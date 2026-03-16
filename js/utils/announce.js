/**
 * ARIA live region announcer.
 * Creates off-screen polite and assertive live regions and cycles their
 * content to guarantee re-announcement of identical strings.
 *
 * Usage:
 *   import { announcePolite, announceAssertive } from './utils/announce.js';
 *   announcePolite('Settings saved.');
 *   announceAssertive('Error: field is required.');
 */

let politeRegion = null;
let assertiveRegion = null;

function createRegion(role, ariaLive) {
  const el = document.createElement('div');
  el.setAttribute('role', role);
  el.setAttribute('aria-live', ariaLive);
  el.setAttribute('aria-atomic', 'true');
  el.setAttribute('aria-relevant', 'additions text');

  // Visually hidden but accessible
  Object.assign(el.style, {
    position: 'absolute',
    width: '1px',
    height: '1px',
    padding: '0',
    overflow: 'hidden',
    clip: 'rect(0, 0, 0, 0)',
    whiteSpace: 'nowrap',
    border: '0',
  });

  document.body.appendChild(el);
  return el;
}

function ensureRegions() {
  if (!politeRegion) politeRegion = createRegion('status', 'polite');
  if (!assertiveRegion) assertiveRegion = createRegion('alert', 'assertive');
}

/**
 * Announce a message politely (waits for the user to finish what they're doing).
 * Use for: status updates, save confirmations, non-critical feedback.
 * @param {string} message
 */
export function announcePolite(message) {
  ensureRegions();
  politeRegion.textContent = '';
  // rAF ensures the DOM mutation is detected as a change, even for repeat messages
  requestAnimationFrame(() => {
    politeRegion.textContent = message;
  });
}

/**
 * Announce a message assertively (interrupts the user immediately).
 * Use for: errors, alerts, time-sensitive information.
 * @param {string} message
 */
export function announceAssertive(message) {
  ensureRegions();
  assertiveRegion.textContent = '';
  requestAnimationFrame(() => {
    assertiveRegion.textContent = message;
  });
}
