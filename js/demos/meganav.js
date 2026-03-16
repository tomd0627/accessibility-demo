/**
 * Demo 11 — Mega Navigation
 * Broken: CSS hover-only, no keyboard access, no ARIA.
 * Fixed: disclosure buttons with aria-expanded, arrow-key navigation, Escape to close.
 */

export function init(sectionEl) {
  initFixedMenus(sectionEl);
  // Broken nav requires no JS — it's pure CSS :hover
}

function initFixedMenus(sectionEl) {
  const nav = sectionEl.querySelector('.demo-meganav--fixed');
  if (!nav) return;

  const triggers = [...nav.querySelectorAll('.demo-meganav__trigger--fixed')];

  function getPanel(trigger) {
    return document.getElementById(trigger.getAttribute('aria-controls'));
  }

  function closeAll(exceptTrigger = null) {
    triggers.forEach((t) => {
      if (t === exceptTrigger) return;
      t.setAttribute('aria-expanded', 'false');
      getPanel(t)?.setAttribute('hidden', '');
    });
  }

  function openMenu(trigger) {
    closeAll(trigger);
    trigger.setAttribute('aria-expanded', 'true');
    getPanel(trigger)?.removeAttribute('hidden');
  }

  function closeMenu(trigger) {
    trigger.setAttribute('aria-expanded', 'false');
    getPanel(trigger)?.setAttribute('hidden', '');
  }

  triggers.forEach((trigger) => {
    trigger.addEventListener('click', () => {
      const isOpen = trigger.getAttribute('aria-expanded') === 'true';
      isOpen ? closeMenu(trigger) : openMenu(trigger);
    });

    trigger.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeMenu(trigger);
        trigger.focus();
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (trigger.getAttribute('aria-expanded') !== 'true') openMenu(trigger);
        getPanel(trigger)?.querySelector('a')?.focus();
      }
    });
  });

  // Arrow key navigation within open panels
  nav.addEventListener('keydown', (e) => {
    const active = document.activeElement;
    const panel = active.closest('.demo-meganav__panel');
    if (!panel) return;

    const links = [...panel.querySelectorAll('a')];
    const idx = links.indexOf(active);

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      links[idx + 1]?.focus();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (idx === 0) {
        triggers.find((t) => t.getAttribute('aria-controls') === panel.id)?.focus();
      } else {
        links[idx - 1]?.focus();
      }
    } else if (e.key === 'Escape') {
      const trigger = triggers.find((t) => t.getAttribute('aria-controls') === panel.id);
      closeMenu(trigger);
      trigger?.focus();
    }
  });

  // Click outside closes all
  document.addEventListener('click', (e) => {
    if (!nav.contains(e.target)) closeAll();
  });
}
