import { LESSON_LIMITS, normalizeNewLessons } from '../lib/lesson-input.js';

export function initializeLessonEditor(actions) {
  const byId = id => document.getElementById(id);
  const manual = byId('lesson-manual');
  const excel = byId('lesson-excel');
  const questions = byId('lesson-manual-questions');
  const add = byId('lesson-add-question');
  const manualMode = byId('lesson-mode-manual');
  const excelMode = byId('lesson-mode-excel');
  const file = byId('lesson-import-file');
  const preview = byId('lesson-import-preview');
  const importSubmit = byId('lesson-import-submit');
  const templateButton = byId('lesson-download-template');
  const status = byId('lesson-create-status');
  let imported = null;
  let fileReadId = 0;
  let saving = false;

  function setStatus(message, kind = '') {
    status.textContent = message;
    status.dataset.kind = kind;
  }

  function showMode(isExcel) {
    manual.hidden = isExcel;
    excel.hidden = !isExcel;
    manualMode.setAttribute('aria-pressed', String(!isExcel));
    excelMode.setAttribute('aria-pressed', String(isExcel));
    setStatus('');
  }
  manualMode.addEventListener('click', () => showMode(false));
  excelMode.addEventListener('click', () => showMode(true));

  function numberQuestions() {
    const count = questions.children.length;
    [...questions.children].forEach((card, index) => {
      card.querySelector('legend').textContent = `Câu ${index + 1}`;
      const remove = card.querySelector('.lesson-remove-question');
      remove.setAttribute('aria-label', `Bỏ câu ${index + 1}`);
      remove.disabled = count === 1;
    });
    add.disabled = count >= LESSON_LIMITS.questions;
  }

  function addQuestion(focus = false) {
    const card = byId('lesson-question-template').content.firstElementChild.cloneNode(true);
    card.querySelector('.lesson-remove-question').addEventListener('click', () => {
      const next = card.nextElementSibling || card.previousElementSibling;
      card.remove();
      numberQuestions();
      next?.querySelector('input').focus();
    });
    questions.append(card);
    numberQuestions();
    if (focus) card.querySelector('input').focus();
  }
  addQuestion();
  add.addEventListener('click', () => addQuestion(true));

  async function publish(lessons, form, onSuccess) {
    if (saving) return;
    const fields = [...form.elements].filter(element => !element.disabled);
    try {
      normalizeNewLessons(lessons);
      const body = JSON.stringify({ lessons });
      if (new Blob([body]).size > LESSON_LIMITS.bytes) throw new Error('Nội dung nhập quá lớn. Hãy chia thành nhiều lượt.');
      saving = true;
      fields.forEach(element => { element.disabled = true; });
      setStatus('Đang lưu bài học...');
      let ids;
      try {
        ids = (await actions.save(body)).ids;
      } finally {
        fields.forEach(element => { element.disabled = false; });
      }
      onSuccess();
      let message = `Đã lưu ${ids.length} bài học.`;
      try {
        await actions.refresh();
      } catch {
        message += ' Hãy tải lại trang giáo viên để cập nhật danh sách.';
      }
      setStatus(message);
      if (ids.length === 1) {
        const link = document.createElement('a');
        link.href = `/quiz?bai=${encodeURIComponent(ids[0])}`;
        link.textContent = 'Mở bài học';
        status.append(link);
      }
    } catch (error) {
      setStatus(error.message, 'error');
    } finally {
      saving = false;
    }
  }

  manual.addEventListener('submit', event => {
    event.preventDefault();
    const value = name => manual.elements.namedItem(name).value;
    const input = {
      grade: Number(value('grade')), title: value('title'), minutes: Number(value('minutes')),
      questions: [...questions.children].map(card => {
        const get = name => card.querySelector(`[name="${name}"]`).value;
        return {
          question: get('question'), options: ['a', 'b', 'c', 'd'].map(get),
          correctIndex: get('correct') === '' ? -1 : Number(get('correct')), explanation: get('explanation')
        };
      })
    };
    publish([input], manual, () => {
      manual.elements.namedItem('title').value = '';
      questions.replaceChildren();
      addQuestion();
    });
  });

  templateButton.addEventListener('click', async () => {
    templateButton.disabled = true;
    try {
      const tools = await actions.loadWorkbookTools();
      actions.download(await tools.createLessonTemplate(), 'mau-nhap-bai-hoc.xlsx');
    } catch (error) {
      setStatus(error.message, 'error');
    } finally {
      templateButton.disabled = false;
    }
  });

  function clearImport() {
    imported = null;
    importSubmit.disabled = true;
    preview.replaceChildren();
  }

  file.addEventListener('change', async () => {
    const readId = ++fileReadId;
    clearImport();
    setStatus('');
    if (!file.files.length) return;
    const selected = file.files[0];
    setStatus('Đang đọc tệp Excel...');
    try {
      const tools = await actions.loadWorkbookTools();
      const lessons = await tools.readLessonWorkbook(selected);
      if (readId !== fileReadId) return;
      imported = lessons;
      for (const lesson of lessons) {
        const row = document.createElement('li');
        row.textContent = `Lớp ${lesson.grade} · ${lesson.title} · ${lesson.questions.length} câu · ${lesson.minutes} phút`;
        preview.append(row);
      }
      importSubmit.disabled = false;
      setStatus(`Đã đọc ${lessons.length} bài. Kiểm tra danh sách rồi bấm Lưu.`);
    } catch (error) {
      if (readId === fileReadId) setStatus(error.message, 'error');
    }
  });

  excel.addEventListener('submit', event => {
    event.preventDefault();
    if (!imported) return;
    publish(imported, excel, () => {
      file.value = '';
      clearImport();
    });
  });
}
