import './compat.js';
    import { selectIncorrectQuestions } from '../lib/retry-questions.js';
function createAttemptId() {
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  bytes[6] = (bytes[6] & 15) | 64;
  bytes[8] = (bytes[8] & 63) | 128;
  const hex = Array.from(bytes, value => ('0' + value.toString(16)).slice(-2)).join('');
  return [hex.slice(0, 8), hex.slice(8, 12), hex.slice(12, 16), hex.slice(16, 20), hex.slice(20)].join('-');
}

async function initializeQuiz() {
    /**
     * =========================================================================
     * 0. KẾT NỐI ĐỒNG BỘ DỮ LIỆU TRỰC TUYẾN (Học sinh nộp bài -> Giáo viên xem)
     * =========================================================================
     */
    const lessonId = new URLSearchParams(location.search).get("bai") || "lop-4-bai-6";
    if (!/^[a-z0-9-]+$/.test(lessonId)) throw new Error("Mã bài học không hợp lệ");
    const lessonResponse = await fetch(`/lessons/${lessonId}.json`);
    if (!lessonResponse.ok) throw new Error("Không tải được bài học");
    const lesson = await lessonResponse.json();
    if (!Array.isArray(lesson.questions) || !lesson.questions.length || lesson.questions.some(q => !Array.isArray(q.options) || q.correctIndex < 0 || q.correctIndex >= q.options.length)) throw new Error("Dữ liệu câu hỏi không hợp lệ");
    /**
     * =========================================================================
     * 1. CẤU HÌNH BÀI HỌC (20 câu trắc nghiệm • 10 phút • 0,5 điểm/câu)
     * =========================================================================
     */
    const LESSON_CONFIG = lesson;
    const QUESTIONS = lesson.questions;

    /**
     * Xáo trộn mảng tại chỗ (Fisher-Yates shuffle) và trả về chính mảng đó.
     */
    function shuffle(arr) {
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const previous = arr[i];
        arr[i] = arr[j];
        arr[j] = previous;
      }
      return arr;
    }

    /**
     * Tạo bộ câu hỏi đã xáo trộn: thứ tự câu hỏi ngẫu nhiên,
     * đáp án trong mỗi câu cũng ngẫu nhiên, nhưng vẫn giữ ánh xạ
     * về chỉ số gốc (originalQuestionIndex, originalOptionIndices)
     * để chấm điểm và xem lại chính xác.
     */
    let shuffledQuestions = [];

    function buildShuffledQuestions() {
      const questionOrder = shuffle(QUESTIONS.map((_, i) => i));
      shuffledQuestions = questionOrder.map(origQIdx => {
        const q = QUESTIONS[origQIdx];
        // Tạo mảng chỉ số đáp án [0,1,2,3] rồi xáo trộn
        const optionOrder = shuffle(q.options.map((_, i) => i));
        return {
          originalQuestionIndex: origQIdx,
          question: q.question,
          explanation: q.explanation,
          options: optionOrder.map(i => q.options[i]),
          // Vị trí mới của đáp án đúng sau khi xáo trộn
          correctIndex: optionOrder.indexOf(q.correctIndex),
          // Ánh xạ: shuffledOptIdx -> originalOptIdx
          originalOptionIndices: optionOrder
        };
      });
    }

    /**
     * =========================================================================
     * 2. BỘ TẠO HIỆU ỨNG ÂM THANH (WEB AUDIO API)
     * =========================================================================
     */
    class SoundManager {
      constructor() {
        this.enabled = true;
        this.ctx = null;
      }

      initContext() {
        if (!this.ctx) {
          const AudioContextClass = window.AudioContext || window.webkitAudioContext;
          if (AudioContextClass) {
            this.ctx = new AudioContextClass();
          }
        }
        if (this.ctx && this.ctx.state === "suspended") {
          this.ctx.resume();
        }
      }

      toggle() {
        this.enabled = !this.enabled;
        if (this.enabled) {
          this.initContext();
          this.playClick();
        }
        return this.enabled;
      }

      playTone(freq, type, duration, startTimeOffset = 0, volume = 0.14) {
        if (!this.enabled) return;
        this.initContext();
        if (!this.ctx) return;

        const now = this.ctx.currentTime + startTimeOffset;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(volume, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + duration);
      }

      playClick() {
        this.playTone(580, "sine", 0.08, 0, 0.1);
      }

      playCorrect() {
        this.playTone(523.25, "triangle", 0.14, 0, 0.16);
        this.playTone(659.25, "triangle", 0.14, 0.09, 0.16);
        this.playTone(783.99, "triangle", 0.25, 0.18, 0.18);
      }

      playWrong() {
        this.playTone(260, "sawtooth", 0.18, 0, 0.11);
        this.playTone(210, "sawtooth", 0.24, 0.12, 0.11);
      }

      playVictory() {
        const notes = [523.25, 659.25, 783.99, 1046.5];
        notes.forEach((n, i) => {
          this.playTone(n, "triangle", 0.28, i * 0.11, 0.17);
        });
      }
    }

    const soundFX = new SoundManager();

    /**
     * =========================================================================
     * 3. TRẠNG THÁI TRÒ CHƠI & CÁC HÀM TIỆN ÍCH
     * =========================================================================
     */
    const state = {
      studentName: "",
      studentClass: "",
      currentIndex: 0,
      score: 0,
      answered: false,
      userAnswers: [],
      reviewVisible: false,
      timeLeft: LESSON_CONFIG.timeLimitSeconds,
      timerInterval: null,
      timedOut: false,
      submitted: false,
      retryMode: false
    };

    const OPTION_LABELS = ["A", "B", "C", "D"];

    function formatScoreVN(num) {
      return Number(num).toFixed(1).replace(".", ",");
    }

    function formatTimeMMSS(totalSeconds) {
      const safe = Math.max(0, Math.floor(totalSeconds));
      const mins = String(Math.floor(safe / 60)).padStart(2, "0");
      const secs = String(safe % 60).padStart(2, "0");
      return `${mins}:${secs}`;
    }

    function initApp() {
      document.getElementById("header-subject-badge").textContent = LESSON_CONFIG.subjectBadge;
      document.getElementById("header-lesson-title").textContent = LESSON_CONFIG.lessonTitle;
      document.getElementById("welcome-main-title").textContent = LESSON_CONFIG.gameTitle;
      document.getElementById("welcome-lesson-subtitle").textContent = LESSON_CONFIG.lessonTitle;

      const totalQ = QUESTIONS.length;
      const mins = Math.floor(LESSON_CONFIG.timeLimitSeconds / 60);
      const maxScore = totalQ * LESSON_CONFIG.pointsPerQuestion;

      document.getElementById("info-card-questions").textContent = `${totalQ} câu trắc nghiệm`;
      document.getElementById("info-card-time").textContent = `${mins} phút (${LESSON_CONFIG.timeLimitSeconds} giây)`;
      document.getElementById("info-card-scoring").textContent = `${formatScoreVN(LESSON_CONFIG.pointsPerQuestion)} điểm / câu (Tối đa ${maxScore})`;

      const params = new URLSearchParams(window.location.search);
      if (params.get("giaovien") === "1" || params.get("teacher") === "1") {
        location.replace('/teacher');
      }
    }

    function toggleSound() {
      const isOn = soundFX.toggle();
      document.getElementById("sound-icon").textContent = isOn ? "🔊" : "🔇";
      document.getElementById("sound-text").textContent = isOn ? "Âm thanh: Bật" : "Âm thanh: Tắt";
    }

    function showScreen(screenId) {
      ["screen-welcome", "screen-quiz", "screen-result"].forEach(id => {
        document.getElementById(id).classList.add("hidden");
      });
      document.getElementById(screenId).classList.remove("hidden");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }

    function clearFormError() {
      document.getElementById("form-error-banner").classList.add("hidden");
    }

    function showFormError(message) {
      document.getElementById("form-error-text").textContent = message;
      document.getElementById("form-error-banner").classList.remove("hidden");
      soundFX.playWrong();
    }

    function startTimer() {
      stopTimer();
      updateTimerDisplay();

      state.timerInterval = setInterval(() => {
        state.timeLeft -= 1;
        updateTimerDisplay();

        if (state.timeLeft <= 0) {
          stopTimer();
          state.timedOut = true;
          showResults();
        }
      }, 1000);
    }

    function stopTimer() {
      if (state.timerInterval) {
        clearInterval(state.timerInterval);
        state.timerInterval = null;
      }
    }

    function updateTimerDisplay() {
      const timerBox = document.getElementById("quiz-timer-box");
      const timerText = document.getElementById("quiz-timer-text");
      timerText.textContent = formatTimeMMSS(state.timeLeft);

      if (state.timeLeft <= 60) {
        timerBox.className = "bg-red-100 border border-red-400 text-red-700 font-black text-xs sm:text-sm px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 timer-urgent";
      } else {
        timerBox.className = "bg-[#ecfdf5] border border-[#6ee7b7] text-[#065f46] font-black text-xs sm:text-sm px-3.5 py-1.5 rounded-xl flex items-center gap-1.5";
      }
    }

    /**
     * =========================================================================
     * 4. LOGIC LÀM BÀI TRẮC NGHIỆM (20 CÂU • 10 PHÚT • 0,5 ĐIỂM/CÂU)
     * =========================================================================
     */
    function startGame() {
      const nameInput = document.getElementById("student-name-input");
      const classInput = document.getElementById("student-class-input");

      const cleanName = nameInput.value.trim();
      const cleanClass = classInput.value.trim().toUpperCase();

      if (!cleanName) {
        showFormError("Em hãy nhập Họ và tên học sinh trước khi bấm Bắt đầu nhé!");
        nameInput.focus();
        return;
      }
      if (!cleanClass) {
        showFormError("Em hãy nhập tên Lớp học (ví dụ: 4A1) trước khi bấm Bắt đầu nhé!");
        classInput.focus();
        return;
      }

      clearFormError();
      soundFX.initContext();
      soundFX.playClick();

      state.studentName = cleanName;
      state.studentClass = cleanClass;
      state.currentIndex = 0;
      state.score = 0;
      state.answered = false;
      state.userAnswers = [];
      state.reviewVisible = false;
      state.timeLeft = LESSON_CONFIG.timeLimitSeconds;
      state.timedOut = false;
      state.submitted = false;
      state.retryMode = false;

      buildShuffledQuestions();

      document.getElementById("quiz-student-badge").textContent = `👤 ${state.studentName} • Lớp ${state.studentClass}`;
      document.getElementById("review-container").classList.add("hidden");
      document.getElementById("toggle-review-text").textContent = "Xem lại bài làm";

      showScreen("screen-quiz");
      renderQuestion();
      startTimer();
    }

    function restartGame() {
      soundFX.playClick();
      stopTimer();
      showScreen("screen-welcome");
    }

    function retryWrongQuestions() {
      const remaining = selectIncorrectQuestions(shuffledQuestions, state.userAnswers);
      if (!state.submitted || remaining.length === 0) return;
      soundFX.playClick();
      shuffledQuestions = shuffle([...remaining]);
      state.retryMode = true;
      state.currentIndex = 0;
      state.score = 0;
      state.answered = false;
      state.userAnswers = [];
      state.reviewVisible = false;
      state.timeLeft = LESSON_CONFIG.timeLimitSeconds;
      state.timedOut = false;
      state.submitted = false;
      document.getElementById('review-container').classList.add('hidden');
      document.getElementById('toggle-review-text').textContent = 'Xem lại bài làm';
      showScreen('screen-quiz');
      renderQuestion();
      startTimer();
    }

    function renderDotsBar() {
      const container = document.getElementById("quiz-dots-bar");
      container.innerHTML = "";

      shuffledQuestions.forEach((_, idx) => {
        const dot = document.createElement("div");
        const answerRecord = state.userAnswers[idx];

        let classes = "h-6 sm:h-7 rounded-md flex items-center justify-center text-[10px] sm:text-xs font-extrabold transition-all ";
        if (answerRecord) {
          classes += answerRecord.isCorrect
            ? "bg-[#10b981] text-white"
            : "bg-red-500 text-white";
        } else if (idx === state.currentIndex) {
          classes += "bg-[#a7f3d0] text-[#064e3b] ring-2 ring-[#059669]";
        } else {
          classes += "bg-slate-100 text-slate-500";
        }

        dot.className = classes;
        dot.textContent = idx + 1;
        container.appendChild(dot);
      });
    }

    function renderQuestion() {
      const qObj = shuffledQuestions[state.currentIndex];
      const total = shuffledQuestions.length;
      state.answered = false;

      document.getElementById("quiz-progress-badge").textContent = `Câu ${state.currentIndex + 1} / ${total}`;
      document.getElementById("quiz-score-text").textContent = `Điểm luyện tập: ${formatScoreVN(state.score)}`;
      document.getElementById("question-number-pill").textContent = `Câu ${state.currentIndex + 1}`;
      document.getElementById("question-text").textContent = qObj.question;

      renderDotsBar();

      document.getElementById("feedback-box").classList.add("hidden");
      document.getElementById("next-question-btn").classList.add("hidden");

      const optionsContainer = document.getElementById("options-container");
      optionsContainer.innerHTML = "";

      qObj.options.forEach((optText, idx) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "option-card w-full text-left bg-white border-2 border-slate-200 rounded-2xl p-3.5 sm:p-4 flex items-center gap-3 cursor-pointer";
        btn.onclick = () => selectAnswer(idx);

        btn.innerHTML = `
          <span class="option-letter w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#ecfdf5] border border-[#6ee7b7] text-[#059669] font-black text-sm flex items-center justify-center shrink-0">
            ${OPTION_LABELS[idx]}
          </span>
          <span class="font-bold text-slate-800 text-xs sm:text-sm md:text-base leading-snug">
            ${optText}
          </span>
        `;

        optionsContainer.appendChild(btn);
      });
    }

    function selectAnswer(selectedIdx) {
      if (state.answered) return;
      state.answered = true;

      const qObj = shuffledQuestions[state.currentIndex];
      const isCorrect = selectedIdx === qObj.correctIndex;

      if (isCorrect) {
        state.score = Math.round((state.score + LESSON_CONFIG.pointsPerQuestion) * 10) / 10;
        soundFX.playCorrect();
      } else {
        soundFX.playWrong();
      }

      state.userAnswers[state.currentIndex] = {
        questionIndex: state.currentIndex,
        selectedIndex: selectedIdx,
        isCorrect
      };

      document.getElementById("quiz-score-text").textContent = `Điểm luyện tập: ${formatScoreVN(state.score)}`;
      renderDotsBar();

      const buttons = document.querySelectorAll("#options-container button");
      buttons.forEach((btn, idx) => {
        btn.disabled = true;
        btn.classList.add("cursor-default");
        const letterBadge = btn.querySelector(".option-letter");

        if (idx === qObj.correctIndex) {
          btn.classList.add("option-correct");
          letterBadge.className = "option-letter w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-green-600 text-white font-black text-sm flex items-center justify-center shrink-0";
          letterBadge.textContent = "✓";
        } else if (idx === selectedIdx && !isCorrect) {
          btn.classList.add("option-wrong");
          letterBadge.className = "option-letter w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-red-600 text-white font-black text-sm flex items-center justify-center shrink-0";
          letterBadge.textContent = "✕";
        } else {
          btn.classList.add("opacity-60");
        }
      });

      const feedbackBox = document.getElementById("feedback-box");
      const feedbackIcon = document.getElementById("feedback-icon");
      const feedbackTitle = document.getElementById("feedback-title");
      const feedbackExplanation = document.getElementById("feedback-explanation");

      feedbackBox.classList.remove("hidden", "bg-green-50", "border-green-400", "text-green-900", "bg-amber-50", "border-amber-400", "text-amber-950");

      if (isCorrect) {
        feedbackBox.classList.add("bg-green-50", "border-green-400", "text-green-900");
        feedbackIcon.textContent = "🎉";
        feedbackTitle.textContent = `Chính xác! +${formatScoreVN(LESSON_CONFIG.pointsPerQuestion)} điểm`;
      } else {
        feedbackBox.classList.add("bg-amber-50", "border-amber-400", "text-amber-950");
        feedbackIcon.textContent = "💡";
        feedbackTitle.textContent = `Chưa đúng rồi! Đáp án đúng là ${OPTION_LABELS[qObj.correctIndex]}.`;
      }

      feedbackExplanation.textContent = qObj.explanation;

      const nextBtn = document.getElementById("next-question-btn");
      const nextLabel = document.getElementById("next-btn-label");
      nextLabel.textContent = state.currentIndex < shuffledQuestions.length - 1 ? "Câu tiếp theo" : "Hoàn thành & Xem điểm";
      nextBtn.classList.remove("hidden");
    }

    function nextQuestion() {
      soundFX.playClick();
      if (state.currentIndex < shuffledQuestions.length - 1) {
        state.currentIndex += 1;
        renderQuestion();
      } else {
        showResults();
      }
    }

    async function showResults() {
      if (state.submitted) return;
      state.submitted = true;
      stopTimer();
      showScreen("screen-result");
      soundFX.playVictory();
      launchConfetti();

      const totalQuestions = shuffledQuestions.length;
      const maxScore = totalQuestions * LESSON_CONFIG.pointsPerQuestion;
      const correctCount = state.userAnswers.filter(a => a && a.isCorrect).length;
      const timeUsedSeconds = LESSON_CONFIG.timeLimitSeconds - Math.max(0, state.timeLeft);
      const timeUsedFormatted = formatTimeMMSS(timeUsedSeconds);
      const finalScoreStr = formatScoreVN(state.score);

      document.getElementById("result-student-name").textContent = state.studentName;
      document.getElementById("result-student-class").textContent = state.studentClass;
      document.getElementById("result-correct-count").textContent = `${correctCount} / ${totalQuestions}`;
      document.getElementById("result-time-taken").textContent = timeUsedFormatted;
      document.getElementById("result-score").textContent = `${finalScoreStr} / ${maxScore}`;
      const remaining = selectIncorrectQuestions(shuffledQuestions, state.userAnswers);
      const retryButton = document.getElementById('retry-wrong-btn');
      retryButton.classList.toggle('hidden', remaining.length === 0);
      document.getElementById('retry-wrong-text').textContent = `Ôn lại ${remaining.length} câu chưa đúng`;

      const timeoutBanner = document.getElementById("result-timeout-banner");
      if (state.timedOut) {
        timeoutBanner.classList.remove("hidden");
      } else {
        timeoutBanner.classList.add("hidden");
      }

      const starsEl = document.getElementById("result-stars");
      const titleEl = document.getElementById("result-title");
      const subtitleEl = document.getElementById("result-subtitle");

      if (state.score >= maxScore * 0.8) {
        starsEl.innerHTML = "⭐⭐⭐";
        titleEl.textContent = `Xuất sắc! Chúc mừng ${state.studentName}!`;
        subtitleEl.textContent = "Em đã nắm rất vững nội dung bài học!";
      } else if (state.score >= maxScore * 0.5) {
        starsEl.innerHTML = "⭐⭐<span class='opacity-30'>⭐</span>";
        titleEl.textContent = `Giỏi lắm! ${state.studentName} làm bài rất tốt!`;
        subtitleEl.textContent = "Em đã hiểu được nhiều nội dung quan trọng. Hãy xem lại các câu chưa đúng để đạt điểm 10 tối đa nhé!";
      } else {
        starsEl.innerHTML = "⭐<span class='opacity-30'>⭐⭐</span>";
        titleEl.textContent = `Hoàn thành! Cố gắng thêm nhé ${state.studentName}!`;
        subtitleEl.textContent = "Không sao cả! Em hãy đọc phần giải thích bên dưới và thử chinh phục lại từ đầu nhé!";
      }

      renderReviewList();


      const statusBanner = document.getElementById("result-submit-status");
      if (state.retryMode) {
        statusBanner.textContent = '🎯 Lượt ôn lại chỉ để luyện tập, không ghi thêm vào bảng điểm.';
        statusBanner.className = 'mt-3 text-center text-xs font-extrabold text-[#047857]';
        return;
      }
      statusBanner.textContent = "📤 Đang gửi kết quả làm bài tới thầy/cô giáo...";
      statusBanner.className = "mt-3 text-center text-xs font-extrabold text-[#047857]";

      const saveResult = await saveStudentRecordCloud(state.studentName, state.studentClass, timeUsedSeconds);

      if (saveResult.ok) {
        statusBanner.textContent = "✅ Đã gửi kết quả thành công tới thầy/cô giáo!";
        statusBanner.className = "mt-3 text-center text-xs font-extrabold text-[#059669]";
      } else {
        statusBanner.textContent = saveResult.rateLimited
          ? "⚠️ Hệ thống đang nhận quá nhiều bài. Em hãy chụp màn hình phiếu điểm và báo thầy/cô."
          : "⚠️ Chưa gửi được kết quả. Em hãy chụp màn hình phiếu điểm và báo thầy/cô.";
        statusBanner.className = "mt-3 text-center text-xs font-extrabold text-red-700";
      }
    }

    function toggleReviewList() {
      soundFX.playClick();
      state.reviewVisible = !state.reviewVisible;
      const container = document.getElementById("review-container");
      const btnText = document.getElementById("toggle-review-text");

      if (state.reviewVisible) {
        container.classList.remove("hidden");
        btnText.textContent = "Ẩn chi tiết bài làm";
      } else {
        container.classList.add("hidden");
        btnText.textContent = "Xem lại bài làm";
      }
    }

    function renderReviewList() {
      const list = document.getElementById("review-list");
      list.innerHTML = "";

      shuffledQuestions.forEach((qObj, idx) => {
        const ans = state.userAnswers[idx];
        const isCorrect = ans ? ans.isCorrect : false;
        const userChoiceText = ans
          ? `${OPTION_LABELS[ans.selectedIndex]}. ${qObj.options[ans.selectedIndex]}`
          : "Chưa trả lời (hết giờ)";
        const correctText = `${OPTION_LABELS[qObj.correctIndex]}. ${qObj.options[qObj.correctIndex]}`;

        const item = document.createElement("div");
        item.className = `rounded-2xl p-4 border-2 ${isCorrect ? "bg-green-50/70 border-green-300" : "bg-red-50/60 border-red-300"}`;

        item.innerHTML = `
          <div class="flex items-center justify-between gap-2 mb-1.5">
            <span class="font-black text-xs sm:text-sm text-[#064e3b]">Câu ${idx + 1}: ${qObj.question}</span>
            <span class="text-xs font-extrabold px-2.5 py-0.5 rounded-full shrink-0 ${isCorrect ? "bg-green-200 text-green-900" : "bg-red-200 text-red-900"}">
              ${isCorrect ? `✓ Đúng (+${formatScoreVN(LESSON_CONFIG.pointsPerQuestion)})` : "✕ Sai"}
            </span>
          </div>
          <p class="text-xs sm:text-sm font-bold text-slate-700 mb-1">
            • Em đã chọn: <span class="${isCorrect ? "text-green-700" : "text-red-700"}">${userChoiceText}</span>
          </p>
          ${!isCorrect ? `<p class="text-xs sm:text-sm font-bold text-green-800 mb-1">• Đáp án đúng: <span>${correctText}</span></p>` : ""}
          <p class="text-xs text-slate-600 font-semibold italic mt-1">💡 ${qObj.explanation}</p>
        `;

        list.appendChild(item);
      });
    }

    /**
     * =========================================================================
     * 5. GỬI KẾT QUẢ LUYỆN TẬP
     * =========================================================================
     */
    async function saveStudentRecordCloud(name, className, timeUsedSeconds) {
      try {
        // Ánh xạ đáp án từ thứ tự xáo trộn về thứ tự gốc để server chấm đúng
        const originalAnswers = new Array(QUESTIONS.length).fill(null);
        shuffledQuestions.forEach((sq, shuffledIdx) => {
          const ans = state.userAnswers[shuffledIdx];
          if (ans && ans.selectedIndex != null) {
            // Chuyển chỉ số đáp án xáo trộn -> chỉ số đáp án gốc
            originalAnswers[sq.originalQuestionIndex] = sq.originalOptionIndices[ans.selectedIndex];
          }
        });
        const response = await fetch('/api/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: createAttemptId(), lessonId, name, className,
            answers: originalAnswers,
            timeTakenSeconds: typeof timeUsedSeconds === 'number' ? Math.max(0, Math.round(timeUsedSeconds)) : null
          })
        });
        return { ok: response.ok, rateLimited: response.status === 429 };
      } catch (e) {
        console.error('Không thể gửi kết quả:', e);
        return { ok: false, rateLimited: false };
      }
    }

    /**
     * =========================================================================
     * 6. HIỆU ỨNG PHÁO GIẤY CHÚC MỪNG HOÀN THÀNH
     * =========================================================================
     */
    function launchConfetti() {
      const canvas = document.getElementById("confetti-canvas");
      const ctx = canvas.getContext("2d");
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      const colors = ["#10b981", "#34d399", "#fbbf24", "#38bdf8", "#f472b6", "#a78bfa"];
      const pieces = Array.from({ length: 85 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * -canvas.height,
        w: 8 + Math.random() * 7,
        h: 5 + Math.random() * 6,
        color: colors[Math.floor(Math.random() * colors.length)],
        speedY: 2.5 + Math.random() * 3.5,
        speedX: -1.5 + Math.random() * 3,
        angle: Math.random() * Math.PI * 2,
        spin: -0.08 + Math.random() * 0.16
      }));

      let frames = 0;
      function animate() {
        frames += 1;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        pieces.forEach(p => {
          p.y += p.speedY;
          p.x += p.speedX;
          p.angle += p.spin;

          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.angle);
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
          ctx.restore();
        });

        if (frames < 170) {
          requestAnimationFrame(animate);
        } else {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
      }

      animate();
    }

    // Gắn toàn bộ hàm xử lý lên window để các sự kiện HTML gọi được
    Object.assign(window, {
      toggleSound,
      clearFormError,
      startGame,
      restartGame,
      selectAnswer,
      nextQuestion,
      toggleReviewList,
      retryWrongQuestions
    });

    if (document.readyState === "loading") window.addEventListener("DOMContentLoaded", initApp); else initApp();
}

initializeQuiz().catch(() => {
  document.getElementById('quiz-load-error').hidden = false;
});
