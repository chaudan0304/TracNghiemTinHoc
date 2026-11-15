import test from 'node:test';
import assert from 'node:assert/strict';
import { grade, loadLesson, sessionToken, isTeacher } from '../lib/server.js';

test('each listed lesson loads and has valid grading', async () => {
  for (const id of ['lop-4-bai-6', 'lop-4-on-tap-may-tinh']) {
    const lesson = await loadLesson(id);
    assert.equal(lesson.id, id);
    assert.ok(lesson.questions.length > 0);
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
  await assert.rejects(loadLesson('../source/trangchu'), /INVALID_LESSON/);
  const lesson = await loadLesson('lop-4-on-tap-may-tinh');
  assert.throws(() => grade(lesson, [9]), /INVALID_ANSWERS/);
  assert.throws(() => grade(lesson, Array(100).fill(0)), /INVALID_ANSWERS/);
});

test('teacher session requires a valid signature and expiry', () => {
  const previous = process.env.SESSION_SECRET;
  process.env.SESSION_SECRET = 'test-secret';
  try {
    const valid = sessionToken('test-secret', Date.now() + 10000);
    assert.equal(isTeacher({ headers: { cookie: `teacher_session=${valid}` } }), true);
    assert.equal(isTeacher({ headers: { cookie: `teacher_session=${valid.slice(0, -1)}0` } }), false);
    assert.equal(isTeacher({ headers: { cookie: `teacher_session=${sessionToken('test-secret', Date.now() - 10000)}` } }), false);
  } finally {
    if (previous === undefined) delete process.env.SESSION_SECRET; else process.env.SESSION_SECRET = previous;
  }
});
