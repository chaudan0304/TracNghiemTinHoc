export function validLessonId(id) {
  return typeof id === 'string' && /^[a-z0-9-]{1,64}$/.test(id);
}

export async function listLessons(sql) {
  return sql`SELECT id, (document->>'grade')::int AS grade, document->>'lessonTitle' AS "lessonTitle",
    document->>'authorName' AS "authorName",
    document->>'subjectBadge' AS "subjectBadge", (document->>'timeLimitSeconds')::int AS "timeLimitSeconds",
    jsonb_array_length(document->'questions') AS "questionCount"
    FROM quiz_lessons ORDER BY position, created_at, id`;
}

export async function loadLesson(sql, id) {
  if (!validLessonId(id)) throw new Error('INVALID_LESSON');
  const [row] = await sql`SELECT document AS lesson FROM quiz_lessons WHERE id = ${id}`;
  if (!row) throw new Error('LESSON_NOT_FOUND');
  return row.lesson;
}

export async function createLessons(sql, lessons) {
  return sql`INSERT INTO quiz_lessons (id, document)
    SELECT item->>'id', item FROM jsonb_array_elements(${JSON.stringify(lessons)}::jsonb) AS entry(item)
    RETURNING id`;
}

export function questionFeedback(question) {
  return { correctIndex: question.correctIndex, explanation: question.explanation };
}
