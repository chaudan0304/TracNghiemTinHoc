import { readFileSync } from 'node:fs';

const directory = new URL('../lessons/', import.meta.url);
export const seedIds = JSON.parse(readFileSync(new URL('index.json', directory), 'utf8'));

export function seedLesson(id) {
  if (!seedIds.includes(id)) throw new Error('INVALID_LESSON');
  const lesson = JSON.parse(readFileSync(new URL(`${id}.json`, directory), 'utf8'));
  return { ...lesson, grade: Number(id[4]) };
}

export function seedCatalog() {
  return seedIds.map(id => ({ id, grade: Number(id[4]) }));
}
