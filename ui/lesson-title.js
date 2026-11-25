export function lessonDisplayTitle(lesson) {
  return lesson.authorName ? `${lesson.lessonTitle} · ${lesson.authorName}` : lesson.lessonTitle;
}

export function normalizeSearch(value) {
  return String(value || '').toLocaleLowerCase('vi')
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd');
}
