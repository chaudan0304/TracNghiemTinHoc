export const LESSON_LIMITS = { lessons: 20, questions: 100, batchQuestions: 500, bytes: 2 * 1024 * 1024 };

export class LessonInputError extends Error {}

function requiredText(value, maxLength, label, optional = false) {
  const trimmed = typeof value === 'string' ? value.trim() : '';
  if (typeof value !== 'string' || (!optional && !trimmed) || trimmed.length > maxLength || trimmed.includes('\0')) {
    throw new LessonInputError(`${label} ${optional ? 'phải có tối đa' : 'phải có từ 1 đến'} ${maxLength} ký tự.`);
  }
  return trimmed;
}

export function normalizeNewLessons(input) {
  if (!Array.isArray(input) || !input.length || input.length > LESSON_LIMITS.lessons) {
    throw new LessonInputError(`Mỗi lần lưu từ 1 đến ${LESSON_LIMITS.lessons} bài học.`);
  }
  const ids = new Set();
  let totalQuestions = 0;
  return input.map((item, index) => {
    const label = `Bài ${index + 1}`;
    if (![3, 4, 5].includes(item?.grade)) throw new LessonInputError(`${label}: Khối phải là 3, 4 hoặc 5.`);
    const title = requiredText(item.title, 160, `${label}: Tên bài`);
    if (!Number.isInteger(item.minutes) || item.minutes < 1 || item.minutes > 120) {
      throw new LessonInputError(`${label}: Thời gian phải là số nguyên từ 1 đến 120 phút.`);
    }
    if (!Array.isArray(item.questions) || !item.questions.length || item.questions.length > LESSON_LIMITS.questions) {
      throw new LessonInputError(`${label}: Cần từ 1 đến ${LESSON_LIMITS.questions} câu hỏi.`);
    }
    totalQuestions += item.questions.length;
    if (totalQuestions > LESSON_LIMITS.batchQuestions) throw new LessonInputError(`Mỗi lần lưu tối đa ${LESSON_LIMITS.batchQuestions} câu hỏi.`);

    const slug = title.toLocaleLowerCase('vi').normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 58).replace(/-$/, '');
    if (!slug) throw new LessonInputError(`${label}: Tên bài cần có chữ cái hoặc chữ số.`);
    const id = `lop-${item.grade}-${slug}`;
    if (ids.has(id)) throw new LessonInputError(`${label}: Tên bài “${title}” tạo mã trùng với một bài trong danh sách.`);
    ids.add(id);

    return {
      id, grade: item.grade, lessonTitle: title, timeLimitSeconds: item.minutes * 60,
      subjectBadge: `TIN HỌC LỚP ${item.grade}`, gameTitle: `CHINH PHỤC TIN HỌC LỚP ${item.grade}`,
      pointsPerQuestion: 10 / item.questions.length,
      questions: item.questions.map((question, questionIndex) => {
        const prefix = `${label} (${title}), câu ${questionIndex + 1}`;
        const text = requiredText(question?.question, 500, `${prefix}: Câu hỏi`);
        if (!Array.isArray(question.options) || question.options.length !== 4) {
          throw new LessonInputError(`${prefix}: Cần đủ 4 phương án.`);
        }
        const options = question.options.map((option, i) => requiredText(option, 300, `${prefix}: Phương án ${'ABCD'[i]}`));
        if (new Set(options).size !== 4) throw new LessonInputError(`${prefix}: Các phương án đang bị trùng.`);
        if (!Number.isInteger(question.correctIndex) || question.correctIndex < 0 || question.correctIndex > 3) {
          throw new LessonInputError(`${prefix}: Đáp án đúng phải là A, B, C hoặc D.`);
        }
        const explanation = requiredText(question.explanation ?? '', 1000, `${prefix}: Giải thích`, true);
        return { question: text, options, correctIndex: question.correctIndex, explanation };
      })
    };
  });
}
