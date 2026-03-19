/**
 * Main entry point.
 *
 * Responsibilities:
 * 1. Initialize demo tab toggles for all sections
 * 2. Lazy-load each demo module when its section enters the viewport
 * 3. Manage the dark/light theme toggle
 * 4. Highlight the active demo in the sidebar nav on scroll
 */

import { initDemoToggle } from './demo-toggle.js';

// --- Demo module map ---
// Maps data-demo attribute values to their dynamic import paths.
const DEMO_MODULES = {
  'color-contrast': () => import('./demos/color-contrast.js'),
  'alt-text':       () => import('./demos/alt-text.js'),
  'form-labels':    () => import('./demos/form-labels.js'),
  'focus-visible':  () => import('./demos/focus-visible.js'),
  'heading-structure': () => import('./demos/heading-structure.js'),
  'button-vs-div':  () => import('./demos/button-vs-div.js'),
  'modal-focus-trap': () => import('./demos/modal-focus-trap.js'),
  'live-region':    () => import('./demos/live-region.js'),
  'skip-link':      () => import('./demos/skip-link.js'),
  'motion':         () => import('./demos/motion.js'),
  'meganav':        () => import('./demos/meganav.js'),
  'carousel':       () => import('./demos/carousel.js'),
  'tooltip':        () => import('./demos/tooltip.js'),
};

// --- Initialization ---

document.addEventListener('DOMContentLoaded', () => {
  initDemoToggles();
  initLazyDemos();
  initThemeToggle();
  initNavHighlight();
  initMobileNav();
});

// --- Demo tab toggles (all sections, immediately) ---

function initDemoToggles() {
  const sections = document.querySelectorAll('.demo-section');
  sections.forEach((section) => initDemoToggle(section));
}

// --- Lazy demo initialization via IntersectionObserver ---

function initLazyDemos() {
  const sections = document.querySelectorAll('.demo-section[data-demo]');
  if (sections.length === 0) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(async (entry) => {
        if (!entry.isIntersecting) return;

        const section = entry.target;
        const demoKey = section.dataset.demo;
        const loader = DEMO_MODULES[demoKey];

        if (!loader) return;

        observer.unobserve(section);

        try {
          const module = await loader();
          module.init(section);
        } catch (err) {
          // Surface errors during development; silent in production
          if (import.meta.env?.DEV) {
            console.error(`Failed to load demo module "${demoKey}":`, err);
          }
        }
      });
    },
    { rootMargin: '200px' } // Start loading 200px before visible
  );

  sections.forEach((section) => observer.observe(section));
}

// --- Theme toggle ---

function initThemeToggle() {
  const toggleBtn = document.querySelector('[data-theme-toggle]');
  if (!toggleBtn) return;

  const html = document.documentElement;
  const STORAGE_KEY = 'a11y-demo-theme';

  // Read saved preference; fall back to OS preference
  const saved = localStorage.getItem(STORAGE_KEY);
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initialTheme = saved ?? (prefersDark ? 'dark' : 'light');

  applyTheme(initialTheme);

  toggleBtn.addEventListener('click', () => {
    const current = html.getAttribute('data-theme') ?? 'light';
    const next = current === 'light' ? 'dark' : 'light';
    applyTheme(next);
    localStorage.setItem(STORAGE_KEY, next);
  });

  function applyTheme(theme) {
    html.setAttribute('data-theme', theme);
    const isDark = theme === 'dark';
    toggleBtn.setAttribute('aria-pressed', String(isDark));
    toggleBtn.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
  }
}

// --- Mobile nav: close details on link click ---

function initMobileNav() {
  const details = document.querySelector('.demo-nav__mobile');
  if (!details) return;

  details.addEventListener('click', (e) => {
    if (e.target.closest('.demo-nav__link')) {
      details.removeAttribute('open');
    }
  });
}

// --- Active nav link highlight on scroll ---

function initNavHighlight() {
  const navLinks = [...document.querySelectorAll('.demo-nav__link')];
  const sections = [...document.querySelectorAll('.demo-section[id]')];
  const mobileSummary = document.querySelector('.demo-nav__mobile-summary');

  if (navLinks.length === 0 || sections.length === 0) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const id = entry.target.id;
        navLinks.forEach((link) => {
          const isActive = link.getAttribute('href') === `#${id}`;
          link.classList.toggle('is-active', isActive);
          if (isActive) {
            link.setAttribute('aria-current', 'location');
            if (mobileSummary) mobileSummary.textContent = link.textContent;
          } else {
            link.removeAttribute('aria-current');
          }
        });
      });
    },
    {
      rootMargin: '-20% 0px -70% 0px',
    }
  );

  sections.forEach((section) => observer.observe(section));
}
