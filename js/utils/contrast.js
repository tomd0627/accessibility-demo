/**
 * WCAG 2.1 contrast ratio utilities.
 * Implements the relative luminance formula from the spec:
 * https://www.w3.org/TR/WCAG21/#dfn-relative-luminance
 */

/**
 * Converts a hex color string to [r, g, b] values (0–255).
 * @param {string} hex - e.g. "#374151" or "374151"
 * @returns {[number, number, number] | null}
 */
function hexToRgb(hex) {
  const clean = hex.replace('#', '');
  if (clean.length !== 6) return null;
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  if (isNaN(r) || isNaN(g) || isNaN(b)) return null;
  return [r, g, b];
}

/**
 * Computes the relative luminance of an sRGB color.
 * @param {number} r - 0–255
 * @param {number} g - 0–255
 * @param {number} b - 0–255
 * @returns {number} - 0 (black) to 1 (white)
 */
function relativeLuminance(r, g, b) {
  const [rs, gs, bs] = [r, g, b].map((c) => {
    const s = c / 255;
    return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

/**
 * Computes the WCAG contrast ratio between two hex colors.
 * @param {string} hex1
 * @param {string} hex2
 * @returns {number | null} - contrast ratio, or null if either hex is invalid
 */
export function contrastRatio(hex1, hex2) {
  const rgb1 = hexToRgb(hex1);
  const rgb2 = hexToRgb(hex2);
  if (!rgb1 || !rgb2) return null;

  const l1 = relativeLuminance(...rgb1);
  const l2 = relativeLuminance(...rgb2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Returns WCAG pass/fail verdicts for a given contrast ratio.
 * @param {number} ratio
 * @returns {{ normalAA: boolean, largeAA: boolean, normalAAA: boolean, largeAAA: boolean }}
 */
export function wcagVerdicts(ratio) {
  return {
    normalAA: ratio >= 4.5,
    largeAA: ratio >= 3,
    normalAAA: ratio >= 7,
    largeAAA: ratio >= 4.5,
  };
}
