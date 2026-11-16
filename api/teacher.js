import { database, ensureTable, equalSecret, isTeacher, json, loginClientKey, sessionToken } from '../lib/server.js';

export function createTeacherHandler(getDatabase = database, prepare = ensureTable) {
return async function handler(request, response) {
  if (request.method === 'POST') {
    if (request.body?.action === 'logout') {
      response.setHeader('Set-Cookie', 'teacher_session=; HttpOnly; Secure; SameSite=Strict; Path=/api; Max-Age=0');
      return json(response, 200, { ok: true });
    }
    const password = process.env.TEACHER_PASSWORD;
    const secret = process.env.SESSION_SECRET;
    if (!password || !secret) return json(response, 503, { error: 'TEACHER_LOGIN_NOT_CONFIGURED' });
    try {
      const sql = getDatabase();
      await prepare(sql);
      const clientKey = loginClientKey(request, secret);
      const [limit] = await sql`INSERT INTO teacher_login_limits (client_key, failures) VALUES (${clientKey}, 1)
        ON CONFLICT (client_key) DO UPDATE SET
          blocked_until = CASE
            WHEN teacher_login_limits.blocked_until > now() THEN teacher_login_limits.blocked_until
            WHEN teacher_login_limits.window_start >= now() - interval '15 minutes' AND teacher_login_limits.failures >= 4 THEN now() + interval '15 minutes'
            ELSE 'epoch'::timestamptz END,
          failures = CASE WHEN teacher_login_limits.window_start < now() - interval '15 minutes' THEN 1 ELSE teacher_login_limits.failures + 1 END,
          window_start = CASE WHEN teacher_login_limits.window_start < now() - interval '15 minutes' THEN now() ELSE teacher_login_limits.window_start END
        RETURNING blocked_until`;
      if (new Date(limit.blocked_until).getTime() > Date.now()) return json(response, 429, { error: 'TOO_MANY_ATTEMPTS' });
      if (!equalSecret(String(request.body?.password || ''), password)) {
        return json(response, 401, { error: 'INVALID_PASSWORD' });
      }
      await sql`DELETE FROM teacher_login_limits WHERE client_key = ${clientKey}`;
    } catch (error) {
      if (error.message === 'DATABASE_NOT_CONFIGURED') return json(response, 503, { error: 'STORAGE_NOT_CONFIGURED' });
      console.error('Teacher login failed', error);
      return json(response, 500, { error: 'SERVER_ERROR' });
    }
    const expires = Date.now() + 8 * 60 * 60 * 1000;
    response.setHeader('Set-Cookie', `teacher_session=${sessionToken(secret, expires)}; HttpOnly; Secure; SameSite=Strict; Path=/api; Max-Age=28800`);
    return json(response, 200, { ok: true });
  }
  if (!isTeacher(request)) return json(response, 401, { error: 'UNAUTHORIZED' });
  try {
    const sql = getDatabase();
    await prepare(sql);
    if (request.method === 'GET') {
      const url = new URL(request.url, 'https://local.invalid');
      const type = url.searchParams.get('type') || '';
      if (type === 'ranking') {
        const mode = url.searchParams.get('mode') || (url.searchParams.get('className') ? 'student' : 'class');
        const className = url.searchParams.get('className')?.trim() || '';
        if (className.length > 30) return json(response, 400, { error: 'INVALID_FILTER' });

        const gradeTotals = { '3': 16, '4': 19, '5': 19, 'all': 54 };

        if (mode === 'student') {
          const students = await sql`SELECT student_name,
            class_name,
            COUNT(DISTINCT lesson_id)::int AS completed_lessons,
            COUNT(*)::int AS total_attempts,
            COALESCE(ROUND(AVG(score), 1), 0)::float AS avg_score,
            COALESCE(MAX(score), 0)::float AS max_score,
            COALESCE(ROUND(AVG(time_taken_seconds)), 0)::int AS avg_time_seconds,
            MAX(submitted_at) AS latest_submission
            FROM quiz_attempts
            WHERE (${className} = '' OR ${className} = 'ALL' OR class_name = ${className})
            GROUP BY student_name, class_name
            ORDER BY completed_lessons DESC, avg_score DESC, total_attempts DESC, student_name ASC`;
          return json(response, 200, { students, gradeTotals });
        }

        const classes = await sql`SELECT class_name,
          COUNT(DISTINCT student_name)::int AS student_count,
          COUNT(DISTINCT lesson_id)::int AS completed_lessons,
          COUNT(*)::int AS total_attempts,
          COALESCE(ROUND(AVG(score), 1), 0)::float AS avg_score,
          COALESCE(MAX(score), 0)::float AS max_score,
          COUNT(*) FILTER (WHERE score >= 8)::int AS good_count,
          MAX(submitted_at) AS latest_submission
          FROM quiz_attempts
          GROUP BY class_name
          ORDER BY completed_lessons DESC, avg_score DESC, total_attempts DESC, class_name ASC`;
        return json(response, 200, { classes, gradeTotals });
      }

      const lessonId = url.searchParams.get('lessonId') || '';
      const offset = Math.max(0, Math.min(100000, Number(url.searchParams.get('offset')) || 0));
      if (!/^[a-z0-9-]{1,64}$/.test(lessonId)) return json(response, 400, { error: 'INVALID_LESSON' });
      if (url.searchParams.get('stats') === '1') {
        const className = url.searchParams.get('className') || '';
        const search = url.searchParams.get('search')?.trim() || '';
        if (className.length > 30 || search.length > 100) return json(response, 400, { error: 'INVALID_FILTER' });
        const [row] = await sql`SELECT COUNT(*)::int AS total,
          COALESCE(ROUND(AVG(score), 1), 0) AS avg,
          COALESCE(MAX(score), 0) AS max,
          COUNT(*) FILTER (WHERE score >= 8)::int AS good_count
          FROM quiz_attempts WHERE lesson_id = ${lessonId}
          AND (${className} = '' OR class_name = ${className})
          AND (${search} = '' OR position(lower(${search}) in lower(student_name)) > 0)`;
        return json(response, 200, { stats: {
          total: row.total,
          avg: Number(row.avg),
          max: Number(row.max),
          goodRatio: row.total ? Math.round(row.good_count * 100 / row.total) : 0
        } });
      }
      const rows = await sql`SELECT id, lesson_id, student_name, class_name, correct_count, total_questions, score, time_taken_seconds, submitted_at
        FROM quiz_attempts WHERE lesson_id = ${lessonId} ORDER BY submitted_at DESC LIMIT 100 OFFSET ${offset}`;
      return json(response, 200, { rows });
    }
    if (request.method === 'DELETE') {
      const id = String(request.body?.id || '');
      if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) return json(response, 400, { error: 'INVALID_ID' });
      await sql`DELETE FROM quiz_attempts WHERE id = ${id}`;
      return json(response, 200, { ok: true });
    }
    return json(response, 405, { error: 'METHOD_NOT_ALLOWED' });
  } catch (error) {
    if (error.message === 'DATABASE_NOT_CONFIGURED') return json(response, 503, { error: 'STORAGE_NOT_CONFIGURED' });
    console.error('Teacher API failed', error);
    return json(response, 500, { error: 'SERVER_ERROR' });
  }
}
}

export default createTeacherHandler();

