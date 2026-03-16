/**
 * Generic focus trap utility using the `inert` attribute.
 * Supported in all modern browsers (Chrome 102+, Firefox 112+, Safari 15.5+).
 *
 * Usage:
 *   import { createFocusTrap } from './focus-trap.js';
 *   const trap = createFocusTrap(dialogEl);
 *   trap.activate(triggerButton);
 *   trap.deactivate();
 */

const FOCUSABLE_SELECTORS = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
  'details > summary:not([disabled])',
].join(', ');

/**
 * Creates a focus trap for a given container element.
 * @param {HTMLElement} containerEl - The element to trap focus within
 * @returns {{ activate: Function, deactivate: Function }}
 */
export function createFocusTrap(containerEl) {
  let triggerEl = null;
  let isActive = false;

  function getFocusableElements() {
    return [...containerEl.querySelectorAll(FOCUSABLE_SELECTORS)].filter(
      (el) => !el.closest('[hidden]') && !el.closest('[inert]')
    );
  }

  function handleTab(e) {
    if (!isActive || e.key !== 'Tab') return;

    const focusable = getFocusableElements();
    if (focusable.length === 0) {
      e.preventDefault();
      return;
    }

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  function handleEscape(e) {
    if (isActive && e.key === 'Escape') {
      deactivate();
    }
  }

  function activate(openedBy) {
    if (isActive) return;

    triggerEl = openedBy ?? null;
    isActive = true;

    // Set all sibling top-level children inert to prevent background focus
    [...document.body.children].forEach((child) => {
      if (!child.contains(containerEl)) {
        child.setAttribute('inert', '');
      }
    });

    containerEl.removeAttribute('hidden');

    document.addEventListener('keydown', handleTab);
    document.addEventListener('keydown', handleEscape);

    // Move focus into the dialog: first focusable element, or the container itself
    const focusable = getFocusableElements();
    const target = focusable[0] ?? containerEl;

    // rAF ensures the element is painted before focus is applied
    requestAnimationFrame(() => target.focus());
  }

  function deactivate() {
    if (!isActive) return;

    isActive = false;

    containerEl.setAttribute('hidden', '');

    // Remove inert from all siblings
    [...document.body.children].forEach((child) => {
      child.removeAttribute('inert');
    });

    document.removeEventListener('keydown', handleTab);
    document.removeEventListener('keydown', handleEscape);

    // Return focus to the element that opened the dialog
    triggerEl?.focus();
    triggerEl = null;
  }

  return { activate, deactivate };
}
