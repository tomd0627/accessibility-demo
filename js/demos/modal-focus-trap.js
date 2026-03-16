/**
 * Demo 07 — Modal Focus Trap
 * Demonstrates broken modal (no trap) vs. accessible modal (createFocusTrap).
 */

import { createFocusTrap } from '../focus-trap.js';

export function init(sectionEl) {
  initBrokenModal(sectionEl);
  initFixedModal(sectionEl);
}

// --- Broken modal: no focus trap, no ARIA, no Escape ---

function initBrokenModal(sectionEl) {
  const openBtn = sectionEl.querySelector('#open-broken-modal');
  const backdrop = document.querySelector('#broken-modal-backdrop');
  const closeBtn = document.querySelector('#close-broken-modal');

  if (!openBtn || !backdrop || !closeBtn) return;

  openBtn.addEventListener('click', () => {
    backdrop.removeAttribute('hidden');
    // No focus management — focus stays on the button behind the modal
  });

  closeBtn.addEventListener('click', () => {
    backdrop.setAttribute('hidden', '');
    // No focus return — focus is lost
  });

  // Clicking backdrop closes it (but still no focus return)
  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) backdrop.setAttribute('hidden', '');
  });
}

// --- Fixed modal: proper focus trap, ARIA, Escape, focus return ---

function initFixedModal(sectionEl) {
  const openBtn = sectionEl.querySelector('#open-fixed-modal');
  const backdropEl = document.querySelector('#fixed-modal-backdrop');
  const dialogEl = document.querySelector('#fixed-modal');
  const closeBtn = document.querySelector('#close-fixed-modal');
  const cancelBtn = document.querySelector('#modal-cancel-btn');
  const subscribeBtn = document.querySelector('#modal-subscribe-btn');

  if (!openBtn || !backdropEl || !dialogEl) return;

  const trap = createFocusTrap(dialogEl);

  function openModal() {
    backdropEl.removeAttribute('hidden');
    trap.activate(openBtn);
  }

  function closeModal() {
    backdropEl.setAttribute('hidden', '');
    trap.deactivate();
  }

  openBtn.addEventListener('click', openModal);
  closeBtn?.addEventListener('click', closeModal);
  cancelBtn?.addEventListener('click', closeModal);

  subscribeBtn?.addEventListener('click', () => {
    closeModal();
  });

  // Backdrop click closes modal
  backdropEl.addEventListener('click', (e) => {
    if (e.target === backdropEl) closeModal();
  });
}
