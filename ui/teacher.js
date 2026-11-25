import './compat.js';
import { EXCELLENT_SCORE, GOOD_SCORE, PASS_SCORE, getScoreLevel } from '../lib/score-levels.js';
    import { csvCell } from '../lib/csv.js';
    import { initializeLessonEditor } from './lesson-editor.js';
    import { initializeTeacherAccounts } from './teacher-access.js';
    import { initializeSchools } from './schools.js';
    import { initializeStudentHistory } from './student-history.js';
    import { lessonDisplayTitle, normalizeSearch } from './lesson-title.js';
    import { createTableSorter } from './table-sort.js';
    const loginSection = document.getElementById('login-section');
    const dashboardSection = document.getElementById('dashboard-section');
    const loginForm = document.getElementById('login-form');
    const loginError = document.getElementById('login-error');
    const accountMenu = document.getElementById('teacher-account-menu');
    const avatar = document.getElementById('teacher-avatar');
    const accountName = document.getElementById('teacher-account-name');
    const accountDetails = document.getElementById('teacher-account-details');
    const avatarInitials = document.getElementById('teacher-avatar-initials');
    const logoutBtn = document.getElementById('teacher-logout');
    const personalEdit = document.getElementById('teacher-personal-edit');
    const personalForm = document.getElementById('teacher-personal-form');
    const personalCancel = document.getElementById('teacher-personal-cancel');
    const personalStatus = document.getElementById('teacher-personal-status');
    const personalName = personalForm.elements.namedItem('displayName');
    const personalSubject = personalForm.elements.namedItem('subject');
    const passwordFields = document.getElementById('teacher-password-fields');

    // Tab buttons & Views
    const tabLessonsBtn = document.getElementById('tab-lessons-btn');
    const tabRankingBtn = document.getElementById('tab-ranking-btn');
    const tabCreateBtn = document.getElementById('tab-create-btn');
    const tabAccountsBtn = document.getElementById('tab-accounts-btn');
    const tabHistoryBtn = document.getElementById('tab-student-history-btn');
    const modeSwitch = document.getElementById('teacher-mode-switch');
    const viewModeBtn = document.getElementById('teacher-view-mode');
    const editModeBtn = document.getElementById('teacher-edit-mode');
    const viewLessons = document.getElementById('view-lessons');
    const viewRanking = document.getElementById('view-ranking');
    const viewCreate = document.getElementById('view-create');
    const viewAccounts = document.getElementById('view-accounts');
    const viewHistory = document.getElementById('view-student-history');
    let teacherIdentity = null;
    let editingMode = false;

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
    const rankingStudentsMoreBtn = document.getElementById('ranking-students-more');
    const studentScoreSummary = document.getElementById('student-score-summary');
    const studentScoreSummaryTotal = document.getElementById('student-score-summary-total');
    const studentScoreLevels = [
      { min: EXCELLENT_SCORE, countElement: document.getElementById('student-score-good') },
      { min: GOOD_SCORE, countElement: document.getElementById('student-score-fair') },
      { min: PASS_SCORE, countElement: document.getElementById('student-score-pass') },
      { min: -Infinity, countElement: document.getElementById('student-score-low') }
    ];
    const rankingStatus = document.getElementById('ranking-status');
    const editDialog = document.getElementById('student-edit-dialog');
    const editForm = document.getElementById('student-edit-form');
    const editSourceLabel = document.getElementById('student-edit-source');
    const editName = document.getElementById('student-edit-name');
    const editClass = document.getElementById('student-edit-class');
    const editClassChoice = document.getElementById('student-edit-class-choice');
    const editClassLabel = document.getElementById('student-edit-class-label');
    const editStatus = document.getElementById('student-edit-status');
    const editCancel = document.getElementById('student-edit-cancel');
    const editSubmit = document.getElementById('student-edit-submit');
    let editSource = null;

    const mergeDialog = document.getElementById('student-merge-dialog');
    const mergeForm = document.getElementById('student-merge-form');
    const mergeSourceLabel = document.getElementById('student-merge-source');
    const mergeTarget = document.getElementById('student-merge-target');
    const mergeStatus = document.getElementById('student-merge-status');
    const mergeCancel = document.getElementById('student-merge-cancel');
    const mergeSubmit = document.getElementById('student-merge-submit');
    const mergeFeedback = document.getElementById('student-merge-feedback');
    let mergeSource = null;

    const attemptsDialog = document.getElementById('student-attempts-dialog');
    const attemptsTitle = document.getElementById('student-attempts-title');
    const attemptsStatus = document.getElementById('student-attempts-status');
    const attemptsTable = document.getElementById('student-attempts-table');
    const attemptsRows = attemptsTable.tBodies[0];
    const attemptsMore = document.getElementById('student-attempts-more');

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
    let studentRankingRequest = 0;
    let studentRankingLoaded = false;
    let studentVisibleLimit = 100;
    const STUDENT_PAGE_SIZE = 100;
    const tableSortCollator = new Intl.Collator('vi', { numeric: true, sensitivity: 'base' });
    let rankingGradeTotals = {};
    let isRankingLoaded = false;
    let rankingSearchTimer;

    async function api(url, options = {}) {
      const schoolId = teacherIdentity ? schoolManagement.id : '';
      let schoolScoped = false;
      if (url.startsWith('/api/teacher') && schoolId) {
        const target = new URL(url, location.origin);
        const type = target.searchParams.get('type');
        if (!['schools', 'accounts'].includes(type)) {
          if (!options.method || options.method === 'GET') {
            target.searchParams.set('schoolId', schoolId);
            url = target.pathname + target.search;
            schoolScoped = true;
          } else if (options.body) {
            const body = JSON.parse(options.body);
            if (['edit-student', 'merge-students'].includes(body.action) || options.method === 'DELETE') {
              options = { ...options, body: JSON.stringify({ ...body, schoolId }) };
              schoolScoped = true;
            }
          }
        }
      }
      const res = await fetch(url, {
        ...options,
        headers: { 'Content-Type': 'application/json', ...(options.headers || {}) }
      });
      const data = await res.json().catch(() => ({}));
      if (schoolScoped && schoolId !== schoolManagement.id) throw new Error('Trường đang xem đã thay đổi. Hãy tải lại bảng.');
      if (!res.ok) {
        const errorMap = {
          INVALID_SCHOOL: 'Hãy kiểm tra trường học và tên trường (tối đa 180 ký tự).',
          SCHOOL_NOT_FOUND: 'Không tìm thấy trường học. Hãy tải lại danh sách.',
          SCHOOL_ALREADY_EXISTS: 'Tên trường đã có trong danh sách. Hãy chọn Sửa để cập nhật.',
          INVALID_PASSWORD: 'Tên đăng nhập hoặc mật khẩu chưa đúng, hoặc tài khoản đã bị khóa.',
          INVALID_PROFILE: 'Kiểm tra tên hiển thị và môn dạy trước khi lưu.',
          INVALID_CURRENT_PASSWORD: 'Mật khẩu hiện tại chưa đúng.',
          FORBIDDEN: 'Tài khoản của thầy/cô không có quyền thực hiện thao tác này.',
          INVALID_TEACHER_ACCOUNT: 'Kiểm tra tên đăng nhập, tên hiển thị, môn dạy và lớp phụ trách. Tên đăng nhập dùng 3–40 ký tự chữ không dấu, số, dấu chấm, gạch dưới hoặc gạch ngang.',
          INVALID_ACCOUNT_PASSWORD: 'Mật khẩu cần từ 12 đến 128 ký tự.',
          TEACHER_ACCOUNT_EXISTS: 'Tên đăng nhập này đã được sử dụng.',
          TEACHER_ACCOUNT_NOT_FOUND: 'Không tìm thấy tài khoản giáo viên.',
          INVALID_STUDENT_MERGE: 'Hãy chọn hai tên khác nhau trong cùng lớp.',
          INVALID_STUDENT_EDIT: 'Hãy nhập họ tên và lớp hợp lệ.',
          LESSON_ALREADY_EXISTS: 'Tên hoặc mã bài đã có trong khối. Hãy kiểm tra và đổi tên bài trùng trước khi lưu lại.',
          LESSON_HAS_ATTEMPTS: 'Bài học này đã có học sinh nộp bài nên không thể xóa. Thầy/cô hãy chọn Ẩn bài nếu muốn tạm ẩn khỏi trang học sinh.',
          LESSON_NOT_FOUND: 'Không tìm thấy bài học.',
          STUDENT_EDIT_DUPLICATE: 'Lớp này đã có học sinh mang tên đó. Hãy kiểm tra lại họ tên và lớp. Nếu là cùng một em trong cùng lớp, hãy dùng Gộp tên.',
          STUDENT_EDIT_CHANGED: 'Danh sách đã thay đổi. Hãy đóng hộp thoại và tải lại bảng.',
          STUDENT_MERGE_CHANGED: 'Danh sách đã thay đổi. Hãy đóng hộp thoại, tải lại bảng và kiểm tra lại hai tên.',
          TOO_MANY_ATTEMPTS: 'Đã thử sai quá nhiều lần. Vui lòng thử lại sau 15 phút.',
          STORAGE_NOT_CONFIGURED: 'Cơ sở dữ liệu chưa được kết nối.',
          TEACHER_LOGIN_NOT_CONFIGURED: 'Mật khẩu giáo viên chưa được cấu hình.',
          UNAUTHORIZED: 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.'
        };
        if (data.error === 'UNAUTHORIZED' && teacherIdentity) {
          teacherIdentity = null;
          showLogin();
          location.reload();
        }
        throw new Error(errorMap[data.error] || data.message || 'Có lỗi xảy ra, vui lòng thử lại.');
      }
      return data;
    }

    /* ========================================================
       TAB SWITCHING
       ======================================================== */
    function switchTab(tab) {
      if ((tab === 'accounts' || tab === 'history') && teacherIdentity?.role !== 'admin') return;
      if (canEditStudentInfo() && !editingMode && (tab === 'create' || tab === 'accounts')) return;
      currentTab = tab;
      for (const entry of [
        { name: 'lessons', button: tabLessonsBtn, view: viewLessons },
        { name: 'ranking', button: tabRankingBtn, view: viewRanking },
        { name: 'create', button: tabCreateBtn, view: viewCreate },
        { name: 'accounts', button: tabAccountsBtn, view: viewAccounts },
        { name: 'history', button: tabHistoryBtn, view: viewHistory }
      ]) {
        entry.button.classList.toggle('active', entry.name === tab);
        entry.view.hidden = entry.name !== tab;
      }
      if (tab === 'ranking' && !isRankingLoaded) fetchRankingData();
      if (tab === 'create') loadManagedLessons();
      if (tab === 'accounts') loadTeacherAccounts();
      if (tab === 'history') loadStudentHistory();
    }

    tabLessonsBtn.addEventListener('click', () => switchTab('lessons'));
    tabRankingBtn.addEventListener('click', () => switchTab('ranking'));
    tabCreateBtn.addEventListener('click', () => switchTab('create'));
    tabAccountsBtn.addEventListener('click', () => switchTab('accounts'));
    tabHistoryBtn.addEventListener('click', () => switchTab('history'));
    viewModeBtn.addEventListener('click', () => setEditingMode(false));
    editModeBtn.addEventListener('click', () => setEditingMode(true));

    function setEditingMode(enabled) {
      const canSwitchModes = canEditStudentInfo();
      editingMode = canSwitchModes && enabled;
      const viewMode = canSwitchModes && !editingMode;
      modeSwitch.hidden = !canSwitchModes;
      dashboardSection.classList.toggle('view-mode', viewMode);
      viewModeBtn.setAttribute('aria-pressed', String(!editingMode));
      editModeBtn.setAttribute('aria-pressed', String(editingMode));
      if (viewMode && (currentTab === 'create' || currentTab === 'accounts')) switchTab('lessons');
    }
    const loadTeacherAccounts = initializeTeacherAccounts(api);
    const schoolManagement = initializeSchools(api, () => {
      isRankingLoaded = false;
      studentRankingLoaded = false;
      rawClassRankings = [];
      rawStudentRankings = [];
      allRows = [];
      for (const dialog of [editDialog, mergeDialog, attemptsDialog]) if (dialog.open) dialog.close();
      updateClassFilterOptions([]);
      fetchResults(true);
      if (currentTab === 'ranking') fetchRankingData();
      if (currentTab === 'history') loadStudentHistory();
    });
    const loadStudentHistory = initializeStudentHistory(api);

    /* ========================================================
       RANKING & PROGRESS LOGIC
       ======================================================== */
    function getGrade(className) {
      const match = String(className || '').match(/^[^\d]*([345])/);
      return match ? match[1] : null;
    }

    function getTotalLessons(className) {
      const g = getGrade(className);
      return rankingGradeTotals[g || 'all'] ?? 0;
    }

    function switchRankingMode(mode) {
      rankingMode = mode;
      mergeFeedback.hidden = true;
      if (mode === 'classes') {
        modeClassesBtn.classList.add('active');
        modeStudentsBtn.classList.remove('active');
        classesTableContainer.hidden = false;
        studentsTableContainer.hidden = true;
        rankingStudentsMoreBtn.hidden = true;
        studentScoreSummary.hidden = true;
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

    function updateRankingSummaryCards(selectedGrade) {
      const classesInScope = rawClassRankings.filter(c => selectedGrade === 'ALL' || getGrade(c.class_name) === selectedGrade);
      const lessonsEl = document.getElementById('rank-stat-lessons');
      const totalForGrade = selectedGrade === 'ALL' ? rankingGradeTotals.all : rankingGradeTotals[selectedGrade];
      lessonsEl.textContent = `${totalForGrade ?? 0} bài`;
      rankStatClasses.textContent = classesInScope.length;
      const totalStudents = classesInScope.reduce((sum, c) => sum + (Number(c.student_count) || 0), 0);
      rankStatStudents.textContent = totalStudents;

      let topClass = null;
      let topProgress = -1;
      for (const classRanking of classesInScope) {
        const total = getTotalLessons(classRanking.class_name);
        if (!total || !getGrade(classRanking.class_name)) continue;
        const progress = classRanking.completed_lessons / total;
        if (progress > topProgress) {
          topClass = classRanking;
          topProgress = progress;
        }
      }
      rankStatTopClass.textContent = topClass
        ? `Lớp ${topClass.class_name} (${topClass.completed_lessons}/${getTotalLessons(topClass.class_name)} bài - ${Math.round(topProgress * 100)}%)`
        : '--';
    }

    async function fetchRankingData() {
      try {
        rankingStatus.textContent = 'Đang tải bảng xếp hạng và tiến độ các lớp...';
        const data = await api('/api/teacher?type=ranking');
        rawClassRankings = data.classes || [];
        rankingGradeTotals = data.gradeTotals;
        for (const option of rankingGradeFilter.options) {
          if (option.value !== 'ALL') {
            option.textContent = `Khối ${option.value} (${rankingGradeTotals[option.value]} bài)`;
          }
        }
        isRankingLoaded = true;
        updateRankingSummaryCards(rankingGradeFilter.value);

        // Cập nhật dropdown lớp cho bảng vàng học sinh
        const currentSelectedClass = rankingClassSelect.value;
        rankingClassSelect.replaceChildren();
        const allOption = document.createElement('option');
        allOption.value = 'ALL';
        allOption.textContent = allClassesLabel();
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
      const request = ++studentRankingRequest;
      studentRankingLoaded = false;
      rawStudentRankings = [];
      studentsRankingRows.replaceChildren();
      studentScoreSummary.hidden = true;
      try {
        rankingStatus.textContent = 'Đang tải bảng vàng học sinh...';
        const selectedClass = rankingClassSelect.value;
        const url = selectedClass && selectedClass !== 'ALL'
          ? `/api/teacher?type=ranking&mode=student&className=${encodeURIComponent(selectedClass)}`
          : '/api/teacher?type=ranking&mode=student';
        const data = await api(url);
        if (request !== studentRankingRequest || rankingMode !== 'students') return;
        rawStudentRankings = data.students || [];
        studentRankingLoaded = true;
        renderStudentsTable();
      } catch (err) {
        if (request !== studentRankingRequest || rankingMode !== 'students') return;
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

    const classTableSort = createTableSorter(classesRankingRows, tableSortCollator, 'rank', 1, ['rank', 'class', 'grade']);
    const resultTableSort = createTableSorter(rowsEl, tableSortCollator, 'index', 1, ['index', 'name', 'class', 'duration']);
    const attemptTableSort = createTableSorter(attemptsRows, tableSortCollator, 'submitted', -1, ['lesson', 'duration']);
    const studentTableSort = createTableSorter(
      studentsRankingRows, tableSortCollator, 'rank', 1, ['rank', 'student_name', 'class_name', 'avg_time_seconds'], renderStudentsTable
    );

    function durationSortValue(seconds) {
      return seconds == null ? null : Number(seconds);
    }

    function renderClassesTable() {
      const selectedGrade = rankingGradeFilter.value;
      updateRankingSummaryCards(selectedGrade);
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
            <span class="score-cell" style="color: ${Number(c.avg_score) >= EXCELLENT_SCORE ? '#059669' : Number(c.avg_score) >= GOOD_SCORE ? '#b45309' : '#b91c1c'};">
              ${Number(c.avg_score).toFixed(1)}
            </span>
          </td>
          <td style="text-align: center; font-weight: 800; color: #047857;">⭐ ${formatScore(c.max_score)}</td>
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

        classTableSort.add(tr, {
          rank: idx + 1,
          class: c.class_name,
          grade: g ? Number(g) : null,
          students: Number(c.student_count),
          progress: totalLessons > 0 ? Math.min(1, c.completed_lessons / totalLessons) : null,
          attempts: Number(c.total_attempts),
          average: Number(c.avg_score),
          maximum: Number(c.max_score),
          good: c.total_attempts > 0 ? c.good_count / c.total_attempts : 0
        }, idx);
        classesRankingRows.append(tr);
      });
      classTableSort.apply();
    }

    function getSortedStudentRows() {
      const selectedGrade = rankingGradeFilter.value;
      const keyword = normalizeSearch(rankingSearchInput.value.trim());

      const filtered = rawStudentRankings.filter(s => {
        if (selectedGrade !== 'ALL') {
          const g = getGrade(s.class_name);
          if (g !== selectedGrade) return false;
        }
        if (keyword && (!s.student_name || !normalizeSearch(s.student_name).includes(keyword))) {
          return false;
        }
        return true;
      });

      const rows = filtered.map((student, index) => {
        const total = getTotalLessons(student.class_name);
        return {
          student,
          rank: index + 1,
          position: index,
          values: {
            rank: index + 1,
            student_name: student.student_name,
            class_name: student.class_name,
            progress: total > 0 ? Math.min(1, student.completed_lessons / total) : null,
            total_attempts: Number(student.total_attempts),
            avg_score: Number(student.avg_score),
            max_score: Number(student.max_score),
            avg_time_seconds: durationSortValue(student.avg_time_seconds),
            latest_submission: Date.parse(student.latest_submission)
          }
        };
      });
      return studentTableSort.order(rows, row => row);
    }

    function renderStudentScoreSummary(rows) {
      const counts = studentScoreLevels.map(() => 0);
      for (const row of rows) {
        const score = Number(row.student.avg_score);
        const level = studentScoreLevels.findIndex(entry => score >= entry.min);
        counts[level] += 1;
      }

      studentScoreLevels.forEach((entry, index) => {
        entry.countElement.textContent = counts[index];
      });
      studentScoreSummaryTotal.textContent = `Tổng cộng ${rows.length} học sinh theo bộ lọc hiện tại.`;
      studentScoreSummary.hidden = false;
    }

    function renderStudentsTable(resetLimit = true) {
      if (rankingMode !== 'students' || !studentRankingLoaded) return;
      if (resetLimit) studentVisibleLimit = STUDENT_PAGE_SIZE;
      const filtered = getSortedStudentRows();
      renderStudentScoreSummary(filtered);
      studentsRankingRows.replaceChildren();

      if (!filtered.length) {
        rankingStudentsMoreBtn.hidden = true;
        rankingStatus.textContent = rawStudentRankings.length
          ? 'Không tìm thấy học sinh nào phù hợp bộ lọc.'
          : 'Chưa có dữ liệu học sinh nộp bài.';
        return;
      }
      const visible = filtered.slice(0, studentVisibleLimit);
      rankingStudentsMoreBtn.hidden = visible.length >= filtered.length;
      rankingStatus.textContent = visible.length < filtered.length
        ? `Hiển thị ${visible.length} / ${filtered.length} học sinh trong bảng vàng.`
        : `Hiển thị bảng vàng ${filtered.length} học sinh.`;
      const studentsPerClass = new Map();
      for (const student of rawStudentRankings) {
        studentsPerClass.set(student.class_name, (studentsPerClass.get(student.class_name) || 0) + 1);
      }

      visible.forEach(row => {
        const s = row.student;
        const tr = document.createElement('tr');
        const totalLessons = getTotalLessons(s.class_name);

        tr.innerHTML = `
          <td style="text-align: center;">${renderRankBadge(row.rank - 1)}</td>
          <td class="student-name-cell">
            <div class="student-name">${escapeHtml(s.student_name)}</div>
            ${canEditStudentInfo() ? `<div class="student-row-actions" data-edit-mode>
              <button type="button" class="student-row-action" data-edit-student aria-haspopup="dialog"
                aria-label="Sửa thông tin ${escapeHtml(s.student_name)}, lớp ${escapeHtml(s.class_name)}">Sửa</button>
              ${teacherIdentity.role === 'admin' ? `<button type="button" class="student-row-action" data-merge-student aria-haspopup="dialog"
                aria-label="Gộp tên ${escapeHtml(s.student_name)}, lớp ${escapeHtml(s.class_name)}"
                ${studentsPerClass.get(s.class_name) < 2 ? 'hidden' : ''}>Gộp tên</button>` : ''}
            </div>` : ''}
          </td>
          <td class="student-class-cell">
            <span style="font-weight: 800; color: var(--primary);">Lớp ${escapeHtml(s.class_name)}</span>
          </td>
          <td>${renderProgressBar(s.completed_lessons, totalLessons)}</td>
          <td style="text-align: center;">
            <button type="button" class="btn btn-secondary" aria-haspopup="dialog"
              data-student-attempts aria-label="Xem ${s.total_attempts} lượt làm của ${escapeHtml(s.student_name)}, lớp ${escapeHtml(s.class_name)}">${s.total_attempts} lượt</button>
          </td>
          <td style="text-align: center;">
            <span class="score-cell" style="color: ${Number(s.avg_score) >= EXCELLENT_SCORE ? '#059669' : Number(s.avg_score) >= GOOD_SCORE ? '#b45309' : '#b91c1c'};">
              ${Number(s.avg_score).toFixed(1)}
            </span>
          </td>
          <td style="text-align: center; font-weight: 800; color: #047857;">⭐ ${formatScore(s.max_score)}</td>
          <td style="text-align: center; font-weight: 700; color: #047857;">${formatDuration(s.avg_time_seconds)}</td>
          <td style="color: var(--muted); font-size: 0.88rem;">${s.latest_submission ? new Date(s.latest_submission).toLocaleString('vi-VN') : '--'}</td>
        `;

        tr.querySelector('[data-student-attempts]').addEventListener('click', () => showStudentAttempts(s));
        tr.querySelector('[data-edit-student]')?.addEventListener('click', () => openStudentEdit(s));
        tr.querySelector('[data-merge-student]')?.addEventListener('click', () => openStudentMerge(s));
        studentsRankingRows.append(tr);
      });
    }

    function canEditStudentInfo() {
      return teacherIdentity?.role === 'admin' || teacherIdentity?.canEditStudents === true;
    }

    function editClassField() {
      return teacherIdentity?.role === 'admin' ? editClass : editClassChoice;
    }

    function openStudentEdit(student) {
      if (!editingMode || !canEditStudentInfo()) return;
      editSource = student;
      editName.value = student.student_name;
      const isAdmin = teacherIdentity.role === 'admin';
      editClass.hidden = editClass.disabled = !isAdmin;
      editClassChoice.hidden = editClassChoice.disabled = isAdmin;
      if (!isAdmin) {
        const currentClass = student.class_name.trim().toUpperCase();
        const values = [student.class_name, ...teacherIdentity.classes.filter(value => value !== currentClass)];
        editClassChoice.replaceChildren(...values.map(value => new Option(value, value)));
      }
      const field = editClassField();
      field.value = student.class_name;
      editClassLabel.htmlFor = field.id;
      editSourceLabel.textContent = `Thay đổi áp dụng cho ${student.total_attempts} lượt làm của “${student.student_name}” (lớp ${student.class_name}).`;
      editStatus.textContent = '';
      editSubmit.disabled = true;
      mergeFeedback.hidden = true;
      editDialog.showModal();
    }

    function updateEditSubmit() {
      const targetName = editName.value.trim();
      const targetClass = editClassField().value.trim();
      editSubmit.disabled = !targetName || !targetClass ||
        (targetName === editSource.student_name && targetClass === editSource.class_name);
    }

    editForm.addEventListener('input', updateEditSubmit);
    editClassChoice.addEventListener('change', updateEditSubmit);
    editCancel.addEventListener('click', () => editDialog.close());
    editDialog.addEventListener('cancel', event => {
      if (editCancel.disabled) event.preventDefault();
    });

    editForm.addEventListener('submit', async event => {
      event.preventDefault();
      if (editSubmit.disabled) return;
      const targetName = editName.value.trim();
      const classField = editClassField();
      const targetClass = classField.value.trim();
      editName.disabled = classField.disabled = editCancel.disabled = editSubmit.disabled = true;
      editStatus.textContent = 'Đang lưu thay đổi…';
      try {
        const data = await api('/api/teacher', {
          method: 'POST',
          body: JSON.stringify({
            action: 'edit-student',
            sourceName: editSource.student_name,
            className: editSource.class_name,
            targetName,
            targetClass
          })
        });
        if (rankingClassSelect.value !== 'ALL' && rankingClassSelect.value !== targetClass) {
          rankingClassSelect.value = 'ALL';
        }
        if (rankingGradeFilter.value !== 'ALL' && rankingGradeFilter.value !== getGrade(targetClass)) {
          rankingGradeFilter.value = 'ALL';
        }
        if (!targetName.toLowerCase().includes(rankingSearchInput.value.trim().toLowerCase())) {
          rankingSearchInput.value = '';
        }
        editDialog.close();
        mergeFeedback.hidden = false;
        mergeFeedback.textContent = `Đã cập nhật ${data.updatedCount} lượt làm của “${targetName}” (lớp ${targetClass}).`;
        await Promise.all([fetchRankingData(), fetchResults()]);
      } catch (error) {
        editStatus.textContent = error.message;
      } finally {
        editName.disabled = classField.disabled = editCancel.disabled = false;
        updateEditSubmit();
      }
    });

    function openStudentMerge(student) {
      mergeSource = student;
      mergeSourceLabel.textContent = `Chuyển ${student.total_attempts} lượt làm của “${student.student_name}” (lớp ${student.class_name}) sang tên thầy/cô chọn. Điểm và đáp án của từng lượt được giữ nguyên.`;
      const classmates = rawStudentRankings
        .filter(item => item.class_name === student.class_name && item.student_name !== student.student_name)
        .sort((a, b) => tableSortCollator.compare(a.student_name, b.student_name));
      mergeTarget.replaceChildren(new Option('Chọn tên đúng…', ''));
      for (const item of classmates) {
        mergeTarget.append(new Option(`${item.student_name} (${item.total_attempts} lượt)`, item.student_name));
      }
      mergeStatus.textContent = '';
      mergeFeedback.hidden = true;
      mergeSubmit.disabled = true;
      mergeDialog.showModal();
    }

    mergeTarget.addEventListener('change', () => {
      mergeSubmit.disabled = !mergeTarget.value;
    });

    mergeCancel.addEventListener('click', () => mergeDialog.close());
    mergeDialog.addEventListener('cancel', event => {
      if (mergeCancel.disabled) event.preventDefault();
    });

    mergeForm.addEventListener('submit', async event => {
      event.preventDefault();
      if (mergeSubmit.disabled) return;
      const targetName = mergeTarget.value;
      const sourceName = mergeSource.student_name;
      const className = mergeSource.class_name;
      mergeTarget.disabled = true;
      mergeCancel.disabled = true;
      mergeSubmit.disabled = true;
      mergeStatus.textContent = 'Đang gộp lượt làm…';
      try {
        const data = await api('/api/teacher', {
          method: 'POST',
          body: JSON.stringify({ action: 'merge-students', sourceName, targetName, className })
        });
        if (!targetName.toLowerCase().includes(rankingSearchInput.value.trim().toLowerCase())) {
          rankingSearchInput.value = '';
        }
        mergeDialog.close();
        mergeFeedback.hidden = false;
        mergeFeedback.textContent = `Đã chuyển ${data.mergedCount} lượt làm từ “${sourceName}” sang “${targetName}” (lớp ${className}).`;
        await Promise.all([fetchRankingData(), fetchResults()]);
      } catch (error) {
        mergeStatus.textContent = error.message;
      } finally {
        mergeTarget.disabled = false;
        mergeCancel.disabled = false;
        mergeSubmit.disabled = !mergeTarget.value;
      }
    });

    function showStudentAttempts(student) {
      attemptsTitle.textContent = `Lượt làm của ${student.student_name} · Lớp ${student.class_name}`;
      attemptsRows.replaceChildren();
      attemptsTable.hidden = true;
      attemptsMore.hidden = true;
      const controller = new AbortController();
      attemptsDialog.addEventListener('close', () => controller.abort(), { once: true });
      attemptsDialog.showModal();

      async function loadPage() {
        attemptsMore.disabled = true;
        attemptsStatus.textContent = 'Đang tải lượt làm…';
        const params = new URLSearchParams({
          type: 'student-attempts',
          studentName: student.student_name,
          className: student.class_name,
          offset: String(attemptsRows.rows.length)
        });

        try {
          const data = await api(`/api/teacher?${params}`, { signal: controller.signal });
          if (controller.signal.aborted) return;
          for (const attempt of data.rows) {
            const title = lessonCatalog.find(lesson => lesson.id === attempt.lesson_id)?.title || attempt.lesson_id;
            const position = attemptsRows.rows.length;
            const row = attemptsRows.insertRow();
            attemptTableSort.add(row, {
              lesson: title,
              score: Number(attempt.score),
              correct: Number(attempt.correct_count),
              duration: durationSortValue(attempt.time_taken_seconds),
              submitted: Date.parse(attempt.submitted_at)
            }, position);
            const values = [
              title,
              formatScore(attempt.score),
              `${attempt.correct_count}/${attempt.total_questions}`,
              formatDuration(attempt.time_taken_seconds),
              new Date(attempt.submitted_at).toLocaleString('vi-VN')
            ];
            for (const value of values) row.insertCell().textContent = value;
          }
          attemptTableSort.apply();
          const loaded = attemptsRows.rows.length;
          attemptsTable.hidden = loaded === 0;
          attemptsStatus.textContent = loaded ? `Đã tải ${loaded} lượt làm.` : 'Chưa có lượt làm.';
          attemptsMore.textContent = 'Xem thêm';
          attemptsMore.hidden = !data.hasMore;
          if (data.hasMore) attemptsStatus.textContent += ' Sắp xếp áp dụng cho các lượt đã tải.';
        } catch (error) {
          if (controller.signal.aborted) return;
          attemptsStatus.textContent = `Không tải được lượt làm. ${error.message}`;
          attemptsMore.textContent = 'Thử lại';
          attemptsMore.hidden = false;
        } finally {
          if (!controller.signal.aborted) attemptsMore.disabled = false;
        }
      }

      attemptsMore.onclick = loadPage;
      loadPage();
    }

    // Ranking Event Listeners
    rankingGradeFilter.addEventListener('change', () => {
      updateRankingSummaryCards(rankingGradeFilter.value);
      if (rankingMode === 'classes') renderClassesTable();
      else renderStudentsTable();
    });

    rankingStudentsMoreBtn.addEventListener('click', () => {
      studentVisibleLimit += STUDENT_PAGE_SIZE;
      renderStudentsTable(false);
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

    const scriptPromises = new Map();
    function loadGlobalScript(src, globalName) {
      if (!scriptPromises.has(src)) {
        scriptPromises.set(src, new Promise((resolve, reject) => {
          const script = document.createElement('script');
          script.src = src;
          script.onload = () => {
            if (window[globalName]) resolve(window[globalName]);
            else reject(new Error('Không thể khởi tạo công cụ xử lý tệp.'));
          };
          script.onerror = () => reject(new Error('Không thể tải công cụ xử lý tệp.'));
          document.head.append(script);
        }).catch(error => {
          scriptPromises.delete(src);
          throw error;
        }));
      }
      return scriptPromises.get(src);
    }

    function loadWorkbookTools() {
      return loadGlobalScript('/assets/lesson-workbook.js', 'QuizLessonWorkbook');
    }

    async function downloadReport(format, filename, title, scope, rows) {
      const schoolName = schoolManagement.name;
      scope = [schoolName, scope].filter(Boolean).join(' · ');
      filename = schoolName + '-' + filename;
      let blob;
      if (format === 'csv') {
        rows = [rows[0].concat('Trường học'), ...rows.slice(1).map(row => row.concat(schoolName))];
        const csv = '\uFEFF' + rows.map(row => row.map(csvCell).join(',')).join('\r\n');
        blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
      } else {
        const exporter = await loadGlobalScript('/assets/report-export.js', 'QuizReportExport');
        blob = await exporter.createReportFile(format, { title, scope, rows });
      }
      downloadFile(blob, `${filename}.${format}`);
    }

    function downloadFile(blob, filename) {
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.append(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 30000);
    }

    rankingExportBtn.addEventListener('click', async () => {
      try {
        const format = document.getElementById('ranking-export-format').value;
        rankingExportBtn.disabled = true;
        rankingExportBtn.textContent = 'Đang xuất…';

        if (rankingMode === 'classes') {
          const selectedGrade = rankingGradeFilter.value;
          const filtered = rawClassRankings.filter(c => {
            if (selectedGrade === 'ALL') return true;
            return getGrade(c.class_name) === selectedGrade;
          });

          const lines = [
            ['Hạng', 'Lớp', 'Khối', 'Sĩ số tham gia', 'Số bài hoàn thành', 'Tổng số bài khối', 'Tiến độ (%)', 'Tổng lượt làm', 'Điểm trung bình', 'Điểm cao nhất', 'Tỉ lệ Xuất sắc (>=9đ)', 'Lần nộp gần nhất'],
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
                exportScore(c.avg_score, format),
                exportScore(c.max_score, format),
                `${goodRatio}%`,
                c.latest_submission ? new Date(c.latest_submission).toLocaleString('vi-VN') : '--'
              ];
            })
          ];

          const allGrades = selectedGrade === 'ALL';
          await downloadReport(format, `Bang_Xep_Hang_Tien_Do_Cac_Lop_${allGrades ? 'Toan_Truong' : 'Khoi_' + selectedGrade}`,
            'Bảng xếp hạng tiến độ các lớp', allGrades ? 'Toàn trường' : `Khối ${selectedGrade}`, lines);
        } else {
          const selectedClass = rankingClassSelect.value;
          const filtered = getSortedStudentRows();

          const lines = [
            ['Hạng', 'Họ và tên', 'Lớp', 'Khối', 'Số bài hoàn thành', 'Tổng số bài khối', 'Tiến độ (%)', 'Tổng lượt làm', 'Điểm trung bình', 'Điểm cao nhất', 'Thời gian làm TB', 'Lần nộp gần nhất'],
            ...filtered.map(row => {
              const s = row.student;
              const g = getGrade(s.class_name);
              const totalLessons = getTotalLessons(s.class_name);
              const percent = totalLessons > 0 ? Math.round((s.completed_lessons / totalLessons) * 100) : 0;
              return [
                row.rank,
                s.student_name,
                s.class_name,
                g ? `Khối ${g}` : '',
                s.completed_lessons,
                totalLessons,
                `${percent}%`,
                s.total_attempts,
                exportScore(s.avg_score, format),
                exportScore(s.max_score, format),
                formatDuration(s.avg_time_seconds),
                s.latest_submission ? new Date(s.latest_submission).toLocaleString('vi-VN') : '--'
              ];
            })
          ];

          const allClasses = selectedClass === 'ALL';
          const scope = [allClasses ? 'Toàn trường' : `Lớp ${selectedClass}`];
          if (rankingGradeFilter.value !== 'ALL') scope.push(`Khối ${rankingGradeFilter.value}`);
          if (rankingSearchInput.value.trim()) scope.push(`Tìm kiếm “${rankingSearchInput.value.trim()}”`);
          await downloadReport(format, `Bang_Vang_Hoc_Sinh_${allClasses ? 'Toan_Truong' : 'Lop_' + selectedClass}`,
            'Bảng xếp hạng học sinh', scope.join(' · '), lines);
        }
      } catch (err) {
        alert('Lỗi xuất file: ' + err.message);
      } finally {
        rankingExportBtn.disabled = false;
        rankingExportBtn.textContent = '📥 Xuất file';
      }
    });

    function renderLessonOptions() {
      const selectedId = lessonSelect.value;
      const keyword = normalizeSearch(lessonSearch.value.trim());
      const matches = lessonCatalog.filter(lesson =>
        lesson.grade === lessonGrade.value &&
        (!keyword || normalizeSearch(lesson.title).includes(keyword))
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
      const data = await api('/api/lessons');
      lessonCatalog = data.lessons.map(lesson => ({ id: lesson.id, grade: String(lesson.grade), title: lessonDisplayTitle(lesson) }));
      renderLessonOptions();
    }

    const loadManagedLessons = initializeLessonEditor({
      save: body => api('/api/lessons', { method: 'POST', body }),
      update: body => api('/api/lessons', { method: 'PUT', body }),
      remove: id => api(`/api/lessons?id=${encodeURIComponent(id)}`, { method: 'DELETE' }),
      listManaged: () => api('/api/lessons?manage=1'),
      loadOne: id => api(`/api/lessons?id=${encodeURIComponent(id)}&edit=1`),
      refresh: async () => {
        isRankingLoaded = false;
        studentRankingLoaded = false;
        if (currentTab === 'ranking') fetchRankingData();
        await loadLessonList();
      },
      loadWorkbookTools,
      download: downloadFile
    });

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
        document.getElementById('stat-max').textContent = formatScore(stats.max);
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
      allOpt.textContent = allClassesLabel();
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

    async function fetchClassOptions(lessonId, requestId) {
      const classes = (await api(`/api/teacher?type=classes&lessonId=${encodeURIComponent(lessonId)}`)).classes;
      if (requestId === resultsRequestId && lessonSelect.value === lessonId) updateClassFilterOptions(classes);
    }

    function renderTable() {
      rowsEl.replaceChildren();

      if (!allRows.length) {
        tableStatus.textContent = (classFilter.value !== 'ALL' || searchInput.value.trim()) ? 'Không có học sinh nào phù hợp với bộ lọc.' : 'Chưa có kết quả nộp bài cho bài học này.';
        return;
      }
      tableStatus.textContent = `Hiển thị ${allRows.length} lượt nộp bài.`;
      if (!loadMoreBtn.hidden) tableStatus.textContent += ' Sắp xếp áp dụng cho các lượt đã tải.';

      allRows.forEach((r, idx) => {
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
        tdScore.textContent = formatScore(r.score);

        // Xếp loại badge
        const tdBadge = document.createElement('td');
        const badge = document.createElement('span');
        badge.className = 'badge';
        const numScore = Number(r.score);
        const scoreLevel = getScoreLevel(numScore);
        if (scoreLevel === 3) {
          badge.className += ' badge-excellent';
          badge.textContent = 'Xuất sắc';
        } else if (scoreLevel === 2) {
          badge.className += ' badge-good';
          badge.textContent = 'Khá';
        } else if (scoreLevel === 1) {
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

        tr.append(tdIdx, tdName, tdClass, tdCorrect, tdScore, tdBadge, tdDuration, tdTime);
        if (teacherIdentity?.role === 'admin') {
          const tdAction = document.createElement('td');
          tdAction.setAttribute('data-edit-mode', '');
          tdAction.style.textAlign = 'center';
          const delBtn = document.createElement('button');
          delBtn.type = 'button';
          delBtn.className = 'btn-danger';
          delBtn.textContent = '🗑️ Xóa';
          delBtn.title = 'Xóa lượt nộp này';
          delBtn.onclick = async () => {
            if (!confirm(`Thầy/cô có chắc muốn xóa lượt làm bài của em "${r.student_name}" (Lớp ${r.class_name})?`)) return;
            try {
              await api('/api/teacher', {
                method: 'DELETE',
                body: JSON.stringify({ id: r.id })
              });
              await fetchResults();
              if (isRankingLoaded) await fetchRankingData();
            } catch (err) {
              alert('Không thể xóa: ' + err.message);
            }
          };
          tdAction.append(delBtn);
          tr.append(tdAction);
        }

        resultTableSort.add(tr, {
          index: idx + 1,
          name: r.student_name,
          class: r.class_name,
          correct: Number(r.correct_count),
          score: numScore,
          level: scoreLevel,
          duration: durationSortValue(r.time_taken_seconds),
          submitted: Date.parse(r.submitted_at)
        }, idx);
        rowsEl.append(tr);
      });
      resultTableSort.apply();
    }

    async function fetchResults(reset = true, refreshClassOptions = reset) {
      const requestId = ++resultsRequestId;
      try {
        loadMoreBtn.disabled = true;
        if (reset) {
          clearTimeout(searchTimer);
          ++statsRequestId;
          offset = 0;
          allRows = [];
          rowsEl.replaceChildren();
          loadMoreBtn.hidden = true;
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
        if (refreshClassOptions) await fetchClassOptions(lessonId, requestId);
        if (requestId !== resultsRequestId) return;
        const params = new URLSearchParams({ lessonId, offset: String(offset), search: searchInput.value.trim() });
        if (classFilter.value !== 'ALL') params.set('className', classFilter.value);
        if (reset) fetchStats();
        const data = await api(`/api/teacher?${params}`);
        if (requestId !== resultsRequestId) return;
        
        allRows = reset ? data.rows : [...allRows, ...data.rows];
        offset += data.rows.length;
        loadMoreBtn.hidden = data.rows.length < 100;

        renderTable();
      } catch (e) {
        if (requestId !== resultsRequestId) return;
        tableStatus.textContent = e.message;
        if (e.message.includes('đăng nhập lại') || e.message.includes('hết hạn')) {
          showLogin();
        }
      } finally {
        if (requestId === resultsRequestId) loadMoreBtn.disabled = false;
      }
    }

    async function showDashboard(identity) {
      teacherIdentity = identity;
      await schoolManagement.load(identity);
      tabAccountsBtn.hidden = identity.role !== 'admin';
      tabHistoryBtn.hidden = identity.role !== 'admin';
      document.getElementById('result-actions-heading').hidden = identity.role !== 'admin';
      setEditingMode(false);
      switchTab('lessons');
      updateClassFilterOptions([]);
      loginSection.hidden = true;
      dashboardSection.hidden = false;
      renderAccount(identity);
      personalForm.hidden = true;
      personalEdit.hidden = identity.role !== 'teacher';
      personalStatus.textContent = '';
      accountMenu.open = false;
      accountMenu.hidden = false;
    }

    function renderAccount(identity) {
      const name = identity.displayName || identity.username;
      const words = name.trim().split(/\s+/);
      const first = Array.from(words[0]);
      const initials = words.length > 1 ? first[0] + Array.from(words[words.length - 1])[0] : first.slice(0, 2).join('');
      accountName.textContent = name;
      const details = name === identity.username ? [] : [['Tên đăng nhập', identity.username]];
      if (identity.role === 'admin') {
        details.push(['Vai trò', 'Quản trị viên'], ['Phạm vi', 'Tất cả các trường và lớp']);
      } else {
        if (schoolManagement.name) details.push(['Trường học', schoolManagement.name]);
        details.push(
          ['Môn dạy', identity.subject],
          ['Lớp phụ trách', identity.classes.join(', ') || 'Chưa được giao lớp'],
          ['Quyền học sinh', identity.canEditStudents ? 'Chỉnh sửa' : 'Chỉ xem']
        );
      }
      accountDetails.replaceChildren();
      for (const detail of details) {
        const label = document.createElement('dt');
        const value = document.createElement('dd');
        label.textContent = detail[0];
        value.textContent = detail[1];
        accountDetails.append(label, value);
      }
      avatarInitials.textContent = initials.toLocaleUpperCase('vi');
      avatar.setAttribute('aria-label', `Tài khoản ${name}`);
    }

    personalEdit.addEventListener('click', () => {
      personalForm.reset();
      passwordFields.open = false;
      personalName.value = teacherIdentity.displayName === teacherIdentity.username ? '' : teacherIdentity.displayName;
      personalSubject.value = teacherIdentity.subject;
      personalStatus.textContent = '';
      personalEdit.hidden = true;
      personalForm.hidden = false;
      personalName.focus();
    });

    function closePersonalForm() {
      personalForm.reset();
      personalForm.hidden = true;
      personalEdit.hidden = false;
      personalEdit.focus();
    }
    personalCancel.addEventListener('click', closePersonalForm);

    personalForm.addEventListener('submit', async event => {
      event.preventDefault();
      const controls = Array.from(personalForm.elements);
      if (personalName.disabled) return;
      const data = {
        action: 'update-profile', displayName: personalName.value, subject: personalSubject.value
      };
      const currentPassword = personalForm.elements.namedItem('currentPassword').value;
      const newPassword = personalForm.elements.namedItem('newPassword').value;
      const confirmPassword = personalForm.elements.namedItem('confirmPassword').value;
      if (passwordFields.open && (currentPassword || newPassword || confirmPassword)) {
        if (!currentPassword || newPassword.length < 12 || newPassword !== confirmPassword) {
          personalStatus.textContent = 'Nhập mật khẩu hiện tại và xác nhận mật khẩu mới có ít nhất 12 ký tự.';
          return;
        }
        data.currentPassword = currentPassword;
        data.newPassword = newPassword;
      }
      controls.forEach(control => { control.disabled = true; });
      personalStatus.textContent = 'Đang lưu…';
      try {
        const updated = await api('/api/teacher', { method: 'POST', body: JSON.stringify(data) });
        if (updated.passwordChanged) {
          personalForm.reset();
          location.reload();
          return;
        }
        teacherIdentity.displayName = updated.displayName;
        teacherIdentity.subject = updated.subject;
        renderAccount(teacherIdentity);
        closePersonalForm();
        personalStatus.textContent = 'Đã lưu thông tin.';
      } catch (error) {
        personalStatus.textContent = error.message;
      } finally {
        controls.forEach(control => { control.disabled = false; });
      }
    });

    logoutBtn.addEventListener('click', async () => {
      logoutBtn.disabled = true;
      try {
        await api('/api/teacher', { method: 'POST', body: JSON.stringify({ action: 'logout' }) });
      } catch (error) {
        console.error('Logout error:', error);
      }
      location.reload();
    });

    document.addEventListener('click', event => {
      if (accountMenu.open && !accountMenu.contains(event.target)) accountMenu.open = false;
    });

    accountMenu.addEventListener('keydown', event => {
      if (event.key !== 'Escape' || !accountMenu.open) return;
      event.preventDefault();
      accountMenu.open = false;
      avatar.focus();
    });

    function showLogin() {
      loginSection.hidden = false;
      dashboardSection.hidden = true;
      accountMenu.open = false;
      accountMenu.hidden = true;
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
      const username = document.getElementById('teacher-username').value;
      loginBtn.disabled = true;
      loginBtn.textContent = 'Đang kiểm tra...';
      try {
        const result = await api('/api/teacher', {
          method: 'POST',
          body: JSON.stringify({ action: 'login', username, password })
        });
        document.getElementById('password').value = '';
        await showDashboard(result.teacher);
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
    classFilter.addEventListener('change', () => fetchResults(true, false));
    searchInput.addEventListener('input', () => {
      ++resultsRequestId;
      ++statsRequestId;
      loadMoreBtn.disabled = true;
      rowsEl.replaceChildren();
      tableStatus.textContent = 'Đang lọc kết quả…';
      clearTimeout(searchTimer);
      searchTimer = setTimeout(() => fetchResults(true, false), 250);
    });
    loadMoreBtn.addEventListener('click', () => fetchResults(false));

    function allClassesLabel() {
      return teacherIdentity?.role === 'admin' ? 'Tất cả các lớp' : 'Tất cả lớp được giao';
    }

    function formatScore(value) {
      return Number(value).toFixed(2).replace(/0$/, '');
    }

    function exportScore(value, format) {
      return format === 'xlsx' ? Number(value) : formatScore(value);
    }

    exportBtn.addEventListener('click', async () => {
      try {
        const id = lessonSelect.value;
        if (!id) return;
        const format = document.getElementById('export-format').value;
        const lesson = lessonCatalog.find(item => item.id === id);
        const selectedClass = classFilter.value;
        const keyword = searchInput.value.trim();
        exportBtn.disabled = true;
        exportBtn.textContent = 'Đang xuất…';

        const all = [];
        for (let page = 0; ; page += 100) {
          const params = new URLSearchParams({ lessonId: id, offset: String(page) });
          if (selectedClass !== 'ALL') params.set('className', selectedClass);
          if (keyword) params.set('search', keyword);
          const rows = (await api(`/api/teacher?${params}`)).rows;
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
            exportScore(r.score, format),
            formatDuration(r.time_taken_seconds),
            new Date(r.submitted_at).toLocaleString('vi-VN')
          ])
        ];

        const scopeParts = [lesson ? lesson.title : id, selectedClass !== 'ALL' ? `Lớp ${selectedClass}` : allClassesLabel()];
        if (keyword) scopeParts.push(`Tìm kiếm “${keyword}”`);
        const fileSuffix = selectedClass !== 'ALL' ? `_Lop_${selectedClass}` : '';
        await downloadReport(format, `Ket_Qua_${id}${fileSuffix}`, 'Kết quả luyện tập', scopeParts.join(' · '), lines);
      } catch (e) {
        alert('Lỗi xuất file: ' + e.message);
      } finally {
        exportBtn.disabled = false;
        exportBtn.textContent = '📥 Xuất file';
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
