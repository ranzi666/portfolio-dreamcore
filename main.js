// ========== 入场：醒来 ==========
const intro = document.getElementById("intro");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (intro) {
  document.body.classList.add("intro-lock");

  // 首屏元素错峰浮现
  document.querySelectorAll(".hero .reveal").forEach((el, i) => {
    el.style.transitionDelay = `${0.09 * i}s`;
  });

  let done = false;
  const finishIntro = () => {
    if (done) return;
    done = true;
    intro.classList.add("is-done");
    document.body.classList.remove("intro-lock");
    setTimeout(() => intro.remove(), 1000);
  };

  const start = () => setTimeout(finishIntro, reduceMotion ? 0 : 1500);

  if (document.readyState === "complete") start();
  else window.addEventListener("load", start, { once: true });

  // 兜底：避免资源加载异常时卡在遮罩里
  setTimeout(finishIntro, 5000);
}

// ========== 滚动渐显 ==========
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1, rootMargin: "0px 0px -8% 0px" }
);

document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

// ========== 鼠标光晕 ==========
const glow = document.getElementById("cursorGlow");
const finePointer = window.matchMedia("(pointer: fine)").matches;
let targetX = window.innerWidth / 2;
let targetY = window.innerHeight / 2;
let currentX = targetX;
let currentY = targetY;

if (finePointer && glow) {
  window.addEventListener("mousemove", (e) => {
    targetX = e.clientX;
    targetY = e.clientY;
  });

  (function animateGlow() {
    currentX += (targetX - currentX) * 0.08;
    currentY += (targetY - currentY) * 0.08;
    glow.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
    requestAnimationFrame(animateGlow);
  })();
} else if (glow) {
  glow.style.display = "none";
}

// ========== 顶部进度条 ==========
const progress = document.getElementById("progress");
function updateProgress() {
  if (!progress) return;
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const ratio = scrollable > 0 ? window.scrollY / scrollable : 0;
  progress.style.width = `${Math.min(ratio * 100, 100)}%`;
}
window.addEventListener("scroll", updateProgress, { passive: true });
window.addEventListener("resize", updateProgress);
updateProgress();

// ========== 导航时钟 ==========
const clock = document.getElementById("clock");
function tick() {
  if (!clock) return;
  const now = new Date();
  const p = (n) => String(n).padStart(2, "0");
  clock.textContent = `${p(now.getHours())}:${p(now.getMinutes())}:${p(now.getSeconds())}`;
}
tick();
setInterval(tick, 1000);

// ========== 作品图微倾斜 ==========
if (finePointer) {
  document.querySelectorAll(".shot").forEach((shot) => {
    const frame = shot.querySelector(".shot-frame");
    if (!frame) return;

    shot.addEventListener("mousemove", (e) => {
      const rect = shot.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      frame.style.transform = `perspective(1000px) rotateX(${-y * 4}deg) rotateY(${x * 4}deg)`;
    });

    shot.addEventListener("mouseleave", () => {
      frame.style.transform = "";
    });
  });
}

// ========== 光团随鼠标轻微偏移 ==========
if (finePointer) {
  const orbs = document.querySelectorAll(".orb");
  window.addEventListener("mousemove", (e) => {
    const dx = e.clientX / window.innerWidth - 0.5;
    const dy = e.clientY / window.innerHeight - 0.5;
    orbs.forEach((orb, i) => {
      const depth = (i + 1) * 10;
      orb.style.translate = `${dx * depth}px ${dy * depth}px`;
    });
  });
}

// ========== 首屏标题呼吸 ==========
const title = document.querySelector(".title-line");
if (title && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  let t = 0;
  (function breathe() {
    t += 0.006;
    const scale = 1 + Math.sin(t) * 0.008;
    title.style.transform = `scale(${scale})`;
    requestAnimationFrame(breathe);
  })();
}
