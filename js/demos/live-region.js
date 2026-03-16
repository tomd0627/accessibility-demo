/**
 * Demo 08 — ARIA Live Regions
 * Simulates an async save operation to show the difference between
 * a silent DOM update and one announced via aria-live.
 */

export function init(sectionEl) {
  initBrokenLiveRegion(sectionEl);
  initFixedLiveRegion(sectionEl);
}

function initBrokenLiveRegion(sectionEl) {
  const saveBtn = sectionEl.querySelector('#lr-broken-save');
  const statusEl = sectionEl.querySelector('#lr-broken-status');

  if (!saveBtn || !statusEl) return;

  saveBtn.addEventListener('click', async () => {
    saveBtn.disabled = true;
    saveBtn.textContent = 'Saving…';

    // Visually updates — but no aria-live, so screen readers hear nothing
    statusEl.textContent = '';
    statusEl.className = 'live-demo-status is-loading';
    statusEl.innerHTML = '<span class="spinner" aria-hidden="true"></span> Saving…';

    await delay(1500);

    statusEl.className = 'live-demo-status is-success';
    statusEl.textContent = '✓ Settings saved. (Silent to screen readers)';

    saveBtn.disabled = false;
    saveBtn.textContent = 'Save settings';
  });
}

function initFixedLiveRegion(sectionEl) {
  const saveBtn = sectionEl.querySelector('#lr-fixed-save');
  const statusEl = sectionEl.querySelector('#lr-fixed-status');

  if (!saveBtn || !statusEl) return;

  saveBtn.addEventListener('click', async () => {
    saveBtn.disabled = true;
    saveBtn.textContent = 'Saving…';

    // Clear first so the region re-announces even if the text is the same
    statusEl.textContent = '';
    statusEl.className = 'live-demo-status is-loading';

    // rAF ensures the clear is processed before the new content is set
    await rafDelay();

    statusEl.innerHTML = '<span class="spinner" aria-hidden="true"></span> Saving settings…';

    await delay(1500);

    statusEl.textContent = '';
    await rafDelay();

    statusEl.className = 'live-demo-status is-success';
    statusEl.textContent = '✓ Settings saved successfully.';

    saveBtn.disabled = false;
    saveBtn.textContent = 'Save settings';
  });
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function rafDelay() {
  return new Promise((resolve) => requestAnimationFrame(resolve));
}
