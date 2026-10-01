/**
 * Tests for input parsing and number formatting.  Run them with:  npm test
 */

import { describe, expect, it } from "vitest";

import {
  formatGpa,
  formatPercentageRange,
  formatPoints,
  gpaToPercentage,
  isBlank,
  parseCreditHours,
  parseGpaValue,
  roundTo,
} from "@/lib/calculators/validation";

describe("isBlank", () => {
  it("treats empty strings, spaces, null and undefined as blank", () => {
    expect(isBlank("")).toBe(true);
    expect(isBlank("   ")).toBe(true);
    expect(isBlank(null)).toBe(true);
    expect(isBlank(undefined)).toBe(true);
  });

  it("does not treat 0 as blank", () => {
    expect(isBlank(0)).toBe(false);
    expect(isBlank("0")).toBe(false);
  });
});

describe("parseCreditHours", () => {
  it("accepts whole and decimal values inside the allowed range", () => {
    expect(parseCreditHours("3")).toEqual({ ok: true, value: 3 });
    expect(parseCreditHours("1.5")).toEqual({ ok: true, value: 1.5 });
  });

  it("rejects blank, zero, negative, too large and non-numeric values", () => {
    expect(parseCreditHours("").ok).toBe(false);
    expect(parseCreditHours("0").ok).toBe(false);
    expect(parseCreditHours("-3").ok).toBe(false);
    expect(parseCreditHours("100").ok).toBe(false);
    expect(parseCreditHours("three").ok).toBe(false);
  });
});

describe("parseGpaValue", () => {
  it("accepts values between 0 and the university's scale", () => {
    expect(parseGpaValue("0", 4)).toEqual({ ok: true, value: 0 });
    expect(parseGpaValue("4", 4)).toEqual({ ok: true, value: 4 });
    expect(parseGpaValue("3.67", 4)).toEqual({ ok: true, value: 3.67 });
  });

  it("rejects values outside the scale", () => {
    expect(parseGpaValue("4.01", 4).ok).toBe(false);
    expect(parseGpaValue("-0.5", 4).ok).toBe(false);
    expect(parseGpaValue("abc", 4).ok).toBe(false);
  });
});

describe("roundTo", () => {
  it("rounds half up even when floating point drift gets in the way", () => {
    // 18.99 / 6 is stored as 3.1649999999999996 but must still give 3.17.
    expect(roundTo(18.99 / 6)).toBe(3.17);
    expect(roundTo(3.175)).toBe(3.18);
    expect(roundTo(35.68 / 10)).toBe(3.57);
  });

  it("returns 0 for values that are not finite", () => {
    expect(roundTo(Number.NaN)).toBe(0);
    expect(roundTo(Number.POSITIVE_INFINITY)).toBe(0);
  });
});

describe("gpaToPercentage", () => {
  it("converts on a four point scale (the familiar GPA x 25)", () => {
    expect(gpaToPercentage(4, 4)).toBe(100);
    expect(gpaToPercentage(2.75, 4)).toBe(68.75);
    expect(gpaToPercentage(0, 4)).toBe(0);
  });

  it("uses the university's own scale, not a fixed 4.00", () => {
    // On a five point scale, 4.00 is 80%, not 100%.
    expect(gpaToPercentage(4, 5)).toBe(80);
  });

  it("stays close to the figure a university prints from real marks", () => {
    // An IIUI result card showed 68.50% against a GPA of 2.75. A letter grade
    // covers a band of marks, so the two can never match exactly - this guards
    // the size of the gap rather than the exact number.
    const converted = gpaToPercentage(2.75, 4) as number;
    expect(Math.abs(converted - 68.5)).toBeLessThan(1);
  });

  it("returns null rather than a nonsense number for bad input", () => {
    expect(gpaToPercentage(3, 0)).toBeNull();
    expect(gpaToPercentage(Number.NaN, 4)).toBeNull();
  });
});

describe("formatPercentageRange", () => {
  it("formats a published marks band", () => {
    expect(formatPercentageRange(75, 80)).toBe("75 - 80%");
  });

  it("returns null when the range is unknown, so the column can be hidden", () => {
    expect(formatPercentageRange(null, null)).toBeNull();
    expect(formatPercentageRange(75, null)).toBeNull();
  });
});

describe("formatting", () => {
  it("always shows two decimals for a GPA", () => {
    expect(formatGpa(4)).toBe("4.00");
    expect(formatGpa(3.5)).toBe("3.50");
  });

  it("shows a dash when there is no result yet", () => {
    expect(formatGpa(null)).toBe("—");
  });

  it("drops pointless trailing zeros for credit hours and points", () => {
    expect(formatPoints(3)).toBe("3");
    expect(formatPoints(4.5)).toBe("4.5");
  });
});
