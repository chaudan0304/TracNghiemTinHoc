import test from 'node:test';
import assert from 'node:assert/strict';
import { createTeacherHandler } from '../api/teacher.js';
import { createSubmitHandler } from '../api/submit.js';
import { createSchoolsHandler } from '../api/schools.js';
import { teacherSessionToken } from '../lib/teacher-auth.js';
import { ensureSchoolsOnce } from '../lib/schools.js';
import { ensureTable, ensureTableOnce } from '../lib/server.js';
import { ensureTeacherAccounts } from '../lib/teacher-accounts.js';
import { handleTeacherAccounts } from '../lib/teacher-accounts.js';
import { seedLesson, seedCatalog } from './seed-fixtures.js';

process.env.SESSION_SECRET = 'school-tests-secret';
process.env.ADMIN_PASSWORD = 'school-tests-password';
const version = '123e4567-e89b-42d3-a456-426614174023';
function response() {
  return { setHeader() {}, status(code) { this.code = code; return this; }, json(body) { this.body = body; } };
}
const admin = { cookie: 'teacher_session=' + teacherSessionToken('admin') };

test('legacy attempts and teacher accounts receive the Quynh Loc default through additive schema changes', async () => {
  const queries = [];
  const sql = async (parts, ...values) => { queries.push({ text: parts.join('?'), values }); return []; };
  await ensureTable(sql);
  await ensureTeacherAccounts(sql);
  assert.equal(queries.filter(q => /ADD COLUMN IF NOT EXISTS school_id text NOT NULL DEFAULT 'quynh-loc'/.test(q.text)).length, 2);
  assert.ok(queries.some(q => q.values.includes('Trường Tiểu học Quỳnh Lộc')));
  assert.ok(queries.every(q => !/DELETE FROM|UPDATE quiz_attempts|SET score|DROP TABLE/.test(q.text)));
});

test('every result read scopes the selected school before aggregating or paginating', async () => {
  for (const suffix of [
    'lessonId=lop-4-bai-6', 'lessonId=lop-4-bai-6&type=classes',
    'lessonId=lop-4-bai-6&stats=1', 'lessonId=lop-4-bai-6&questionStats=1',
    'type=ranking', 'type=ranking&mode=student&className=4A1',
    'type=student-attempts&studentName=An&className=4A1',
    'type=student-history'
  ]) {
    let scopedQueries = 0;
    const sql = async (parts, ...values) => {
      const query = parts.join('?');
      if (query.includes('FROM quiz_lessons')) {
        return query.includes('WHERE') ? [{ lesson: seedLesson('lop-4-bai-6') }] : seedCatalog();
      }
      if (query.includes('FROM quiz_attempts') || query.includes('FROM quiz_student_history')) {
        assert.match(query, /school_id/);
        assert.ok(values.includes('school-b'), suffix);
        scopedQueries++;
      }
      if (query.includes('AS total,')) return [{ total: 0, avg: 0, max: 0, good_count: 0 }];
      return [];
    };
    const result = response();
    await createTeacherHandler(() => sql, async () => {})({
      method: 'GET', url: '/api/teacher?' + suffix + '&schoolId=school-b', headers: admin
    }, result);
    assert.equal(result.code, 200, suffix);
    assert.equal(scopedQueries, 1, suffix);
  }
});

test('teacher cannot read, edit or administer another school with the same class name', async () => {
  let dataQueries = 0;
  const sql = async parts => {
    if (parts.join('?').includes('FROM teacher_accounts')) return [{
      active: true, session_version: version, school_id: 'school-a', classes: ['4A1'], can_edit_students: true
    }];
    dataQueries++;
    return [];
  };
  const handler = createTeacherHandler(() => sql, async () => {});
  const headers = { cookie: 'teacher_session=' + teacherSessionToken('gv.an', version) };
  for (const request of [
    { method: 'GET', url: '/api/teacher?lessonId=lop-4-bai-6&className=4A1&schoolId=school-b' },
    { method: 'POST', body: { action: 'edit-student', schoolId: 'school-b', sourceName: 'An', targetName: 'An mới', className: '4A1', targetClass: '4A1' } },
    { method: 'POST', body: { action: 'create-school', name: 'Trường khác' } },
    { method: 'POST', body: { action: 'update-school', id: 'school-a', name: 'Trường sửa', active: true } },
    { method: 'POST', body: { action: 'migrate-schools' } }
  ]) {
    const result = response();
    await handler({ ...request, headers }, result);
    assert.equal(result.code, 403);
  }
  assert.equal(dataQueries, 0);
});

test('account updates store the selected school and keep passwords when left unchanged', async () => {
  let update;
  const sql = async (parts, ...values) => {
    const query = parts.join('?');
    if (query.includes('SELECT id FROM quiz_schools')) return values[0] === 'school-b' ? [{ id: 'school-b' }] : [];
    if (query.includes('UPDATE teacher_accounts')) { update = { query, values }; return [{ username: 'gv.an' }]; }
    return [];
  };
  const body = { action: 'update-account', username: 'gv.an', subject: 'Tin học', schoolId: 'school-b',
    classes: ['3a1'], active: true, canEditStudents: false, displayName: 'Giáo viên A' };
  const saved = response();
  await handleTeacherAccounts({ method: 'POST', body }, saved, sql);
  assert.equal(saved.code, 200);
  assert.match(update.query, /school_id = COALESCE/);
  assert.ok(update.values.includes('school-b'));
  assert.ok(update.values.includes('["3A1"]'));
  assert.match(update.query, /password_hash = COALESCE/);
  update = null;
  const unknown = response();
  await handleTeacherAccounts({ method: 'POST', body: { ...body, schoolId: 'unknown' } }, unknown, sql);
  assert.equal(unknown.code, 400);
  assert.equal(update, null);
});

test('student list returns active schools while school edits preserve stable identifiers', async () => {
  const calls = [];
  const sql = async (parts, ...values) => {
    const query = parts.join('?');
    calls.push({ query, values });
    if (query.includes('SELECT id, name FROM quiz_schools')) {
      assert.match(query, /WHERE active = true/);
      return [{ id: 'school-a', name: 'Trường A' }];
    }
    if (query.includes('UPDATE quiz_schools')) return [{ id: 'school-a', name: 'Trường đổi tên', active: false }];
    return [];
  };
  const publicResult = response();
  await createSchoolsHandler(() => sql)({ method: 'GET' }, publicResult);
  assert.equal(publicResult.code, 200);
  assert.deepEqual(publicResult.body.schools, [{ id: 'school-a', name: 'Trường A' }]);
  const updated = response();
  await createTeacherHandler(() => sql, async () => {})({
    method: 'POST', headers: admin, body: { action: 'update-school', id: 'school-a', name: 'Trường đổi tên', active: false }
  }, updated);
  assert.equal(updated.code, 200);
  const mutation = calls.find(q => q.query.includes('UPDATE quiz_schools'));
  assert.match(mutation.query, /WHERE id = \?/);
  assert.deepEqual(mutation.values, ['Trường đổi tên', false, 'school-a']);
});

test('retry cannot reuse an attempt id under another school and unavailable schools reject new submissions', async () => {
  const body = { id: version, lessonId: 'lop-4-bai-6', name: 'An', className: '4A1', schoolId: 'school-b', answers: [] };
  let active = true;
  let inserts = 0;
  const sql = async (parts, ...values) => {
    const query = parts.join('?');
    if (query.includes('FROM quiz_lessons')) return [{ lesson: seedLesson(values[0]) }];
    if (query.includes('FROM quiz_schools')) return active ? [{ id: 'school-b' }] : [];
    if (query.includes('INSERT INTO submission_limits')) return [{ attempts: 1 }];
    if (query.includes('INSERT INTO quiz_attempts')) { inserts++; assert.equal(values.at(-1), 'school-b'); return []; }
    if (query.includes('SELECT lesson_id')) return [{ ...body, lesson_id: body.lessonId, student_name: 'An', class_name: '4A1', school_id: 'school-a' }];
    throw new Error('Unexpected query');
  };
  const handler = createSubmitHandler(() => sql, async () => {});
  const retry = response();
  await handler({ method: 'POST', body }, retry);
  assert.equal(retry.code, 409);
  active = false;
  const unavailable = response();
  await handler({ method: 'POST', body: { ...body, id: '123e4567-e89b-42d3-a456-426614174024' } }, unavailable);
  assert.equal(unavailable.code, 400);
  assert.equal(unavailable.body.error, 'SCHOOL_NOT_AVAILABLE');
  assert.equal(inserts, 1);
});

test('schema ensureOnce helpers cache successful initialization per client and recover on errors', async () => {
  let failOnce = true;
  let calls = 0;
  const sql = async () => {
    calls++;
    if (failOnce) { failOnce = false; throw new Error('transient'); }
    return [];
  };
  await assert.rejects(ensureSchoolsOnce(sql), /transient/);
  const afterFailure = calls;
  await Promise.all([ensureSchoolsOnce(sql), ensureSchoolsOnce(sql)]);
  const afterSuccess = calls;
  await ensureSchoolsOnce(sql);
  assert.equal(calls, afterSuccess);
  assert.ok(afterSuccess > afterFailure);

  let tableCalls = 0;
  const tableSql = async () => { tableCalls++; return []; };
  await Promise.all([ensureTableOnce(tableSql), ensureTableOnce(tableSql)]);
  const firstRun = tableCalls;
  await ensureTableOnce(tableSql);
  assert.equal(tableCalls, firstRun);
});
