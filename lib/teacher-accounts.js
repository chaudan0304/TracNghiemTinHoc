import { randomUUID } from 'node:crypto';
import { ADMIN_USERNAME, hashTeacherPassword, normalizeUsername } from './teacher-auth.js';
import { json } from './server.js';

export async function ensureTeacherAccounts(sql) {
  await sql`CREATE TABLE IF NOT EXISTS teacher_accounts (
    username text PRIMARY KEY,
    subject text NOT NULL,
    classes jsonb NOT NULL,
    password_hash text NOT NULL,
    session_version uuid NOT NULL,
    active boolean NOT NULL DEFAULT true,
    can_edit_students boolean NOT NULL DEFAULT false,
    display_name text
  )`;
  await sql`ALTER TABLE teacher_accounts
    ADD COLUMN IF NOT EXISTS can_edit_students boolean NOT NULL DEFAULT false,
    ADD COLUMN IF NOT EXISTS display_name text`;
}

export async function handleTeacherAccounts(request, response, sql) {
  await ensureTeacherAccounts(sql);
  if (request.method === 'GET') {
    const accounts = await sql`SELECT username, subject, classes, active, can_edit_students AS "canEditStudents",
      display_name AS "displayName"
      FROM teacher_accounts ORDER BY username`;
    return json(response, 200, { accounts });
  }

  const { action, password, classes, active, canEditStudents, displayName } = request.body;
  const trimmedName = typeof displayName === 'string' ? displayName.trim() : '';
  const username = normalizeUsername(request.body.username);
  const subject = typeof request.body.subject === 'string' ? request.body.subject.trim() : '';
  const creating = action === 'create-account';
  if (!username || username === ADMIN_USERNAME || !subject || subject.length > 120 || /[\x00-\x1f]/.test(subject) ||
      !Array.isArray(classes) || classes.length > 80 ||
      !classes.every(value => typeof value === 'string' && value.trim() && value.trim().length <= 30 && !/[\x00-\x1f]/.test(value)) ||
      (!creating && typeof active !== 'boolean') ||
      (canEditStudents !== undefined && typeof canEditStudents !== 'boolean') ||
      (displayName !== undefined && (typeof displayName !== 'string' || trimmedName.length > 100 || /[\x00-\x1f]/.test(trimmedName)))) {
    return json(response, 400, { error: 'INVALID_TEACHER_ACCOUNT' });
  }
  if ((creating || password !== undefined) &&
      (typeof password !== 'string' || password.length < 12 || password.length > 128 || !password.trim())) {
    return json(response, 400, { error: 'INVALID_ACCOUNT_PASSWORD' });
  }

  const classList = JSON.stringify([...new Set(classes.map(value => value.trim().toUpperCase()))]);
  const hash = password === undefined ? null : await hashTeacherPassword(password);
  const version = randomUUID();
  if (creating) {
    const [account] = await sql`INSERT INTO teacher_accounts (username, subject, classes, password_hash, session_version, can_edit_students, display_name)
      VALUES (${username}, ${subject}, ${classList}::jsonb, ${hash}, ${version}, ${canEditStudents ?? false}, ${trimmedName || null})
      ON CONFLICT (username) DO NOTHING RETURNING username`;
    if (!account) return json(response, 409, { error: 'TEACHER_ACCOUNT_EXISTS' });
    return json(response, 201, { ok: true });
  }
  const [account] = await sql`UPDATE teacher_accounts
    SET subject = ${subject}, classes = ${classList}::jsonb, active = ${active},
      password_hash = COALESCE(${hash}, password_hash), session_version = ${version},
      can_edit_students = COALESCE(${canEditStudents ?? null}, can_edit_students),
      display_name = CASE WHEN ${displayName !== undefined} THEN ${trimmedName || null} ELSE display_name END
    WHERE username = ${username} RETURNING username`;
  if (!account) return json(response, 404, { error: 'TEACHER_ACCOUNT_NOT_FOUND' });
  return json(response, 200, { ok: true });
}
