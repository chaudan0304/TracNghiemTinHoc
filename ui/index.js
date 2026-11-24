import './compat.js';
(async function initializeHome() {
    const grid = document.getElementById('lessons');
    const tabs = document.querySelectorAll('.tab-btn');
    const searchInput = document.getElementById('search-lesson');
    const errorMessage = document.getElementById('error');
    const retryButton = document.getElementById('retry-lessons');
    const lessonsById = new Map();
    let catalogIds = null;
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
        if (!catalogIds) {
          const response = await fetch('/lessons/index.json');
          if (!response.ok) throw new Error('Không tải được danh sách bài học.');
          const ids = await response.json();
          if (!Array.isArray(ids)) throw new Error('Invalid lesson catalog');
          catalogIds = [...new Set(ids)];
        }
        const missing = catalogIds.filter(id => !lessonsById.has(id));
        await Promise.all(missing.map(async id => {
          try {
            if (!/^[a-z0-9-]+$/.test(id)) return;
            const response = await fetch(`/lessons/${id}.json`);
            if (!response.ok) return;
            const lesson = await response.json();
            if (lesson.id === id && typeof lesson.lessonTitle === 'string' &&
                Array.isArray(lesson.questions) && Number.isFinite(lesson.timeLimitSeconds)) {
              lessonsById.set(id, lesson);
            }
          } catch {
            // The failed lesson stays eligible for another request.
          }
        }));
        loadedLessons = catalogIds.map(id => lessonsById.get(id)).filter(Boolean);
        const failures = catalogIds.length - loadedLessons.length;
        errorMessage.textContent = failures ? `Chưa tải được ${failures} bài học.` : '';
        retryButton.hidden = failures === 0;
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
        const matchGrade = (currentGrade === 'all') || (lesson.id && lesson.id.startsWith(currentGrade));
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
        title.textContent = lesson.lessonTitle;
        top.append(tag, title);

        const bottom = document.createElement('div');
        const meta = document.createElement('div');
        meta.className = 'meta';
        meta.textContent = `🎯 ${lesson.questions.length} câu hỏi • ⏱️ ${Math.ceil(lesson.timeLimitSeconds / 60)} phút`;

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
