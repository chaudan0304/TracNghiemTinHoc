import test from 'node:test';
import assert from 'node:assert/strict';
import ExcelJS from 'exceljs';
import { createLessonsHandler } from '../api/lessons.js';
import { normalizeNewLessons } from '../lib/lesson-input.js';
import { teacherSessionToken } from '../lib/teacher-auth.js';
import { createLessonTemplate, readLessonWorkbook } from '../ui/lesson-workbook.js';

const input = {
  grade: 4, title: 'Bài tập về bàn phím', minutes: 10,
  questions: [{ question: 'Đâu là phím cách?', options: ['Space', 'Enter', 'Shift', 'Tab'], correctIndex: 0, explanation: '' }]
};

function response() {
  return {
    setHeader() {},
    status(code) { this.code = code; return this; },
    json(body) { this.body = body; }
  };
}

test('new lessons validate grade, answers, and duplicates before insertion', () => {
  const [lesson] = normalizeNewLessons([input]);
  assert.equal(lesson.id, 'lop-4-bai-tap-ve-ban-phim');
  assert.equal(lesson.timeLimitSeconds, 600);
  assert.equal(lesson.questions[0].correctIndex, 0);
  assert.throws(() => normalizeNewLessons([input, input]), /trùng/);
  assert.throws(() => normalizeNewLessons([{ ...input, grade: 2 }]), /khối/i);
  assert.throws(() => normalizeNewLessons([{ ...input, questions: [{ ...input.questions[0], correctIndex: 4 }] }]), /đáp án/i);
});

test('lesson API publishes question text without answer keys and protects creation', async t => {
  const previous = process.env.SESSION_SECRET;
  process.env.ADMIN_PASSWORD = 'test-admin-password';
  t.after(() => { delete process.env.ADMIN_PASSWORD; });
  process.env.SESSION_SECRET = 'test-lessons-secret';
  t.after(() => {
    if (previous === undefined) delete process.env.SESSION_SECRET;
    else process.env.SESSION_SECRET = previous;
  });
  const [lesson] = normalizeNewLessons([input]);
  let writes = 0;
  const sql = async (parts, ...values) => {
    if (parts.join('').includes('INSERT INTO quiz_lessons')) {
      writes++;
      assert.deepEqual(JSON.parse(values[0]), [{ ...lesson, authorName: 'Admin' }]);
      return [{ id: lesson.id }];
    }
    return [{ lesson }];
  };
  const handler = createLessonsHandler(() => sql);
  const detail = response();
  await handler({ method: 'GET', url: '/api/lessons?id=' + lesson.id }, detail);
  assert.equal(detail.code, 200);
  assert.deepEqual(detail.body.questions, [{ question: 'Đâu là phím cách?', options: ['Space', 'Enter', 'Shift', 'Tab'] }]);

  const create = { method: 'POST', headers: {}, body: { lessons: [input] } };
  const unauthorized = response();
  await handler(create, unauthorized);
  assert.equal(unauthorized.code, 401);
  assert.equal(writes, 0);

  const created = response();
  create.headers.cookie = 'teacher_session=' + teacherSessionToken('admin');
  await handler(create, created);
  assert.equal(created.code, 201);
  assert.equal(writes, 1);
  assert.deepEqual(created.body.ids, [lesson.id]);
});

test('lessons use the signed-in teacher name and ignore author fields in the request', async t => {
  const previous = process.env.SESSION_SECRET;
  process.env.SESSION_SECRET = 'author-test-secret';
  t.after(() => {
    if (previous === undefined) delete process.env.SESSION_SECRET;
    else process.env.SESSION_SECRET = previous;
  });
  const username = 'gv.an';
  const version = '123e4567-e89b-42d3-a456-426614174023';
  let displayName = 'Nguyễn Văn An';
  let stored;
  const sql = async (parts, ...values) => {
    const query = parts.join('?');
    if (query.includes('FROM teacher_accounts')) {
      return [{ display_name: displayName, active: true, classes: [], session_version: version }];
    }
    if (query.includes('INSERT INTO quiz_lessons')) {
      stored = JSON.parse(values[0]);
      return stored.map(({ id }) => ({ id }));
    }
    return [{ lesson: stored[0] }];
  };
  const handler = createLessonsHandler(() => sql);
  const create = { method: 'POST', headers: { cookie: 'teacher_session=' + teacherSessionToken(username, version) },
    body: { authorName: 'Tên giả', lessons: [{ ...input, authorName: 'Tên giả' }, { ...input, title: 'Thực hành bàn phím' }] } };
  const added = response();
  await handler(create, added);
  assert.equal(added.code, 201);
  assert.deepEqual(stored.map(lesson => lesson.authorName), [displayName, displayName]);
  assert.equal(stored[0].lessonTitle, input.title);
  const detail = response();
  await handler({ method: 'GET', url: '/api/lessons?id=' + stored[0].id }, detail);
  assert.equal(detail.body.authorName, displayName);
  assert.equal(detail.body.lessonTitle, input.title);

  displayName = null;
  const fallback = response();
  await handler(create, fallback);
  assert.equal(fallback.code, 201);
  assert.ok(stored.every(lesson => lesson.authorName === username));
});

test('custom lessons can be managed, edited, hidden from students, and deleted only when unused', async t => {
  const settings = ['SESSION_SECRET', 'ADMIN_PASSWORD'];
  const previous = settings.map(name => process.env[name]);
  t.after(() => {
    settings.forEach((name, index) => {
      if (previous[index] === undefined) delete process.env[name];
      else process.env[name] = previous[index];
    });
  });
  process.env.SESSION_SECRET = 'manage-lessons-secret';
  process.env.ADMIN_PASSWORD = 'manage-lessons-admin';

  const builtin = { ...normalizeNewLessons([{ ...input, title: 'Bài gốc hệ thống' }])[0] };
  const custom = {
    ...normalizeNewLessons([input])[0],
    authorName: 'Cô An',
    authorUsername: 'gv.an'
  };
  let hasAttempts = false;
  const store = new Map([[builtin.id, builtin], [custom.id, custom]]);
  const sql = async (parts, ...values) => {
    const query = parts.join('?');
    if (query.includes('FROM teacher_accounts')) {
      return [{ active: true, session_version: '123e4567-e89b-42d3-a456-426614174023', classes: ['4A1'], display_name: 'Cô An', subject: 'Tin học' }];
    }
    if (query.includes('ORDER BY position')) {
      return [...store.values()].map(item => ({
        id: item.id, grade: item.grade, lessonTitle: item.lessonTitle,
        authorName: item.authorName ?? null, authorUsername: item.authorUsername ?? null,
        hidden: Boolean(item.hidden), subjectBadge: item.subjectBadge,
        timeLimitSeconds: item.timeLimitSeconds, questionCount: item.questions.length
      }));
    }
    if (query.includes('SELECT document AS lesson FROM quiz_lessons')) {
      const found = store.get(values[0]);
      return found ? [{ lesson: found }] : [];
    }
    if (query.includes('UPDATE quiz_lessons SET document')) {
      const next = JSON.parse(values[0]);
      const id = values[1];
      if (!store.has(id)) return [];
      store.set(id, next);
      return [{ id }];
    }
    if (query.includes('DELETE FROM quiz_lessons')) {
      if (hasAttempts || !store.has(values[0])) return [];
      store.delete(values[0]);
      return [{ id: values[0] }];
    }
    if (query.includes('SELECT id FROM quiz_lessons WHERE id =')) {
      return store.has(values[0]) ? [{ id: values[0] }] : [];
    }
    assert.fail(query);
  };

  const handler = createLessonsHandler(() => sql);
  const teacherCookie = { cookie: 'teacher_session=' + teacherSessionToken('gv.an', '123e4567-e89b-42d3-a456-426614174023') };
  const adminCookie = { cookie: 'teacher_session=' + teacherSessionToken('admin') };

  const send = async (method, url, body, headers = {}) => {
    const res = response();
    await handler({ method, url, body, headers }, res);
    return res;
  };

  // Built-in lesson without author cannot be edited by teacher or deleted
  assert.equal((await send('PUT', '/api/lessons', { action: 'toggle-hidden', id: builtin.id, hidden: true }, teacherCookie)).code, 403);
  assert.equal((await send('DELETE', '/api/lessons?id=' + builtin.id, null, adminCookie)).code, 403);

  // Author can edit custom lesson and load edit details
  const detail = await send('GET', `/api/lessons?id=${custom.id}&edit=1`, null, teacherCookie);
  assert.equal(detail.code, 200);
  assert.equal(detail.body.questions[0].correctIndex, 0);

  const edited = await send('PUT', '/api/lessons', {
    id: custom.id, grade: 4, title: 'Bài tập về bàn phím (mới)', minutes: 20,
    questions: [{ question: 'Phím nào xuống dòng?', options: ['Enter', 'Space', 'Shift', 'Tab'], correctIndex: 0, explanation: 'Enter dùng để xuống dòng.' }]
  }, teacherCookie);
  assert.equal(edited.code, 200);
  assert.equal(store.get(custom.id).lessonTitle, 'Bài tập về bàn phím (mới)');

  // Hide from students while visible to manager
  assert.equal((await send('PUT', '/api/lessons', { action: 'toggle-hidden', id: custom.id, hidden: true }, teacherCookie)).code, 200);
  const publicList = await send('GET', '/api/lessons');
  assert.equal(publicList.body.lessons.some(item => item.id === custom.id), false);
  assert.equal((await send('GET', `/api/lessons?id=${custom.id}`)).code, 404);
  const managedList = await send('GET', '/api/lessons?manage=1', null, teacherCookie);
  assert.equal(managedList.body.lessons.find(item => item.id === custom.id).editable, true);
  assert.equal(managedList.body.lessons.find(item => item.id === custom.id).hidden, true);

  // Cannot delete when attempts exist, succeeds once unused
  hasAttempts = true;
  const blockedDelete = await send('DELETE', `/api/lessons?id=${custom.id}`, null, teacherCookie);
  assert.equal(blockedDelete.code, 409);
  assert.equal(blockedDelete.body.error, 'LESSON_HAS_ATTEMPTS');

  hasAttempts = false;
  assert.equal((await send('DELETE', `/api/lessons?id=${custom.id}`, null, teacherCookie)).code, 200);
  assert.equal(store.has(custom.id), false);
});

test('Excel template round-trips rows from multiple lessons and reports an invalid answer by row', async () => {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(await (await createLessonTemplate()).arrayBuffer());
  const sheet = workbook.getWorksheet('Câu hỏi');
  sheet.addRows([
    [4, 'Bàn phím', 10, 'Phím cách?', 'Space', 'Enter', 'Shift', 'Tab', 'A', ''],
    [3, 'Máy tính', 12, 'Thiết bị nghe âm thanh?', 'Loa', 'Chuột', 'Tủ', 'Ghế', 'Z', ''],
    [4, 'Bàn phím', 10, 'Phím xuống dòng?', 'Space', 'Enter', 'Shift', 'Tab', 'b', 'Dùng Enter.']
  ]);
  const selectedFile = async () => new File([await workbook.xlsx.writeBuffer()], 'bai-hoc.xlsx');
  await assert.rejects(readLessonWorkbook(await selectedFile()), /Dòng 3: Đáp án đúng/);
  sheet.getCell('I3').value = 'A';
  const lessons = await readLessonWorkbook(await selectedFile());
  assert.deepEqual(lessons.map(lesson => [lesson.grade, lesson.minutes, lesson.questions.length]), [[4, 10, 2], [3, 12, 1]]);
  assert.deepEqual(lessons[0].questions.map(question => question.correctIndex), [0, 1]);
});
