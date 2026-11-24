import { database, ensureTable, equalSecret, isTeacher, json, loadLesson, loginClientKey, sessionToken } from '../lib/server.js';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { EXCELLENT_SCORE } from '../lib/score-levels.js';
import { summarizeQuestionResponses } from '../lib/question-stats.js';

export function createTeacherHandler(getDatabase = database, prepare = ensureTable) {
return async function handler(request, response) {
  const isMerge = request.method === 'POST' && request.body?.action === 'merge-students';
  const isEdit = request.method === 'POST' && request.body?.action === 'edit-student';
  if (request.method === 'POST' && !isMerge && !isEdit) {
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
  if (isMerge) {
    const { sourceName, targetName, className } = request.body;
    if (!validMergeValue(sourceName, 100) || !validMergeValue(targetName, 100) ||
        !validMergeValue(className, 30) || sourceName === targetName) {
      return json(response, 400, { error: 'INVALID_STUDENT_MERGE' });
    }
  }
  if (isEdit) {
    const { sourceName, className, targetName, targetClass } = request.body;
    if (!validMergeValue(sourceName, 100) || !validMergeValue(className, 30) ||
        !validMergeValue(targetName, 100) || !validMergeValue(targetClass, 30) ||
        (sourceName === targetName.trim() && className === targetClass.trim())) {
      return json(response, 400, { error: 'INVALID_STUDENT_EDIT' });
    }
  }
  try {
    const sql = getDatabase();
    await prepare(sql);
    if (isEdit) {
      const { sourceName, className, targetName, targetClass } = request.body;
      const [, [result]] = await sql.transaction(tx => [
        tx`LOCK TABLE quiz_attempts IN SHARE ROW EXCLUSIVE MODE`,
        tx`WITH target AS (
          SELECT EXISTS (
            SELECT 1 FROM quiz_attempts
            WHERE student_name = ${targetName.trim()} AND class_name = ${targetClass.trim()}
          ) AS already_exists
        ), updated AS (
          UPDATE quiz_attempts AS source
          SET student_name = ${targetName.trim()}, class_name = ${targetClass.trim()},
            original_student_name = COALESCE(source.original_student_name, source.student_name),
            original_class_name = COALESCE(source.original_class_name, source.class_name)
          FROM target
          WHERE source.student_name = ${sourceName} AND source.class_name = ${className}
            AND NOT target.already_exists
          RETURNING source.id
        ) SELECT (SELECT COUNT(*)::int FROM updated) AS updated_count, already_exists AS target_exists
          FROM target`
      ]);
      if (result.target_exists) return json(response, 409, { error: 'STUDENT_EDIT_DUPLICATE' });
      if (!result.updated_count) return json(response, 409, { error: 'STUDENT_EDIT_CHANGED' });
      return json(response, 200, { updatedCount: result.updated_count });
    }
    if (isMerge) {
      const { sourceName, targetName, className } = request.body;
      // Serialize merges and keep the selected target in place while moving its classmate's attempts.
      const [, [result]] = await sql.transaction(tx => [
        tx`LOCK TABLE quiz_attempts IN SHARE ROW EXCLUSIVE MODE`,
        tx`WITH moved AS (
          UPDATE quiz_attempts AS source
          SET student_name = ${targetName}, original_student_name = COALESCE(source.original_student_name, source.student_name)
          WHERE source.student_name = ${sourceName} AND source.class_name = ${className}
            AND EXISTS (
              SELECT 1 FROM quiz_attempts AS target
              WHERE target.student_name = ${targetName} AND target.class_name = source.class_name
            )
          RETURNING source.id
        ) SELECT COUNT(*)::int AS merged_count FROM moved`
      ]);
      if (!result.merged_count) return json(response, 409, { error: 'STUDENT_MERGE_CHANGED' });
      return json(response, 200, { mergedCount: result.merged_count });
    }
    if (request.method === 'GET') {
      const url = new URL(request.url, 'https://local.invalid');
      const type = url.searchParams.get('type') || '';
      if (type === 'student-attempts') {
        const studentName = url.searchParams.get('studentName') || '';
        const className = url.searchParams.get('className') || '';
        const offset = Number(url.searchParams.get('offset') ?? '0');
        if (!studentName.trim() || studentName.length > 100 || !className.trim() ||
            className.length > 30 || !Number.isSafeInteger(offset) || offset < 0) {
          return json(response, 400, { error: 'INVALID_FILTER' });
        }

        const pageSize = 50;
        const rows = await sql`SELECT lesson_id, correct_count, total_questions, score, time_taken_seconds, submitted_at
          FROM quiz_attempts WHERE student_name = ${studentName} AND class_name = ${className}
          ORDER BY submitted_at DESC, id DESC LIMIT ${pageSize + 1} OFFSET ${offset}`;
        return json(response, 200, { rows: rows.slice(0, pageSize), hasMore: rows.length > pageSize });
      }
      if (type === 'ranking') {
        const mode = url.searchParams.get('mode') || (url.searchParams.get('className') ? 'student' : 'class');
        const className = url.searchParams.get('className')?.trim() || '';
        if (className.length > 30) return json(response, 400, { error: 'INVALID_FILTER' });

        const { gradeTotals, lessonIdsByGrade } = await loadRankingCatalog();
        const catalog = JSON.stringify(lessonIdsByGrade);

        if (mode === 'student') {
          const students = await sql`SELECT student_name,
            class_name,
            COUNT(DISTINCT lesson_id) FILTER (
              WHERE jsonb_exists(${catalog}::jsonb -> COALESCE(substring(class_name FROM '^[^0-9]*([345])'), 'all'), lesson_id)
            )::int AS completed_lessons,
            COUNT(*)::int AS total_attempts,
            COALESCE(ROUND(AVG(score), 1), 0)::float AS avg_score,
            COALESCE(MAX(score), 0)::float AS max_score,
            COALESCE(ROUND(AVG(time_taken_seconds)), 0)::int AS avg_time_seconds,
            MAX(submitted_at) AS latest_submission
            FROM quiz_attempts
            WHERE (${className} = '' OR ${className} = 'ALL' OR class_name = ${className})
            GROUP BY student_name, class_name
            ORDER BY avg_score DESC,
              AVG(time_taken_seconds) ASC NULLS LAST, student_name ASC, class_name ASC`;
          return json(response, 200, { students, gradeTotals });
        }

        const classes = await sql`SELECT class_name,
          COUNT(DISTINCT student_name)::int AS student_count,
          COUNT(DISTINCT lesson_id) FILTER (
            WHERE jsonb_exists(${catalog}::jsonb -> COALESCE(substring(class_name FROM '^[^0-9]*([345])'), 'all'), lesson_id)
          )::int AS completed_lessons,
          COUNT(*)::int AS total_attempts,
          COALESCE(ROUND(AVG(score), 1), 0)::float AS avg_score,
          COALESCE(MAX(score), 0)::float AS max_score,
          COUNT(*) FILTER (WHERE score >= ${EXCELLENT_SCORE})::int AS good_count,
          MAX(submitted_at) AS latest_submission
          FROM quiz_attempts
          GROUP BY class_name
          ORDER BY (COUNT(*) FILTER (WHERE score >= ${EXCELLENT_SCORE}))::numeric / COUNT(*) DESC,
            avg_score DESC, class_name ASC`;
        return json(response, 200, { classes, gradeTotals });
      }

      const lessonId = url.searchParams.get('lessonId') || '';
      const offset = Number(url.searchParams.get('offset') ?? '0');
      if (!/^[a-z0-9-]{1,64}$/.test(lessonId)) return json(response, 400, { error: 'INVALID_LESSON' });
      if (type === 'classes') {
        const classes = await sql`SELECT DISTINCT class_name FROM quiz_attempts
          WHERE lesson_id = ${lessonId} ORDER BY class_name`;
        return json(response, 200, { classes: classes.map(row => row.class_name) });
      }
      const className = url.searchParams.get('className') || '';
      const search = url.searchParams.get('search')?.trim() || '';
      if (className.length > 30 || search.length > 100 || !Number.isSafeInteger(offset) || offset < 0) {
        return json(response, 400, { error: 'INVALID_FILTER' });
      }
      if (url.searchParams.get('questionStats') === '1') {
        const lesson = await loadLesson(lessonId);
        const counts = await sql`SELECT (item.ordinal - 1)::int AS question_index,
          item.answer AS answer, COUNT(*)::int AS count
          FROM quiz_attempts AS attempt
          CROSS JOIN LATERAL jsonb_array_elements_text(attempt.answers) WITH ORDINALITY AS item(answer, ordinal)
          WHERE attempt.lesson_id = ${lessonId}
          AND (${className} = '' OR attempt.class_name = ${className})
          AND (${search} = '' OR position(lower(${search}) in lower(attempt.student_name)) > 0)
          GROUP BY item.ordinal, item.answer`;
        return json(response, 200, { questions: summarizeQuestionResponses(lesson, counts) });
      }
      if (url.searchParams.get('stats') === '1') {
        const [row] = await sql`SELECT COUNT(*)::int AS total,
          COALESCE(ROUND(AVG(score), 1), 0) AS avg,
          COALESCE(MAX(score), 0) AS max,
          COUNT(*) FILTER (WHERE score >= ${EXCELLENT_SCORE})::int AS good_count
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
        FROM quiz_attempts WHERE lesson_id = ${lessonId}
        AND (${className} = '' OR class_name = ${className})
        AND (${search} = '' OR position(lower(${search}) in lower(student_name)) > 0)
        ORDER BY submitted_at DESC, id DESC LIMIT 100 OFFSET ${offset}`;
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

function validMergeValue(value, maxLength) {
  return typeof value === 'string' && value.length <= maxLength && Boolean(value.trim());
}

async function loadRankingCatalog() {
  const ids = [...new Set(JSON.parse(await readFile(join(process.cwd(), 'lessons', 'index.json'), 'utf8')))];
  const lessonIdsByGrade = { '3': [], '4': [], '5': [], all: ids };
  for (const id of ids) {
    const grade = /^lop-([345])-/.exec(id)?.[1];
    if (grade) lessonIdsByGrade[grade].push(id);
  }
  const gradeTotals = Object.fromEntries(Object.entries(lessonIdsByGrade).map(([grade, lessons]) => [grade, lessons.length]));
  return { gradeTotals, lessonIdsByGrade };
}

export default createTeacherHandler();

