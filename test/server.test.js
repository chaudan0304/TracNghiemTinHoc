import test from 'node:test';
import assert from 'node:assert/strict';
import { grade } from '../lib/server.js';
import { authenticateTeacher, teacherSessionToken } from '../lib/teacher-auth.js';
import { loadLesson } from '../lib/lesson-store.js';
import { seedIds, seedLesson } from './seed-fixtures.js';

const sql = async (_query, id) => [{ lesson: seedLesson(id) }];

test('each listed lesson loads and has valid grading', async () => {
  const ids = seedIds;
  assert.equal(ids.length, 60);
  for (const grade of [3, 4, 5]) {
    for (const term of [1, 2]) {
      assert.ok(ids.includes(`lop-${grade}-on-tap-hoc-ki-${term}`));
    }
  }
  assert.equal(new Set(ids).size, ids.length);
  for (const id of ids) {
    const lesson = await loadLesson(sql, id);
    assert.equal(lesson.id, id);
    assert.equal(lesson.questions.length, 20, `${id} cần đúng 20 câu hỏi`);
    assert.equal(new Set(lesson.questions.map(q => q.question)).size, lesson.questions.length, `${id} có câu hỏi trùng`);
    assert.equal(lesson.questions.length * lesson.pointsPerQuestion, 10);
    for (const question of lesson.questions) {
      assert.equal(question.options.length, 4);
      assert.equal(new Set(question.options).size, 4);
      assert.ok(Number.isInteger(question.correctIndex) && question.correctIndex >= 0 && question.correctIndex < 4);
      assert.ok(question.explanation.length > 0);
    }
    const correct = lesson.questions.map(q => q.correctIndex);
    assert.deepEqual(grade(lesson, correct), {
      correctCount: correct.length,
      totalQuestions: correct.length,
      score: correct.length * lesson.pointsPerQuestion
    });
    assert.equal(grade(lesson, correct.map(() => null)).score, 0);
  }
});

test('rejects invalid answers and lesson paths', async () => {
  await assert.rejects(loadLesson(sql, '../source/trangchu'), /INVALID_LESSON/);
  const lesson = await loadLesson(sql, 'lop-4-on-tap-may-tinh');
  assert.throws(() => grade(lesson, [9]), /INVALID_ANSWERS/);
  assert.throws(() => grade(lesson, Array(100).fill(0)), /INVALID_ANSWERS/);
});

test('admin session requires a valid signature, expiry and current password', async () => {
  const previous = process.env.SESSION_SECRET;
  const previousPassword = process.env.ADMIN_PASSWORD;
  process.env.SESSION_SECRET = 'test-secret';
  process.env.ADMIN_PASSWORD = 'admin-password';
  try {
    const valid = teacherSessionToken('admin');
    const check = token => authenticateTeacher({ headers: { cookie: `teacher_session=${token}` } });
    assert.equal((await check(valid)).role, 'admin');
    assert.equal(await check(`${valid}0`), null);
    assert.equal(await check(teacherSessionToken('admin', null, Date.now() - 10000)), null);
    assert.equal(await check(`${Date.now() + 10000}.legacy`), null);
    process.env.ADMIN_PASSWORD = 'new-admin-password';
    assert.equal(await check(valid), null);
  } finally {
    if (previous === undefined) delete process.env.SESSION_SECRET; else process.env.SESSION_SECRET = previous;
    if (previousPassword === undefined) delete process.env.ADMIN_PASSWORD; else process.env.ADMIN_PASSWORD = previousPassword;
  }
});
