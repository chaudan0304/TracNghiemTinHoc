export function selectIncorrectQuestions(questions, answers) {
  return questions.filter((_, index) => answers[index]?.isCorrect !== true);
}
