import ExcelJS from 'exceljs';
import { LESSON_LIMITS, normalizeNewLessons } from '../lib/lesson-input.js';

const columns = [
  ['Khối', 9], ['Tên bài', 32], ['Thời gian (phút)', 19], ['Câu hỏi', 52],
  ['Phương án A', 30], ['Phương án B', 30], ['Phương án C', 30], ['Phương án D', 30],
  ['Đáp án đúng', 17], ['Giải thích', 40]
];
const sheetName = 'Câu hỏi';
const excelType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

export async function createLessonTemplate() {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet(sheetName, { views: [{ state: 'frozen', ySplit: 1 }] });
  sheet.columns = columns.map(([header, width]) => ({ header, width }));
  sheet.getRow(1).height = 27;
  sheet.getRow(1).eachCell(cell => {
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF183153' } };
    cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
    cell.alignment = { vertical: 'middle' };
  });
  const data = await workbook.xlsx.writeBuffer();
  return new Blob([data], { type: excelType });
}

export async function readLessonWorkbook(file) {
  if (!file || !/\.xlsx$/i.test(file.name) || file.size > LESSON_LIMITS.bytes) {
    throw new Error('Chọn tệp .xlsx có dung lượng tối đa 2 MB.');
  }
  const bytes = await new Response(file).arrayBuffer();
  const workbook = new ExcelJS.Workbook();
  try {
    await workbook.xlsx.load(bytes, { ignoreNodes: ['drawing', 'picture', 'dataValidations'] });
  } catch {
    throw new Error('Không đọc được tệp Excel. Hãy lưu lại dưới dạng .xlsx và thử lại.');
  }
  const sheet = workbook.getWorksheet(sheetName);
  if (!sheet || columns.some(([header], index) => sheet.getRow(1).getCell(index + 1).text.trim() !== header)) {
    throw new Error('Thiếu trang “Câu hỏi” hoặc tiêu đề cột chưa đúng. Hãy dùng tệp mẫu.');
  }

  const lessons = new Map();
  let questionCount = 0;
  sheet.eachRow((row, number) => {
    if (number === 1) return;
    const values = columns.map((_, index) => row.getCell(index + 1).value);
    if (values.every(value => value == null || (typeof value === 'string' && !value.trim()))) return;
    if (++questionCount > LESSON_LIMITS.batchQuestions) throw new Error(`Tệp có hơn ${LESSON_LIMITS.batchQuestions} câu hỏi. Hãy chia thành nhiều tệp.`);
    if (values.some(value => value != null && !['string', 'number'].includes(typeof value))) {
      throw new Error(`Dòng ${number}: Hãy dùng văn bản hoặc số, bỏ công thức, liên kết và kiểu ngày tháng.`);
    }
    const [gradeText, title, timeText, question, a, b, c, d, answer, explanation] = values.map(value => String(value ?? '').trim());
    if (![gradeText, title, timeText, question, a, b, c, d].every(Boolean)) {
      throw new Error(`Dòng ${number}: Hãy điền đủ khối, tên bài, thời gian, câu hỏi và 4 phương án.`);
    }
    if (!/^[345]$/.test(gradeText) || !/^\d{1,3}$/.test(timeText) || Number(timeText) < 1 || Number(timeText) > 120) {
      throw new Error(`Dòng ${number}: Khối phải là 3, 4 hoặc 5 và thời gian từ 1 đến 120 phút.`);
    }
    if (!/^[ABCD]$/i.test(answer)) throw new Error(`Dòng ${number}: Đáp án đúng phải là A, B, C hoặc D.`);
    const grade = Number(gradeText);
    const minutes = Number(timeText);
    const key = JSON.stringify([grade, title.toLocaleLowerCase('vi')]);
    if (!lessons.has(key)) lessons.set(key, { grade, title, minutes, questions: [] });
    const lesson = lessons.get(key);
    if (lesson.minutes !== minutes) throw new Error(`Dòng ${number}: Thời gian của bài “${title}” khác với các dòng trước.`);
    lesson.questions.push({ question, options: [a, b, c, d], correctIndex: 'ABCD'.indexOf(answer.toUpperCase()), explanation });
  });
  if (!lessons.size) throw new Error('Tệp mẫu chưa có câu hỏi. Hãy điền dữ liệu từ dòng 2.');
  const result = [...lessons.values()];
  normalizeNewLessons(result);
  return result;
}
