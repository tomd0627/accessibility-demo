/**
 * Demo 12 — Carousel
 * Broken: auto-advances with no pause, no keyboard nav, no ARIA.
 * Fixed: pause/play, prev/next buttons, aria-live, proper slide labels.
 */

export function init(sectionEl) {
  initBrokenCarousel(sectionEl);
  initFixedCarousel(sectionEl);
}

function initBrokenCarousel(sectionEl) {
  const track = sectionEl.querySelector('#broken-carousel-track');
  if (!track) return;

  const slides = [...track.querySelectorAll('.carousel-slide')];
  let current = 0;

  function goTo(idx) {
    slides[current].hidden = true;
    current = idx;
    slides[current].hidden = false;
  }

  // Auto-advance every 3s with no pause mechanism
  setInterval(() => {
    goTo((current + 1) % slides.length);
  }, 3000);
}

function initFixedCarousel(sectionEl) {
  const carousel = sectionEl.querySelector('.demo-carousel--fixed');
  if (!carousel) return;

  const track    = carousel.querySelector('.carousel-track');
  const slides   = [...carousel.querySelectorAll('.carousel-slide')];
  const prevBtn  = carousel.querySelector('.carousel-btn--prev');
  const nextBtn  = carousel.querySelector('.carousel-btn--next');
  const pauseBtn = carousel.querySelector('.carousel-btn--pause');
  const dots     = [...carousel.querySelectorAll('.carousel-dot')];
  const counter  = carousel.querySelector('.carousel-counter');
  const iconPause = pauseBtn?.querySelector('.icon-pause');
  const iconPlay  = pauseBtn?.querySelector('.icon-play');

  let current = 0;
  let paused  = false;
  let interval = null;

  function updateUI() {
    dots.forEach((d, i) => d.classList.toggle('carousel-dot--active', i === current));
    if (counter) counter.textContent = `${current + 1} / ${slides.length}`;
  }

  function goTo(idx, announce) {
    slides[current].hidden = true;
    current = (idx + slides.length) % slides.length;
    slides[current].hidden = false;
    // Announce only on manual navigation
    track.setAttribute('aria-live', announce ? 'polite' : 'off');
    updateUI();
  }

  function startAuto() {
    clearInterval(interval);
    interval = setInterval(() => {
      if (!paused) goTo(current + 1, false);
    }, 3000);
  }

  function setPaused(state) {
    paused = state;
    pauseBtn.setAttribute('aria-pressed', String(paused));
    pauseBtn.setAttribute('aria-label', paused ? 'Resume auto-advance' : 'Pause auto-advance');
    iconPause?.toggleAttribute('hidden', paused);
    iconPlay?.toggleAttribute('hidden', !paused);
    if (paused) track.setAttribute('aria-live', 'polite');
    else        track.setAttribute('aria-live', 'off');
  }

  prevBtn?.addEventListener('click', () => goTo(current - 1, true));
  nextBtn?.addEventListener('click', () => goTo(current + 1, true));
  pauseBtn?.addEventListener('click', () => setPaused(!paused));

  // Pause on focus within carousel; resume on blur out
  carousel.addEventListener('focusin',  () => setPaused(true));
  carousel.addEventListener('focusout', (e) => {
    if (!carousel.contains(e.relatedTarget)) setPaused(false);
  });

  updateUI();
  startAuto();
}
