import { LESSON_LIMITS, normalizeLessonUpdate, normalizeNewLessons } from '../lib/lesson-input.js';

export function initializeLessonEditor(actions) {
  const byId = id => document.getElementById(id);
  const manual = byId('lesson-manual');
  const excel = byId('lesson-excel');
  const questions = byId('lesson-manual-questions');
  const add = byId('lesson-add-question');
  const manualSubmit = byId('lesson-manual-submit');
  const manualCancel = byId('lesson-manual-cancel');
  const manualMode = byId('lesson-mode-manual');
  const excelMode = byId('lesson-mode-excel');
  const file = byId('lesson-import-file');
  const preview = byId('lesson-import-preview');
  const importSubmit = byId('lesson-import-submit');
  const templateButton = byId('lesson-download-template');
  const status = byId('lesson-create-status');
  const managedList = byId('managed-lessons-list');
  const managedStatus = byId('managed-lessons-status');
  const managedRefresh = byId('managed-lessons-refresh');
  let imported = null;
  let editingLesson = null;
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
  excelMode.addEventListener('click', () => {
    if (editingLesson) resetManualForm();
    showMode(true);
  });

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

  function addQuestion(focus = false, initial = null) {
    const card = byId('lesson-question-template').content.firstElementChild.cloneNode(true);
    card.querySelector('.lesson-remove-question').addEventListener('click', () => {
      const next = card.nextElementSibling || card.previousElementSibling;
      card.remove();
      numberQuestions();
      next?.querySelector('input').focus();
    });
    if (initial) {
      card.querySelector('[name="question"]').value = initial.question || '';
      ['a', 'b', 'c', 'd'].forEach((key, index) => {
        card.querySelector(`[name="${key}"]`).value = initial.options?.[index] || '';
      });
      card.querySelector('[name="correct"]').value = Number.isInteger(initial.correctIndex) ? String(initial.correctIndex) : '';
      card.querySelector('[name="explanation"]').value = initial.explanation || '';
    }
    questions.append(card);
    numberQuestions();
    if (focus) card.querySelector('input').focus();
  }

  function resetManualForm() {
    editingLesson = null;
    manual.elements.namedItem('title').value = '';
    manual.elements.namedItem('grade').value = '3';
    manual.elements.namedItem('minutes').value = '15';
    questions.replaceChildren();
    addQuestion();
    manualSubmit.textContent = 'Lưu bài học';
    manualCancel.hidden = true;
  }

  addQuestion();
  add.addEventListener('click', () => addQuestion(true));
  manualCancel.addEventListener('click', () => {
    resetManualForm();
    setStatus('');
  });

  async function refreshManaged() {
    if (!actions.listManaged) return;
    managedRefresh.disabled = true;
    managedStatus.textContent = 'Đang tải bài học tự tạo...';
    try {
      const data = await actions.listManaged();
      const editable = (data.lessons || []).filter(item => item.editable);
      managedList.replaceChildren();
      if (!editable.length) {
        managedStatus.textContent = 'Chưa có bài học tự tạo thuộc quyền quản lý của bạn.';
        return;
      }
      managedStatus.textContent = `Có ${editable.length} bài học có thể chỉnh sửa.`;
      for (const lesson of editable) {
        const item = document.createElement('li');
        item.className = 'managed-lesson-item';
        const meta = document.createElement('div');
        meta.className = 'managed-lesson-meta';
        const titleRow = document.createElement('div');
        titleRow.className = 'managed-lesson-title';
        const titleText = document.createElement('span');
        titleText.textContent = `Lớp ${lesson.grade} · ${lesson.lessonTitle}`;
        titleRow.append(titleText);
        if (lesson.hidden) {
          const badge = document.createElement('span');
          badge.className = 'managed-lesson-badge';
          badge.textContent = 'Đã ẩn';
          titleRow.append(badge);
        }
        const sub = document.createElement('div');
        sub.className = 'managed-lesson-sub';
        sub.textContent = `${lesson.questionCount} câu · ${Math.ceil(lesson.timeLimitSeconds / 60)} phút${lesson.authorName ? ' · ' + lesson.authorName : ''}`;
        meta.append(titleRow, sub);

        const controls = document.createElement('div');
        controls.className = 'managed-lesson-actions';
        if (!lesson.hidden) {
          const openLink = document.createElement('a');
          openLink.className = 'btn btn-secondary';
          openLink.href = `/quiz?bai=${encodeURIComponent(lesson.id)}`;
          openLink.textContent = 'Mở bài';
          controls.append(openLink);
        }

        const editBtn = document.createElement('button');
        editBtn.type = 'button';
        editBtn.className = 'btn btn-secondary';
        editBtn.textContent = 'Sửa';
        editBtn.addEventListener('click', () => startEdit(lesson.id));

        const hideBtn = document.createElement('button');
        hideBtn.type = 'button';
        hideBtn.className = 'btn btn-secondary';
        hideBtn.textContent = lesson.hidden ? 'Hiện bài' : 'Ẩn bài';
        hideBtn.addEventListener('click', async () => {
          if (saving) return;
          saving = true;
          hideBtn.disabled = true;
          try {
            await actions.update(JSON.stringify({ action: 'toggle-hidden', id: lesson.id, hidden: !lesson.hidden }));
            await Promise.all([refreshManaged(), actions.refresh()]);
            setStatus(lesson.hidden ? `Đã hiển thị lại bài “${lesson.lessonTitle}”.` : `Đã ẩn bài “${lesson.lessonTitle}” khỏi trang học sinh.`);
          } catch (error) {
            setStatus(error.message, 'error');
          } finally {
            saving = false;
            hideBtn.disabled = false;
          }
        });

        const delBtn = document.createElement('button');
        delBtn.type = 'button';
        delBtn.className = 'btn-danger';
        delBtn.textContent = 'Xóa';
        delBtn.addEventListener('click', async () => {
          if (saving || !confirm(`Thầy/cô muốn xóa bài “${lesson.lessonTitle}”? Chỉ xóa được nếu chưa có học sinh nộp bài.`)) return;
          saving = true;
          delBtn.disabled = true;
          try {
            await actions.remove(lesson.id);
            if (editingLesson?.id === lesson.id) resetManualForm();
            await Promise.all([refreshManaged(), actions.refresh()]);
            setStatus(`Đã xóa bài “${lesson.lessonTitle}”.`);
          } catch (error) {
            setStatus(error.message, 'error');
          } finally {
            saving = false;
            delBtn.disabled = false;
          }
        });

        controls.append(editBtn, hideBtn, delBtn);
        item.append(meta, controls);
        managedList.append(item);
      }
    } catch (error) {
      managedStatus.textContent = error.message;
    } finally {
      managedRefresh.disabled = false;
    }
  }

  async function startEdit(id) {
    if (saving || !actions.loadOne) return;
    setStatus('Đang tải nội dung bài học...');
    try {
      const detail = await actions.loadOne(id);
      showMode(false);
      editingLesson = detail;
      manual.elements.namedItem('title').value = detail.lessonTitle;
      manual.elements.namedItem('grade').value = String(detail.grade);
      manual.elements.namedItem('minutes').value = String(Math.max(1, Math.round(detail.timeLimitSeconds / 60)));
      questions.replaceChildren();
      for (const question of detail.questions) addQuestion(false, question);
      manualSubmit.textContent = 'Cập nhật bài học';
      manualCancel.hidden = false;
      setStatus(`Đang sửa bài “${detail.lessonTitle}”. Bấm Cập nhật bài học để lưu.`);
      manual.elements.namedItem('title').focus();
    } catch (error) {
      setStatus(error.message, 'error');
    }
  }

  managedRefresh.addEventListener('click', refreshManaged);

  async function publish(lessons, form, onSuccess) {
    if (saving) return;
    const fields = [...form.elements].filter(element => !element.disabled);
    try {
      if (editingLesson && form === manual) {
        normalizeLessonUpdate(lessons[0], editingLesson);
      } else {
        normalizeNewLessons(lessons);
      }
      const payload = editingLesson && form === manual
        ? { id: editingLesson.id, hidden: Boolean(editingLesson.hidden), ...lessons[0] }
        : { lessons };
      const body = JSON.stringify(payload);
      if (new Blob([body]).size > LESSON_LIMITS.bytes) throw new Error('Nội dung nhập quá lớn. Hãy chia thành nhiều lượt.');
      saving = true;
      fields.forEach(element => { element.disabled = true; });
      setStatus(editingLesson && form === manual ? 'Đang cập nhật bài học...' : 'Đang lưu bài học...');
      let ids;
      let updatedHidden = false;
      try {
        if (editingLesson && form === manual) {
          const updated = await actions.update(body);
          ids = [updated.id];
          updatedHidden = Boolean(updated.hidden);
        } else {
          ids = (await actions.save(body)).ids;
        }
      } finally {
        fields.forEach(element => { element.disabled = false; });
      }
      const wasEditing = editingLesson && form === manual;
      onSuccess();
      let message = wasEditing ? 'Đã cập nhật bài học.' : `Đã lưu ${ids.length} bài học.`;
      try {
        await Promise.all([actions.refresh(), refreshManaged()]);
      } catch {
        message += ' Hãy tải lại trang giáo viên để cập nhật danh sách.';
      }
      setStatus(message);
      if (ids.length === 1 && !updatedHidden) {
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
    publish([input], manual, resetManualForm);
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

  return refreshManaged;
}
