const fs = require('fs');
const vm = require('vm');

const source = fs.readFileSync('source/trangchu.html', 'utf8');
const start = source.indexOf('    const LESSON_CONFIG = {');
const end = source.indexOf('    ];', source.indexOf('    const QUESTIONS = [', start)) + 6;
if (start < 0 || end < 6) throw new Error('Không tìm thấy dữ liệu bài 6');
const data = vm.runInNewContext(source.slice(start, end).replace('const LESSON_CONFIG', 'var LESSON_CONFIG').replace('const QUESTIONS', 'var QUESTIONS') + '\n({LESSON_CONFIG, QUESTIONS})');
fs.mkdirSync('lessons', { recursive: true });
fs.writeFileSync('lessons/lop-4-bai-6.json', JSON.stringify({ id: 'lop-4-bai-6', ...data.LESSON_CONFIG, questions: data.QUESTIONS }, null, 2));

const replacement = `    const lessonId = new URLSearchParams(location.search).get("bai") || "lop-4-bai-6";
    if (!/^[a-z0-9-]+$/.test(lessonId)) throw new Error("Mã bài học không hợp lệ");
    const lessonResponse = await fetch(\`/lessons/\${lessonId}.json\`);
    if (!lessonResponse.ok) throw new Error("Không tải được bài học");
    const lesson = await lessonResponse.json();
    if (!Array.isArray(lesson.questions) || !lesson.questions.length || lesson.questions.some(q => !Array.isArray(q.options) || q.correctIndex < 0 || q.correctIndex >= q.options.length)) throw new Error("Dữ liệu câu hỏi không hợp lệ");
    const LESSON_CONFIG = lesson;
    const QUESTIONS = lesson.questions;`;
let html = source.slice(0, start) + '    const LESSON_CONFIG = lesson;\n    const QUESTIONS = lesson.questions;' + source.slice(end);
html = html.replace('    const appId = ', replacement.slice(0, replacement.indexOf('    const LESSON_CONFIG = lesson;')) + '    const appId = ');
html = html.replace(/<title>[^<]*<\/title>/, '<title>Chinh phục Tin học</title>');
html = html.replace('"tinhoc4-bai6-quiz"', '"trac-nghiem-tin-hoc"');
html = html.replace('"tinhoc4_bai6_records_backup_v1"', '`records_${lessonId}_v1`');
html = html.replace('"tinhoc4_bai6_teacher_pin_v1"', '`teacher_pin_${lessonId}_v1`');
html = html.replace('"student_results");', '"student_results", lessonId, "attempts");');
html = html.replace('"teacher_settings", "config");', '"teacher_settings", lessonId);');
html = html.replaceAll('"student_results", docId)', '"student_results", lessonId, "attempts", docId)');
html = html.replaceAll('"student_results", r.id)', '"student_results", lessonId, "attempts", r.id)');
html = html.replaceAll('Ket_Qua_Tin_Hoc_4_Bai_6.csv', 'Ket_Qua_${lessonId}.csv');
html = html.replace('link.download = "Ket_Qua_${lessonId}.csv";', 'link.download = `Ket_Qua_${lessonId}.csv`;');
html = html.replace('"Đã tải xuống tệp Ket_Qua_${lessonId}.csv thành công!"', '`Đã tải xuống tệp Ket_Qua_${lessonId}.csv thành công!`');
html = html.replace('    window.addEventListener("DOMContentLoaded", initApp);', '    if (document.readyState === "loading") window.addEventListener("DOMContentLoaded", initApp); else initApp();');
html = html.replaceAll('Bài 6. Bản quyền sử dụng phần mềm • Tin học Lớp 4', 'Kết quả bài trắc nghiệm');
html = html.replace('aria-label="Minh họa học sinh sử dụng phần mềm có bản quyền"', 'aria-label="Minh họa học sinh sử dụng máy tính"');
html = html.replace('Em đã nắm được những kiến thức quan trọng về bản quyền sử dụng phần mềm.', 'Em đã hoàn thành bài trắc nghiệm.');
html = html.replace('Em đã nắm rất vững kiến thức về bản quyền sử dụng phần mềm và luôn biết tôn trọng sản phẩm trí tuệ!', 'Em đã nắm rất vững nội dung bài học!');
html = html.replaceAll('Bài 6. Bản quyền sử dụng phần mềm', 'Đang tải bài học...');
html = html.replace('if (state.score >= 8)', 'if (state.score >= maxScore * 0.8)');
html = html.replace('else if (state.score >= 5)', 'else if (state.score >= maxScore * 0.5)');
html = html.replace('onclick="openTeacherPortal()"', 'onclick="location.href=\'/teacher\'"');
html = html.replace('      timedOut: false\n', '      timedOut: false,\n      submitted: false\n');
html = html.replace('      state.timedOut = false;', '      state.timedOut = false;\n      state.submitted = false;');
html = html.replace('    async function showResults() {\n      stopTimer();', '    async function showResults() {\n      if (state.submitted) return;\n      state.submitted = true;\n      stopTimer();');
const oldSubmit = `    async function saveStudentRecordCloud(record) {
      try {
        await cloudReadyPromise;
        if (!db || !currentUser) return false;
        await addDoc(getResultsCollectionRef(), record);
        return true;
      } catch (e) {
        console.error("Không thể lưu kết quả học sinh lên đám mây:", e);
        return false;
      }
    }`;
const newSubmit = `    async function saveStudentRecordCloud(record) {
      try {
        const response = await fetch('/api/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: crypto.randomUUID(), lessonId, name: record.name,
            className: record.className,
            answers: QUESTIONS.map((_, i) => state.userAnswers[i]?.selectedIndex ?? null)
          })
        });
        return response.ok;
      } catch (e) {
        console.error('Không thể gửi kết quả:', e);
        return false;
      }
    }`;
if (!html.includes(oldSubmit)) throw new Error('Không tìm thấy hàm nộp bài cũ');
html = html.replace(oldSubmit, newSubmit);
fs.writeFileSync('quiz.html', html);
