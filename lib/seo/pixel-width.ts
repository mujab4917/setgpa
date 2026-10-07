/**
 * Estimates how wide a title or description is in Google's results.
 *
 * Google cuts snippets by PIXEL width, not by character count, so a 60
 * character title full of wide letters (M, W, O, C) can still be truncated
 * while a 62 character one with narrow letters (i, l, t) fits.
 *
 * The numbers are Arial advance widths per 1000 em. They were calibrated
 * against Screaming Frog's measurements of this site: titles come out at
 * about 19.25 px per 1000 units, descriptions at about 14.05 px per 1000.
 */

const WIDTHS: Record<string, number> = {
  " ": 278, "!": 278, '"': 355, "#": 556, "$": 556, "%": 889, "&": 667, "'": 191,
  "(": 333, ")": 333, "*": 389, "+": 584, ",": 278, "-": 333, ".": 278, "/": 278,
  ":": 278, ";": 278, "<": 584, "=": 584, ">": 584, "?": 556, "@": 1015, "|": 260,
  "…": 1000, "’": 222,
  A: 667, B: 667, C: 722, D: 722, E: 667, F: 611, G: 778, H: 722, I: 278, J: 500,
  K: 667, L: 556, M: 833, N: 722, O: 778, P: 667, Q: 778, R: 722, S: 667, T: 611,
  U: 722, V: 667, W: 944, X: 667, Y: 667, Z: 611,
  a: 556, b: 556, c: 500, d: 556, e: 556, f: 278, g: 556, h: 556, i: 222, j: 222,
  k: 500, l: 222, m: 833, n: 556, o: 556, p: 556, q: 556, r: 333, s: 500, t: 278,
  u: 556, v: 500, w: 722, x: 500, y: 500, z: 500,
};

/** Characters not in the table (digits, accents) are treated as digit width. */
const DEFAULT_WIDTH = 556;

function units(text: string): number {
  let total = 0;
  for (const character of text) total += WIDTHS[character] ?? DEFAULT_WIDTH;
  return total;
}

/** Estimated width of a <title> in pixels. */
export function titlePixelWidth(text: string): number {
  return Math.round((units(text) * 19.25) / 1000);
}

/** Estimated width of a meta description in pixels. */
export function descriptionPixelWidth(text: string): number {
  return Math.round((units(text) * 14.05) / 1000);
}

/**
 * Safe limits: Google's approximate cut-offs are 561 px (titles) and 985 px
 * (descriptions); a small margin absorbs the estimate's error.
 */
export const TITLE_MAX_PX = 555;
export const DESCRIPTION_MAX_PX = 970;
