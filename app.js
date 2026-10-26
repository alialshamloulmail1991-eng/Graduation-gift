// كلمة السر: 27 10 (المسافة اختيارية)
const CORRECT_PASSWORD = '2710';
const form = document.getElementById('passwordForm');
const input = document.getElementById('passwordInput');
const error = document.getElementById('errorMessage');
const lockScreen = document.getElementById('lockScreen');
const giftSite = document.getElementById('giftSite');

form.addEventListener('submit', (event) => {
  event.preventDefault();
  if (input.value.replace(/\s+/g, '') === CORRECT_PASSWORD) {
    lockScreen.classList.add('hidden');
    giftSite.classList.remove('hidden');
    startWelcomeTyping();
    tryAutoplaySong();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } else {
    error.textContent = '•••';
    input.value = '';
    input.focus();
  }
});
input.addEventListener('input', () => { error.textContent = ''; });


// تظهر رسالة التخرج تدريجيًا حرفًا حرفًا عند فتح الموقع.
const welcomeText = document.getElementById('welcomeText');
const welcomeCongrats = document.getElementById('welcomeCongrats');
function typeText(element, text, speed, done) {
  if (!element) { if (done) done(); return; }
  element.textContent = '';
  let index = 0;
  const tick = () => {
    if (index >= text.length) { element.classList.remove('is-typing'); if (done) done(); return; }
    element.textContent += text.charAt(index++);
    setTimeout(tick, speed);
  };
  element.classList.add('is-typing');
  tick();
}
let welcomeTypingStarted = false;
function startWelcomeTyping() {
  if (welcomeTypingStarted) return;
  welcomeTypingStarted = true;
  const mainMessage = 'Today marks the beginning of an exciting new chapter in your life. A chapter filled with new opportunities, beautiful memories, and dreams waiting to come true. May this achievement be the first of many, and may your future be as bright as your ambition. You’ve worked hard to reach this moment, and you deserve every bit of happiness and success that comes your way.';
  const finalMessage = 'Congratulations on your graduation! 🎓';
  typeText(welcomeText, mainMessage, 32, () => typeText(welcomeCongrats, finalMessage, 55));
}

const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');
if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const isDark = document.body.classList.toggle('dark');
    themeIcon.textContent = isDark ? '☀' : '☾';
    themeToggle.setAttribute('aria-label', isDark ? 'الوضع الفاتح' : 'الوضع الداكن');
    document.querySelector('meta[name="theme-color"]').setAttribute('content', isDark ? '#171512' : '#f4eee4');
  });
}

// زر الأغنية العائم في أسفل الشاشة.
const giftSong = document.getElementById('giftSong');
const musicToggle = document.getElementById('musicToggle');
const musicIcon = document.getElementById('musicIcon');
const floatingMusic = document.getElementById('floatingMusic');
function updateMusicButton(isPlaying) {
  musicIcon.textContent = isPlaying ? 'Ⅱ' : '▶';
  musicToggle.setAttribute('aria-label', isPlaying ? 'إيقاف الأغنية' : 'تشغيل الأغنية');
  floatingMusic.classList.toggle('is-playing', isPlaying);
}
async function tryAutoplaySong() {
  try { await giftSong.play(); updateMusicButton(true); }
  catch (_) { updateMusicButton(false); }
}
musicToggle.addEventListener('click', async () => {
  if (giftSong.paused) {
    try { await giftSong.play(); updateMusicButton(true); }
    catch (_) { updateMusicButton(false); }
  } else {
    giftSong.pause();
    updateMusicButton(false);
  }
});
giftSong.addEventListener('pause', () => updateMusicButton(false));
giftSong.addEventListener('play', () => updateMusicButton(true));

// يوقف الموسيقى أثناء الفيديو ويستأنفها بعد انتهاء الفيديو أو إيقافه يدويًا.
const giftVideo = document.getElementById('giftVideo');
if (giftVideo) {
  giftVideo.addEventListener('play', () => {
    giftSong.pause();
    updateMusicButton(false);
  });
  const resumeSong = async () => {
    try { await giftSong.play(); updateMusicButton(true); }
    catch (_) { updateMusicButton(false); }
  };
  giftVideo.addEventListener('ended', resumeSong);
  giftVideo.addEventListener('pause', () => {
    if (!giftVideo.ended && giftVideo.currentTime > 0) resumeSong();
  });
}

// العدّ التنازلي حتى بداية يوم 27 أكتوبر 2026 بالتوقيت المحلي للجهاز.
const giftDate = new Date(2026, 9, 27, 0, 0, 0).getTime();
const countdownGrid = document.getElementById('countdownGrid');
const giftReveal = document.getElementById('giftReveal');
const openGiftBox = document.getElementById('openGiftBox');
const giftMessage = document.getElementById('giftMessage');
let countdownInterval;
function updateCountdown() {
  const remaining = giftDate - Date.now();
  if (remaining <= 0) {
    clearInterval(countdownInterval);
    countdownGrid.classList.add('hidden');
    giftReveal.classList.remove('hidden');
    return;
  }
  const values = [
    Math.floor(remaining / 86400000),
    Math.floor((remaining % 86400000) / 3600000),
    Math.floor((remaining % 3600000) / 60000),
    Math.floor((remaining % 60000) / 1000)
  ];
  ['countDays', 'countHours', 'countMinutes', 'countSeconds'].forEach((id, i) => {
    document.getElementById(id).textContent = String(values[i]).padStart(i ? 2 : 1, '0').replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[d]);
  });
}
updateCountdown();
countdownInterval = setInterval(updateCountdown, 1000);
openGiftBox.addEventListener('click', () => {
  openGiftBox.classList.toggle('opened');
  const isOpen = openGiftBox.classList.contains('opened');
  giftMessage.classList.toggle('hidden', !isOpen);
  openGiftBox.setAttribute('aria-expanded', String(isOpen));
});
