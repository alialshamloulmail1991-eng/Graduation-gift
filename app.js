// كلمة السر: 27 10، والمسافة اختيارية
const CORRECT_PASSWORD = "2710";
const form = document.getElementById("passwordForm");
const input = document.getElementById("passwordInput");
const error = document.getElementById("errorMessage");

form.addEventListener("submit", (event) => {
  event.preventDefault();
  if (input.value.replace(/\s+/g, "") === CORRECT_PASSWORD) {
    document.getElementById("lockScreen").classList.add("hidden");
    document.getElementById("giftSite").classList.remove("hidden");
    document.title = "حكاية تخرّجها ✦";
    tryAutoplaySong();
    window.scrollTo({ top: 0, behavior: "smooth" });
  } else {
    error.textContent = "كلمة السر مش صحيحة، جرّبي تاني 🤍";
    input.value = "";
    input.focus();
  }
});
input.addEventListener("input", () => { error.textContent = ""; });

const themeToggle = document.getElementById("themeToggle");
const themeIcon = document.getElementById("themeIcon");
themeToggle.addEventListener("click", () => {
  const isDark = document.body.classList.toggle("dark");
  themeIcon.textContent = isDark ? "☀" : "☾";
  themeToggle.setAttribute("aria-label", isDark ? "التبديل للوضع الفاتح" : "التبديل للوضع الداكن");
  document.querySelector('meta[name="theme-color"]').setAttribute("content", isDark ? "#171512" : "#f4eee4");
});


// مشغل أغنية الخلفية: يحاول التشغيل بعد فتح الهدية، مع زر ثابت أسفل الشاشة.
const giftSong = document.getElementById("giftSong");
const musicToggle = document.getElementById("musicToggle");
const musicIcon = document.getElementById("musicIcon");
const musicStatus = document.getElementById("musicStatus");
const floatingMusic = document.getElementById("floatingMusic");

function updateMusicButton(isPlaying) {
  musicIcon.textContent = isPlaying ? "Ⅱ" : "▶";
  musicToggle.setAttribute("aria-label", isPlaying ? "إيقاف الأغنية" : "تشغيل الأغنية");
  musicToggle.title = isPlaying ? "إيقاف الأغنية" : "تشغيل الأغنية";
  floatingMusic.classList.toggle("is-playing", isPlaying);
  musicStatus.textContent = isPlaying ? "الأغنية شغّالة في الخلفية 🎵" : "الأغنية متوقفة مؤقتًا";
}

async function tryAutoplaySong() {
  try {
    await giftSong.play();
    updateMusicButton(true);
  } catch (_) {
    // بعض المتصفحات تمنع التشغيل التلقائي؛ الزر يظل متاحًا للمستخدمة.
    musicStatus.textContent = "اضغطي زر الأغنية أسفل الشاشة لتشغيلها.";
    updateMusicButton(false);
  }
}

musicToggle.addEventListener("click", async () => {
  if (giftSong.paused) {
    try { await giftSong.play(); updateMusicButton(true); }
    catch (_) { musicStatus.textContent = "تعذّر التشغيل؛ جرّبي الضغط مرة تانية."; }
  } else {
    giftSong.pause();
    updateMusicButton(false);
  }
});
giftSong.addEventListener("pause", () => updateMusicButton(false));
giftSong.addEventListener("play", () => updateMusicButton(true));


// مزامنة صوت الخلفية مع الفيديو: عند بدء الفيديو تتوقف الأغنية،
// وعند انتهاء الفيديو أو إيقافه يدويًا نحاول استئناف الأغنية.
const giftVideo = document.querySelector('.video-frame video');
if (giftVideo) {
  giftVideo.addEventListener('play', () => {
    if (!giftSong.paused) giftSong.pause();
    updateMusicButton(false);
    musicStatus.textContent = 'الفيديو شغّال؛ الأغنية متوقفة مؤقتًا.';
  });

  const resumeSongAfterVideo = async () => {
    try {
      await giftSong.play();
      updateMusicButton(true);
    } catch (_) {
      updateMusicButton(false);
      musicStatus.textContent = 'الفيديو وقف. اضغطي زر الأغنية أسفل الشاشة لاستكمالها.';
    }
  };

  giftVideo.addEventListener('ended', resumeSongAfterVideo);
  giftVideo.addEventListener('pause', () => {
    // لا نستأنف الأغنية إذا كان الفيديو انتهى؛ حدث ended يتولى ذلك.
    if (!giftVideo.ended && !giftSong.paused) return;
    if (!giftVideo.ended) resumeSongAfterVideo();
  });
}


// عدّ تنازلي لموعد الهدية: 27 أكتوبر 2026، منتصف الليل بتوقيت مصر (+02:00).
const giftDate = new Date(2026, 9, 27, 0, 0, 0).getTime();
const countdownGrid = document.getElementById('countdownGrid');
const countdownIntro = document.getElementById('countdownIntro');
const countdownWhisper = document.getElementById('countdownWhisper');
const giftReveal = document.getElementById('giftReveal');
const openGiftBox = document.getElementById('openGiftBox');
const giftInstruction = document.getElementById('giftInstruction');
const giftMessage = document.getElementById('giftMessage');
let countdownInterval;
function updateCountdown(){
  const remaining = giftDate - Date.now();
  if (remaining <= 0) {
    clearInterval(countdownInterval);
    countdownGrid.classList.add('hidden');
    countdownIntro.textContent = 'وصل اليوم المنتظر… ٢٧ أكتوبر ٢٠٢٦';
    countdownWhisper.textContent = 'دلوقتي جه وقت المفاجأة ♡';
    giftReveal.classList.remove('hidden');
    return;
  }
  const days = Math.floor(remaining / 86400000);
  const hours = Math.floor((remaining % 86400000) / 3600000);
  const minutes = Math.floor((remaining % 3600000) / 60000);
  const seconds = Math.floor((remaining % 60000) / 1000);
  document.getElementById('countDays').textContent = days.toLocaleString('ar-EG');
  document.getElementById('countHours').textContent = String(hours).padStart(2,'0').replace(/\d/g,d=>'٠١٢٣٤٥٦٧٨٩'[d]);
  document.getElementById('countMinutes').textContent = String(minutes).padStart(2,'0').replace(/\d/g,d=>'٠١٢٣٤٥٦٧٨٩'[d]);
  document.getElementById('countSeconds').textContent = String(seconds).padStart(2,'0').replace(/\d/g,d=>'٠١٢٣٤٥٦٧٨٩'[d]);
}
updateCountdown();
countdownInterval = setInterval(updateCountdown, 1000);
openGiftBox.addEventListener('click', () => {
  openGiftBox.classList.add('opened');
  giftInstruction.textContent = 'مفاجأتكِ اتفتحت… والرسالة دي ليكي من القلب ♡';
  giftMessage.classList.remove('hidden');
  openGiftBox.setAttribute('aria-expanded','true');
});
