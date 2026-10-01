/**
 * SEMESTER GPA ENGINE
 *
 * This is the ONLY place where GPA is calculated. It is a pure function:
 * same input -> same output, no React, no database, no browser APIs.
 * Every university uses it; only the GradingSystem argument changes.
 *
 *   GPA = SUM(credit hours x grade point) / SUM(credit hours)
 */

import type {
  CourseInput,
  CourseRowResult,
  GpaResult,
  GradingSystem,
} from "./types";
import { isBlank, parseCreditHours, roundTo } from "./validation";

/** Looks up a grade letter in the university's grade table. */
export function findGradePoint(
  grade: string,
  gradingSystem: GradingSystem,
): number | null {
  const needle = grade.trim().toUpperCase();
  const match = gradingSystem.grades.find(
    (option) => option.grade.trim().toUpperCase() === needle,
  );
  return match ? match.gradePoint : null;
}

/**
 * Calculates the semester GPA for a list of courses.
 *
 * Rows that are completely empty are skipped silently, so a student can leave
 * spare rows in the form. Rows that are half-filled or invalid are reported
 * through `rows[i].error` and are not counted.
 */
export function calculateGpa(
  courses: CourseInput[],
  gradingSystem: GradingSystem,
): GpaResult {
  const rows: CourseRowResult[] = [];
  const errors: string[] = [];

  let totalCreditHours = 0;
  let totalQualityPoints = 0;
  let countedCourses = 0;

  courses.forEach((course, index) => {
    const creditHoursBlank = isBlank(course.creditHours);
    const gradeBlank = isBlank(course.grade);

    // Completely empty row: ignore it, it is not an error.
    if (creditHoursBlank && gradeBlank) {
      rows.push(emptyRow(index));
      return;
    }

    if (gradeBlank) {
      rows.push(invalidRow(index, "Select a grade."));
      return;
    }

    const gradePoint = findGradePoint(course.grade, gradingSystem);
    if (gradePoint === null) {
      rows.push(invalidRow(index, "This grade is not in the university's grade table."));
      return;
    }

    const creditHours = parseCreditHours(course.creditHours);
    if (!creditHours.ok) {
      rows.push(invalidRow(index, creditHours.error));
      return;
    }

    const qualityPoints = creditHours.value * gradePoint;

    totalCreditHours += creditHours.value;
    totalQualityPoints += qualityPoints;
    countedCourses += 1;

    rows.push({
      index,
      status: "counted",
      creditHours: creditHours.value,
      gradePoint,
      qualityPoints: roundTo(qualityPoints),
      error: null,
    });
  });

  if (countedCourses === 0) {
    errors.push("Add at least one course with credit hours and a grade.");
    return {
      gpa: null,
      totalCreditHours: 0,
      totalQualityPoints: 0,
      countedCourses: 0,
      rows,
      errors,
    };
  }

  return {
    gpa: roundTo(totalQualityPoints / totalCreditHours),
    totalCreditHours: roundTo(totalCreditHours),
    totalQualityPoints: roundTo(totalQualityPoints),
    countedCourses,
    rows,
    errors,
  };
}

function emptyRow(index: number): CourseRowResult {
  return {
    index,
    status: "empty",
    creditHours: null,
    gradePoint: null,
    qualityPoints: null,
    error: null,
  };
}

function invalidRow(index: number, error: string): CourseRowResult {
  return {
    index,
    status: "invalid",
    creditHours: null,
    gradePoint: null,
    qualityPoints: null,
    error,
  };
}
