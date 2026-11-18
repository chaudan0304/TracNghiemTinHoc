import './compat.js';
    import { csvCell } from '../lib/csv.js';
    const loginSection = document.getElementById('login-section');
    const dashboardSection = document.getElementById('dashboard-section');
    const loginForm = document.getElementById('login-form');
    const loginError = document.getElementById('login-error');
    const authActions = document.getElementById('auth-actions');

    // Tab buttons & Views
    const tabLessonsBtn = document.getElementById('tab-lessons-btn');
    const tabRankingBtn = document.getElementById('tab-ranking-btn');
    const viewLessons = document.getElementById('view-lessons');
    const viewRanking = document.getElementById('view-ranking');

    // View 1 (Lessons) Elements
    const lessonGrade = document.getElementById('lesson-grade');
    const lessonSearch = document.getElementById('lesson-search');
    const lessonSelect = document.getElementById('lesson-select');
    const selectedLessonName = document.getElementById('selected-lesson-name');
    const questionStatsStatus = document.getElementById('question-stats-status');
    const questionStatsList = document.getElementById('question-stats-list');
    const questionStatsBody = document.getElementById('question-stats-body');
    const questionStatsToggle = document.getElementById('question-stats-toggle');
    function setQuestionStatsVisible(visible) {
      questionStatsBody.hidden = !visible;
      questionStatsToggle.setAttribute('aria-expanded', String(visible));
      questionStatsToggle.textContent = visible ? 'Ẩn thống kê' : 'Hiện thống kê';
    }
    try {
      setQuestionStatsVisible(localStorage.getItem('teacher-question-stats-hidden') !== '1');
    } catch {
      setQuestionStatsVisible(true);
    }
    questionStatsToggle.addEventListener('click', () => {
      const visible = questionStatsBody.hidden;
      setQuestionStatsVisible(visible);
      try { localStorage.setItem('teacher-question-stats-hidden', visible ? '0' : '1'); } catch {}
    });
    const classFilter = document.getElementById('class-filter');
    const searchInput = document.getElementById('search-input');
    const refreshBtn = document.getElementById('refresh-btn');
    const exportBtn = document.getElementById('export-btn');
    const loadMoreBtn = document.getElementById('load-more-btn');
    const rowsEl = document.getElementById('rows');
    const tableStatus = document.getElementById('table-status');

    // View 2 (Ranking) Elements
    const modeClassesBtn = document.getElementById('mode-classes-btn');
    const modeStudentsBtn = document.getElementById('mode-students-btn');
    const rankingGradeFilter = document.getElementById('ranking-grade-filter');
    const rankingClassContainer = document.getElementById('ranking-class-container');
    const rankingClassSelect = document.getElementById('ranking-class-select');
    const rankingSearchContainer = document.getElementById('ranking-search-container');
    const rankingSearchInput = document.getElementById('ranking-search-input');
    const rankingRefreshBtn = document.getElementById('ranking-refresh-btn');
    const rankingExportBtn = document.getElementById('ranking-export-btn');
    const classesTableContainer = document.getElementById('classes-table-container');
    const classesRankingRows = document.getElementById('classes-ranking-rows');
    const studentsTableContainer = document.getElementById('students-table-container');
    const studentsRankingRows = document.getElementById('students-ranking-rows');
    const rankingStatus = document.getElementById('ranking-status');

    const rankStatClasses = document.getElementById('rank-stat-classes');
    const rankStatStudents = document.getElementById('rank-stat-students');
    const rankStatTopClass = document.getElementById('rank-stat-top-class');

    let allRows = [];
    let lessonCatalog = [];
    let lessonSearchTimer;
    let resultsRequestId = 0;
    let currentLessonData = null;
    let offset = 0;
    let statsRequestId = 0;
    let searchTimer;

    // Ranking State
    let currentTab = 'lessons';
    let rankingMode = 'classes';
    let rawClassRankings = [];
    let rawStudentRankings = [];
    let rankingGradeTotals = { '3': 18, '4': 21, '5': 21, 'all': 60 };
    let isRankingLoaded = false;
    let rankingSearchTimer;

    async function api(url, options = {}) {
      const res = await fetch(url, {
        ...options,
        headers: { 'Content-Type': 'application/json', ...(options.headers || {}) }
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        const errorMap = {
          INVALID_PASSWORD: 'Mật khẩu giáo viên chưa đúng.',
          TOO_MANY_ATTEMPTS: 'Đã thử sai quá nhiều lần. Vui lòng thử lại sau 15 phút.',
          STORAGE_NOT_CONFIGURED: 'Cơ sở dữ liệu chưa được kết nối.',
          TEACHER_LOGIN_NOT_CONFIGURED: 'Mật khẩu giáo viên chưa được cấu hình.',
          UNAUTHORIZED: 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.'
        };
        throw new Error(errorMap[data.error] || 'Có lỗi xảy ra, vui lòng thử lại.');
      }
      return data;
    }

    /* ========================================================
       TAB SWITCHING
       ======================================================== */
    function switchTab(tab) {
      currentTab = tab;
      if (tab === 'lessons') {
        tabLessonsBtn.classList.add('active');
        tabRankingBtn.classList.remove('active');
        viewLessons.hidden = false;
        viewRanking.hidden = true;
      } else {
        tabRankingBtn.classList.add('active');
        tabLessonsBtn.classList.remove('active');
        viewLessons.hidden = true;
        viewRanking.hidden = false;
        if (!isRankingLoaded) {
          fetchRankingData();
        }
      }
    }

    tabLessonsBtn.addEventListener('click', () => switchTab('lessons'));
    tabRankingBtn.addEventListener('click', () => switchTab('ranking'));

    /* ========================================================
       RANKING & PROGRESS LOGIC
       ======================================================== */
    function getGrade(className) {
      const match = String(className || '').match(/^[^\d]*([345])/);
      return match ? match[1] : null;
    }

    function getTotalLessons(className) {
      const g = getGrade(className);
      if (g === '3') return rankingGradeTotals['3'] || 18;
      if (g === '4') return rankingGradeTotals['4'] || 21;
      if (g === '5') return rankingGradeTotals['5'] || 21;
      return rankingGradeTotals['all'] || 60;
    }

    function switchRankingMode(mode) {
      rankingMode = mode;
      if (mode === 'classes') {
        modeClassesBtn.classList.add('active');
        modeStudentsBtn.classList.remove('active');
        classesTableContainer.hidden = false;
        studentsTableContainer.hidden = true;
        rankingClassContainer.hidden = true;
        rankingSearchContainer.hidden = true;
        renderClassesTable();
      } else {
        modeStudentsBtn.classList.add('active');
        modeClassesBtn.classList.remove('active');
        classesTableContainer.hidden = true;
        studentsTableContainer.hidden = false;
        rankingClassContainer.hidden = false;
        rankingSearchContainer.hidden = false;
        fetchStudentRankingData();
      }
    }

    modeClassesBtn.addEventListener('click', () => switchRankingMode('classes'));
    modeStudentsBtn.addEventListener('click', () => switchRankingMode('students'));

    async function fetchRankingData() {
      try {
        rankingStatus.textContent = 'Đang tải bảng xếp hạng và tiến độ các lớp...';
        const data = await api('/api/teacher?type=ranking');
        rawClassRankings = data.classes || [];
        if (data.gradeTotals) rankingGradeTotals = data.gradeTotals;
        isRankingLoaded = true;

        // Cập nhật thống kê tổng quan
        rankStatClasses.textContent = rawClassRankings.length;
        const totalStudents = rawClassRankings.reduce((sum, c) => sum + (Number(c.student_count) || 0), 0);
        rankStatStudents.textContent = totalStudents;

        if (rawClassRankings.length > 0) {
          const topClass = rawClassRankings[0];
          const topGradeTotal = getTotalLessons(topClass.class_name);
          const topPercent = topGradeTotal > 0 ? Math.round((topClass.completed_lessons / topGradeTotal) * 100) : 0;
          rankStatTopClass.textContent = `Lớp ${topClass.class_name} (${topClass.completed_lessons}/${topGradeTotal} bài - ${topPercent}%)`;
        } else {
          rankStatTopClass.textContent = '--';
        }

        // Cập nhật dropdown lớp cho bảng vàng học sinh
        const currentSelectedClass = rankingClassSelect.value;
        rankingClassSelect.replaceChildren();
        const allOption = document.createElement('option');
        allOption.value = 'ALL';
        allOption.textContent = 'Tất cả các lớp';
        rankingClassSelect.append(allOption);

        const sortedClasses = [...rawClassRankings].sort((a, b) => a.class_name.localeCompare(b.class_name));
        for (const c of sortedClasses) {
          const opt = document.createElement('option');
          opt.value = c.class_name;
          const g = getGrade(c.class_name);
          opt.textContent = `Lớp ${c.class_name}${g ? ' (Khối ' + g + ')' : ''}`;
          rankingClassSelect.append(opt);
        }
        if (sortedClasses.some(c => c.class_name === currentSelectedClass)) {
          rankingClassSelect.value = currentSelectedClass;
        }

        if (rankingMode === 'classes') {
          renderClassesTable();
        } else {
          fetchStudentRankingData();
        }
      } catch (err) {
        rankingStatus.textContent = 'Không thể tải bảng xếp hạng: ' + err.message;
        if (err.message.includes('đăng nhập lại') || err.message.includes('hết hạn')) {
          showLogin();
        }
      }
    }

    async function fetchStudentRankingData() {
      try {
        rankingStatus.textContent = 'Đang tải bảng vàng học sinh...';
        const selectedClass = rankingClassSelect.value;
        const url = selectedClass && selectedClass !== 'ALL'
          ? `/api/teacher?type=ranking&mode=student&className=${encodeURIComponent(selectedClass)}`
          : '/api/teacher?type=ranking&mode=student';
        const data = await api(url);
        rawStudentRankings = data.students || [];
        renderStudentsTable();
      } catch (err) {
        rankingStatus.textContent = 'Lỗi tải danh sách học sinh: ' + err.message;
      }
    }

    function renderProgressBar(completed, total) {
      const percent = total > 0 ? Math.min(100, Math.round((completed / total) * 100)) : 0;
      const isFull = percent === 100;
      return `
        <div style="display: flex; flex-direction: column; gap: 4px;">
          <div style="display: flex; justify-content: space-between; font-size: 0.85rem; font-weight: 800;">
            <span><strong style="color: var(--primary-dark);">${completed}</strong> / ${total} bài</span>
            <span style="color: ${isFull ? '#059669' : '#0369a1'};">${percent}%${isFull ? ' 🎉' : ''}</span>
          </div>
          <div class="progress-track" style="height: 9px;">
            <div class="progress-fill ${isFull ? 'full' : ''}" style="width: ${percent}%;"></div>
          </div>
        </div>
      `;
    }

    function renderRankBadge(idx) {
      if (idx === 0) return '<span class="rank-badge rank-1">🥇 1</span>';
      if (idx === 1) return '<span class="rank-badge rank-2">🥈 2</span>';
      if (idx === 2) return '<span class="rank-badge rank-3">🥉 3</span>';
      return `<span class="rank-badge rank-normal">#${idx + 1}</span>`;
    }

    function renderClassesTable() {
      const selectedGrade = rankingGradeFilter.value;
      const filtered = rawClassRankings.filter(c => {
        if (selectedGrade === 'ALL') return true;
        const g = getGrade(c.class_name);
        return g === selectedGrade;
      });

      classesRankingRows.replaceChildren();

      if (!filtered.length) {
        rankingStatus.textContent = rawClassRankings.length
          ? 'Không có lớp nào thuộc khối đã chọn.'
          : 'Chưa có lớp nào nộp bài luyện tập.';
        return;
      }
      rankingStatus.textContent = `Hiển thị bảng xếp hạng ${filtered.length} lớp.`;

      filtered.forEach((c, idx) => {
        const tr = document.createElement('tr');
        const g = getGrade(c.class_name);
        const totalLessons = getTotalLessons(c.class_name);
        const goodRatio = c.total_attempts > 0 ? Math.round((c.good_count * 100) / c.total_attempts) : 0;

        tr.innerHTML = `
          <td style="text-align: center;">${renderRankBadge(idx)}</td>
          <td>
            <div style="font-weight: 900; font-size: 1.05rem; color: var(--primary-dark);">Lớp ${escapeHtml(c.class_name)}</div>
          </td>
          <td>${g ? `<span class="grade-chip">Khối ${g}</span>` : '<span style="color: var(--muted);">--</span>'}</td>
          <td style="text-align: center; font-weight: 800;">${c.student_count} em</td>
          <td>${renderProgressBar(c.completed_lessons, totalLessons)}</td>
          <td style="text-align: center; font-weight: 700; color: var(--muted);">${c.total_attempts}</td>
          <td style="text-align: center;">
            <span class="score-cell" style="color: ${Number(c.avg_score) >= 8 ? '#059669' : Number(c.avg_score) >= 6.5 ? '#b45309' : '#b91c1c'};">
              ${Number(c.avg_score).toFixed(1)}
            </span>
          </td>
          <td style="text-align: center; font-weight: 800; color: #047857;">⭐ ${Number(c.max_score).toFixed(1)}</td>
          <td style="text-align: center; font-weight: 800; color: ${goodRatio >= 70 ? '#059669' : '#b45309'};">${goodRatio}%</td>
          <td style="text-align: center;">
            <button type="button" class="btn btn-secondary view-students-btn" style="padding: 6px 12px; font-size: 0.82rem;" data-class="${escapeHtml(c.class_name)}">
              👁️ Xem học sinh
            </button>
          </td>
        `;

        const viewBtn = tr.querySelector('.view-students-btn');
        viewBtn.onclick = () => {
          rankingClassSelect.value = c.class_name;
          switchRankingMode('students');
        };

        classesRankingRows.append(tr);
      });
    }

    function renderStudentsTable() {
      const selectedGrade = rankingGradeFilter.value;
      const keyword = rankingSearchInput.value.trim().toLowerCase();

      const filtered = rawStudentRankings.filter(s => {
        if (selectedGrade !== 'ALL') {
          const g = getGrade(s.class_name);
          if (g !== selectedGrade) return false;
        }
        if (keyword && (!s.student_name || !s.student_name.toLowerCase().includes(keyword))) {
          return false;
        }
        return true;
      });

      studentsRankingRows.replaceChildren();

      if (!filtered.length) {
        rankingStatus.textContent = rawStudentRankings.length
          ? 'Không tìm thấy học sinh nào phù hợp bộ lọc.'
          : 'Chưa có dữ liệu học sinh nộp bài.';
        return;
      }
      rankingStatus.textContent = `Hiển thị bảng vàng ${filtered.length} học sinh.`;

      filtered.forEach((s, idx) => {
        const tr = document.createElement('tr');
        const totalLessons = getTotalLessons(s.class_name);

        tr.innerHTML = `
          <td style="text-align: center;">${renderRankBadge(idx)}</td>
          <td>
            <div style="font-weight: 800; font-size: 1rem; color: var(--text);">${escapeHtml(s.student_name)}</div>
          </td>
          <td>
            <span style="font-weight: 800; color: var(--primary);">Lớp ${escapeHtml(s.class_name)}</span>
          </td>
          <td>${renderProgressBar(s.completed_lessons, totalLessons)}</td>
          <td style="text-align: center; font-weight: 700; color: var(--muted);">${s.total_attempts}</td>
          <td style="text-align: center;">
            <span class="score-cell" style="color: ${Number(s.avg_score) >= 8 ? '#059669' : Number(s.avg_score) >= 6.5 ? '#b45309' : '#b91c1c'};">
              ${Number(s.avg_score).toFixed(1)}
            </span>
          </td>
          <td style="text-align: center; font-weight: 800; color: #047857;">⭐ ${Number(s.max_score).toFixed(1)}</td>
          <td style="text-align: center; font-weight: 700; color: #047857;">${formatDuration(s.avg_time_seconds)}</td>
          <td style="color: var(--muted); font-size: 0.88rem;">${s.latest_submission ? new Date(s.latest_submission).toLocaleString('vi-VN') : '--'}</td>
        `;

        studentsRankingRows.append(tr);
      });
    }

    // Ranking Event Listeners
    rankingGradeFilter.addEventListener('change', () => {
      if (rankingMode === 'classes') renderClassesTable();
      else renderStudentsTable();
    });

    rankingClassSelect.addEventListener('change', () => {
      if (rankingMode === 'students') fetchStudentRankingData();
    });

    rankingSearchInput.addEventListener('input', () => {
      clearTimeout(rankingSearchTimer);
      rankingSearchTimer = setTimeout(renderStudentsTable, 200);
    });

    rankingRefreshBtn.addEventListener('click', () => {
      fetchRankingData();
    });

    rankingExportBtn.addEventListener('click', () => {
      try {
        rankingExportBtn.disabled = true;
        rankingExportBtn.textContent = 'Đang trích xuất...';

        if (rankingMode === 'classes') {
          const selectedGrade = rankingGradeFilter.value;
          const filtered = rawClassRankings.filter(c => {
            if (selectedGrade === 'ALL') return true;
            return getGrade(c.class_name) === selectedGrade;
          });

          const lines = [
            ['Hạng', 'Lớp', 'Khối', 'Sĩ số tham gia', 'Số bài hoàn thành', 'Tổng số bài khối', 'Tiến độ (%)', 'Tổng lượt làm', 'Điểm trung bình', 'Điểm cao nhất', 'Tỉ lệ Giỏi (>=8đ)', 'Lần nộp gần nhất'],
            ...filtered.map((c, i) => {
              const g = getGrade(c.class_name);
              const totalLessons = getTotalLessons(c.class_name);
              const percent = totalLessons > 0 ? Math.round((c.completed_lessons / totalLessons) * 100) : 0;
              const goodRatio = c.total_attempts > 0 ? Math.round((c.good_count * 100) / c.total_attempts) : 0;
              return [
                i + 1,
                c.class_name,
                g ? `Khối ${g}` : '',
                c.student_count,
                c.completed_lessons,
                totalLessons,
                `${percent}%`,
                c.total_attempts,
                Number(c.avg_score).toFixed(1),
                Number(c.max_score).toFixed(1),
                `${goodRatio}%`,
                c.latest_submission ? new Date(c.latest_submission).toLocaleString('vi-VN') : '--'
              ];
            })
          ];

          const csvContent = '\uFEFF' + lines.map(row => row.map(csvCell).join(',')).join('\r\n');
          const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `Bang_Xep_Hang_Tien_Do_Cac_Lop_${selectedGrade === 'ALL' ? 'Toan_Truong' : 'Khoi_' + selectedGrade}.csv`;
          link.click();
          URL.revokeObjectURL(url);
        } else {
          const selectedClass = rankingClassSelect.value;
          const selectedGrade = rankingGradeFilter.value;
          const keyword = rankingSearchInput.value.trim().toLowerCase();

          const filtered = rawStudentRankings.filter(s => {
            if (selectedGrade !== 'ALL') {
              const g = getGrade(s.class_name);
              if (g !== selectedGrade) return false;
            }
            if (keyword && (!s.student_name || !s.student_name.toLowerCase().includes(keyword))) {
              return false;
            }
            return true;
          });

          const lines = [
            ['Hạng', 'Họ và tên', 'Lớp', 'Khối', 'Số bài hoàn thành', 'Tổng số bài khối', 'Tiến độ (%)', 'Tổng lượt làm', 'Điểm trung bình', 'Điểm cao nhất', 'Thời gian làm TB', 'Lần nộp gần nhất'],
            ...filtered.map((s, i) => {
              const g = getGrade(s.class_name);
              const totalLessons = getTotalLessons(s.class_name);
              const percent = totalLessons > 0 ? Math.round((s.completed_lessons / totalLessons) * 100) : 0;
              return [
                i + 1,
                s.student_name,
                s.class_name,
                g ? `Khối ${g}` : '',
                s.completed_lessons,
                totalLessons,
                `${percent}%`,
                s.total_attempts,
                Number(s.avg_score).toFixed(1),
                Number(s.max_score).toFixed(1),
                formatDuration(s.avg_time_seconds),
                s.latest_submission ? new Date(s.latest_submission).toLocaleString('vi-VN') : '--'
              ];
            })
          ];

          const csvContent = '\uFEFF' + lines.map(row => row.map(csvCell).join(',')).join('\r\n');
          const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `Bang_Vang_Hoc_Sinh_${selectedClass === 'ALL' ? 'Toan_Truong' : 'Lop_' + selectedClass}.csv`;
          link.click();
          URL.revokeObjectURL(url);
        }
      } catch (err) {
        alert('Lỗi xuất file: ' + err.message);
      } finally {
        rankingExportBtn.disabled = false;
        rankingExportBtn.textContent = '📥 Xuất file Excel (CSV)';
      }
    });

    function normalizeLessonSearch(value) {
      return String(value || '').toLocaleLowerCase('vi')
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd');
    }

    function renderLessonOptions() {
      const selectedId = lessonSelect.value;
      const keyword = normalizeLessonSearch(lessonSearch.value.trim());
      const matches = lessonCatalog.filter(lesson =>
        lesson.grade === lessonGrade.value &&
        (!keyword || normalizeLessonSearch(lesson.title).includes(keyword))
      );
      lessonSelect.replaceChildren();
      lessonSelect.disabled = matches.length === 0;
      if (!matches.length) {
        const empty = document.createElement('option');
        empty.value = '';
        empty.textContent = 'Không tìm thấy bài';
        lessonSelect.append(empty);
        selectedLessonName.textContent = '';
        return;
      }
      for (const lesson of matches) {
        const option = document.createElement('option');
        option.value = lesson.id;
        option.textContent = lesson.title;
        lessonSelect.append(option);
      }
      if (matches.some(lesson => lesson.id === selectedId)) lessonSelect.value = selectedId;
      updateSelectedLessonName();
    }

    function updateSelectedLessonName() {
      selectedLessonName.textContent = lessonSelect.value
        ? `Bài đang xem: ${lessonSelect.selectedOptions[0].textContent}`
        : '';
    }

    async function loadLessonList() {
      const res = await fetch('/lessons/index.json');
      if (!res.ok) throw new Error('Không tải được danh sách bài học.');
      const ids = await res.json();
      const lessons = await Promise.all(ids.map(async id => {
        try {
          const response = await fetch(`/lessons/${id}.json`);
          if (!response.ok) return null;
          const lesson = await response.json();
          const grade = id.match(/^lop-([345])-/)?.[1];
          return grade && lesson.lessonTitle ? { id, grade, title: lesson.lessonTitle } : null;
        } catch (error) {
          console.error('Không tải được bài học:', id, error);
          return null;
        }
      }));
      lessonCatalog = lessons.filter(Boolean);
      if (!lessonCatalog.length) throw new Error('Không có bài học để hiển thị.');
      renderLessonOptions();
    }

    async function fetchStats() {
      const requestId = ++statsRequestId;
      const lessonId = lessonSelect.value;
      if (!lessonId) return;
      const params = new URLSearchParams({ lessonId, stats: '1', search: searchInput.value.trim() });
      if (classFilter.value !== 'ALL') params.set('className', classFilter.value);
      questionStatsStatus.textContent = 'Đang tải thống kê từng câu...';
      questionStatsList.replaceChildren();
      try {
        const stats = (await api(`/api/teacher?${params}`)).stats;
        if (requestId !== statsRequestId) return;
        document.getElementById('stat-total').textContent = stats.total;
        document.getElementById('stat-avg').textContent = Number(stats.avg).toFixed(1);
        document.getElementById('stat-max').textContent = Number(stats.max).toFixed(1);
        document.getElementById('stat-good-ratio').textContent = `${stats.goodRatio}%`;
        params.delete('stats');
        params.set('questionStats', '1');
        const questions = (await api(`/api/teacher?${params}`)).questions;
        if (requestId !== statsRequestId) return;
        renderQuestionStats(questions);
      } catch (error) {
        if (requestId === statsRequestId) {
          questionStatsStatus.textContent = 'Không tải được thống kê từng câu.';
          console.error('Không tải được thống kê:', error);
        }
      }
    }

    function renderQuestionStats(questions) {
      questionStatsList.replaceChildren();
      const attempted = questions.filter(q => q.total > 0);
      if (!attempted.length) {
        questionStatsStatus.textContent = 'Chưa có lượt làm phù hợp bộ lọc.';
        return;
      }
      questionStatsStatus.textContent = `Đã thống kê ${attempted.length} câu; xếp theo số lượt trả lời sai.`;
      attempted.sort((a, b) => b.wrongCount - a.wrongCount || a.questionIndex - b.questionIndex);
      for (const q of attempted) {
        const card = document.createElement('article');
        card.style.cssText = 'background:#f8fffb;border:1px solid #cdebdc;border-radius:14px;padding:14px;';
        const title = document.createElement('h4');
        title.style.cssText = 'margin:0 0 8px;color:#064e3b;font-size:.96rem;';
        title.textContent = `Câu ${q.questionIndex + 1}. ${q.question}`;
        const summary = document.createElement('p');
        summary.style.cssText = 'margin:0 0 9px;color:#334155;font-size:.86rem;font-weight:700;';
        summary.textContent = `${q.wrongCount}/${q.total} lượt sai • ${q.correctCount} đúng • ${q.unansweredCount} bỏ trống`;
        const bar = document.createElement('div');
        bar.setAttribute('role', 'img');
        bar.setAttribute('aria-label', `Tỉ lệ trả lời sai: ${Math.round(q.wrongCount * 100 / q.total)} phần trăm`);
        bar.style.cssText = 'height:8px;background:#dceee5;border-radius:999px;overflow:hidden;margin-bottom:9px;';
        const fill = document.createElement('div');
        fill.style.cssText = `height:100%;width:${q.wrongCount * 100 / q.total}%;background:#e05a47;`;
        bar.append(fill);
        const options = document.createElement('div');
        options.style.cssText = 'display:grid;gap:4px;font-size:.84rem;color:#334155;';
        q.options.forEach((option, index) => {
          const line = document.createElement('div');
          line.textContent = `${'ABCD'[index]}. ${option} — ${q.optionCounts[index]} lượt chọn${index === q.correctIndex ? ' (đáp án đúng)' : ''}`;
          if (index === q.correctIndex) line.style.color = '#047857';
          options.append(line);
        });
        card.append(title, summary, bar, options);
        questionStatsList.append(card);
      }
    }

    function updateClassFilterOptions(items) {
      const currentSelected = classFilter.value;
      const classes = Array.from(new Set(items.filter(Boolean))).sort();
      classFilter.replaceChildren();
      const allOpt = document.createElement('option');
      allOpt.value = 'ALL';
      allOpt.textContent = 'Tất cả các lớp';
      classFilter.append(allOpt);

      for (const cls of classes) {
        const opt = document.createElement('option');
        opt.value = cls;
        opt.textContent = `Lớp ${cls}`;
        classFilter.append(opt);
      }
      if (classes.includes(currentSelected)) {
        classFilter.value = currentSelected;
      }
    }

    async function fetchClassOptions(lessonId) {
      const classes = (await api(`/api/teacher?type=classes&lessonId=${encodeURIComponent(lessonId)}`)).classes;
      if (lessonSelect.value === lessonId) updateClassFilterOptions(classes);
    }

    function renderTable() {
      const filterClass = classFilter.value;
      const keyword = searchInput.value.trim().toLowerCase();

      const filtered = allRows.filter(r => {
        const matchClass = (filterClass === 'ALL' || r.class_name === filterClass);
        const matchName = !keyword || (r.student_name && r.student_name.toLowerCase().includes(keyword));
        return matchClass && matchName;
      });

      rowsEl.replaceChildren();

      if (!filtered.length) {
        tableStatus.textContent = allRows.length ? 'Không có học sinh nào phù hợp với bộ lọc.' : 'Chưa có kết quả nộp bài cho bài học này.';
        return;
      }
      tableStatus.textContent = `Hiển thị ${filtered.length} lượt nộp bài.`;

      filtered.forEach((r, idx) => {
        const tr = document.createElement('tr');

        // STT
        const tdIdx = document.createElement('td');
        tdIdx.textContent = idx + 1;
        tdIdx.style.color = 'var(--muted)';

        // Tên
        const tdName = document.createElement('td');
        tdName.innerHTML = `<strong>${escapeHtml(r.student_name)}</strong>`;

        // Lớp
        const tdClass = document.createElement('td');
        tdClass.textContent = r.class_name;

        // Câu đúng
        const tdCorrect = document.createElement('td');
        tdCorrect.textContent = `${r.correct_count} / ${r.total_questions}`;

        // Điểm
        const tdScore = document.createElement('td');
        tdScore.className = 'score-cell';
        tdScore.textContent = Number(r.score).toFixed(1);

        // Xếp loại badge
        const tdBadge = document.createElement('td');
        const badge = document.createElement('span');
        badge.className = 'badge';
        const numScore = Number(r.score);
        if (numScore >= 8.5) {
          badge.className += ' badge-excellent';
          badge.textContent = 'Xuất sắc';
        } else if (numScore >= 7.0) {
          badge.className += ' badge-good';
          badge.textContent = 'Khá';
        } else if (numScore >= 5.0) {
          badge.className += ' badge-pass';
          badge.textContent = 'Đạt';
        } else {
          badge.className += ' badge-low';
          badge.textContent = 'Cần cố gắng';
        }
        tdBadge.append(badge);

        // Thời gian làm bài
        const tdDuration = document.createElement('td');
        tdDuration.style.color = '#047857';
        tdDuration.style.fontWeight = '700';
        tdDuration.textContent = formatDuration(r.time_taken_seconds);

        // Thời gian nộp
        const tdTime = document.createElement('td');
        tdTime.style.color = 'var(--muted)';
        tdTime.textContent = new Date(r.submitted_at).toLocaleString('vi-VN');

        // Thao tác (Xóa)
        const tdAction = document.createElement('td');
        tdAction.style.textAlign = 'center';
        const delBtn = document.createElement('button');
        delBtn.type = 'button';
        delBtn.className = 'btn-danger';
        delBtn.innerHTML = '🗑️ Xóa';
        delBtn.title = 'Xóa lượt nộp này';
        delBtn.onclick = async () => {
          if (!confirm(`Thầy/cô có chắc muốn xóa lượt làm bài của em "${r.student_name}" (Lớp ${r.class_name})?`)) return;
          try {
            await api('/api/teacher', {
              method: 'DELETE',
              body: JSON.stringify({ id: r.id })
            });
            allRows = allRows.filter(item => item.id !== r.id);
            await fetchClassOptions(lessonSelect.value);
            renderTable();
            fetchStats();
          } catch (err) {
            alert('Không thể xóa: ' + err.message);
          }
        };
        tdAction.append(delBtn);

        tr.append(tdIdx, tdName, tdClass, tdCorrect, tdScore, tdBadge, tdDuration, tdTime, tdAction);
        rowsEl.append(tr);
      });
    }

    async function fetchResults(reset = true) {
      const requestId = ++resultsRequestId;
      try {
        if (reset) {
          offset = 0;
          allRows = [];
        }
        const lessonId = lessonSelect.value;
        if (!lessonId) {
          ++statsRequestId;
          rowsEl.replaceChildren();
          loadMoreBtn.hidden = true;
          tableStatus.textContent = 'Không tìm thấy bài học phù hợp.';
          for (const id of ['stat-total', 'stat-avg', 'stat-max']) document.getElementById(id).textContent = '0';
          document.getElementById('stat-good-ratio').textContent = '0%';
          questionStatsList.replaceChildren();
          questionStatsStatus.textContent = '';
          return;
        }

        tableStatus.textContent = 'Đang tải danh sách kết quả...';
        const data = await api(`/api/teacher?lessonId=${encodeURIComponent(lessonId)}&offset=${offset}`);
        if (requestId !== resultsRequestId) return;
        
        allRows = reset ? data.rows : [...allRows, ...data.rows];
        offset += data.rows.length;
        loadMoreBtn.hidden = data.rows.length < 100;

        if (reset) await fetchClassOptions(lessonId);
        if (requestId !== resultsRequestId) return;
        renderTable();
        if (reset) fetchStats();
      } catch (e) {
        if (requestId !== resultsRequestId) return;
        tableStatus.textContent = e.message;
        if (e.message.includes('đăng nhập lại') || e.message.includes('hết hạn')) {
          showLogin();
        }
      }
    }

    function showDashboard() {
      loginSection.hidden = true;
      dashboardSection.hidden = false;
      const logoutBtn = document.createElement('button');
      logoutBtn.className = 'logout-btn';
      logoutBtn.textContent = '🚪 Đăng xuất';
      logoutBtn.onclick = async () => {
        try {
          await api('/api/teacher', {
            method: 'POST',
            body: JSON.stringify({ action: 'logout' })
          });
        } catch (e) {
          console.error('Logout error:', e);
        }
        location.reload();
      };
      authActions.replaceChildren(logoutBtn);
    }

    function showLogin() {
      loginSection.hidden = false;
      dashboardSection.hidden = true;
      authActions.replaceChildren();
    }

    let loginReady = false;
    const loginBtn = document.getElementById('login-btn');
    loginBtn.disabled = true;
    loginBtn.textContent = 'Đang chuẩn bị...';

    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!loginReady) return;
      loginReady = false;
      loginError.textContent = '';
      const password = document.getElementById('password').value;
      loginBtn.disabled = true;
      loginBtn.textContent = 'Đang kiểm tra...';
      try {
        await api('/api/teacher', {
          method: 'POST',
          body: JSON.stringify({ password })
        });
        document.getElementById('password').value = '';
        showDashboard();
        await loadLessonList();
        await fetchResults(true);
      } catch (err) {
        loginError.textContent = err.message;
      } finally {
        loginReady = true;
        loginBtn.disabled = false;
        loginBtn.textContent = 'Đăng nhập';
      }
    });

    lessonGrade.addEventListener('change', () => {
      lessonSearch.value = '';
      renderLessonOptions();
      fetchResults(true);
    });
    lessonSearch.addEventListener('input', () => {
      clearTimeout(lessonSearchTimer);
      lessonSearchTimer = setTimeout(() => {
        renderLessonOptions();
        fetchResults(true);
      }, 250);
    });
    lessonSelect.addEventListener('change', () => {
      updateSelectedLessonName();
      fetchResults(true);
    });
    refreshBtn.addEventListener('click', () => fetchResults(true));
    classFilter.addEventListener('change', () => { renderTable(); fetchStats(); });
    searchInput.addEventListener('input', () => {
      renderTable();
      clearTimeout(searchTimer);
      searchTimer = setTimeout(fetchStats, 250);
    });
    loadMoreBtn.addEventListener('click', () => fetchResults(false));

    exportBtn.addEventListener('click', async () => {
      try {
        const id = lessonSelect.value;
        if (!id) return;
        exportBtn.disabled = true;
        exportBtn.textContent = 'Đang trích xuất...';

        const all = [];
        for (let page = 0; ; page += 100) {
          const rows = (await api(`/api/teacher?lessonId=${encodeURIComponent(id)}&offset=${page}`)).rows;
          all.push(...rows);
          if (rows.length < 100) break;
        }

        const lines = [
          ['STT', 'Họ và tên', 'Lớp', 'Số câu đúng', 'Tổng câu hỏi', 'Điểm', 'Thời gian làm bài', 'Thời điểm nộp'],
          ...all.map((r, i) => [
            i + 1,
            r.student_name,
            r.class_name,
            r.correct_count,
            r.total_questions,
            Number(r.score).toFixed(1),
            formatDuration(r.time_taken_seconds),
            new Date(r.submitted_at).toLocaleString('vi-VN')
          ])
        ];

        const csvContent = '\uFEFF' + lines.map(row => row.map(csvCell).join(',')).join('\r\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `Ket_Qua_${id}.csv`;
        link.click();
        URL.revokeObjectURL(url);
      } catch (e) {
        alert('Lỗi xuất file: ' + e.message);
      } finally {
        exportBtn.disabled = false;
        exportBtn.textContent = '📥 Xuất file Excel (CSV)';
      }
    });

    function escapeHtml(str) {
      return String(str || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
    }

    function formatDuration(sec) {
      if (sec === null || sec === undefined || isNaN(sec)) return '--';
      const s = Math.max(0, Math.floor(sec));
      const mins = Math.floor(s / 60);
      const remainingSecs = s % 60;
      return `${mins}:${String(remainingSecs).padStart(2, '0')}`;
    }

    // Mỗi lần mở trang giáo viên đều yêu cầu nhập lại mật khẩu.
    // Xóa cookie phiên cũ trước khi cho phép gửi biểu mẫu đăng nhập.
    (async function clearExistingSession() {
      try {
        await api('/api/teacher', { method: 'POST', body: JSON.stringify({ action: 'logout' }) });
        loginReady = true;
        loginBtn.disabled = false;
        loginBtn.textContent = 'Đăng nhập';
      } catch (e) {
        loginError.textContent = 'Không thể chuẩn bị đăng nhập. Vui lòng tải lại trang.';
      }
    })();
