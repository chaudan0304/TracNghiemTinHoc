export function initializeStudentHistory(api) {
  const byId = id => document.getElementById(id);
  const container = byId('student-history-table-container');
  const rows = byId('student-history-rows');
  const labels = Array.from(container.querySelectorAll('th'), heading => heading.textContent);
  const refresh = byId('student-history-refresh');
  const more = byId('student-history-more');
  const status = byId('student-history-status');
  const dateFormat = new Intl.DateTimeFormat('vi-VN', {
    timeZone: 'Asia/Ho_Chi_Minh', day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
  });
  let nextBefore = null;
  let loadId = 0;

  function appendStudent(row, name, className) {
    const cell = row.insertCell();
    cell.textContent = name;
    const line = document.createElement('span');
    line.className = 'student-history-class';
    line.textContent = `Lớp ${className}`;
    cell.append(line);
  }

  async function load(reset) {
    if (!reset && !nextBefore) return;
    const request = ++loadId;
    refresh.disabled = more.disabled = true;
    status.textContent = 'Đang tải lịch sử…';
    try {
      const suffix = reset ? '' : `&before=${encodeURIComponent(nextBefore)}`;
      const data = await api('/api/teacher?type=student-history' + suffix);
      if (request !== loadId) return;
      if (reset) rows.replaceChildren();
      for (const entry of data.entries) {
        const row = rows.insertRow();
        row.setAttribute('role', 'row');
        row.insertCell().textContent = dateFormat.format(new Date(entry.changed_at));
        row.insertCell().textContent = entry.actor_username || 'Không xác định';
        row.insertCell().textContent = entry.action === 'merge-students' ? 'Gộp tên' : 'Sửa thông tin';
        appendStudent(row, entry.previous_name, entry.previous_class);
        appendStudent(row, entry.current_name, entry.current_class);
        row.insertCell().textContent = entry.attempt_count;
        Array.from(row.cells).forEach((cell, col) => {
          cell.setAttribute('role', 'cell');
          if (col) cell.dataset.label = labels[col];
        });
      }
      nextBefore = data.nextBefore;
      more.hidden = !nextBefore;
      container.hidden = rows.rows.length === 0;
      status.textContent = rows.rows.length ? `Đang hiển thị ${rows.rows.length} thay đổi.` : 'Chưa có thay đổi nào được ghi nhận.';
    } catch (error) {
      if (request === loadId) status.textContent = error.message;
    } finally {
      if (request === loadId) refresh.disabled = more.disabled = false;
    }
  }

  refresh.addEventListener('click', () => load(true));
  more.addEventListener('click', () => load(false));
  return () => load(true);
}
