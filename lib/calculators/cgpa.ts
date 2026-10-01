/**
 * CUMULATIVE CGPA ENGINE
 *
 * The ONLY place where CGPA is calculated. Pure function, no React,
 * no database. Every university uses it; only the GradingSystem changes.
 *
 *   quality points of a semester = semester GPA x semester credit hours
 *   CGPA = SUM(quality points of all semesters) / SUM(credit hours of all semesters)
 */

import type {
  CgpaResult,
  GradingSystem,
  SemesterInput,
  SemesterRowResult,
} from "./types";
import {
  MAX_SEMESTER_CREDIT_HOURS,
  isBlank,
  parseCreditHours,
  parseGpaValue,
  roundTo,
} from "./validation";

/**
 * Calculates the cumulative CGPA across semesters.
 *
 * Empty rows are skipped silently. Half-filled or out-of-range rows are
 * reported through `rows[i].error` and are not counted.
 */
export function calculateCgpa(
  semesters: SemesterInput[],
  gradingSystem: GradingSystem,
): CgpaResult {
  const rows: SemesterRowResult[] = [];
  const errors: string[] = [];

  let totalCreditHours = 0;
  let totalQualityPoints = 0;
  let countedSemesters = 0;

  semesters.forEach((semester, index) => {
    const gpaBlank = isBlank(semester.gpa);
    const creditHoursBlank = isBlank(semester.creditHours);

    // Completely empty row: ignore it, it is not an error.
    if (gpaBlank && creditHoursBlank) {
      rows.push(emptyRow(index));
      return;
    }

    const gpa = parseGpaValue(semester.gpa, gradingSystem.gpaScale);
    if (!gpa.ok) {
      rows.push(invalidRow(index, gpa.error));
      return;
    }

    const creditHours = parseCreditHours(
      semester.creditHours,
      MAX_SEMESTER_CREDIT_HOURS,
    );
    if (!creditHours.ok) {
      rows.push(invalidRow(index, creditHours.error));
      return;
    }

    const qualityPoints = gpa.value * creditHours.value;

    totalCreditHours += creditHours.value;
    totalQualityPoints += qualityPoints;
    countedSemesters += 1;

    rows.push({
      index,
      status: "counted",
      gpa: gpa.value,
      creditHours: creditHours.value,
      qualityPoints: roundTo(qualityPoints),
      error: null,
    });
  });

  if (countedSemesters === 0) {
    errors.push("Add at least one semester with a GPA and its credit hours.");
    return {
      cgpa: null,
      totalCreditHours: 0,
      totalQualityPoints: 0,
      countedSemesters: 0,
      rows,
      errors,
    };
  }

  return {
    cgpa: roundTo(totalQualityPoints / totalCreditHours),
    totalCreditHours: roundTo(totalCreditHours),
    totalQualityPoints: roundTo(totalQualityPoints),
    countedSemesters,
    rows,
    errors,
  };
}

function emptyRow(index: number): SemesterRowResult {
  return {
    index,
    status: "empty",
    gpa: null,
    creditHours: null,
    qualityPoints: null,
    error: null,
  };
}

function invalidRow(index: number, error: string): SemesterRowResult {
  return {
    index,
    status: "invalid",
    gpa: null,
    creditHours: null,
    qualityPoints: null,
    error,
  };
}
