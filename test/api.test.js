import test from 'node:test';
import assert from 'node:assert/strict';
import submit, { createSubmitHandler } from '../api/submit.js';
import teacher, { createTeacherHandler } from '../api/teacher.js';
import { sessionToken } from '../lib/server.js';

function response() {
  return {
    headers: {}, code: 200, body: null,
    setHeader(key, value) { this.headers[key] = value; },
    status(code) { this.code = code; return this; },
    json(body) { this.body = body; return this; }
  };
}

test('submission validates input before touching storage', async () => {
  const invalid = response();
  await submit({ method: 'POST', body: { id: 'bad' } }, invalid);
  assert.equal(invalid.code, 400);
  const valid = response();
  await submit({ method: 'POST', body: {
    id: '123e4567-e89b-42d3-a456-426614174000',
    lessonId: 'lop-4-on-tap-may-tinh', name: 'Học sinh', className: '4A1', answers: [0, 2, 1, 2, 1]
  } }, valid);
  assert.equal(valid.code, 503);
  assert.equal(valid.body.error, 'STORAGE_NOT_CONFIGURED');
});

test('teacher records stay private without login', async () => {
  const result = response();
  await teacher({ method: 'GET', headers: {}, url: '/api/teacher?lessonId=lop-4-bai-6' }, result);
  assert.equal(result.code, 401);
});

test('teacher logout clears session cookie', async () => {
  const result = response();
  await teacher({ method: 'POST', body: { action: 'logout' } }, result);
  assert.equal(result.code, 200);
  assert.equal(result.body.ok, true);
  assert.match(result.headers['Set-Cookie'], /Max-Age=0/);
});

test('submission accepts an identical retry and rejects a conflicting retry', async () => {
  const id = '123e4567-e89b-42d3-a456-426614174000';
  const body = { id, lessonId: 'lop-4-on-tap-may-tinh', name: 'Học sinh', className: '4A1', answers: [0, 2, 1, 2, 1] };
  let stored;
  const sql = async (strings, ...values) => {
    const query = strings.join('?');
    if (query.includes('INSERT INTO submission_limits')) return [{ attempts: 1 }];
    if (query.includes('INSERT INTO quiz_attempts')) {
      if (stored) return [];
      stored = { lesson_id: values[1], student_name: values[2], class_name: values[3], answers: JSON.parse(values[4]) };
      return [{ id }];
    }
    if (query.includes('SELECT lesson_id')) return [stored];
    throw new Error('Unexpected query');
  };
  const handler = createSubmitHandler(() => sql, async () => {});
  for (const expected of [200, 200, 409]) {
    const result = response();
    await handler({ method: 'POST', body: expected === 409 ? { ...body, name: 'Người khác' } : body }, result);
    assert.equal(result.code, expected);
  }
});

test('submission rate limit rejects excess attempts before saving', async () => {
  const body = { id: '123e4567-e89b-42d3-a456-426614174000', lessonId: 'lop-4-on-tap-may-tinh', name: 'Học sinh', className: '4A1', answers: [null, null, null, null, null] };
  let attemptedInsert = false;
  const sql = async (strings) => {
    const query = strings.join('?');
    if (query.includes('INSERT INTO submission_limits')) return [{ attempts: 301 }];
    if (query.includes('INSERT INTO quiz_attempts')) attemptedInsert = true;
    return [];
  };
  const handler = createSubmitHandler(() => sql, async () => {});
  const result = response();
  await handler({ method: 'POST', headers: {}, body }, result);
  assert.equal(result.code, 429);
  assert.equal(attemptedInsert, false);
});

test('submission records timeTakenSeconds when provided', async () => {
  const id = '123e4567-e89b-42d3-a456-426614174001';
  const body = { id, lessonId: 'lop-4-on-tap-may-tinh', name: 'Học sinh', className: '4A1', answers: [0, 2, 1, 2, 1], timeTakenSeconds: 154 };
  let savedDuration;
  const sql = async (strings, ...values) => {
    const query = strings.join('?');
    if (query.includes('INSERT INTO submission_limits')) return [{ attempts: 1 }];
    if (query.includes('INSERT INTO quiz_attempts')) {
      savedDuration = values[8];
      return [{ id }];
    }
    throw new Error('Unexpected query');
  };
  const handler = createSubmitHandler(() => sql, async () => {});
  const result = response();
  await handler({ method: 'POST', body }, result);
  assert.equal(result.code, 200);
  assert.equal(savedDuration, 154);
});

test('teacher login blocks on the fifth attempt and does not issue a cookie', async () => {
  const previous = { password: process.env.TEACHER_PASSWORD, secret: process.env.SESSION_SECRET };
  process.env.TEACHER_PASSWORD = 'correct';
  process.env.SESSION_SECRET = 'test-secret';
  let attempts = 0;
  const sql = async (strings) => {
    assert.match(strings.join('?'), /INSERT INTO teacher_login_limits/);
    attempts++;
    return [{ blocked_until: attempts >= 5 ? new Date(Date.now() + 60000) : new Date(0) }];
  };
  try {
    const handler = createTeacherHandler(() => sql, async () => {});
    for (let i = 1; i <= 5; i++) {
      const result = response();
      await handler({ method: 'POST', headers: {}, body: { password: 'wrong' } }, result);
      assert.equal(result.code, i === 5 ? 429 : 401);
      assert.equal(result.headers['Set-Cookie'], undefined);
    }
  } finally {
    if (previous.password === undefined) delete process.env.TEACHER_PASSWORD; else process.env.TEACHER_PASSWORD = previous.password;
    if (previous.secret === undefined) delete process.env.SESSION_SECRET; else process.env.SESSION_SECRET = previous.secret;
  }
});

test('teacher delete requires a session and deletes the requested id', async () => {
  const previous = process.env.SESSION_SECRET;
  process.env.SESSION_SECRET = 'test-secret';
  const id = '123e4567-e89b-42d3-a456-426614174000';
  let deleted;
  const sql = async (strings, ...values) => {
    assert.match(strings.join('?'), /DELETE FROM quiz_attempts/);
    deleted = values[0];
    return [];
  };
  try {
    const handler = createTeacherHandler(() => sql, async () => {});
    const result = response();
    await handler({ method: 'DELETE', headers: { cookie: `teacher_session=${sessionToken('test-secret', Date.now() + 60000)}` }, body: { id } }, result);
    assert.equal(result.code, 200);
    assert.equal(deleted, id);
  } finally {
    if (previous === undefined) delete process.env.SESSION_SECRET; else process.env.SESSION_SECRET = previous;
  }
});

test('teacher results use the requested lesson and page offset', async () => {
  const previous = process.env.SESSION_SECRET;
  process.env.SESSION_SECRET = 'test-secret';
  const lessonId = 'lop-4-bai-6';
  let queryValues;
  const sql = async (strings, ...values) => {
    assert.match(strings.join('?'), /SELECT id, lesson_id/);
    queryValues = values;
    return [{ id: 'one' }];
  };
  try {
    const handler = createTeacherHandler(() => sql, async () => {});
    const result = response();
    await handler({ method: 'GET', headers: { cookie: `teacher_session=${sessionToken('test-secret', Date.now() + 60000)}` }, url: `/api/teacher?lessonId=${lessonId}&offset=100` }, result);
    assert.equal(result.code, 200);
    assert.deepEqual(result.body.rows, [{ id: 'one' }]);
    assert.deepEqual(queryValues, [lessonId, 100]);
  } finally {
    if (previous === undefined) delete process.env.SESSION_SECRET; else process.env.SESSION_SECRET = previous;
  }
});

test('teacher statistics cover the full lesson with class and name filters', async () => {
  const previous = process.env.SESSION_SECRET;
  process.env.SESSION_SECRET = 'test-secret';
  const lessonId = 'lop-4-bai-6';
  let queryValues;
  const sql = async (strings, ...values) => {
    assert.match(strings.join('?'), /COUNT\(\*\)/);
    queryValues = values;
    return [{ total: 125, avg: '7.4', max: '10', good_count: 60 }];
  };
  try {
    const handler = createTeacherHandler(() => sql, async () => {});
    const result = response();
    await handler({ method: 'GET', headers: { cookie: `teacher_session=${sessionToken('test-secret', Date.now() + 60000)}` }, url: `/api/teacher?lessonId=${lessonId}&stats=1&className=4A1&search=An` }, result);
    assert.equal(result.code, 200);
    assert.deepEqual(result.body.stats, { total: 125, avg: 7.4, max: 10, goodRatio: 48 });
    assert.deepEqual(queryValues, [lessonId, '4A1', '4A1', 'An', 'An']);
  } finally {
    if (previous === undefined) delete process.env.SESSION_SECRET; else process.env.SESSION_SECRET = previous;
  }
});

test('teacher ranking returns class list and grade totals', async () => {
  const previous = process.env.SESSION_SECRET;
  process.env.SESSION_SECRET = 'test-secret';
  let queryCalled = false;
  const sql = async (strings) => {
    assert.match(strings.join('?'), /COUNT\(DISTINCT student_name\)/);
    queryCalled = true;
    return [{ class_name: '4A1', student_count: 30, completed_lessons: 15, total_attempts: 120, avg_score: 8.5, max_score: 10, good_count: 95, latest_submission: new Date().toISOString() }];
  };
  try {
    const handler = createTeacherHandler(() => sql, async () => {});
    const result = response();
    await handler({ method: 'GET', headers: { cookie: `teacher_session=${sessionToken('test-secret', Date.now() + 60000)}` }, url: '/api/teacher?type=ranking' }, result);
    assert.equal(result.code, 200);
    assert.equal(queryCalled, true);
    assert.equal(result.body.classes.length, 1);
    assert.equal(result.body.classes[0].class_name, '4A1');
    assert.equal(result.body.gradeTotals['4'], 19);
  } finally {
    if (previous === undefined) delete process.env.SESSION_SECRET; else process.env.SESSION_SECRET = previous;
  }
});

test('teacher student ranking filters by class and returns student aggregations', async () => {
  const previous = process.env.SESSION_SECRET;
  process.env.SESSION_SECRET = 'test-secret';
  let queryValues;
  const sql = async (strings, ...values) => {
    assert.match(strings.join('?'), /FROM quiz_attempts/);
    queryValues = values;
    return [{ student_name: 'Nguyen Van A', class_name: '4A1', completed_lessons: 12, total_attempts: 15, avg_score: 9.0, max_score: 10, avg_time_seconds: 180, latest_submission: new Date().toISOString() }];
  };
  try {
    const handler = createTeacherHandler(() => sql, async () => {});
    const result = response();
    await handler({ method: 'GET', headers: { cookie: `teacher_session=${sessionToken('test-secret', Date.now() + 60000)}` }, url: '/api/teacher?type=ranking&mode=student&className=4A1' }, result);
    assert.equal(result.code, 200);
    assert.equal(result.body.students.length, 1);
    assert.equal(result.body.students[0].student_name, 'Nguyen Van A');
    assert.deepEqual(queryValues, ['4A1', '4A1', '4A1']);
  } finally {
    if (previous === undefined) delete process.env.SESSION_SECRET; else process.env.SESSION_SECRET = previous;
  }
});
