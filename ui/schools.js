export function initializeSchools(api, onSelectionChange) {
  const select = document.getElementById('result-school');
  const form = document.getElementById('school-form');
  const fields = [form.elements.schoolName, form.elements.schoolActive];
  const status = document.getElementById('school-status');
  const list = document.getElementById('school-list');
  const save = document.getElementById('school-save');
  const cancel = document.getElementById('school-cancel');
  let schools = [];
  let identity;
  let editingId = null;
  let busy = false;

  function reset() {
    editingId = null;
    form.reset();
    cancel.hidden = true;
    save.textContent = 'Thêm trường';
  }

  async function load(teacher = identity) {
    identity = teacher;
    const selected = select.value || teacher.schoolId || 'quynh-loc';
    const data = await api('/api/teacher?type=schools');
    schools = data.schools;
    select.replaceChildren();
    for (const school of schools) select.add(new Option(school.name + (school.active ? '' : ' (đã ẩn)'), school.id));
    select.value = selected;
    if (!select.value && schools.length) select.value = schools[0].id;
    select.disabled = teacher.role !== 'admin';
    list.replaceChildren();
    if (teacher.role !== 'admin') return;
    for (const school of schools) {
      const row = document.createElement('li');
      const name = document.createElement('span');
      name.textContent = school.name + (school.active ? '' : ' · Đã ẩn khỏi danh sách học sinh');
      const edit = document.createElement('button');
      edit.className = 'btn btn-secondary';
      edit.type = 'button';
      edit.textContent = 'Sửa';
      edit.setAttribute('aria-label', 'Sửa trường ' + school.name);
      edit.addEventListener('click', () => {
        if (busy) return;
        editingId = school.id;
        fields[0].value = school.name;
        fields[1].checked = school.active;
        save.textContent = 'Lưu trường';
        cancel.hidden = false;
        fields[0].focus();
      });
      row.append(name, edit);
      list.append(row);
    }
  }
  select.addEventListener('change', onSelectionChange);
  cancel.addEventListener('click', reset);
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (busy) return;
    busy = true;
    save.disabled = cancel.disabled = true;
    try {
      await api('/api/teacher', { method: 'POST', body: JSON.stringify({
        action: editingId ? 'update-school' : 'create-school', id: editingId,
        name: fields[0].value, active: fields[1].checked
      }) });
      reset();
      await load();
      document.dispatchEvent(new Event('schools-updated'));
      status.textContent = 'Đã lưu trường học.';
    } catch (error) {
      status.textContent = error.message;
    } finally {
      busy = false;
      save.disabled = cancel.disabled = false;
    }
  });
  return { load, get id() { return select.value; }, get name() { return schools.find(s => s.id === select.value)?.name || ''; } };
}
