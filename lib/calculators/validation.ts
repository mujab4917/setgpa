/**
 * Input parsing, validation and number formatting for the calculators.
 *
 * Everything the user types arrives as a string. These helpers turn those
 * strings into safe numbers, so NaN / Infinity can never reach a calculation.
 */

/** Credit hours must stay inside this range (decimals such as 1.5 are allowed). */
export const MIN_CREDIT_HOURS = 0.5;
export const MAX_CREDIT_HOURS = 24;

/** A single semester's total credit hours (used by the CGPA calculator). */
export const MAX_SEMESTER_CREDIT_HOURS = 60;

/** Result of parsing one user-entered value. */
export type ParseResult =
  | { ok: true; value: number }
  | { ok: false; error: string };

/** True when the field was left completely empty. */
export function isBlank(value: string | number | undefined | null): boolean {
  if (value === undefined || value === null) return true;
  return String(value).trim() === "";
}

/** Parses any user input into a finite number, or explains why it cannot. */
function parseFiniteNumber(value: string | number, label: string): ParseResult {
  const raw = String(value).trim();
  if (raw === "") return { ok: false, error: `Enter ${label}.` };

  const parsed = Number(raw);
  if (!Number.isFinite(parsed)) {
    return { ok: false, error: `${capitalise(label)} must be a number.` };
  }
  return { ok: true, value: parsed };
}

/** Validates a credit-hours field for a single course. */
export function parseCreditHours(
  value: string | number,
  max: number = MAX_CREDIT_HOURS,
): ParseResult {
  const parsed = parseFiniteNumber(value, "credit hours");
  if (!parsed.ok) return parsed;

  if (parsed.value < MIN_CREDIT_HOURS) {
    return { ok: false, error: `Credit hours must be at least ${MIN_CREDIT_HOURS}.` };
  }
  if (parsed.value > max) {
    return { ok: false, error: `Credit hours cannot be more than ${max}.` };
  }
  return { ok: true, value: parsed.value };
}

/** Validates a GPA field against the university's own scale (e.g. 0 - 4.00). */
export function parseGpaValue(value: string | number, gpaScale: number): ParseResult {
  const parsed = parseFiniteNumber(value, "a GPA");
  if (!parsed.ok) return parsed;

  if (parsed.value < 0) {
    return { ok: false, error: "GPA cannot be negative." };
  }
  if (parsed.value > gpaScale) {
    return { ok: false, error: `GPA cannot be higher than ${formatPoints(gpaScale)}.` };
  }
  return { ok: true, value: parsed.value };
}

/**
 * Rounds a number to a fixed number of decimals.
 *
 * Plain `Math.round(value * 100) / 100` is not enough here: 18.99 / 6 is stored
 * as 3.1649999999999996, so a naive round gives 3.16 instead of 3.17. We first
 * drop the floating point noise, then shift the decimal point through the
 * decimal string form, which is exact for the small numbers a GPA uses.
 */
export function roundTo(value: number, decimals = 2): number {
  if (!Number.isFinite(value)) return 0;

  const cleaned = Number(value.toPrecision(12));
  const asText = String(cleaned);

  // Exponential notation ("1e-7") cannot take the string shift below.
  if (asText.includes("e") || asText.includes("E")) {
    const factor = 10 ** decimals;
    return Math.round(cleaned * factor) / factor;
  }

  const shifted = Math.round(Number(`${asText}e${decimals}`));
  return Number(`${shifted}e-${decimals}`);
}

/** Formats a GPA/CGPA for display: 3.5 -> "3.50". */
export function formatGpa(value: number | null, decimals = 2): string {
  if (value === null || !Number.isFinite(value)) return "—";
  return value.toFixed(decimals);
}

/**
 * Converts a GPA to the equivalent percentage of the scale.
 *
 * On a four point scale this is the familiar `GPA x 25` conversion used across
 * Pakistani universities: 2.75 becomes 68.75.
 *
 * IMPORTANT: this is an APPROXIMATION, and the site labels it as one. A letter
 * grade covers a band of marks - at IIUI a B+ is anything from 75 to 80 - so
 * once marks become a grade, the original percentage cannot be recovered. A
 * university's own printed percentage comes from the actual marks, which is
 * why it differs slightly: a real result card showing GPA 2.75 gave 68.50,
 * against 68.75 from this formula.
 */
export function gpaToPercentage(gpa: number, gpaScale: number): number | null {
  if (!Number.isFinite(gpa) || !Number.isFinite(gpaScale) || gpaScale <= 0) {
    return null;
  }
  return roundTo((gpa / gpaScale) * 100, 2);
}

/** Formats a percentage for display: 68.75 -> "68.75%". */
export function formatPercentage(value: number | null): string {
  if (value === null || !Number.isFinite(value)) return "—";
  return `${value.toFixed(2)}%`;
}

/** Formats a grade's marks band: (75, 80) -> "75 - 80%". */
export function formatPercentageRange(
  min: number | null,
  max: number | null,
): string | null {
  if (min === null || max === null) return null;
  return `${formatPoints(min)} - ${formatPoints(max)}%`;
}

/** Formats grade points / credit hours, dropping pointless trailing zeros. */
export function formatPoints(value: number): string {
  if (!Number.isFinite(value)) return "0";
  return Number.isInteger(value) ? String(value) : String(roundTo(value, 2));
}

function capitalise(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}
