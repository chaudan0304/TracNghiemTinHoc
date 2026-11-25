import { randomUUID } from 'node:crypto';
import { json } from './server.js';

export const DEFAULT_SCHOOL_ID = 'quynh-loc';
export const DEFAULT_SCHOOL_NAME = 'Trường Tiểu học Quỳnh Lộc';
export const validSchoolId = value => typeof value === 'string' && /^[a-z0-9-]{1,64}$/.test(value);

const ensuredSchools = new WeakMap();

export async function ensureSchoolsOnce(sql) {
  let pending = ensuredSchools.get(sql);
  if (!pending) {
    pending = ensureSchools(sql).catch(error => {
      ensuredSchools.delete(sql);
      throw error;
    });
    ensuredSchools.set(sql, pending);
  }
  return pending;
}

export async function ensureSchools(sql) {
  await sql`CREATE TABLE IF NOT EXISTS quiz_schools (
    id text PRIMARY KEY,
    name text NOT NULL,
    active boolean NOT NULL DEFAULT true
  )`;
  await sql`INSERT INTO quiz_schools (id, name) VALUES (${DEFAULT_SCHOOL_ID}, ${DEFAULT_SCHOOL_NAME})
    ON CONFLICT (id) DO NOTHING`;
  await sql`CREATE UNIQUE INDEX IF NOT EXISTS quiz_schools_unique_name ON quiz_schools (lower(btrim(name)))`;
}

export async function handleSchools(request, response, sql, schoolId = null) {
  await ensureSchools(sql);
  if (request.method === 'GET') {
    const schools = await sql`SELECT id, name, active FROM quiz_schools
      WHERE (${schoolId}::text IS NULL OR id = ${schoolId}) ORDER BY name, id`;
    return json(response, 200, { schools });
  }
  const { action, id, name, active } = request.body || {};
  const cleanName = typeof name === 'string' ? name.trim().replace(/\s+/g, ' ') : '';
  if (!cleanName || cleanName.length > 180 || /[\x00-\x1f]/.test(name)
    || (action === 'update-school' && (!validSchoolId(id) || typeof active !== 'boolean'))) {
    return json(response, 400, { error: 'INVALID_SCHOOL' });
  }
  if (action === 'create-school') {
    const [school] = await sql`INSERT INTO quiz_schools (id, name, active) VALUES (${randomUUID()}, ${cleanName}, ${active !== false})
      RETURNING id, name, active`;
    return json(response, 201, { school });
  }
  const [school] = await sql`UPDATE quiz_schools SET name = ${cleanName}, active = ${active}
    WHERE id = ${id} RETURNING id, name, active`;
  return school ? json(response, 200, { school }) : json(response, 404, { error: 'SCHOOL_NOT_FOUND' });
}
