import test from 'node:test';
import assert from 'node:assert/strict';
import { createTeacherHandler } from '../api/teacher.js';
import { authenticateTeacher, hashTeacherPassword, teacherSessionToken } from '../lib/teacher-auth.js';

test('the existing teacher password signs in as admin and teacher accounts keep separate passwords', async t => {
  const settings = ['SESSION_SECRET', 'TEACHER_PASSWORD', 'ADMIN_PASSWORD'];
  const previous = settings.map(name => process.env[name]);
  t.after(() => {
    settings.forEach((name, index) => {
      if (previous[index] === undefined) delete process.env[name];
      else process.env[name] = previous[index];
    });
  });
  process.env.SESSION_SECRET = 'role-test-secret';
  process.env.TEACHER_PASSWORD = 'existing-password';
  delete process.env.ADMIN_PASSWORD;

  const account = {
    active: true, classes: ['4A1'], subject: 'Tin học',
    session_version: '123e4567-e89b-42d3-a456-426614174023',
    password_hash: await hashTeacherPassword('teacher-own-password')
  };
  const sql = async parts => {
    const query = parts.join('?');
    if (query.includes('INSERT INTO teacher_login_limits')) return [{ blocked_until: new Date(0) }];
    if (query.includes('DELETE FROM teacher_login_limits')) return [];
    if (query.includes('FROM teacher_accounts')) return [account];
    assert.fail(query);
  };
  const handler = createTeacherHandler(() => sql, async () => {});
  async function login(username, password) {
    const response = {
      headers: {},
      setHeader(name, value) { this.headers[name] = value; },
      status(code) { this.code = code; return this; },
      json(data) { this.data = data; }
    };
    await handler({ method: 'POST', headers: {}, body: { action: 'login', username, password } }, response);
    return response;
  }

  const admin = await login('admin', 'existing-password');
  assert.equal(admin.code, 200);
  assert.equal(admin.data.teacher.role, 'admin');
  const request = { headers: { cookie: admin.headers['Set-Cookie'].split(';')[0] } };
  assert.equal((await authenticateTeacher(request)).role, 'admin');
  assert.equal((await login('gv.an', 'existing-password')).code, 401);
  assert.equal((await login('gv.an', 'teacher-own-password')).data.teacher.role, 'teacher');

  process.env.ADMIN_PASSWORD = 'rotated-admin-password';
  assert.equal(await authenticateTeacher(request), null);
  assert.equal((await login('admin', 'existing-password')).code, 401);
  assert.equal((await login('admin', 'rotated-admin-password')).data.teacher.role, 'admin');
});

test('teacher class scope applies to reads and admin tools, and score edits are rejected', async t => {
  const previous = process.env.SESSION_SECRET;
  process.env.SESSION_SECRET = 'role-test-secret';
  t.after(() => {
    if (previous === undefined) delete process.env.SESSION_SECRET;
    else process.env.SESSION_SECRET = previous;
  });
  const username = 'gv.an';
  const version = '123e4567-e89b-42d3-a456-426614174023';
  const scope = JSON.stringify(['4A1']);
  let canEditStudents = false;
  let identityUpdates = 0;
  const sql = async (parts, ...values) => {
    const query = parts.join('?');
    if (query.includes('FROM teacher_accounts')) return [{
      active: true, session_version: version, classes: ['4A1'], can_edit_students: canEditStudents
    }];
    if (query.includes('SELECT id, lesson_id')) {
      assert.match(query, /jsonb_exists/);
      assert.ok(values.includes(scope));
      return [];
    }
    assert.fail(query);
  };
  sql.transaction = async build => {
    identityUpdates++;
    const queries = build((parts, ...values) => ({ text: parts.join('?'), values }));
    assert.match(queries[1].text, /quiz.audit_actor/);
    assert.deepEqual(queries[1].values, [username]);
    assert.match(queries[2].text, /SET student_name = \?, class_name = \?/);
    assert.doesNotMatch(queries[2].text, /SET score|original_score/);
    assert.deepEqual(queries[2].values, ['An đúng', '4A1', 'quynh-loc', 'An đúng', '4A1', 'An sai', '4A1', 'quynh-loc']);
    return [[], [], [{ updated_count: 2, target_exists: false }]];
  };
  const handler = createTeacherHandler(() => sql, async () => {});
  const headers = { cookie: `teacher_session=${teacherSessionToken(username, version)}` };
  async function call(method, url, body, requestHeaders = headers) {
    const res = {
      setHeader() {},
      status(code) { this.code = code; return this; },
      json(data) { this.data = data; }
    };
    await handler({ method, headers: requestHeaders, url, body }, res);
    return res;
  }
  assert.equal((await call('GET', '/api/teacher?lessonId=lop-4-bai-6')).code, 200);
  assert.equal((await call('GET', '/api/teacher?type=student-attempts&className=4A2&studentName=An')).code, 403);
  assert.equal((await call('GET', '/api/teacher?type=accounts')).code, 403);
  assert.equal((await call('GET', '/api/teacher?type=student-history')).code, 403);
  assert.equal((await call('DELETE', '/api/teacher', { id: version })).code, 403);
  const studentEdit = { action: 'edit-student', sourceName: 'An sai', targetName: 'An đúng', className: '4A1', targetClass: '4A1' };
  assert.equal((await call('POST', '/api/teacher', studentEdit)).code, 403);
  canEditStudents = true;
  assert.equal((await call('POST', '/api/teacher', { ...studentEdit, targetClass: '4A2' })).code, 403);
  assert.equal((await call('POST', '/api/teacher', { ...studentEdit, className: '4A2' })).code, 403);
  assert.equal((await call('POST', '/api/teacher', { ...studentEdit, action: 'merge-students' })).code, 403);
  assert.equal((await call('POST', '/api/teacher', studentEdit)).data.updatedCount, 2);
  assert.equal(identityUpdates, 1);
  const edit = { action: 'edit-score', id: version, expectedScore: 7, score: 8.25 };
  assert.equal((await call('POST', '/api/teacher', edit)).code, 405);
  const previousAdmin = process.env.ADMIN_PASSWORD;
  process.env.ADMIN_PASSWORD = 'role-test-admin-password';
  t.after(() => {
    if (previousAdmin === undefined) delete process.env.ADMIN_PASSWORD;
    else process.env.ADMIN_PASSWORD = previousAdmin;
  });
  const adminHeaders = { cookie: `teacher_session=${teacherSessionToken('admin')}` };
  assert.equal((await call('POST', '/api/teacher', edit, adminHeaders)).code, 405);
});

test('student edit history requires admin and paginates before the supplied id', async t => {
  const settings = ['SESSION_SECRET', 'ADMIN_PASSWORD'];
  const previous = settings.map(name => process.env[name]);
  t.after(() => {
    settings.forEach((name, index) => {
      if (previous[index] === undefined) delete process.env[name];
      else process.env[name] = previous[index];
    });
  });
  process.env.SESSION_SECRET = 'history-test-secret';
  process.env.ADMIN_PASSWORD = 'history-test-admin-password';
  let reads = 0;
  const sql = async (parts, ...values) => {
    reads++;
    assert.match(parts.join('?'), /FROM quiz_student_history[\s\S]*id <[\s\S]*ORDER BY quiz_student_history.id DESC LIMIT 51/);
    assert.deepEqual(values, ['123', '123', 'quynh-loc']);
    return Array.from({ length: 51 }, (_, i) => ({ id: String(122 - i) }));
  };
  const handler = createTeacherHandler(() => sql, async () => assert.fail('Reading history should not prepare other tables'));
  async function get(before, headers = {}) {
    const response = {
      setHeader() {},
      status(code) { this.code = code; return this; },
      json(data) { this.data = data; }
    };
    await handler({ method: 'GET', url: '/api/teacher?type=student-history&before=' + before, headers }, response);
    return response;
  }
  const admin = { cookie: 'teacher_session=' + teacherSessionToken('admin') };
  assert.equal((await get('123')).code, 401);
  assert.equal((await get('invalid', admin)).code, 400);
  assert.equal(reads, 0);
  const page = await get('123', admin);
  assert.equal(page.code, 200);
  assert.equal(page.data.entries.length, 50);
  assert.equal(page.data.nextBefore, '73');
  assert.equal(reads, 1);
});

test('teacher login rate limit isolates failures by username on a shared IP', async t => {
  const settings = ['SESSION_SECRET', 'ADMIN_PASSWORD'];
  const previous = settings.map(name => process.env[name]);
  t.after(() => {
    settings.forEach((name, index) => {
      if (previous[index] === undefined) delete process.env[name];
      else process.env[name] = previous[index];
    });
  });
  process.env.SESSION_SECRET = 'shared-ip-secret';
  process.env.ADMIN_PASSWORD = 'admin-secret-password';
  const limits = new Map();
  const sql = async (parts, ...values) => {
    const query = parts.join('?');
    if (query.includes('INSERT INTO teacher_login_limits')) {
      const key = values[0];
      const count = (limits.get(key) || 0) + 1;
      limits.set(key, count);
      return [{ blocked_until: count >= 5 ? new Date(Date.now() + 60000) : new Date(0) }];
    }
    if (query.includes('DELETE FROM teacher_login_limits')) {
      limits.delete(values[0]);
      return [];
    }
    if (query.includes('FROM teacher_accounts')) return [];
    assert.fail(query);
  };
  const handler = createTeacherHandler(() => sql, async () => {});
  const sharedHeaders = { 'x-forwarded-for': '203.0.113.10' };
  const attempt = async (username, password) => {
    const res = {
      headers: {}, setHeader(k, v) { this.headers[k] = v; },
      status(c) { this.code = c; return this; }, json(d) { this.data = d; }
    };
    await handler({ method: 'POST', headers: sharedHeaders, body: { action: 'login', username, password } }, res);
    return res;
  };
  for (let i = 0; i < 5; i++) await attempt('gv.locked', 'wrong');
  assert.equal((await attempt('gv.locked', 'wrong')).code, 429);
  assert.equal((await attempt('admin', 'admin-secret-password')).code, 200);
});
