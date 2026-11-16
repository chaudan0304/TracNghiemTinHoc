import { database, ensureTable, loadLesson, grade, json, loginClientKey } from '../lib/server.js';

export function createSubmitHandler(getDatabase = database, prepare = ensureTable) {
return async function handler(request, response) {
  if (request.method !== 'POST') return json(response, 405, { error: 'METHOD_NOT_ALLOWED' });
  try {
    const { id, lessonId, name, className, answers, timeTakenSeconds } = request.body || {};
    if (typeof id !== 'string' || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id) || typeof name !== 'string' || !name.trim() || name.length > 100 || typeof className !== 'string' || !className.trim() || className.length > 30) return json(response, 400, { error: 'INVALID_SUBMISSION' });
    const duration = Number.isInteger(timeTakenSeconds) && timeTakenSeconds >= 0 && timeTakenSeconds <= 86400 ? timeTakenSeconds : null;
    const lesson = await loadLesson(lessonId);
    const result = grade(lesson, answers);
    const sql = getDatabase();
    await prepare(sql);
    const clientKey = loginClientKey(request, `${process.env.SESSION_SECRET || 'quiz-submit'}:${lessonId}`);
    const [limit] = await sql`INSERT INTO submission_limits (client_key, attempts) VALUES (${clientKey}, 1)
      ON CONFLICT (client_key) DO UPDATE SET
        attempts = CASE WHEN submission_limits.window_start < now() - interval '15 minutes' THEN 1 ELSE submission_limits.attempts + 1 END,
        window_start = CASE WHEN submission_limits.window_start < now() - interval '15 minutes' THEN now() ELSE submission_limits.window_start END
      RETURNING attempts`;
    if (limit.attempts > 300) {
      response.setHeader('Retry-After', '900');
      return json(response, 429, { error: 'TOO_MANY_SUBMISSIONS' });
    }
    const inserted = await sql`INSERT INTO quiz_attempts (id, lesson_id, student_name, class_name, answers, correct_count, total_questions, score, time_taken_seconds)
      VALUES (${id}, ${lessonId}, ${name.trim()}, ${className.trim()}, ${JSON.stringify(answers)}::jsonb, ${result.correctCount}, ${result.totalQuestions}, ${result.score}, ${duration})
      ON CONFLICT (id) DO NOTHING RETURNING id`;
    if (inserted.length === 0) {
      const [existing] = await sql`SELECT lesson_id, student_name, class_name, answers FROM quiz_attempts WHERE id = ${id}`;
      if (!existing || existing.lesson_id !== lessonId || existing.student_name !== name.trim() ||
          existing.class_name !== className.trim() || JSON.stringify(existing.answers) !== JSON.stringify(answers)) {
        return json(response, 409, { error: 'SUBMISSION_ID_CONFLICT' });
      }
    }
    return json(response, 200, { id, ...result });
  } catch (error) {
    if (error.message === 'DATABASE_NOT_CONFIGURED') return json(response, 503, { error: 'STORAGE_NOT_CONFIGURED' });
    if (error.message.startsWith('INVALID_')) return json(response, 400, { error: error.message });
    console.error('Quiz submission failed', error);
    return json(response, 500, { error: 'SERVER_ERROR' });
  }
}
}

export default createSubmitHandler();

