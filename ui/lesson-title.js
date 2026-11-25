export function lessonDisplayTitle(lesson) {
  return lesson.authorName ? `${lesson.lessonTitle} · ${lesson.authorName}` : lesson.lessonTitle;
}
