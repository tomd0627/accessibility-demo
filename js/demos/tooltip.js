/**
 * Demo 13 — Tooltip
 * Broken: CSS hover-only, no keyboard trigger, no ARIA association.
 * Fixed: shown on hover + focus, dismissible with Escape, role="tooltip" + aria-describedby.
 */

export function init(sectionEl) {
  initFixedTooltips(sectionEl);
  // Broken tooltips are CSS-only — no JS needed
}

function initFixedTooltips(sectionEl) {
  const wraps = [...sectionEl.querySelectorAll('.tooltip-wrap--fixed')];

  wraps.forEach((wrap) => {
    const trigger = wrap.querySelector('[aria-describedby]');
    const tooltip = wrap.querySelector('[role="tooltip"]');
    if (!trigger || !tooltip) return;

    let hideTimer = null;

    function show() {
      clearTimeout(hideTimer);
      tooltip.removeAttribute('hidden');
    }

    function hide() {
      hideTimer = setTimeout(() => tooltip.setAttribute('hidden', ''), 120);
    }

    trigger.addEventListener('mouseenter', show);
    trigger.addEventListener('mouseleave', hide);
    trigger.addEventListener('focus',      show);
    trigger.addEventListener('blur',       hide);

    // Keep visible when cursor moves onto the tooltip itself
    tooltip.addEventListener('mouseenter', () => clearTimeout(hideTimer));
    tooltip.addEventListener('mouseleave', hide);

    // Escape dismisses without moving focus
    trigger.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') tooltip.setAttribute('hidden', '');
    });
  });
}
