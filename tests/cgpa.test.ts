/**
 * Tests for the cumulative CGPA engine.  Run them with:  npm test
 */

import { describe, expect, it } from "vitest";

import { calculateCgpa } from "@/lib/calculators/cgpa";
import type { GradingSystem } from "@/lib/calculators/types";

const fourPointScale: GradingSystem = {
  gpaScale: 4,
  grades: [
    { grade: "A", gradePoint: 4 },
    { grade: "B", gradePoint: 3 },
    { grade: "F", gradePoint: 0 },
  ],
};

/** Some universities publish on a 5.00 scale - the engine follows the data. */
const fivePointScale: GradingSystem = {
  gpaScale: 5,
  grades: [
    { grade: "A", gradePoint: 5 },
    { grade: "B", gradePoint: 4 },
    { grade: "F", gradePoint: 0 },
  ],
};

describe("calculateCgpa - normal use", () => {
  it("returns the same value as the GPA when there is one semester", () => {
    const result = calculateCgpa(
      [{ name: "Semester 1", gpa: "3.42", creditHours: "15" }],
      fourPointScale,
    );

    expect(result.cgpa).toBe(3.42);
    expect(result.totalCreditHours).toBe(15);
    expect(result.countedSemesters).toBe(1);
  });

  it("weights each semester by its credit hours", () => {
    // 3.50x15 = 52.5 | 3.00x18 = 54  ->  106.5 / 33 = 3.2272...
    const result = calculateCgpa(
      [
        { name: "Semester 1", gpa: "3.5", creditHours: "15" },
        { name: "Semester 2", gpa: "3", creditHours: "18" },
      ],
      fourPointScale,
    );

    expect(result.totalCreditHours).toBe(33);
    expect(result.totalQualityPoints).toBe(106.5);
    expect(result.cgpa).toBe(3.23);
  });

  it("handles many semesters", () => {
    // (3x15) + (3.5x15) + (4x12) + (2.5x18) = 45 + 52.5 + 48 + 45 = 190.5
    // 190.5 / 60 = 3.175 -> 3.18
    const result = calculateCgpa(
      [
        { gpa: "3", creditHours: "15" },
        { gpa: "3.5", creditHours: "15" },
        { gpa: "4", creditHours: "12" },
        { gpa: "2.5", creditHours: "18" },
      ],
      fourPointScale,
    );

    expect(result.countedSemesters).toBe(4);
    expect(result.totalQualityPoints).toBe(190.5);
    expect(result.cgpa).toBe(3.18);
  });

  it("accepts a GPA of 0 (all courses failed)", () => {
    const result = calculateCgpa([{ gpa: "0", creditHours: "12" }], fourPointScale);

    expect(result.cgpa).toBe(0);
    expect(result.countedSemesters).toBe(1);
  });

  it("uses the university's own scale, not a fixed 4.00", () => {
    // 4.60 is invalid on a 4.00 scale but valid on a 5.00 scale.
    const onFour = calculateCgpa([{ gpa: "4.6", creditHours: "15" }], fourPointScale);
    const onFive = calculateCgpa([{ gpa: "4.6", creditHours: "15" }], fivePointScale);

    expect(onFour.cgpa).toBeNull();
    expect(onFive.cgpa).toBe(4.6);
  });

  it("accepts decimal credit hours and numeric input", () => {
    const result = calculateCgpa(
      [
        { gpa: 3.5, creditHours: 10.5 },
        { gpa: 3.5, creditHours: 10.5 },
      ],
      fourPointScale,
    );

    expect(result.totalCreditHours).toBe(21);
    expect(result.cgpa).toBe(3.5);
  });
});

describe("calculateCgpa - empty and invalid input", () => {
  it("returns null instead of NaN when nothing has been entered", () => {
    const result = calculateCgpa([], fourPointScale);

    expect(result.cgpa).toBeNull();
    expect(result.totalCreditHours).toBe(0);
    expect(result.errors.length).toBeGreaterThan(0);
  });

  it("skips completely empty rows without complaining", () => {
    const result = calculateCgpa(
      [
        { gpa: "3.5", creditHours: "15" },
        { gpa: "", creditHours: "" },
      ],
      fourPointScale,
    );

    expect(result.cgpa).toBe(3.5);
    expect(result.rows[1].status).toBe("empty");
    expect(result.rows[1].error).toBeNull();
  });

  it("reports a GPA above the university's scale", () => {
    const result = calculateCgpa([{ gpa: "4.5", creditHours: "15" }], fourPointScale);

    expect(result.cgpa).toBeNull();
    expect(result.rows[0].error).toMatch(/higher than/i);
  });

  it("reports a negative GPA", () => {
    const result = calculateCgpa([{ gpa: "-1", creditHours: "15" }], fourPointScale);

    expect(result.rows[0].error).toMatch(/negative/i);
  });

  it("reports a row where only one of the two fields is filled in", () => {
    const result = calculateCgpa([{ gpa: "3.5", creditHours: "" }], fourPointScale);

    expect(result.cgpa).toBeNull();
    expect(result.rows[0].status).toBe("invalid");
    expect(result.rows[0].error).toMatch(/credit hours/i);
  });

  it("rejects zero, non-numeric and unrealistic credit hours", () => {
    const result = calculateCgpa(
      [
        { gpa: "3.5", creditHours: "0" },
        { gpa: "3.5", creditHours: "abc" },
        { gpa: "3.5", creditHours: "500" },
      ],
      fourPointScale,
    );

    expect(result.cgpa).toBeNull();
    result.rows.forEach((row) => expect(row.status).toBe("invalid"));
  });

  it("still calculates from the valid rows when one row is broken", () => {
    const result = calculateCgpa(
      [
        { gpa: "3.5", creditHours: "15" },
        { gpa: "9", creditHours: "15" },
      ],
      fourPointScale,
    );

    expect(result.countedSemesters).toBe(1);
    expect(result.cgpa).toBe(3.5);
    expect(result.rows[1].error).not.toBeNull();
  });
});
