/**
 * Tests for the semester GPA engine.  Run them with:  npm test
 */

import { describe, expect, it } from "vitest";

import { calculateGpa, findGradePoint } from "@/lib/calculators/gpa";
import type { GradingSystem } from "@/lib/calculators/types";

/** A "thirds" scale, like the FAST / COMSATS demo data. */
const thirdsScale: GradingSystem = {
  gpaScale: 4,
  grades: [
    { grade: "A", gradePoint: 4.0 },
    { grade: "A-", gradePoint: 3.67 },
    { grade: "B+", gradePoint: 3.33 },
    { grade: "B", gradePoint: 3.0 },
    { grade: "C", gradePoint: 2.0 },
    { grade: "D", gradePoint: 1.0 },
    { grade: "F", gradePoint: 0.0 },
  ],
};

/** A "halves" scale, like the UET demo data - proves the engine is data driven. */
const halvesScale: GradingSystem = {
  gpaScale: 4,
  grades: [
    { grade: "A", gradePoint: 4.0 },
    { grade: "B+", gradePoint: 3.5 },
    { grade: "B", gradePoint: 3.0 },
    { grade: "F", gradePoint: 0.0 },
  ],
};

describe("findGradePoint", () => {
  it("finds a grade from the university's table", () => {
    expect(findGradePoint("A-", thirdsScale)).toBe(3.67);
  });

  it("ignores letter case and surrounding spaces", () => {
    expect(findGradePoint(" b+ ", thirdsScale)).toBe(3.33);
  });

  it("returns null for a grade that is not in the table", () => {
    // "A-" does not exist on the halves scale.
    expect(findGradePoint("A-", halvesScale)).toBeNull();
  });
});

describe("calculateGpa - normal use", () => {
  it("calculates a single course", () => {
    const result = calculateGpa(
      [{ creditHours: "3", grade: "A" }],
      thirdsScale,
    );

    expect(result.gpa).toBe(4);
    expect(result.totalCreditHours).toBe(3);
    expect(result.totalQualityPoints).toBe(12);
    expect(result.countedCourses).toBe(1);
  });

  it("calculates multiple courses as a credit-hour weighted average", () => {
    // 3x4.00 = 12.00 | 3x3.00 = 9.00 | 4x3.67 = 14.68  ->  35.68 / 10
    const result = calculateGpa(
      [
        { name: "Programming", creditHours: "3", grade: "A" },
        { name: "Calculus", creditHours: "3", grade: "B" },
        { name: "Physics", creditHours: "4", grade: "A-" },
      ],
      thirdsScale,
    );

    expect(result.totalCreditHours).toBe(10);
    expect(result.totalQualityPoints).toBe(35.68);
    expect(result.gpa).toBe(3.57);
  });

  it("gives a different answer for the same grades on a different scale", () => {
    const courses = [
      { creditHours: 3, grade: "B+" },
      { creditHours: 3, grade: "B" },
    ];

    // thirds: (3x3.33 + 3x3.00) / 6 = 3.165 -> 3.17
    expect(calculateGpa(courses, thirdsScale).gpa).toBe(3.17);
    // halves: (3x3.50 + 3x3.00) / 6 = 3.25
    expect(calculateGpa(courses, halvesScale).gpa).toBe(3.25);
  });

  it("counts an F: the credit hours still divide, the points do not add", () => {
    const result = calculateGpa(
      [
        { creditHours: "3", grade: "A" },
        { creditHours: "3", grade: "F" },
      ],
      thirdsScale,
    );

    expect(result.totalCreditHours).toBe(6);
    expect(result.gpa).toBe(2);
  });

  it("accepts decimal credit hours", () => {
    // 1.5x4.00 + 3x3.00 = 15.00 / 4.5 = 3.333... -> 3.33
    const result = calculateGpa(
      [
        { creditHours: "1.5", grade: "A" },
        { creditHours: "3", grade: "B" },
      ],
      thirdsScale,
    );

    expect(result.totalCreditHours).toBe(4.5);
    expect(result.gpa).toBe(3.33);
  });

  it("accepts numbers as well as strings", () => {
    expect(calculateGpa([{ creditHours: 3, grade: "A" }], thirdsScale).gpa).toBe(4);
  });
});

/**
 * Regression test built from a REAL university result card.
 *
 * This is the strongest kind of test available here: the university printed
 * the GPA itself, so if our engine and our grade table are both right, the
 * number has to match exactly. It caught a genuine bug - IIUI had been given
 * an eleven-grade scale with minus grades, when its result card shows eight
 * grades in 0.50 steps.
 *
 * Add a case here whenever a student sends in a result card.
 */
describe("real result cards", () => {
  const iiui: GradingSystem = {
    gpaScale: 4,
    grades: [
      { grade: "A", gradePoint: 4.0 },
      { grade: "B+", gradePoint: 3.5 },
      { grade: "B", gradePoint: 3.0 },
      { grade: "C+", gradePoint: 2.5 },
      { grade: "C", gradePoint: 2.0 },
      { grade: "D+", gradePoint: 1.5 },
      { grade: "D", gradePoint: 1.0 },
      { grade: "F", gradePoint: 0.0 },
    ],
  };

  it("reproduces the GPA printed on an IIUI result card (Fall 2025)", () => {
    // Six courses, three credit hours each, as printed on the card.
    const result = calculateGpa(
      [
        { creditHours: 3, grade: "C+" },
        { creditHours: 3, grade: "B+" },
        { creditHours: 3, grade: "D" },
        { creditHours: 3, grade: "B+" },
        { creditHours: 3, grade: "C+" },
        { creditHours: 3, grade: "B+" },
      ],
      iiui,
    );

    expect(result.totalCreditHours).toBe(18);
    expect(result.totalQualityPoints).toBe(49.5);
    // The figure printed on the card.
    expect(result.gpa).toBe(2.75);
  });
});

describe("calculateGpa - empty and invalid input", () => {
  it("returns null instead of NaN when there is no input at all", () => {
    const result = calculateGpa([], thirdsScale);

    expect(result.gpa).toBeNull();
    expect(result.totalCreditHours).toBe(0);
    expect(result.errors.length).toBeGreaterThan(0);
  });

  it("skips completely empty rows without complaining", () => {
    const result = calculateGpa(
      [
        { creditHours: "3", grade: "A" },
        { creditHours: "", grade: "" },
        { name: "", creditHours: "   ", grade: "" },
      ],
      thirdsScale,
    );

    expect(result.gpa).toBe(4);
    expect(result.countedCourses).toBe(1);
    expect(result.rows[1].status).toBe("empty");
    expect(result.rows[1].error).toBeNull();
  });

  it("reports a row that has credit hours but no grade", () => {
    const result = calculateGpa([{ creditHours: "3", grade: "" }], thirdsScale);

    expect(result.gpa).toBeNull();
    expect(result.rows[0].status).toBe("invalid");
    expect(result.rows[0].error).toMatch(/grade/i);
  });

  it("rejects a grade that is not in this university's table", () => {
    const result = calculateGpa([{ creditHours: "3", grade: "A-" }], halvesScale);

    expect(result.gpa).toBeNull();
    expect(result.rows[0].error).toMatch(/grade table/i);
  });

  it("rejects zero, negative and non-numeric credit hours", () => {
    const result = calculateGpa(
      [
        { creditHours: "0", grade: "A" },
        { creditHours: "-3", grade: "A" },
        { creditHours: "abc", grade: "A" },
        { creditHours: "999", grade: "A" },
      ],
      thirdsScale,
    );

    expect(result.gpa).toBeNull();
    expect(result.countedCourses).toBe(0);
    result.rows.forEach((row) => expect(row.status).toBe("invalid"));
  });

  it("still calculates from the valid rows when one row is broken", () => {
    const result = calculateGpa(
      [
        { creditHours: "3", grade: "A" },
        { creditHours: "abc", grade: "B" },
      ],
      thirdsScale,
    );

    expect(result.countedCourses).toBe(1);
    expect(result.gpa).toBe(4);
    expect(result.rows[1].error).not.toBeNull();
  });

  it("never produces NaN or Infinity", () => {
    const result = calculateGpa(
      [{ creditHours: "0", grade: "A" }],
      thirdsScale,
    );

    expect(Number.isNaN(result.gpa as number)).toBe(false);
    expect(result.gpa).toBeNull();
  });
});
