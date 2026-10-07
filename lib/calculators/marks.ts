/**
 * Marks -> grade lookup, for universities that publish a marks range for each
 * grade (stored as minPercentage / maxPercentage on the grade rows).
 *
 * A range includes its lower bound and excludes its upper bound, except at
 * the very top. So with A = 79.5 to 84.5 and A+ = 84.5 to 100, exactly 84.5
 * is an A+, and exactly 79.5 is an A. Universities that publish no ranges
 * never get a marks box at all; nothing is ever guessed.
 */

import type { GradeOption } from "./types";

export type MarksLookup =
  | { status: "empty" }
  | { status: "invalid"; message: string }
  | { status: "ok"; grade: string };

interface RangedGrade {
  grade: string;
  min: number;
  max: number;
}

function rangedGrades(grades: GradeOption[]): RangedGrade[] {
  return grades
    .filter(
      (option) =>
        typeof option.minPercentage === "number" && typeof option.maxPercentage === "number",
    )
    .map((option) => ({
      grade: option.grade,
      min: option.minPercentage as number,
      max: option.maxPercentage as number,
    }));
}

/** True when the grade table has marks ranges, so the marks box can be shown. */
export function hasMarksRanges(grades: GradeOption[]): boolean {
  return rangedGrades(grades).length > 0;
}

export function gradeForMarks(input: string | number, grades: GradeOption[]): MarksLookup {
  const text = String(input ?? "").trim();
  if (text === "") return { status: "empty" };

  const marks = Number(text);
  if (!Number.isFinite(marks)) {
    return { status: "invalid", message: "Enter marks as a number, for example 78." };
  }
  if (marks < 0 || marks > 100) {
    return { status: "invalid", message: "Marks must be between 0 and 100." };
  }

  // Highest range first: the first one whose lower bound the marks reach wins.
  const ranges = rangedGrades(grades).sort((a, b) => b.min - a.min);
  const match = ranges.find((range) => marks >= range.min && marks <= range.max);
  if (!match) {
    return { status: "invalid", message: "These marks are not covered by the grade table." };
  }
  return { status: "ok", grade: match.grade };
}
