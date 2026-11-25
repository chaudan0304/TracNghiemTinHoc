import { createHmac, randomBytes, scrypt, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';
import { equalSecret, json, loginClientKey } from './server.js';
import { DEFAULT_SCHOOL_ID } from './schools.js';

export const ADMIN_USERNAME = 'admin';
const adminIdentity = { username: ADMIN_USERNAME, role: 'admin', classes: null, displayName: 'Admin' };
const SESSION_SECONDS = 8 * 60 * 60;
const cookieOptions = 'HttpOnly; Secure; SameSite=Strict; Path=/api';
const usernamePattern = /^[a-z0-9][a-z0-9._-]{2,39}$/;
const deriveKey = promisify(scrypt);
const scryptOptions = { N: 32768, r: 8, p: 3, maxmem: 64 * 1024 * 1024 };
const dummyHash = `${'0'.repeat(32)}:${'0'.repeat(64)}`;

function configuredAdminPassword() {
  return process.env.ADMIN_PASSWORD || process.env.TEACHER_PASSWORD;
}

export function normalizeUsername(input) {
  const username = typeof input === 'string' ? input.trim().toLowerCase() : '';
  return usernamePattern.test(username) ? username : '';
}

export async function hashTeacherPassword(password) {
  const salt = randomBytes(16);
  const key = await deriveKey(password, salt, 32, scryptOptions);
  return `${salt.toString('hex')}:${key.toString('hex')}`;
}

export async function verifyTeacherPassword(password, stored) {
  const [salt, hash] = (stored || dummyHash).split(':');
  const actual = await deriveKey(password, Buffer.from(salt, 'hex'), 32, scryptOptions);
  return timingSafeEqual(actual, Buffer.from(hash, 'hex'));
}

export function teacherSessionToken(username, version, expires = Date.now() + SESSION_SECONDS * 1000) {
  const secret = process.env.SESSION_SECRET;
  const adminPassword = configuredAdminPassword();
  if (!secret || (username === ADMIN_USERNAME && !adminPassword)) return '';
  const key = username === ADMIN_USERNAME ? createHmac('sha256', secret).update('admin:').update(adminPassword).digest() : secret;
  const payload = `v2:${expires}:${username}:${version || '-'}`;
  const signature = createHmac('sha256', key).update(payload).digest('hex');
  return `${payload}:${signature}`;
}

export async function authenticateTeacher(request, getDatabase) {
  const match = /(?:^|;\s*)teacher_session=([^;]+)/.exec(request.headers?.cookie || '');
  if (!match || match[1].length > 180) return null;
  const [format, expires, username, version] = match[1].split(':');
  if (format !== 'v2' || !/^\d{13}$/.test(expires) || Number(expires) <= Date.now() || !usernamePattern.test(username || '')) return null;
  if (!equalSecret(teacherSessionToken(username, version, expires), match[1])) return null;
  if (username === ADMIN_USERNAME) return adminIdentity;

  const sql = getDatabase();
  const [account] = await sql`SELECT active, session_version, classes, subject, can_edit_students, display_name,
    to_jsonb(teacher_accounts)->>'school_id' AS school_id
    FROM teacher_accounts WHERE username = ${username}`;
  if (!account?.active || account.session_version !== version || !Array.isArray(account.classes)) return null;
  return { ...scopedTeacherIdentity(username, account), sessionVersion: version };
}

function scopedTeacherIdentity(username, account) {
  return {
    username, role: 'teacher', classes: account.classes, subject: account.subject,
    displayName: account.display_name || username, schoolId: account.school_id || DEFAULT_SCHOOL_ID,
    canEditStudents: account.can_edit_students === true
  };
}

export function clearTeacherSession(response, body = { ok: true }) {
  response.setHeader('Set-Cookie', `teacher_session=; ${cookieOptions}; Max-Age=0`);
  return json(response, 200, body);
}

export async function recordTeacherPasswordAttempt(sql, request, scope = '') {
  const clientKey = loginClientKey(request, process.env.SESSION_SECRET + scope);
  const [limit] = await sql`INSERT INTO teacher_login_limits (client_key, failures) VALUES (${clientKey}, 1)
    ON CONFLICT (client_key) DO UPDATE SET
      blocked_until = CASE
        WHEN teacher_login_limits.blocked_until > now() THEN teacher_login_limits.blocked_until
        WHEN teacher_login_limits.window_start >= now() - interval '15 minutes' AND teacher_login_limits.failures >= 4 THEN now() + interval '15 minutes'
        ELSE 'epoch'::timestamptz END,
      failures = CASE WHEN teacher_login_limits.window_start < now() - interval '15 minutes' THEN 1 ELSE teacher_login_limits.failures + 1 END,
      window_start = CASE WHEN teacher_login_limits.window_start < now() - interval '15 minutes' THEN now() ELSE teacher_login_limits.window_start END
    RETURNING blocked_until`;
  return { clientKey, blocked: new Date(limit.blocked_until).getTime() > Date.now() };
}

export async function loginTeacher(request, response, getDatabase, prepare) {
  const secret = process.env.SESSION_SECRET;
  const adminPassword = configuredAdminPassword();
  if (!secret || !adminPassword) return json(response, 503, { error: 'TEACHER_LOGIN_NOT_CONFIGURED' });
  const username = normalizeUsername(request.body?.username);
  const password = request.body?.password;
  if (!username || typeof password !== 'string' || !password || password.length > 128) {
    return json(response, 401, { error: 'INVALID_PASSWORD' });
  }
  const sql = getDatabase();
  await prepare(sql);
  const { clientKey, blocked } = await recordTeacherPasswordAttempt(sql, request, `:login:${username}`);
  if (blocked) return json(response, 429, { error: 'TOO_MANY_ATTEMPTS' });

  let account;
  let identity;
  if (username === ADMIN_USERNAME) {
    if (!equalSecret(password, adminPassword)) return json(response, 401, { error: 'INVALID_PASSWORD' });
    identity = adminIdentity;
  } else {
    [account] = await sql`SELECT password_hash, active, session_version, classes, subject, can_edit_students, display_name,
      to_jsonb(teacher_accounts)->>'school_id' AS school_id
      FROM teacher_accounts WHERE username = ${username}`;
    const validPassword = await verifyTeacherPassword(password, account?.password_hash);
    if (!validPassword || !account?.active || !Array.isArray(account.classes)) return json(response, 401, { error: 'INVALID_PASSWORD' });
    identity = scopedTeacherIdentity(username, account);
  }

  await sql`DELETE FROM teacher_login_limits WHERE client_key = ${clientKey}`;
  const token = teacherSessionToken(username, account?.session_version);
  response.setHeader('Set-Cookie', `teacher_session=${token}; ${cookieOptions}; Max-Age=${SESSION_SECONDS}`);
  return json(response, 200, { ok: true, teacher: identity });
}
