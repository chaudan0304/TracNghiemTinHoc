import { database, ensureTable, equalSecret, isTeacher, json, sessionToken } from '../lib/server.js';

export default async function handler(request, response) {
  if (request.method === 'POST') {
    const password = process.env.TEACHER_PASSWORD;
    const secret = process.env.SESSION_SECRET;
    if (!password || !secret) return json(response, 503, { error: 'TEACHER_LOGIN_NOT_CONFIGURED' });
    if (!equalSecret(String(request.body?.password || ''), password)) return json(response, 401, { error: 'INVALID_PASSWORD' });
    const expires = Date.now() + 8 * 60 * 60 * 1000;
    response.setHeader('Set-Cookie', `teacher_session=${sessionToken(secret, expires)}; HttpOnly; Secure; SameSite=Strict; Path=/api; Max-Age=28800`);
    return json(response, 200, { ok: true });
  }
  if (!isTeacher(request)) return json(response, 401, { error: 'UNAUTHORIZED' });
  try {
    const sql = database();
    await ensureTable(sql);
    if (request.method === 'GET') {
      const url = new URL(request.url, 'https://local.invalid');
      const lessonId = url.searchParams.get('lessonId') || '';
      const offset = Math.max(0, Math.min(100000, Number(url.searchParams.get('offset')) || 0));
      if (!/^[a-z0-9-]{1,64}$/.test(lessonId)) return json(response, 400, { error: 'INVALID_LESSON' });
      const rows = await sql`SELECT id, lesson_id, student_name, class_name, correct_count, total_questions, score, submitted_at
        FROM quiz_attempts WHERE lesson_id = ${lessonId} ORDER BY submitted_at DESC LIMIT 100 OFFSET ${offset}`;
      return json(response, 200, { rows });
    }
    if (request.method === 'DELETE') {
      const id = String(request.body?.id || '');
      if (!/^[0-9a-f-]{36}$/i.test(id)) return json(response, 400, { error: 'INVALID_ID' });
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

