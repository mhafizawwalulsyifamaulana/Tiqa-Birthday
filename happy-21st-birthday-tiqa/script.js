(() => {
  "use strict";

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  // ---------- Background / particles ----------
  const bg = $(".site-bg");
  let scrollTimer;
  window.addEventListener("scroll", () => {
    bg.classList.add("is-scrolling");
    clearTimeout(scrollTimer);
    scrollTimer = setTimeout(() => bg.classList.remove("is-scrolling"), 180);
  }, { passive: true });

  const canvas = $("#particleCanvas");
  const ctx = canvas.getContext("2d");
  const particles = [];
  const particleCount = Math.min(55, Math.floor(window.innerWidth / 22));

  function resizeCanvas() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = innerWidth * dpr;
    canvas.height = innerHeight * dpr;
    canvas.style.width = innerWidth + "px";
    canvas.style.height = innerHeight + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  resizeCanvas();
  addEventListener("resize", resizeCanvas);

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * innerWidth, y: Math.random() * innerHeight,
      r: Math.random() * 2.2 + .4, speed: Math.random() * .22 + .06,
      alpha: Math.random() * .45 + .12, drift: Math.random() * .3 - .15
    });
  }
  function drawParticles() {
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    particles.forEach(p => {
      p.y -= p.speed; p.x += p.drift;
      if (p.y < -5) p.y = innerHeight + 5;
      if (p.x < -5) p.x = innerWidth + 5;
      if (p.x > innerWidth + 5) p.x = -5;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${p.alpha})`;
      ctx.fill();
    });
    requestAnimationFrame(drawParticles);
  }
  drawParticles();

  // ---------- Scroll reveal ----------
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: .13, rootMargin: "0px 0px -6% 0px" });
  $$(".reveal").forEach(el => observer.observe(el));

  // ---------- Background parallax ----------
  let ticking = false;
  addEventListener("scroll", () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const y = Math.min(scrollY * .045, 80);
      bg.style.backgroundPosition = `center calc(50% + ${y}px)`;
      ticking = false;
    });
  }, { passive: true });

  // ---------- Birthday background audio ----------
  const birthdayAudio = new Audio("audio/happy-birthday.mp3");
  birthdayAudio.loop = true;
  birthdayAudio.volume = 0.48;
  const startGate = $("#startGate");
  const startBtn = $("#startBtn");
  const audioToggle = $("#audioToggle");

  async function playBirthday() {
    try {
      await birthdayAudio.play();
      document.body.classList.add("audio-playing");
      audioToggle.querySelector(".audio-icon").textContent = "Ⅱ";
    } catch (_) {}
  }
  function pauseBirthday() {
    birthdayAudio.pause();
    document.body.classList.remove("audio-playing");
    audioToggle.querySelector(".audio-icon").textContent = "♫";
  }

  startBtn.addEventListener("click", async () => {
    startGate.classList.add("hidden");
    await playBirthday();
    document.querySelector("#message").scrollIntoView({ behavior: "smooth" });
  });
  audioToggle.addEventListener("click", () => {
    birthdayAudio.paused ? playBirthday() : pauseBirthday();
  });
  ["pointerdown", "keydown", "touchstart"].forEach(evt => {
    window.addEventListener(evt, () => {
      if (startGate.classList.contains("hidden")) playBirthday();
    }, { once: true, passive: true });
  });

  // ---------- Music player ----------
  const song = $("#songAudio");
  const playBtn = $("#trackPlay");
  const seek = $("#seekBar");
  const volume = $("#volumeBar");
  const muteBtn = $("#muteBtn");
  const current = $("#currentTime");
  const duration = $("#duration");

  const fmt = sec => {
    if (!Number.isFinite(sec)) return "0:00";
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };
  function updatePlayUI() {
    playBtn.textContent = song.paused ? "▶" : "Ⅱ";
    document.querySelector(".music-player").classList.toggle("playing", !song.paused);
  }
  playBtn.addEventListener("click", async () => {
    if (song.paused) {
      try { await song.play(); } catch (_) {}
    } else song.pause();
    updatePlayUI();
  });
  song.addEventListener("loadedmetadata", () => {
    duration.textContent = fmt(song.duration);
    seek.max = song.duration;
  });
  song.addEventListener("timeupdate", () => {
    current.textContent = fmt(song.currentTime);
    seek.value = song.currentTime;
  });
  seek.addEventListener("input", () => { song.currentTime = Number(seek.value); });
  volume.addEventListener("input", () => {
    song.volume = Number(volume.value);
    song.muted = song.volume === 0;
    muteBtn.textContent = song.muted ? "Muted" : "Volume";
  });
  muteBtn.addEventListener("click", () => {
    song.muted = !song.muted;
    muteBtn.textContent = song.muted ? "Muted" : "Volume";
  });
  song.addEventListener("play", updatePlayUI);
  song.addEventListener("pause", updatePlayUI);
  song.addEventListener("ended", updatePlayUI);
  song.volume = .8;

  // ---------- Video Intersection Observer ----------
  const video = $("#birthdayVideo");
  const videoObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting && entry.intersectionRatio >= .35) {
        video.play().catch(() => {});
      } else if (!entry.isIntersecting || entry.intersectionRatio < .08) {
        video.pause();
      }
    });
  }, { threshold: [0, .08, .35, .7] });
  videoObserver.observe(video);

  // ---------- Celebration ----------
  const surpriseBtn = $("#surpriseBtn");
  const celebration = $("#celebration");
  let celebrated = false;

  function fireworks() {
    if (typeof confetti !== "function") return;
    const end = Date.now() + 2200;
    const colors = ["#b9e8ff", "#ffffff", "#74c9f5", "#102f4c"];
    (function frame() {
      confetti({
        particleCount: 5,
        angle: 60, spread: 65,
        origin: { x: 0, y: .65 },
        colors
      });
      confetti({
        particleCount: 5,
        angle: 120, spread: 65,
        origin: { x: 1, y: .65 },
        colors
      });
      if (Date.now() < end) requestAnimationFrame(frame);
    })();
    const bursts = [
      [0.2, .32], [.5, .22], [.8, .32]
    ];
    bursts.forEach(([x,y], i) => setTimeout(() => confetti({
      particleCount: 75, spread: 95, startVelocity: 34,
      origin: { x, y }, scalar: 1.05, colors
    }), i * 300));
  }

  surpriseBtn.addEventListener("click", () => {
    if (celebrated) return;
    celebrated = true;
    document.body.classList.add("celebrating");
    celebration.classList.add("show");
    surpriseBtn.style.display = "none";
    fireworks();
    finalCardFlash();
  });

  function finalCardFlash() {
    const card = $("#finalCard");
    card.animate([
      { transform: "scale(1)" },
      { transform: "scale(1.015)" },
      { transform: "scale(1)" }
    ], { duration: 900, easing: "cubic-bezier(.2,.8,.2,1)" });
  }
})();
