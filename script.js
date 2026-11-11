/**
 * ١١/١١ — تجربة رومانسية تفاعلية بالعامية المصرية
 * ١. تشغيل الأغنية تلقائياً في المقطع من ٢:٣٠ (١٥٠ ثانية) إلى ٣:٤٥ (٢٢٥ ثانية) مع التكرار السلس
 * ٢. عداد الحب المباشر من ١ مايو ٢٠٢٦ الساعة ٢:٣٠ الفجر لحد دلوقتي
 * ٣. بتلات ورد عنابي متساقطة ومتفجرة عند اللمس
 * ٤. عارض صور بالحجم الكامل للأربع صور على الموبايل
 */

document.addEventListener('DOMContentLoaded', () => {
  const START_TIME_SECONDS = 150; // 2:30
  const END_TIME_SECONDS = 225;   // 3:45

  // تاريخ البداية: ١ مايو ٢٠٢٦ الساعة ٢:٣٠ صباحاً (الفجر)
  const LOVE_START_DATE = new Date(2026, 4, 1, 2, 30, 0);

  const body = document.body;
  const introGate = document.getElementById('intro-gate');
  const openGiftBtn = document.getElementById('open-gift-btn');

  const bgAudio = document.getElementById('bg-audio');
  const audioDock = document.getElementById('audio-dock');
  const vinylDisc = document.getElementById('vinyl-disc');
  const toggleAudioBtn = document.getElementById('toggle-audio-btn');
  const audioIcon = document.getElementById('audio-icon');
  const audioStatusText = document.getElementById('audio-status-text');

  const scrollProgress = document.getElementById('scroll-progress');
  const showerRosesBtn = document.getElementById('shower-roses-btn');
  const secretWishReveal = document.getElementById('secret-wish-reveal');

  const lightboxModal = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxClose = document.getElementById('lightbox-close');

  const counterDays = document.getElementById('counter-days');
  const counterHours = document.getElementById('counter-hours');
  const counterMinutes = document.getElementById('counter-minutes');
  const counterSeconds = document.getElementById('counter-seconds');
  const counterMonthsSummary = document.getElementById('counter-months-summary');

  let audioInitialized = false;

  // تحويل الأرقام إلى أرقام عربية (٠١٢٣٤٥٦٧٨٩)
  function toArabicDigits(num) {
    const arabicNumerals = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
    return String(num).replace(/\d/g, (d) => arabicNumerals[Number(d)]);
  }

  // ==========================================================================
  // عداد الوقت المباشر من ١ مايو ٢٠٢٦ الساعة ٢:٣٠ الفجر لحد دلوقتي
  // ==========================================================================
  function updateLoveDurationCounter() {
    if (!counterDays) return;

    const now = new Date();
    const diffMs = Math.max(0, now.getTime() - LOVE_START_DATE.getTime());

    const totalSeconds = Math.floor(diffMs / 1000);
    const totalMinutes = Math.floor(totalSeconds / 60);
    const totalHours = Math.floor(totalMinutes / 60);
    const totalDays = Math.floor(totalHours / 24);

    const hours = totalHours % 24;
    const minutes = totalMinutes % 60;
    const seconds = totalSeconds % 60;

    counterDays.textContent = toArabicDigits(totalDays);
    counterHours.textContent = toArabicDigits(String(hours).padStart(2, '0'));
    counterMinutes.textContent = toArabicDigits(String(minutes).padStart(2, '0'));
    counterSeconds.textContent = toArabicDigits(String(seconds).padStart(2, '0'));

    // حساب الشهور والأيام كملخص رومانسي إضافي
    if (counterMonthsSummary) {
      let months =
        (now.getFullYear() - LOVE_START_DATE.getFullYear()) * 12 +
        (now.getMonth() - LOVE_START_DATE.getMonth());
      let remDays = now.getDate() - LOVE_START_DATE.getDate();

      if (remDays < 0) {
        months -= 1;
        const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
        remDays += prevMonth.getDate();
      }

      if (months > 0) {
        counterMonthsSummary.textContent = `يعني ${toArabicDigits(months)} شهور و ${toArabicDigits(remDays)} يوم من أجمل أيام عمري معاكي ♥`;
      } else {
        counterMonthsSummary.textContent = `${toArabicDigits(totalDays)} يوم من أجمل أيام عمري معاكي ♥`;
      }
    }
  }

  updateLoveDurationCounter();
  setInterval(updateLoveDurationCounter, 1000);

  // ==========================================================================
  // ضبط وتشغيل الأغنية من 2:30 (150 ثانية) إلى 3:45 (225 ثانية)
  // ==========================================================================
  function seekToStartSegment() {
    try {
      if (bgAudio.readyState >= 1) {
        bgAudio.currentTime = START_TIME_SECONDS;
      } else {
        bgAudio.addEventListener(
          'loadedmetadata',
          () => {
            bgAudio.currentTime = START_TIME_SECONDS;
          },
          { once: true }
        );
      }
    } catch (_) {}
  }

  seekToStartSegment();

  function fadeInAudio(targetVolume = 0.92, durationMs = 1500) {
    bgAudio.volume = 0.06;
    const steps = 20;
    const stepTime = durationMs / steps;
    const volumeStep = (targetVolume - 0.06) / steps;
    let currentStep = 0;

    const interval = setInterval(() => {
      currentStep++;
      bgAudio.volume = Math.min(targetVolume, bgAudio.volume + volumeStep);
      if (currentStep >= steps) {
        clearInterval(interval);
      }
    }, stepTime);
  }

  function updateAudioUI(isPlaying) {
    if (isPlaying) {
      audioDock.classList.add('playing');
      vinylDisc.classList.add('spinning');
      audioIcon.textContent = '❚❚';
      if (audioStatusText) audioStatusText.textContent = 'شغالة علشانك';
    } else {
      audioDock.classList.remove('playing');
      vinylDisc.classList.remove('spinning');
      audioIcon.textContent = '▶';
      if (audioStatusText) audioStatusText.textContent = 'اضغطي للتشغيل';
    }
  }

  function playSegment() {
    try {
      bgAudio.currentTime = START_TIME_SECONDS;
    } catch (_) {}

    const playPromise = bgAudio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          if (
            (bgAudio.currentTime < START_TIME_SECONDS || bgAudio.currentTime >= END_TIME_SECONDS) &&
            !audioInitialized
          ) {
            try {
              bgAudio.currentTime = START_TIME_SECONDS;
            } catch (_) {}
          }
          audioInitialized = true;
          fadeInAudio();
          updateAudioUI(true);
        })
        .catch(() => {
          updateAudioUI(false);
        });
    }
  }

  // فتح الهدية من شاشة البداية
  function openExperience() {
    if (introGate.classList.contains('opened')) return;

    introGate.classList.add('opened');
    body.classList.remove('locked');
    audioDock.classList.remove('hidden-dock');

    playSegment();

    spawnPetalBurst(window.innerWidth / 2, window.innerHeight / 2, 36);
  }

  openGiftBtn.addEventListener('click', openExperience);

  function toggleAudio() {
    if (bgAudio.paused) {
      if (!audioInitialized) {
        playSegment();
      } else {
        if (bgAudio.currentTime < START_TIME_SECONDS || bgAudio.currentTime >= END_TIME_SECONDS) {
          bgAudio.currentTime = START_TIME_SECONDS;
        }
        bgAudio.play().then(() => updateAudioUI(true)).catch(() => {});
      }
    } else {
      bgAudio.pause();
      updateAudioUI(false);
    }
  }

  toggleAudioBtn.addEventListener('click', toggleAudio);
  vinylDisc.addEventListener('click', toggleAudio);

  bgAudio.addEventListener('timeupdate', () => {
    if (bgAudio.currentTime >= END_TIME_SECONDS || (audioInitialized && bgAudio.currentTime < START_TIME_SECONDS - 1)) {
      bgAudio.currentTime = START_TIME_SECONDS;
      if (bgAudio.paused) {
        bgAudio.play().catch(() => {});
      }
    }
  });

  bgAudio.addEventListener('ended', () => {
    bgAudio.currentTime = START_TIME_SECONDS;
    bgAudio.play().catch(() => {});
  });

  // ==========================================================================
  // عارض الصور بالحجم الكامل (Lightbox)
  // ==========================================================================
  document.querySelectorAll('[data-lightbox]').forEach((item) => {
    item.addEventListener('click', (e) => {
      const src = item.getAttribute('data-lightbox');
      const caption = item.getAttribute('data-caption') || '';
      if (!src) return;

      lightboxImg.src = src;
      lightboxCaption.textContent = caption;
      lightboxModal.classList.add('active');
      lightboxModal.setAttribute('aria-hidden', 'false');
      spawnPetalBurst(e.clientX || window.innerWidth / 2, e.clientY || window.innerHeight / 2, 20);
    });
  });

  function closeLightbox() {
    lightboxModal.classList.remove('active');
    lightboxModal.setAttribute('aria-hidden', 'true');
  }

  if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
  }

  if (lightboxModal) {
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) {
        closeLightbox();
      }
    });
  }

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightboxModal.classList.contains('active')) {
      closeLightbox();
    }
  });

  // ==========================================================================
  // حركات الظهور عند التمرير وشريط التقدم
  // ==========================================================================
  const revealElements = document.querySelectorAll('.reveal-up, .reveal-scale, .bloom-svg');

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: '0px 0px -30px 0px',
    }
  );

  revealElements.forEach((el) => revealObserver.observe(el));

  window.addEventListener(
    'scroll',
    () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      scrollProgress.style.width = `${Math.min(100, Math.max(0, progress))}%`;
    },
    { passive: true }
  );

  // تفاعل الكروت
  const traitCards = document.querySelectorAll('.trait-card');
  traitCards.forEach((card) => {
    card.addEventListener('click', () => {
      traitCards.forEach((c) => c.classList.remove('active-trait'));
      card.classList.add('active-trait');
    });
  });

  // ==========================================================================
  // زر الختام لمطر الورد والوعد الأخير
  // ==========================================================================
  if (showerRosesBtn) {
    showerRosesBtn.addEventListener('click', () => {
      secretWishReveal.classList.add('revealed');
      const rect = showerRosesBtn.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      spawnPetalBurst(centerX, centerY, 50);
    });
  }

  document.querySelectorAll('[data-burst="true"]').forEach((item) => {
    item.addEventListener('click', (e) => {
      spawnPetalBurst(e.clientX || window.innerWidth / 2, e.clientY || window.innerHeight / 2, 16);
    });
  });

  // ==========================================================================
  // كانفاس بتلات الورد العنابي المتساقطة
  // ==========================================================================
  const canvas = document.getElementById('petals-canvas');
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const PETAL_COLORS = [
    '#6B0F1A',
    '#871625',
    '#9E2132',
    '#C47D85',
    '#B88B58',
  ];

  const ambientPetals = [];
  const burstPetals = [];
  const AMBIENT_COUNT = window.innerWidth < 600 ? 20 : 34;

  class RosePetal {
    constructor(isBurst = false, startX = 0, startY = 0) {
      this.isBurst = isBurst;
      this.reset(startX, startY);
    }

    reset(startX = 0, startY = 0) {
      this.color = PETAL_COLORS[Math.floor(Math.random() * PETAL_COLORS.length)];
      this.size = Math.random() * 8.5 + 6.5;
      this.angle = Math.random() * Math.PI * 2;
      this.spinSpeed = (Math.random() - 0.5) * 0.03;
      this.flip = Math.random() * Math.PI;
      this.flipSpeed = Math.random() * 0.025 + 0.01;

      if (this.isBurst) {
        this.x = startX;
        this.y = startY;
        const launchAngle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 6 + 2;
        this.vx = Math.cos(launchAngle) * speed;
        this.vy = Math.sin(launchAngle) * speed - 2.2;
        this.gravity = 0.09;
        this.opacity = 0.95;
        this.fadeRate = Math.random() * 0.009 + 0.006;
      } else {
        this.x = Math.random() * width;
        this.y = Math.random() * height - height;
        this.vx = (Math.random() - 0.5) * 0.55;
        this.vy = Math.random() * 0.85 + 0.5;
        this.swayAmp = Math.random() * 0.7 + 0.25;
        this.swayFreq = Math.random() * 0.015 + 0.005;
        this.step = Math.random() * 100;
        this.opacity = Math.random() * 0.42 + 0.22;
      }
    }

    update() {
      this.angle += this.spinSpeed;
      this.flip += this.flipSpeed;

      if (this.isBurst) {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += this.gravity;
        this.vx *= 0.99;
        this.opacity -= this.fadeRate;
      } else {
        this.step += 1;
        this.x += this.vx + Math.sin(this.step * this.swayFreq) * this.swayAmp;
        this.y += this.vy;

        if (this.y > height + 25) {
          this.y = -20;
          this.x = Math.random() * width;
        }
        if (this.x > width + 25) this.x = -20;
        if (this.x < -25) this.x = width + 20;
      }
    }

    draw(context) {
      if (this.opacity <= 0) return;
      context.save();
      context.translate(this.x, this.y);
      context.rotate(this.angle);
      context.scale(1, Math.max(0.25, Math.abs(Math.cos(this.flip))));
      context.globalAlpha = Math.max(0, this.opacity);

      const s = this.size;
      context.beginPath();
      context.moveTo(0, -s);
      context.bezierCurveTo(s * 0.95, -s * 0.9, s * 1.15, s * 0.35, 0, s);
      context.bezierCurveTo(-s * 1.15, s * 0.35, -s * 0.95, -s * 0.9, 0, -s);
      context.closePath();

      context.fillStyle = this.color;
      context.fill();
      context.restore();
    }
  }

  for (let i = 0; i < AMBIENT_COUNT; i++) {
    const p = new RosePetal(false);
    p.y = Math.random() * height;
    ambientPetals.push(p);
  }

  function spawnPetalBurst(x, y, count = 20) {
    for (let i = 0; i < count; i++) {
      burstPetals.push(new RosePetal(true, x, y));
    }
  }

  function animatePetals() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < ambientPetals.length; i++) {
      ambientPetals[i].update();
      ambientPetals[i].draw(ctx);
    }

    for (let i = burstPetals.length - 1; i >= 0; i--) {
      burstPetals[i].update();
      burstPetals[i].draw(ctx);
      if (burstPetals[i].opacity <= 0) {
        burstPetals.splice(i, 1);
      }
    }

    requestAnimationFrame(animatePetals);
  }

  animatePetals();
});
