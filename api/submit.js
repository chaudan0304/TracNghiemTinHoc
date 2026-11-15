import { database, ensureTable, loadLesson, grade, json } from '../lib/server.js';

export default async function handler(request, response) {
  if (request.method !== 'POST') return json(response, 405, { error: 'METHOD_NOT_ALLOWED' });
  try {
    const { id, lessonId, name, className, answers } = request.body || {};
    if (typeof id !== 'string' || !/^[0-9a-f-]{36}$/i.test(id) || typeof name !== 'string' || !name.trim() || name.length > 100 || typeof className !== 'string' || !className.trim() || className.length > 30) return json(response, 400, { error: 'INVALID_SUBMISSION' });
    const lesson = await loadLesson(lessonId);
    const result = grade(lesson, answers);
    const sql = database();
    await ensureTable(sql);
    await sql`INSERT INTO quiz_attempts (id, lesson_id, student_name, class_name, answers, correct_count, total_questions, score)
      VALUES (${id}, ${lessonId}, ${name.trim()}, ${className.trim()}, ${JSON.stringify(answers)}::jsonb, ${result.correctCount}, ${result.totalQuestions}, ${result.score})
      ON CONFLICT (id) DO NOTHING`;
    return json(response, 200, { id, ...result });
  } catch (error) {
    if (error.message === 'DATABASE_NOT_CONFIGURED') return json(response, 503, { error: 'STORAGE_NOT_CONFIGURED' });
    if (error.message.startsWith('INVALID_')) return json(response, 400, { error: error.message });
    console.error('Quiz submission failed', error);
    return json(response, 500, { error: 'SERVER_ERROR' });
  }
}

