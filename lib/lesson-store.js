export function validLessonId(id) {
  return typeof id === 'string' && /^[a-z0-9-]{1,64}$/.test(id);
}

export async function listLessons(sql) {
  return sql`SELECT id, (document->>'grade')::int AS grade, document->>'lessonTitle' AS "lessonTitle",
    document->>'authorName' AS "authorName",
    document->>'authorUsername' AS "authorUsername",
    COALESCE((document->>'hidden')::boolean, false) AS hidden,
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

export async function createLessons(sql, lessons, authorUsername = null) {
  return sql`WITH items AS (
      SELECT item FROM jsonb_array_elements(${JSON.stringify(lessons)}::jsonb) AS entry(item)
    )
    INSERT INTO quiz_lessons (id, document)
    SELECT item->>'id',
      CASE WHEN ${authorUsername}::text IS NULL THEN item
        ELSE item || jsonb_build_object('authorUsername', ${authorUsername}::text) END
    FROM items
    RETURNING id`;
}

export async function updateLesson(sql, id, lesson) {
  const [row] = await sql`UPDATE quiz_lessons SET document = ${JSON.stringify(lesson)}::jsonb
    WHERE id = ${id} RETURNING id`;
  if (!row) throw new Error('LESSON_NOT_FOUND');
  return row;
}

export async function deleteLessonIfUnused(sql, id) {
  const [deleted] = await sql`DELETE FROM quiz_lessons
    WHERE id = ${id} AND NOT EXISTS (SELECT 1 FROM quiz_attempts WHERE lesson_id = ${id})
    RETURNING id`;
  if (deleted) return { deleted: true };
  const [exists] = await sql`SELECT id FROM quiz_lessons WHERE id = ${id}`;
  if (!exists) throw new Error('LESSON_NOT_FOUND');
  return { deleted: false, reason: 'IN_USE' };
}

export function questionFeedback(question) {
  return { correctIndex: question.correctIndex, explanation: question.explanation };
}
