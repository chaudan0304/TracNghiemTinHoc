import test from 'node:test';
import assert from 'node:assert/strict';
import { selectIncorrectQuestions } from '../lib/retry-questions.js';

test('retry selects incorrect and unanswered shuffled questions in their current order', () => {
  const questions = [{ originalQuestionIndex: 2 }, { originalQuestionIndex: 0 }, { originalQuestionIndex: 1 }];
  const answers = [{ isCorrect: false }, { isCorrect: true }];
  assert.deepEqual(selectIncorrectQuestions(questions, answers), [questions[0], questions[2]]);
  assert.equal(selectIncorrectQuestions(questions, answers)[0], questions[0]);
  assert.deepEqual(selectIncorrectQuestions(questions, [{ isCorrect: true }, { isCorrect: true }, { isCorrect: true }]), []);
});
