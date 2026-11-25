import { randomUUID } from 'node:crypto';
import { ADMIN_USERNAME, clearTeacherSession, hashTeacherPassword, normalizeUsername, recordTeacherPasswordAttempt, verifyTeacherPassword } from './teacher-auth.js';
import { json } from './server.js';
import { DEFAULT_SCHOOL_ID, ensureSchools, validSchoolId } from './schools.js';

export async function updateTeacherProfile(request, response, sql, identity) {
  const { body } = request;
  const { displayName, subject, currentPassword, newPassword } = body;
  const changingPassword = currentPassword !== undefined || newPassword !== undefined;
  if (Object.keys(body).some(key => !['action', 'displayName', 'subject', 'currentPassword', 'newPassword'].includes(key)) ||
      typeof displayName !== 'string' || displayName.trim().length > 100 || /[\x00-\x1f]/.test(displayName) ||
      typeof subject !== 'string' || !subject.trim() || subject.trim().length > 120 || /[\x00-\x1f]/.test(subject)) {
    return json(response, 400, { error: 'INVALID_PROFILE' });
  }
  let hash = null;
  let clientKey;
  if (changingPassword) {
    if (typeof newPassword !== 'string' || newPassword.length < 12 || newPassword.length > 128 ||
        !newPassword.trim() || typeof currentPassword !== 'string' || !currentPassword || currentPassword.length > 128) {
      return json(response, 400, { error: 'INVALID_ACCOUNT_PASSWORD' });
    }
    const attempt = await recordTeacherPasswordAttempt(sql, request, ':password-change:' + identity.username);
    if (attempt.blocked) return json(response, 429, { error: 'TOO_MANY_ATTEMPTS' });
    clientKey = attempt.clientKey;
    const [account] = await sql`SELECT password_hash FROM teacher_accounts
      WHERE username = ${identity.username} AND session_version = ${identity.sessionVersion} AND active`;
    if (!account || !await verifyTeacherPassword(currentPassword, account.password_hash)) {
      return json(response, 403, { error: 'INVALID_CURRENT_PASSWORD' });
    }
    hash = await hashTeacherPassword(newPassword);
    await sql`DELETE FROM teacher_login_limits WHERE client_key = ${clientKey}`;
  }
  const [updated] = await sql`UPDATE teacher_accounts
    SET display_name = ${displayName.trim() || null}, subject = ${subject.trim()},
      password_hash = COALESCE(${hash}, password_hash), session_version = COALESCE(${changingPassword ? randomUUID() : null}::uuid, session_version)
    WHERE username = ${identity.username} AND session_version = ${identity.sessionVersion} AND active
    RETURNING display_name, subject`;
  if (!updated) return json(response, 401, { error: 'UNAUTHORIZED' });
  if (changingPassword) return clearTeacherSession(response, { ok: true, passwordChanged: true });
  return json(response, 200, { displayName: updated.display_name || identity.username, subject: updated.subject });
}

export async function ensureTeacherAccounts(sql) {
  await ensureSchools(sql);
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
    ADD COLUMN IF NOT EXISTS display_name text,
    ADD COLUMN IF NOT EXISTS school_id text NOT NULL DEFAULT 'quynh-loc' REFERENCES quiz_schools(id)`;
}

export async function handleTeacherAccounts(request, response, sql) {
  await ensureTeacherAccounts(sql);
  if (request.method === 'GET') {
    const accounts = await sql`SELECT username, subject, classes, active, can_edit_students AS "canEditStudents",
      display_name AS "displayName", school_id AS "schoolId"
      FROM teacher_accounts ORDER BY username`;
    return json(response, 200, { accounts });
  }

  const { action, password, classes, active, canEditStudents, displayName } = request.body;
  const trimmedName = typeof displayName === 'string' ? displayName.trim() : '';
  const username = normalizeUsername(request.body.username);
  const subject = typeof request.body.subject === 'string' ? request.body.subject.trim() : '';
  const creating = action === 'create-account';
  const schoolId = request.body.schoolId;
  if (schoolId !== undefined && !validSchoolId(schoolId)) return json(response, 400, { error: 'INVALID_SCHOOL' });
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
  if (schoolId !== undefined || creating) {
    const [school] = await sql`SELECT id FROM quiz_schools WHERE id = ${schoolId || DEFAULT_SCHOOL_ID}`;
    if (!school) return json(response, 400, { error: 'SCHOOL_NOT_FOUND' });
  }
  if (creating) {
    const [account] = await sql`INSERT INTO teacher_accounts (username, subject, classes, password_hash, session_version, can_edit_students, display_name, school_id)
      VALUES (${username}, ${subject}, ${classList}::jsonb, ${hash}, ${version}, ${canEditStudents ?? false}, ${trimmedName || null}, ${schoolId || DEFAULT_SCHOOL_ID})
      ON CONFLICT (username) DO NOTHING RETURNING username`;
    if (!account) return json(response, 409, { error: 'TEACHER_ACCOUNT_EXISTS' });
    return json(response, 201, { ok: true });
  }
  const [account] = await sql`UPDATE teacher_accounts
    SET subject = ${subject}, classes = ${classList}::jsonb, active = ${active},
      password_hash = COALESCE(${hash}, password_hash), session_version = ${version},
      can_edit_students = COALESCE(${canEditStudents ?? null}, can_edit_students),
      school_id = COALESCE(${schoolId ?? null}, school_id),
      display_name = CASE WHEN ${displayName !== undefined} THEN ${trimmedName || null} ELSE display_name END
    WHERE username = ${username} RETURNING username`;
  if (!account) return json(response, 404, { error: 'TEACHER_ACCOUNT_NOT_FOUND' });
  return json(response, 200, { ok: true });
}
