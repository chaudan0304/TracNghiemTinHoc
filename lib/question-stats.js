export function summarizeQuestionResponses(lesson, rows) {
  const questions = lesson.questions.map((item, questionIndex) => ({
    questionIndex,
    question: item.question,
    options: item.options,
    correctIndex: item.correctIndex,
    total: 0,
    correctCount: 0,
    wrongCount: 0,
    unansweredCount: 0,
    optionCounts: item.options.map(() => 0)
  }));

  for (const row of rows) {
    const question = questions[Number(row.question_index)];
    const count = Number(row.count);
    if (!question || !Number.isSafeInteger(count) || count < 0) continue;
    question.total += count;
    if (row.answer === null || row.answer === undefined) {
      question.unansweredCount += count;
      continue;
    }
    const answer = Number(row.answer);
    if (!Number.isInteger(answer) || answer < 0 || answer >= question.options.length) continue;
    question.optionCounts[answer] += count;
    if (answer === question.correctIndex) question.correctCount += count;
    else question.wrongCount += count;
  }
  return questions;
}
