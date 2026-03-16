/**
 * Demo 01 — Color Contrast
 * Powers the live contrast ratio calculator.
 */

import { contrastRatio, wcagVerdicts } from '../utils/contrast.js';

export function init(sectionEl) {
  const textColorInput = sectionEl.querySelector('#cc-text-color');
  const bgColorInput = sectionEl.querySelector('#cc-bg-color');
  const textHexInput = sectionEl.querySelector('#cc-text-hex');
  const bgHexInput = sectionEl.querySelector('#cc-bg-hex');
  const preview = sectionEl.querySelector('#cc-preview');
  const ratioOutput = sectionEl.querySelector('#cc-ratio-output');
  const normalAAOutput = sectionEl.querySelector('#cc-normal-aa');
  const largeAAOutput = sectionEl.querySelector('#cc-large-aa');

  if (!textColorInput || !bgColorInput || !preview) return;

  function updateChecker() {
    const textHex = textHexInput.value.trim();
    const bgHex = bgHexInput.value.trim();

    // Sync color pickers with hex inputs
    if (/^#[0-9a-f]{6}$/i.test(textHex)) textColorInput.value = textHex;
    if (/^#[0-9a-f]{6}$/i.test(bgHex)) bgColorInput.value = bgHex;

    const ratio = contrastRatio(textHex, bgHex);
    if (ratio === null) return;

    const verdicts = wcagVerdicts(ratio);

    preview.style.color = textHex;
    preview.style.backgroundColor = bgHex;

    ratioOutput.textContent = `${ratio.toFixed(2)}:1`;

    setVerdict(normalAAOutput, verdicts.normalAA);
    setVerdict(largeAAOutput, verdicts.largeAA);
  }

  function setVerdict(el, passes) {
    el.textContent = passes ? 'Pass' : 'Fail';
    el.dataset.pass = passes ? 'true' : 'false';
  }

  // Color picker → hex input sync
  textColorInput.addEventListener('input', () => {
    textHexInput.value = textColorInput.value;
    updateChecker();
  });

  bgColorInput.addEventListener('input', () => {
    bgHexInput.value = bgColorInput.value;
    updateChecker();
  });

  // Hex input → color picker sync
  textHexInput.addEventListener('input', updateChecker);
  bgHexInput.addEventListener('input', updateChecker);

  // Initial render
  updateChecker();
}
