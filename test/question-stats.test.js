import test from 'node:test';
import assert from 'node:assert/strict';
import { summarizeQuestionResponses } from '../lib/question-stats.js';

test('question statistics count wrong options and unanswered attempts', () => {
  const lesson = { questions: [
    { question: 'Câu một?', options: ['A', 'B', 'C', 'D'], correctIndex: 1 },
    { question: 'Câu hai?', options: ['E', 'F', 'G', 'H'], correctIndex: 0 }
  ] };
  const rows = [
    { question_index: 0, answer: '0', count: 2 },
    { question_index: 0, answer: '1', count: 3 },
    { question_index: 0, answer: null, count: 1 },
    { question_index: 1, answer: '0', count: 4 },
    { question_index: 1, answer: '2', count: 1 },
    { question_index: 1, answer: null, count: 1 }
  ];
  assert.deepEqual(summarizeQuestionResponses(lesson, rows), [
    { questionIndex: 0, question: 'Câu một?', options: ['A', 'B', 'C', 'D'], correctIndex: 1,
      total: 6, correctCount: 3, wrongCount: 2, unansweredCount: 1, optionCounts: [2, 3, 0, 0] },
    { questionIndex: 1, question: 'Câu hai?', options: ['E', 'F', 'G', 'H'], correctIndex: 0,
      total: 6, correctCount: 4, wrongCount: 1, unansweredCount: 1, optionCounts: [4, 0, 1, 0] }
  ]);
});
