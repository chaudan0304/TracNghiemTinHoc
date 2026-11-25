import './compat.js';
import { lessonDisplayTitle } from './lesson-title.js';
(async function initializeHome() {
    const grid = document.getElementById('lessons');
    const tabs = document.querySelectorAll('.tab-btn');
    const searchInput = document.getElementById('search-lesson');
    const errorMessage = document.getElementById('error');
    const retryButton = document.getElementById('retry-lessons');
    let loadedLessons = [];
    let currentGrade = 'all';

    // Kiểm tra trạng thái máy chủ
    try {
      const status = await (await fetch('/api/status')).json();
      document.getElementById('storage-status').innerHTML = status.ready
        ? '🟢 <strong>Hệ thống sẵn sàng:</strong> Kết quả nộp bài sẽ tự động gửi tới thầy/cô giáo.'
        : '🟡 <strong>Lưu ý:</strong> Máy chủ chưa sẵn sàng nhận kết quả. Hãy báo thầy/cô nếu em làm bài lúc này.';
    } catch {
      document.getElementById('storage-status').textContent = 'Chưa xác nhận được trạng thái lưu trữ.';
    }

    retryButton.addEventListener('click', loadLessons);
    await loadLessons();

    async function loadLessons() {
      retryButton.disabled = true;
      errorMessage.textContent = '';
      try {
        const response = await fetch('/api/lessons');
        if (!response.ok) throw new Error('Không tải được danh sách bài học.');
        loadedLessons = (await response.json()).lessons;
        retryButton.hidden = true;
        renderLessons();
      } catch {
        errorMessage.textContent = 'Không tải được danh sách bài học. Em có thể thử lại.';
        retryButton.hidden = false;
      } finally {
        retryButton.disabled = false;
      }
    }

    function renderLessons() {
      const keyword = searchInput.value.trim().toLowerCase();

      const filtered = loadedLessons.filter(lesson => {
        const matchGrade = currentGrade === 'all' || String(lesson.grade) === currentGrade;
        const matchText = !keyword || (
          (lesson.lessonTitle && lesson.lessonTitle.toLowerCase().includes(keyword)) ||
          (lesson.subjectBadge && lesson.subjectBadge.toLowerCase().includes(keyword))
        );
        return matchGrade && matchText;
      });

      grid.replaceChildren();

      if (!filtered.length) {
        const empty = document.createElement('div');
        empty.className = 'empty-msg';
        empty.textContent = 'Không tìm thấy bài học nào phù hợp.';
        grid.append(empty);
        return;
      }

      for (const lesson of filtered) {
        const card = document.createElement('a');
        card.className = 'card';
        card.href = `/quiz?bai=${encodeURIComponent(lesson.id)}`;

        const top = document.createElement('div');
        const tag = document.createElement('div');
        tag.className = 'tag';
        tag.textContent = lesson.subjectBadge || 'TIN HỌC TIỂU HỌC';

        const title = document.createElement('h2');
        title.textContent = lessonDisplayTitle(lesson);
        top.append(tag, title);

        const bottom = document.createElement('div');
        const meta = document.createElement('div');
        meta.className = 'meta';
        meta.textContent = `🎯 ${lesson.questionCount} câu hỏi • ⏱️ ${Math.ceil(lesson.timeLimitSeconds / 60)} phút`;

        const btn = document.createElement('div');
        btn.className = 'btn-start';
        btn.textContent = '🚀 Bắt đầu làm bài';

        bottom.append(meta, btn);
        card.append(top, bottom);
        grid.append(card);
      }
    }

    // Sự kiện chuyển Tab
    tabs.forEach(btn => {
      btn.addEventListener('click', () => {
        tabs.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentGrade = btn.dataset.grade;
        renderLessons();
      });
    });

    // Sự kiện tìm kiếm
    searchInput.addEventListener('input', renderLessons);

})();
