/**
 * Tests for the marks -> grade lookup.
 */

import { describe, expect, it } from "vitest";

import { gradeForMarks, hasMarksRanges } from "@/lib/calculators/marks";
import type { GradeOption } from "@/lib/calculators/types";

/** University of Gujrat: bands of 5 marks, A+ above 84.5, F below 49.5. */
const uog: GradeOption[] = [
  { grade: "A+", gradePoint: 4.0, minPercentage: 84.5, maxPercentage: 100 },
  { grade: "A", gradePoint: 3.7, minPercentage: 79.5, maxPercentage: 84.5 },
  { grade: "B+", gradePoint: 3.4, minPercentage: 74.5, maxPercentage: 79.5 },
  { grade: "B", gradePoint: 3.0, minPercentage: 69.5, maxPercentage: 74.5 },
  { grade: "B-", gradePoint: 2.5, minPercentage: 64.5, maxPercentage: 69.5 },
  { grade: "C+", gradePoint: 2.0, minPercentage: 59.5, maxPercentage: 64.5 },
  { grade: "C", gradePoint: 1.5, minPercentage: 54.5, maxPercentage: 59.5 },
  { grade: "D", gradePoint: 1.0, minPercentage: 49.5, maxPercentage: 54.5 },
  { grade: "F", gradePoint: 0, minPercentage: 0, maxPercentage: 49.5 },
];

const noRanges: GradeOption[] = [
  { grade: "A", gradePoint: 4 },
  { grade: "F", gradePoint: 0 },
];

describe("hasMarksRanges", () => {
  it("is true only when the table has marks ranges", () => {
    expect(hasMarksRanges(uog)).toBe(true);
    expect(hasMarksRanges(noRanges)).toBe(false);
    expect(hasMarksRanges([{ grade: "A", gradePoint: 4, minPercentage: null, maxPercentage: null }])).toBe(false);
  });
});

describe("gradeForMarks", () => {
  const grade = (marks: string | number) => {
    const result = gradeForMarks(marks, uog);
    return result.status === "ok" ? result.grade : result.status;
  };

  it("maps marks inside each band to its grade", () => {
    expect(grade(100)).toBe("A+");
    expect(grade(90)).toBe("A+");
    expect(grade(82)).toBe("A");
    expect(grade(77)).toBe("B+");
    expect(grade(72)).toBe("B");
    expect(grade(67)).toBe("B-");
    expect(grade(62)).toBe("C+");
    expect(grade(57)).toBe("C");
    expect(grade(52)).toBe("D");
    expect(grade(30)).toBe("F");
    expect(grade(0)).toBe("F");
  });

  it("includes the lower bound of each band", () => {
    expect(grade(84.5)).toBe("A+");
    expect(grade(79.5)).toBe("A");
    expect(grade(49.5)).toBe("D");
    expect(grade(49.4)).toBe("F");
    expect(grade(84.4)).toBe("A");
  });

  it("treats a blank box as empty and rejects bad input", () => {
    expect(grade("")).toBe("empty");
    expect(grade("   ")).toBe("empty");
    expect(grade("abc")).toBe("invalid");
    expect(grade(101)).toBe("invalid");
    expect(grade(-1)).toBe("invalid");
  });

  it("accepts marks typed as text", () => {
    expect(grade("78")).toBe("B+");
    expect(grade(" 85 ")).toBe("A+");
  });

  it("handles IIUI-style ranges where the top range ends at 100", () => {
    const iiui: GradeOption[] = [
      { grade: "A", gradePoint: 4, minPercentage: 80, maxPercentage: 100 },
      { grade: "B+", gradePoint: 3.5, minPercentage: 75, maxPercentage: 80 },
      { grade: "F", gradePoint: 0, minPercentage: 0, maxPercentage: 50 },
    ];
    const result = gradeForMarks(80, iiui);
    expect(result).toEqual({ status: "ok", grade: "A" });
    expect(gradeForMarks(79.9, iiui)).toEqual({ status: "ok", grade: "B+" });
  });
});
