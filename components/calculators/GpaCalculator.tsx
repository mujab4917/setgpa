"use client";

/**
 * SEMESTER GPA CALCULATOR (Client Component).
 *
 * This file only handles the FORM: rows, typing, adding and removing courses.
 * The arithmetic lives in lib/calculators/gpa.ts, and the grade list comes
 * from the database through the `gradingSystem` prop - which is why the same
 * component works for every university.
 */

import { useMemo, useRef, useState } from "react";
import { trackEvent } from "@/lib/analytics";

import { ResultSummary } from "@/components/calculators/ResultSummary";
import {
  ROW_EXIT_MS,
  fieldLabelClass,
  gradeColor,
  inputClass,
  invalidInputClass,
  primaryButtonClass,
  removeButtonClass,
  rowErrorClass,
  secondaryButtonClass,
} from "@/components/calculators/calculator-ui";
import { calculateGpa, findGradePoint } from "@/lib/calculators/gpa";
import type { GradingSystem } from "@/lib/calculators/types";
import {
  formatGpa,
  formatPercentage,
  formatPoints,
  gpaToPercentage,
} from "@/lib/calculators/validation";
import { parseUniversityPath, routes } from "@/lib/routes";

interface CourseRow {
  id: string;
  name: string;
  creditHours: string;
  grade: string;
}

const STARTING_ROWS = 3;

function makeRow(id: string): CourseRow {
  return { id, name: "", creditHours: "", grade: "" };
}

function makeInitialRows(): CourseRow[] {
  return Array.from({ length: STARTING_ROWS }, (_, index) =>
    makeRow(`course-${index + 1}`),
  );
}

interface GpaCalculatorProps {
  gradingSystem: GradingSystem;
  /** Used in the copied text so a shared result says which university it is for. */
  universityName: string;
  /** Absolute URL of this page, added to the copied text. */
  shareUrl: string;
}

export function GpaCalculator({
  gradingSystem,
  universityName,
  shareUrl,
}: GpaCalculatorProps) {
  const universityPath = parseUniversityPath(shareUrl);
  const [rows, setRows] = useState<CourseRow[]>(makeInitialRows);
  // Errors only appear after the student presses "Calculate", so the form does
  // not shout at them while they are still typing.
  const [showErrors, setShowErrors] = useState(false);
  // Rows that were just added animate in; rows being removed animate out
  // before they actually leave the list.
  const [enteringId, setEnteringId] = useState<string | null>(null);
  const [leavingIds, setLeavingIds] = useState<string[]>([]);
  // Changing this forces the error message to replay its animation.
  const [errorNonce, setErrorNonce] = useState(0);

  // A plain counter keeps row ids stable and identical on server and client.
  const nextRowNumber = useRef(STARTING_ROWS + 1);

  // Recalculated only when the rows or the grading system change.
  const result = useMemo(
    () => calculateGpa(rows, gradingSystem),
    [rows, gradingSystem],
  );

  // Plain-text summary for the "Copy result" button. Null until there is a result.
  const copyText = useMemo(() => {
    if (result.gpa === null) return null;
    return [
      `${universityName} - Semester GPA: ${formatGpa(result.gpa)} / ${formatPoints(gradingSystem.gpaScale)}`,
      `Percentage (approx.): ${formatPercentage(gpaToPercentage(result.gpa, gradingSystem.gpaScale))}`,
      `Total credit hours: ${formatPoints(result.totalCreditHours)}`,
      `Total grade points: ${formatPoints(result.totalQualityPoints)}`,
      `Courses counted: ${result.countedCourses}`,
      shareUrl,
    ].join("\n");
  }, [result, gradingSystem.gpaScale, universityName, shareUrl]);

  function updateRow(id: string, field: keyof Omit<CourseRow, "id">, value: string) {
    setRows((current) =>
      current.map((row) => (row.id === id ? { ...row, [field]: value } : row)),
    );
  }

  function addRow() {
    const id = `course-${nextRowNumber.current++}`;
    setRows((current) => [...current, makeRow(id)]);
    setEnteringId(id);
  }

  function removeRow(id: string) {
    if (rows.length === 1) return;

    // Play the exit animation first, then drop the row from state.
    setLeavingIds((current) => [...current, id]);
    window.setTimeout(() => {
      setRows((current) => current.filter((row) => row.id !== id));
      setLeavingIds((current) => current.filter((leavingId) => leavingId !== id));
    }, ROW_EXIT_MS);
  }

  function reset() {
    nextRowNumber.current = STARTING_ROWS + 1;
    setRows(makeInitialRows());
    setShowErrors(false);
    setEnteringId(null);
    setLeavingIds([]);
  }

  return (
    <div className="p-4 sm:p-6">
      <form
        onSubmit={(event) => {
          event.preventDefault();
          setShowErrors(true);
          setErrorNonce((value) => value + 1);
          trackEvent("calculate_gpa", {
            university: universityName,
            courses_counted: result.countedCourses,
            valid: result.gpa !== null,
          });
        }}
        noValidate
      >
        <ul className="space-y-4">
          {rows.map((row, index) => {
            const rowResult = result.rows[index];
            const error = showErrors ? (rowResult?.error ?? null) : null;
            const leaving = leavingIds.includes(row.id);
            const gradePoint = findGradePoint(row.grade, gradingSystem);

            return (
              <li
                key={row.id}
                className={`rounded-xl border border-ink-900/10 p-3 transition-colors sm:border-0 sm:p-0 ${
                  leaving ? "animate-row-out" : ""
                } ${row.id === enteringId && !leaving ? "animate-row-in" : ""}`}
              >
                <div className="grid grid-cols-[5rem_1fr_auto] items-end gap-2.5 sm:grid-cols-[1fr_7rem_8rem_auto] sm:gap-3">
                  <div className="col-span-3 sm:col-span-1">
                    <label className={fieldLabelClass} htmlFor={`${row.id}-name`}>
                      Course name (optional)
                    </label>
                    <input
                      id={`${row.id}-name`}
                      type="text"
                      value={row.name}
                      onChange={(event) =>
                        updateRow(row.id, "name", event.target.value)
                      }
                      placeholder={`Course ${index + 1}`}
                      className={inputClass}
                      autoComplete="off"
                    />
                  </div>

                  <div>
                    <label
                      className={fieldLabelClass}
                      htmlFor={`${row.id}-credit-hours`}
                    >
                      Credit hours
                    </label>
                    <input
                      id={`${row.id}-credit-hours`}
                      // inputMode="decimal" shows the number keypad on phones.
                      type="number"
                      inputMode="decimal"
                      min={0.5}
                      max={24}
                      step={0.5}
                      value={row.creditHours}
                      onChange={(event) =>
                        updateRow(row.id, "creditHours", event.target.value)
                      }
                      placeholder="3"
                      aria-invalid={error ? true : undefined}
                      className={`${inputClass} ${error ? `${invalidInputClass} animate-nudge` : ""}`}
                    />
                  </div>

                  <div>
                    <label className={fieldLabelClass} htmlFor={`${row.id}-grade`}>
                      Grade
                    </label>
                    <div className="relative">
                      {/* Colour dot for the chosen grade. Native <select>
                          options cannot be styled reliably across browsers,
                          so the indicator sits beside the control instead. */}
                      {gradePoint !== null && (
                        <span
                          aria-hidden="true"
                          className="pointer-events-none absolute left-3 top-1/2 z-10 mt-0.5 h-2.5 w-2.5 -translate-y-1/2 rounded-full transition-colors"
                          style={{
                            backgroundColor: gradeColor(
                              gradePoint,
                              gradingSystem.gpaScale,
                            ),
                          }}
                        />
                      )}
                      <select
                        id={`${row.id}-grade`}
                        value={row.grade}
                        onChange={(event) =>
                          updateRow(row.id, "grade", event.target.value)
                        }
                        aria-invalid={error ? true : undefined}
                        className={`${inputClass} ${gradePoint !== null ? "pl-7" : ""} ${error ? `${invalidInputClass} animate-nudge` : ""}`}
                      >
                        <option value="">Select</option>
                        {/* The options ARE the university's grade table. */}
                        {gradingSystem.grades.map((option) => (
                          <option key={option.grade} value={option.grade}>
                            {option.grade} ({formatPoints(option.gradePoint)})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-end sm:pb-1">
                    <button
                      type="button"
                      onClick={() => removeRow(row.id)}
                      disabled={rows.length === 1}
                      className={removeButtonClass}
                      aria-label={`Remove course ${index + 1}`}
                    >
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>
                </div>

                {error && <p className={rowErrorClass}>{error}</p>}
              </li>
            );
          })}
        </ul>

        <div className="mt-5 flex flex-wrap gap-3">
          <button type="button" onClick={addRow} className={secondaryButtonClass}>
            Add course
          </button>
          <button type="submit" className={primaryButtonClass}>
            Calculate GPA
          </button>
          <button type="button" onClick={reset} className={secondaryButtonClass}>
            Reset
          </button>
        </div>

        {showErrors && result.errors.length > 0 && (
          <p
            key={errorNonce}
            role="alert"
            className="mt-4 animate-slide-down-fade text-sm font-medium text-red-600"
          >
            {result.errors[0]}
          </p>
        )}
      </form>

      {/* Keep the result in flow so it never covers inputs on small screens. */}
      <div className="mt-6">
        <ResultSummary
          universityName={universityName}
          shareUrl={shareUrl}
          headlineLabel="Semester GPA"
          value={result.gpa}
          emptyValue={formatGpa(null)}
          scale={gradingSystem.gpaScale}
          scaleLabel={formatPoints(gradingSystem.gpaScale)}
          copyText={copyText}
          targetPlannerHref={
            universityPath
              ? (target) =>
                  routes.targetPlannerFor({
                    citySlug: universityPath.citySlug,
                    universitySlug: universityPath.universitySlug,
                    current: result.gpa ?? 0,
                    target,
                  })
              : undefined
          }
          items={[
            {
              label: "Total credit hours",
              value: formatPoints(result.totalCreditHours),
            },
            {
              label: "Total grade points",
              value: formatPoints(result.totalQualityPoints),
            },
            { label: "Courses counted", value: String(result.countedCourses) },
          ]}
        />
      </div>
    </div>
  );
}
