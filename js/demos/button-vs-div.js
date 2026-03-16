/**
 * Demo 06 — Button Semantics
 * Demonstrates that <div> buttons are unreachable by keyboard while
 * <button> elements respond to both click and keyboard activation.
 */

export function init(sectionEl) {
  const brokenBtns = [...sectionEl.querySelectorAll('[data-broken-btn]')];
  const fixedBtns = [...sectionEl.querySelectorAll('[data-fixed-btn]')];
  const fixedResult = sectionEl.querySelector('#bs-fixed-result');

  // Broken divs: only respond to mouse click — no keyboard access
  brokenBtns.forEach((div) => {
    div.addEventListener('click', () => {
      const brokenResult = sectionEl.querySelector('#bs-broken-result');
      if (brokenResult) {
        brokenResult.textContent = `Clicked "${div.textContent.trim()}" — but only with a mouse!`;
      }
    });
  });

  // Fixed buttons: fully accessible via keyboard
  fixedBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      if (!fixedResult) return;
      const action = btn.dataset.fixedBtn === 'add' ? 'Added to cart' : 'Saved for later';
      fixedResult.textContent = `✓ ${action} — activated by keyboard or mouse.`;
    });
  });
}
