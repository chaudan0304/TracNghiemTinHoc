import { database, json } from '../lib/server.js';
import { authenticateTeacher } from '../lib/teacher-auth.js';
import { LESSON_LIMITS, LessonInputError, normalizeLessonUpdate, normalizeNewLessons } from '../lib/lesson-input.js';
import { createLessons, deleteLessonIfUnused, listLessons, loadLesson, questionFeedback, updateLesson, validLessonId } from '../lib/lesson-store.js';

function canManageLesson(teacher, lesson) {
  if (!teacher) return false;
  if (teacher.role === 'admin') return Boolean(lesson.authorName);
  if (!lesson.authorName) return false;
  if (lesson.authorUsername) return lesson.authorUsername === teacher.username;
  return lesson.authorName === teacher.displayName;
}

function publicLessonSummary(lesson) {
  return {
    id: lesson.id,
    grade: lesson.grade,
    lessonTitle: lesson.lessonTitle,
    authorName: lesson.authorName ?? null,
    subjectBadge: lesson.subjectBadge,
    timeLimitSeconds: lesson.timeLimitSeconds,
    questionCount: lesson.questionCount
  };
}

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
        const rows = await createLessons(getDatabase(), lessons, teacher.username);
        return json(response, 201, { ids: rows.map(row => row.id) });
      }
      if (request.method === 'PUT') {
        const teacher = await authenticateTeacher(request, getDatabase);
        if (!teacher) return json(response, 401, { error: 'UNAUTHORIZED' });
        const body = request.body || {};
        if (!validLessonId(body.id)) return json(response, 400, { error: 'INVALID_LESSON' });
        const sql = getDatabase();
        const existing = await loadLesson(sql, body.id);
        if (!canManageLesson(teacher, existing)) return json(response, 403, { error: 'FORBIDDEN' });

        let nextLesson;
        if (body.action === 'toggle-hidden' && typeof body.hidden === 'boolean') {
          nextLesson = { ...existing };
          if (body.hidden) nextLesson.hidden = true;
          else delete nextLesson.hidden;
        } else {
          if (Buffer.byteLength(JSON.stringify(body)) > LESSON_LIMITS.bytes) {
            throw new LessonInputError('Nội dung nhập quá lớn.');
          }
          nextLesson = normalizeLessonUpdate(body, existing);
        }
        await updateLesson(sql, body.id, nextLesson);
        return json(response, 200, { id: body.id, hidden: Boolean(nextLesson.hidden) });
      }
      if (request.method === 'DELETE') {
        const teacher = await authenticateTeacher(request, getDatabase);
        if (!teacher) return json(response, 401, { error: 'UNAUTHORIZED' });
        const params = new URL(request.url, 'https://local.invalid').searchParams;
        const id = params.get('id') || request.body?.id;
        if (!validLessonId(id)) return json(response, 400, { error: 'INVALID_LESSON' });
        const sql = getDatabase();
        const existing = await loadLesson(sql, id);
        if (!canManageLesson(teacher, existing)) return json(response, 403, { error: 'FORBIDDEN' });
        const outcome = await deleteLessonIfUnused(sql, id);
        if (!outcome.deleted) return json(response, 409, { error: 'LESSON_HAS_ATTEMPTS' });
        return json(response, 200, { ok: true });
      }
      if (request.method !== 'GET') return json(response, 405, { error: 'METHOD_NOT_ALLOWED' });
      const params = new URL(request.url, 'https://local.invalid').searchParams;
      const id = params.get('id');
      const question = params.get('question');
      if (id === null && question === null) {
        const rows = await listLessons(getDatabase());
        if (params.get('manage') === '1') {
          const teacher = await authenticateTeacher(request, getDatabase);
          if (!teacher) return json(response, 401, { error: 'UNAUTHORIZED' });
          return json(response, 200, {
            lessons: rows.map(lesson => ({
              ...publicLessonSummary(lesson),
              hidden: Boolean(lesson.hidden),
              editable: canManageLesson(teacher, lesson)
            }))
          });
        }
        return json(response, 200, {
          lessons: rows.filter(lesson => !lesson.hidden).map(publicLessonSummary)
        });
      }
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
      if (params.get('edit') === '1') {
        const teacher = await authenticateTeacher(request, getDatabase);
        if (!teacher) return json(response, 401, { error: 'UNAUTHORIZED' });
        if (!canManageLesson(teacher, lesson)) return json(response, 403, { error: 'FORBIDDEN' });
        return json(response, 200, {
          id: lesson.id,
          grade: lesson.grade,
          lessonTitle: lesson.lessonTitle,
          authorName: lesson.authorName ?? null,
          timeLimitSeconds: lesson.timeLimitSeconds,
          hidden: Boolean(lesson.hidden),
          questions: lesson.questions
        });
      }
      if (lesson.hidden) return json(response, 404, { error: 'LESSON_NOT_FOUND' });
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
