const byId = id => document.getElementById(id);

export function initializeTeacherAccounts(api) {
  const form = byId('account-form');
  const fields = byId('account-fields');
  const list = byId('account-list');
  const status = byId('account-status');
  const password = form.elements.namedItem('password');
  const username = form.elements.namedItem('username');
  const displayName = form.elements.namedItem('displayName');
  const subject = form.elements.namedItem('subject');
  const classes = form.elements.namedItem('classes');
  const school = form.elements.namedItem('schoolId');
  let schools = [];
  const studentPermission = form.elements.namedItem('studentPermission');
  const active = form.elements.namedItem('active');
  const cancel = byId('account-cancel');
  let editing = false;

  function populate(account) {
    editing = Boolean(account);
    form.reset();
    username.value = account?.username || '';
    displayName.value = account?.displayName || '';
    username.readOnly = editing;
    subject.value = account?.subject || '';
    school.value = account?.schoolId || 'quynh-loc';
    classes.value = account ? account.classes.join(', ') : '';
    studentPermission.value = account?.canEditStudents ? 'edit' : 'view';
    active.value = account?.active === false ? 'false' : 'true';
    password.required = !editing;
    byId('account-form-title').textContent = editing ? 'Sửa tài khoản' : 'Tạo tài khoản';
    byId('account-save').textContent = editing ? 'Lưu thay đổi' : 'Tạo tài khoản';
    byId('account-password-label').textContent = editing ? 'Mật khẩu mới (có thể để trống)' : 'Mật khẩu (ít nhất 12 ký tự)';
    byId('account-active-label').hidden = !editing;
    cancel.hidden = !editing;
  }

  async function load(message = '') {
    list.replaceChildren();
    status.textContent = 'Đang tải tài khoản...';
    try {
      const selectedSchool = school.value;
      schools = (await api('/api/teacher?type=schools')).schools;
      school.replaceChildren();
      for (const item of schools) school.add(new Option(item.name, item.id));
      school.value = selectedSchool || 'quynh-loc';
      const data = await api('/api/teacher?type=accounts');
      for (const account of data.accounts) {
        const row = document.createElement('tr');
        const cell = (label, text) => {
          const element = document.createElement('td');
          if (label) element.dataset.label = label;
          if (text) element.textContent = text;
          row.append(element);
          return element;
        };
        const identity = cell('');
        const name = document.createElement('strong');
        name.className = 'account-name';
        name.textContent = account.displayName || account.username;
        identity.append(name);
        if (account.displayName) {
          const login = document.createElement('span');
          login.className = 'account-username';
          login.textContent = account.username;
          identity.append(login);
        }
        cell('Môn dạy', account.subject);
        const assignedClasses = cell('Lớp phụ trách');
        const tags = document.createElement('div');
        tags.className = 'account-class-tags';
        for (const className of account.classes) {
          const tag = document.createElement('span');
          tag.className = 'account-class-tag';
          tag.textContent = className;
          tags.append(tag);
        }
        assignedClasses.append(account.classes.length ? tags : document.createTextNode('Chưa giao lớp'));
        cell('Trường học', schools.find(item => item.id === account.schoolId)?.name || 'Trường Tiểu học Quỳnh Lộc');
        cell('Quyền', account.canEditStudents ? 'Chỉnh sửa' : 'Chỉ xem');
        const state = document.createElement('span');
        state.className = `account-state${account.active ? '' : ' is-inactive'}`;
        state.textContent = account.active ? 'Đang hoạt động' : 'Đã khóa';
        cell('Trạng thái').append(state);
        const edit = document.createElement('button');
        edit.type = 'button';
        edit.className = 'btn btn-secondary';
        edit.textContent = 'Sửa';
        edit.setAttribute('aria-label', `Sửa tài khoản ${account.username}`);
        edit.addEventListener('click', () => {
          if (fields.disabled) return;
          populate(account);
          subject.focus();
        });
        cell('').append(edit);
        list.append(row);
      }
      status.textContent = message || (data.accounts.length ? '' : 'Chưa có tài khoản giáo viên.');
    } catch (error) {
      status.textContent = message ? `${message} Chưa tải được danh sách.` : error.message;
    }
  }

  cancel.addEventListener('click', () => populate());
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (fields.disabled) return;
    const input = {
      action: editing ? 'update-account' : 'create-account', username: username.value, displayName: displayName.value,
      subject: subject.value, schoolId: school.value, classes: classes.value.split(',').map(value => value.trim()).filter(Boolean),
      active: active.value === 'true', canEditStudents: studentPermission.value === 'edit'
    };
    if (password.value || !editing) input.password = password.value;
    fields.disabled = true;
    status.textContent = 'Đang lưu tài khoản...';
    try {
      await api('/api/teacher', { method: 'POST', body: JSON.stringify(input) });
      populate();
      await load('Đã lưu tài khoản giáo viên.');
    } catch (error) {
      status.textContent = error.message;
    } finally {
      fields.disabled = false;
    }
  });
  document.addEventListener('schools-updated', () => load());
  return load;
}

