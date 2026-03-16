/**
 * Demo 04 — Focus Visibility
 * Updates a live region to show which fixed-nav link currently has focus.
 */

export function init(sectionEl) {
  const tracker = sectionEl.querySelector('#fv-focus-tracker');
  const fixedLinks = [...sectionEl.querySelectorAll('.focus-demo-link--fixed')];

  if (!tracker || fixedLinks.length === 0) return;

  sectionEl.addEventListener('focusin', (e) => {
    if (!fixedLinks.includes(e.target)) return;
    tracker.textContent = `Focus is on: "${e.target.textContent.trim()}"`;
    tracker.style.display = 'block';
  });

  sectionEl.addEventListener('focusout', (e) => {
    if (!fixedLinks.includes(e.target)) return;
    // Small delay so the message stays readable briefly after leaving
    setTimeout(() => {
      if (!fixedLinks.includes(document.activeElement)) {
        tracker.textContent = 'Tab to see which link has focus.';
      }
    }, 300);
  });
}
