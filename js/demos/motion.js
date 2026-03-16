/**
 * Demo 10 — Reduced Motion
 * The broken box animates unconditionally.
 * The fixed box respects prefers-reduced-motion via CSS, and this module
 * adds a manual toggle button to simulate the OS preference for visitors
 * who may not have it enabled.
 */

export function init(sectionEl) {
  initBrokenMotion(sectionEl);
  initFixedMotion(sectionEl);
}

function initBrokenMotion(sectionEl) {
  const toggleBtn = sectionEl.querySelector('#rm-broken-toggle');
  const box = sectionEl.querySelector('.motion-box--broken');

  if (!toggleBtn || !box) return;

  let paused = false;

  toggleBtn.addEventListener('click', () => {
    paused = !paused;
    box.style.animationPlayState = paused ? 'paused' : 'running';
    toggleBtn.textContent = paused ? 'Resume animation' : 'Pause animation';
  });
}

function initFixedMotion(sectionEl) {
  const toggleBtn = sectionEl.querySelector('#rm-fixed-toggle');
  const box = sectionEl.querySelector('.motion-box--fixed');
  const label = sectionEl.querySelector('#rm-fixed-label');

  if (!toggleBtn || !box) return;

  // Check the real OS preference and reflect it in the initial state
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) {
    box.classList.add('is-reduced');
    toggleBtn.setAttribute('aria-pressed', 'true');
    updateLabel(label, true);
  }

  toggleBtn.addEventListener('click', () => {
    const isPressed = toggleBtn.getAttribute('aria-pressed') === 'true';
    const nextState = !isPressed;

    toggleBtn.setAttribute('aria-pressed', String(nextState));
    box.classList.toggle('is-reduced', nextState);
    updateLabel(label, nextState);
  });
}

function updateLabel(labelEl, isReduced) {
  if (!labelEl) return;
  labelEl.textContent = isReduced
    ? 'Reduced motion simulated — animation is stopped (or replaced with a simple fade).'
    : 'Animation respects your OS preference. Use the toggle below to simulate.';
}
