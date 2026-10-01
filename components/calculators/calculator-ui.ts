/**
 * Tailwind class strings shared by both calculators, so the two forms look
 * identical and there is one place to restyle inputs and buttons.
 */

export const fieldLabelClass = "block text-xs font-semibold text-ink-700";

export const inputClass =
  "mt-1 min-h-11 w-full rounded-xl border border-ink-900/20 bg-white px-3 py-2 text-ink-900 transition-shadow placeholder:text-slate-400 focus:border-brand-600 focus:ring-2 focus:ring-brand-200";

export const invalidInputClass = "border-red-400 focus:border-red-500 focus:ring-red-200";

export const primaryButtonClass =
  "inline-flex items-center justify-center rounded-full bg-brand-600 px-6 py-3 text-sm font-bold text-white shadow-[0_8px_18px_-8px_rgba(31,46,41,0.4)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-brand-500 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-50";

export const secondaryButtonClass =
  "inline-flex items-center justify-center rounded-full border border-ink-900/25 bg-white px-6 py-3 text-sm font-bold text-ink-900 transition-all duration-150 hover:-translate-y-0.5 hover:border-ink-900 active:translate-y-0";

export const removeButtonClass =
  "inline-flex h-11 w-11 items-center justify-center rounded-xl border border-ink-900/20 text-slate-500 transition-all duration-200 hover:scale-105 hover:border-red-300 hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100";

export const rowErrorClass =
  "mt-1 text-xs font-medium text-red-600 animate-slide-down-fade";

/**
 * Colour for a grade, based on where its grade point sits on the university's
 * own scale. An "A" is green everywhere, an "F" red everywhere, even though
 * the numbers behind them differ from campus to campus.
 *
 * Native <select> options cannot be reliably styled across browsers, so this
 * drives a small dot next to the dropdown instead of the options themselves.
 */
export function gradeColor(gradePoint: number, scale: number): string {
  if (scale <= 0) return "#9aa9b1";
  const ratio = gradePoint / scale;

  if (ratio >= 0.85) return "#5fa88a"; // green
  if (ratio >= 0.65) return "#6b9ac4"; // blue
  if (ratio >= 0.5) return "#d9a441"; // amber
  if (ratio > 0) return "#e08a5b"; // orange
  return "#d4685f"; // red - a zero-point grade
}

/** How long the row exit animation runs, in milliseconds. Matches .animate-row-out. */
export const ROW_EXIT_MS = 220;
