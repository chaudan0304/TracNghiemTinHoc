import { readFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import { database } from '../lib/server.js';

export async function seedLessons(sql) {
  const seedDirectory = new URL('../lessons/', import.meta.url);
  const ids = JSON.parse(await readFile(new URL('index.json', seedDirectory), 'utf8'));
  const lessons = await Promise.all(ids.map(async id => {
    const grade = /^lop-([345])-[a-z0-9-]+$/.exec(id)?.[1];
    if (!grade) throw new Error(`Invalid seed lesson ID: ${id}`);
    const lesson = JSON.parse(await readFile(new URL(`${id}.json`, seedDirectory), 'utf8'));
    if (lesson.id !== id) throw new Error(`Seed lesson ID mismatch: ${id}`);
    return { ...lesson, grade: Number(grade) };
  }));

  const [, , inserted] = await sql.transaction(tx => [
    tx`CREATE TABLE IF NOT EXISTS quiz_lessons (
      id text PRIMARY KEY,
      document jsonb NOT NULL,
      position integer NOT NULL DEFAULT 2147483647,
      created_at timestamptz NOT NULL DEFAULT now()
    )`,
    tx`CREATE UNIQUE INDEX IF NOT EXISTS quiz_lessons_grade_title
      ON quiz_lessons ((document->>'grade'), lower(document->>'lessonTitle'))`,
    tx`INSERT INTO quiz_lessons (id, document, position)
      SELECT item->>'id', item, position::int
      FROM jsonb_array_elements(${JSON.stringify(lessons)}::jsonb) WITH ORDINALITY AS entry(item, position)
      ON CONFLICT (id) DO NOTHING RETURNING id`
  ]);
  return { inserted: inserted.length, total: lessons.length };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const { inserted, total } = await seedLessons(database());
  console.log(`Đã nạp ${inserted}/${total} bài gốc. Các bài đã tồn tại được giữ nguyên.`);
}
