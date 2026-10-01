import { describe, expect, it } from "vitest";
import {
  calculatePerCourseTarget,
  calculateTargetGpa,
  describeTargetFieldError,
  nearestAchievableGrade,
} from "../lib/calculators/target";
import type { GradingSystem } from "../lib/calculators/types";

const fourPointScale: GradingSystem = {
  gpaScale: 4,
  grades: [
    { grade: "A", gradePoint: 4 },
    { grade: "A-", gradePoint: 3.67 },
    { grade: "B+", gradePoint: 3.33 },
    { grade: "B", gradePoint: 3 },
    { grade: "B-", gradePoint: 2.67 },
    { grade: "C", gradePoint: 2 },
    { grade: "F", gradePoint: 0 },
  ],
};

describe("target GPA planning", () => {
  it("weights completed and upcoming credits", () => {
    expect(calculateTargetGpa(3, 60, 15, 3.2, 4)).toEqual({ required: 4, possible: true, bestPossible: 3.2 });
  });
  it("identifies an unreachable target", () => {
    expect(calculateTargetGpa(2, 60, 15, 3.5, 4)?.possible).toBe(false);
  });
  it("supports students without completed credits and different scales", () => {
    expect(calculateTargetGpa(0, 0, 15, 4.5, 5)?.required).toBe(4.5);
  });
  it("clamps an already secured target to zero", () => {
    expect(calculateTargetGpa(4, 90, 15, 3, 4)?.required).toBe(0);
  });
  it.each([[3, 60, 0, 3.5, 4], [5, 60, 15, 3, 4], [3, -1, 15, 3, 4], [3, 60, 15, 5, 4], [NaN, 60, 15, 3, 4]])("rejects invalid values", (...values) => {
    expect(calculateTargetGpa(...values as [number, number, number, number, number])).toBeNull();
  });
});

describe("target GPA field validation messages", () => {
  it("has no message for an empty field", () => {
    expect(describeTargetFieldError("current", "", 4)).toBeNull();
  });
  it("has no message for a valid value", () => {
    expect(describeTargetFieldError("current", "3.2", 4)).toBeNull();
    expect(describeTargetFieldError("completed", "60", 4)).toBeNull();
    expect(describeTargetFieldError("upcoming", "15", 4)).toBeNull();
  });
  it("rejects non-numeric text", () => {
    expect(describeTargetFieldError("current", "abc", 4)).toMatch(/number/i);
  });
  it("caps CGPA fields at the scale but not credit-hour fields", () => {
    expect(describeTargetFieldError("current", "4.5", 4)).toMatch(/scale/i);
    expect(describeTargetFieldError("target", "4.5", 4)).toMatch(/scale/i);
    expect(describeTargetFieldError("completed", "90", 4)).toBeNull();
  });
  it("rejects negative values", () => {
    expect(describeTargetFieldError("current", "-1", 4)).toMatch(/negative/i);
    expect(describeTargetFieldError("completed", "-1", 4)).toMatch(/negative/i);
  });
  it("requires at least some upcoming credit hours", () => {
    expect(describeTargetFieldError("upcoming", "0", 4)).toMatch(/upcoming/i);
  });
});

describe("nearestAchievableGrade", () => {
  it("picks the cheapest grade that clears the requirement", () => {
    expect(nearestAchievableGrade(3.1, fourPointScale)).toBe("B+");
    expect(nearestAchievableGrade(3.33, fourPointScale)).toBe("B+");
    expect(nearestAchievableGrade(0, fourPointScale)).toBe("F");
  });
  it("falls back to the top grade when nothing reaches the requirement", () => {
    expect(nearestAchievableGrade(4.5, fourPointScale)).toBe("A");
  });
  it("returns null for an empty grade table", () => {
    expect(nearestAchievableGrade(3, { gpaScale: 4, grades: [] })).toBeNull();
  });
});

describe("calculatePerCourseTarget", () => {
  it("matches calculateTargetGpa's even split when every course is open", () => {
    const result = calculatePerCourseTarget(3, 60, 3.2, 4, [
      { creditHours: "9", grade: "" },
      { creditHours: "6", grade: "" },
    ]);
    const blended = calculateTargetGpa(3, 60, 15, 3.2, 4);
    expect(result?.requiredForOpen).toBe(blended?.required);
    expect(result?.possible).toBe(blended?.possible);
    expect(result?.openCredits).toBe(15);
    expect(result?.lockedCredits).toBe(0);
  });

  it("recomputes the requirement for the remaining open courses when one is locked", () => {
    // Needs a 3.2 average over 15 credits (60 completed at 3.0). Locking a
    // perfect A in a 3-credit course should lower what the other 12 need.
    const result = calculatePerCourseTarget(3, 60, 3.2, 4, [
      { creditHours: "3", grade: "A" },
      { creditHours: "12", grade: "" },
    ], fourPointScale);
    expect(result?.rows[0]).toMatchObject({ status: "locked", gradePoint: 4 });
    expect(result?.rows[1].status).toBe("open");
    // (3.2*75 - 3*60 - 3*4) / 12 = (240 - 180 - 12) / 12 = 4
    expect(result?.requiredForOpen).toBe(4);
    expect(result?.rows[1].suggestedGradeLetter).toBe("A");
  });

  it("reports the resulting CGPA directly once every course is locked", () => {
    const result = calculatePerCourseTarget(3, 60, 3.2, 4, [
      { creditHours: "9", grade: "A" },
      { creditHours: "6", grade: "B" },
    ], fourPointScale);
    // (3*60 + 9*4 + 6*3) / 75 = (180 + 36 + 18) / 75 = 3.12
    expect(result?.requiredForOpen).toBeNull();
    expect(result?.projectedCgpa).toBe(3.12);
    expect(result?.possible).toBe(false); // 3.12 < 3.2 target
  });

  it("flags an unreachable target and still reports the best possible CGPA", () => {
    const result = calculatePerCourseTarget(2, 60, 3.9, 4, [
      { creditHours: "15", grade: "" },
    ]);
    expect(result?.possible).toBe(false);
    expect(result?.bestPossible).toBeCloseTo((2 * 60 + 4 * 15) / 75, 5);
  });

  it("skips blank rows and flags invalid ones", () => {
    const result = calculatePerCourseTarget(3, 60, 3.2, 4, [
      { creditHours: "", grade: "" },
      { creditHours: "-3", grade: "" },
      { creditHours: "12", grade: "" },
    ]);
    expect(result?.rows[0].status).toBe("empty");
    expect(result?.rows[1].status).toBe("invalid");
    expect(result?.openCredits).toBe(12);
  });

  it("flags a locked grade with no grade table to resolve it against", () => {
    const result = calculatePerCourseTarget(3, 60, 3.2, 4, [
      { creditHours: "3", grade: "A" },
    ]);
    expect(result?.rows[0].status).toBe("invalid");
  });

  it("flags a grade letter that isn't in the table", () => {
    const result = calculatePerCourseTarget(3, 60, 3.2, 4, [
      { creditHours: "3", grade: "Z" },
    ], fourPointScale);
    expect(result?.rows[0].status).toBe("invalid");
  });

  it("requires at least one course with credit hours", () => {
    const result = calculatePerCourseTarget(3, 60, 3.2, 4, [{ creditHours: "", grade: "" }]);
    expect(result?.totalUpcomingCredits).toBe(0);
    expect(result?.errors.length).toBeGreaterThan(0);
  });

  it("rejects invalid top-level values", () => {
    expect(calculatePerCourseTarget(NaN, 60, 3.2, 4, [{ creditHours: "3", grade: "" }])).toBeNull();
    expect(calculatePerCourseTarget(5, 60, 3.2, 4, [{ creditHours: "3", grade: "" }])).toBeNull();
  });
});
