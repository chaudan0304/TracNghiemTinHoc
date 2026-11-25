import { database, json } from '../lib/server.js';
import { authenticateTeacher } from '../lib/teacher-auth.js';
import { LESSON_LIMITS, LessonInputError, normalizeNewLessons } from '../lib/lesson-input.js';
import { createLessons, listLessons, loadLesson, questionFeedback, validLessonId } from '../lib/lesson-store.js';

export function createLessonsHandler(getDatabase = database) {
  return async function handler(request, response) {
    try {
      if (request.method === 'POST') {
        const teacher = await authenticateTeacher(request, getDatabase);
        if (!teacher) return json(response, 401, { error: 'UNAUTHORIZED' });
        const input = request.body?.lessons;
        if (Buffer.byteLength(JSON.stringify(input ?? null)) > LESSON_LIMITS.bytes) {
          throw new LessonInputError('Nội dung nhập quá lớn. Hãy chia thành nhiều lượt.');
        }
        const lessons = normalizeNewLessons(input).map(lesson => ({ ...lesson, authorName: teacher.displayName }));
        const rows = await createLessons(getDatabase(), lessons);
        return json(response, 201, { ids: rows.map(row => row.id) });
      }
      if (request.method !== 'GET') return json(response, 405, { error: 'METHOD_NOT_ALLOWED' });
      const params = new URL(request.url, 'https://local.invalid').searchParams;
      const id = params.get('id');
      const question = params.get('question');
      if (id === null && question === null) return json(response, 200, { lessons: await listLessons(getDatabase()) });
      if (!validLessonId(id)) return json(response, 400, { error: 'INVALID_LESSON' });
      if (question !== null && !/^\d{1,3}$/.test(question)) return json(response, 400, { error: 'INVALID_QUESTION' });

      const sql = getDatabase();
      if (question !== null) {
        const [row] = await sql`SELECT document->'questions'->${Number(question)}::int AS question
          FROM quiz_lessons WHERE id = ${id}`;
        if (!row?.question) return json(response, 404, { error: 'QUESTION_NOT_FOUND' });
        return json(response, 200, questionFeedback(row.question));
      }
      const lesson = await loadLesson(sql, id);
      return json(response, 200, {
        id: lesson.id, grade: lesson.grade, lessonTitle: lesson.lessonTitle, authorName: lesson.authorName ?? null,
        subjectBadge: lesson.subjectBadge, gameTitle: lesson.gameTitle,
        timeLimitSeconds: lesson.timeLimitSeconds, pointsPerQuestion: lesson.pointsPerQuestion,
        questions: lesson.questions.map(({ question, options }) => ({ question, options }))
      });
    } catch (error) {
      if (error instanceof LessonInputError) return json(response, 400, { error: 'INVALID_LESSONS', message: error.message });
      if (error.code === '23505') return json(response, 409, { error: 'LESSON_ALREADY_EXISTS' });
      if (error.message === 'LESSON_NOT_FOUND') return json(response, 404, { error: 'LESSON_NOT_FOUND' });
      if (error.message === 'DATABASE_NOT_CONFIGURED' || error.code === '42P01') {
        return json(response, 503, { error: 'STORAGE_NOT_CONFIGURED' });
      }
      console.error('Lesson API failed', error);
      return json(response, 500, { error: 'SERVER_ERROR' });
    }
  };
}

export default createLessonsHandler();
