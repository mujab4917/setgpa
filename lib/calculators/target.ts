import { findGradePoint } from "./gpa";
import type { GradingSystem } from "./types";
import { isBlank, parseCreditHours, roundTo } from "./validation";

export function calculateTargetGpa(current: number, completed: number, upcoming: number, target: number, scale: number) {
  if (![current, completed, upcoming, target, scale].every(Number.isFinite) || scale <= 0 || current < 0 || current > scale || target < 0 || target > scale || completed < 0 || upcoming <= 0) {
    return null;
  }
  const required = (target * (completed + upcoming) - current * completed) / upcoming;
  return {
    required: Math.max(0, required),
    possible: required <= scale + 1e-10,
    bestPossible: (current * completed + scale * upcoming) / (completed + upcoming),
  };
}

export type TargetPlannerField = "current" | "completed" | "upcoming" | "target";

// -----------------------------------------------------------------------------
// PER-COURSE TARGET PLANNER
//
// calculateTargetGpa() above answers "what average GPA do I need across my
// upcoming credits". This section answers the more concrete question a
// student actually has in front of them: "I have these specific courses left
// - what grade do I need in each one?"
//
// A student can leave a course's grade blank ("not decided yet") or lock one
// in ("I already know/expect a B+ in this one"). Locked courses use their
// real quality points; blank courses share whatever average is still needed
// for the target, recalculated live as courses get locked. This one table
// covers both "just suggest an average" (nothing locked) and "let me plug in
// grades and see" (everything locked) - the two are ends of the same slider,
// not separate modes.
// -----------------------------------------------------------------------------

/** Raw input for one row of the per-course planner, as typed into the form. */
export interface TargetCourseInput {
  creditHours: string;
  /** A grade letter from the university's grade table, or "" to leave it open. */
  grade: string;
}

export type TargetCourseRowStatus = "empty" | "invalid" | "locked" | "open";

export interface TargetCourseRowResult {
  index: number;
  status: TargetCourseRowStatus;
  creditHours: number | null;
  /** Set when status is "locked": the grade point of the chosen letter grade. */
  gradePoint: number | null;
  /**
   * Set when status is "open" and the plan is possible: the average grade
   * point this course needs to carry its share of the remaining target.
   */
  suggestedGradePoint: number | null;
  /** Nearest real letter grade (at or above the suggestion) from the grade table, when one is available. */
  suggestedGradeLetter: string | null;
  error: string | null;
}

export interface PerCourseTargetResult {
  /** Average GPA still needed across the open (not-yet-graded) courses. Null when every course is locked. */
  requiredForOpen: number | null;
  /** Whether the plan is achievable: open courses can still average requiredForOpen within the scale. */
  possible: boolean;
  /** The best CGPA reachable if every open course gets a perfect grade. */
  bestPossible: number;
  /** The CGPA this plan actually produces: locked grades as given, open courses at their suggested average. */
  projectedCgpa: number;
  totalUpcomingCredits: number;
  openCredits: number;
  lockedCredits: number;
  rows: TargetCourseRowResult[];
  errors: string[];
}

/**
 * Finds the cheapest real letter grade that still meets a required grade
 * point - the plain-language answer to "so what grade is that, actually?".
 * Returns the top grade in the table when even a perfect grade falls short,
 * so the UI can show "even an A- isn't quite enough" instead of nothing.
 */
export function nearestAchievableGrade(
  requiredPoint: number,
  gradingSystem: GradingSystem,
): string | null {
  if (gradingSystem.grades.length === 0) return null;

  const sorted = [...gradingSystem.grades].sort((a, b) => a.gradePoint - b.gradePoint);
  const match = sorted.find((option) => option.gradePoint >= requiredPoint - 1e-9);
  return (match ?? sorted[sorted.length - 1]).grade;
}

/**
 * Plans grades across a specific list of upcoming courses instead of a single
 * blended average. Pure function: same input -> same output.
 *
 * `gradingSystem` is optional - without it, locked grades cannot be resolved
 * (there is no table to look them up in), so every course is treated as open
 * and only credit hours matter, same as calculateTargetGpa() but per row.
 */
export function calculatePerCourseTarget(
  current: number,
  completed: number,
  target: number,
  scale: number,
  courses: TargetCourseInput[],
  gradingSystem?: GradingSystem,
): PerCourseTargetResult | null {
  if (
    ![current, completed, target, scale].every(Number.isFinite) ||
    scale <= 0 ||
    current < 0 ||
    current > scale ||
    target < 0 ||
    target > scale ||
    completed < 0
  ) {
    return null;
  }

  const rows: TargetCourseRowResult[] = [];
  const errors: string[] = [];

  let openCredits = 0;
  let lockedCredits = 0;
  let lockedQualityPoints = 0;

  courses.forEach((course, index) => {
    const creditBlank = isBlank(course.creditHours);
    const gradeBlank = isBlank(course.grade);

    if (creditBlank && gradeBlank) {
      rows.push({ index, status: "empty", creditHours: null, gradePoint: null, suggestedGradePoint: null, suggestedGradeLetter: null, error: null });
      return;
    }

    const parsedCredits = parseCreditHours(course.creditHours);
    if (!parsedCredits.ok) {
      rows.push({ index, status: "invalid", creditHours: null, gradePoint: null, suggestedGradePoint: null, suggestedGradeLetter: null, error: parsedCredits.error });
      return;
    }

    if (gradeBlank) {
      openCredits += parsedCredits.value;
      rows.push({ index, status: "open", creditHours: parsedCredits.value, gradePoint: null, suggestedGradePoint: null, suggestedGradeLetter: null, error: null });
      return;
    }

    if (!gradingSystem) {
      rows.push({ index, status: "invalid", creditHours: null, gradePoint: null, suggestedGradePoint: null, suggestedGradeLetter: null, error: "No grade table is set yet - leave this open or pick a university first." });
      return;
    }

    const gradePoint = findGradePoint(course.grade, gradingSystem);
    if (gradePoint === null) {
      rows.push({ index, status: "invalid", creditHours: null, gradePoint: null, suggestedGradePoint: null, suggestedGradeLetter: null, error: "This grade is not in the grade table." });
      return;
    }

    lockedCredits += parsedCredits.value;
    lockedQualityPoints += parsedCredits.value * gradePoint;
    rows.push({ index, status: "locked", creditHours: parsedCredits.value, gradePoint, suggestedGradePoint: null, suggestedGradeLetter: null, error: null });
  });

  const totalUpcomingCredits = roundTo(openCredits + lockedCredits, 4);

  if (totalUpcomingCredits <= 0) {
    errors.push("Add at least one upcoming course with its credit hours.");
    return {
      requiredForOpen: null,
      possible: false,
      bestPossible: current,
      projectedCgpa: current,
      totalUpcomingCredits: 0,
      openCredits: 0,
      lockedCredits: 0,
      rows,
      errors,
    };
  }

  const totalCredits = completed + totalUpcomingCredits;
  const bestPossible = roundTo((current * completed + lockedQualityPoints + scale * openCredits) / totalCredits);

  if (openCredits <= 0) {
    // Every upcoming course is locked in: nothing left to solve for, just
    // report the CGPA this plan produces and whether it clears the target.
    const projectedCgpa = roundTo((current * completed + lockedQualityPoints) / totalCredits);
    return {
      requiredForOpen: null,
      possible: projectedCgpa >= target - 1e-9,
      bestPossible: projectedCgpa,
      projectedCgpa,
      totalUpcomingCredits,
      openCredits: 0,
      lockedCredits: roundTo(lockedCredits, 4),
      rows,
      errors,
    };
  }

  const requiredRaw = (target * totalCredits - current * completed - lockedQualityPoints) / openCredits;
  const requiredForOpen = Math.max(0, requiredRaw);
  const possible = requiredForOpen <= scale + 1e-10;
  const appliedOpenPoint = Math.min(requiredForOpen, scale);
  const projectedCgpa = roundTo((current * completed + lockedQualityPoints + appliedOpenPoint * openCredits) / totalCredits);
  const suggestedLetter = gradingSystem ? nearestAchievableGrade(requiredForOpen, gradingSystem) : null;

  const finalRows = rows.map((row) =>
    row.status === "open"
      ? { ...row, suggestedGradePoint: roundTo(appliedOpenPoint), suggestedGradeLetter: suggestedLetter }
      : row,
  );

  return {
    requiredForOpen: roundTo(requiredForOpen),
    possible,
    bestPossible,
    projectedCgpa,
    totalUpcomingCredits,
    openCredits: roundTo(openCredits, 4),
    lockedCredits: roundTo(lockedCredits, 4),
    rows: finalRows,
    errors,
  };
}

/**
 * A friendly, field-specific validation message for the target GPA planner
 * UI - the same rules calculateTargetGpa() enforces, but explained in one
 * short sentence instead of the browser's generic "value must be ≤ 4"
 * native-validation tooltip (which also can't explain WHY, e.g. that credit
 * hours and CGPA are different units and only one of them is capped by the
 * scale).
 *
 * Returns null when the raw text is empty (an empty field is "incomplete",
 * not "invalid" - callers show that state differently) or when the value is
 * valid.
 */
export function describeTargetFieldError(
  field: TargetPlannerField,
  rawValue: string,
  scale: number,
): string | null {
  if (rawValue.trim() === "") return null;

  const value = Number(rawValue);
  if (!Number.isFinite(value)) return "Enter a number.";

  if (field === "current" || field === "target") {
    if (value < 0) return "This can't be negative.";
    if (scale > 0 && value > scale) return `Can't be higher than your ${scale.toFixed(2)} scale.`;
    return null;
  }

  if (field === "completed") {
    return value < 0 ? "This can't be negative." : null;
  }

  // field === "upcoming"
  return value <= 0 ? "Enter at least some upcoming credit hours." : null;
}
