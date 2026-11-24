export const EXCELLENT_SCORE = 9;
export const GOOD_SCORE = 7;
export const PASS_SCORE = 5;

export function getScoreLevel(score) {
  if (score >= EXCELLENT_SCORE) return 3;
  if (score >= GOOD_SCORE) return 2;
  if (score >= PASS_SCORE) return 1;
  return 0;
}
