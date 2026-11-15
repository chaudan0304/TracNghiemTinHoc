import test from 'node:test';
import assert from 'node:assert/strict';
import submit from '../api/submit.js';
import teacher from '../api/teacher.js';

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
