"use client";

/**
 * CUMULATIVE CGPA CALCULATOR (Client Component).
 *
 * Same idea as the GPA calculator: this file is only the form. The arithmetic
 * lives in lib/calculators/cgpa.ts and the GPA scale comes from the database
 * through the `gradingSystem` prop.
 */

import { useMemo, useRef, useState } from "react";

import { ResultSummary } from "@/components/calculators/ResultSummary";
import {
  ROW_EXIT_MS,
  fieldLabelClass,
  inputClass,
  invalidInputClass,
  primaryButtonClass,
  removeButtonClass,
  rowErrorClass,
  secondaryButtonClass,
} from "@/components/calculators/calculator-ui";
import { calculateCgpa } from "@/lib/calculators/cgpa";
import type { GradingSystem } from "@/lib/calculators/types";
import {
  formatGpa,
  formatPercentage,
  formatPoints,
  gpaToPercentage,
} from "@/lib/calculators/validation";
import { parseUniversityPath, routes } from "@/lib/routes";

interface SemesterRow {
  id: string;
  name: string;
  gpa: string;
  creditHours: string;
}

const STARTING_ROWS = 2;

function makeRow(id: string, label: string): SemesterRow {
  return { id, name: label, gpa: "", creditHours: "" };
}

function makeInitialRows(): SemesterRow[] {
  return Array.from({ length: STARTING_ROWS }, (_, index) =>
    makeRow(`semester-${index + 1}`, `Semester ${index + 1}`),
  );
}

interface CgpaCalculatorProps {
  gradingSystem: GradingSystem;
  /** Used in the copied text so a shared result says which university it is for. */
  universityName: string;
  /** Absolute URL of this page, added to the copied text. */
  shareUrl: string;
}

export function CgpaCalculator({
  gradingSystem,
  universityName,
  shareUrl,
}: CgpaCalculatorProps) {
  const universityPath = parseUniversityPath(shareUrl);
  const [rows, setRows] = useState<SemesterRow[]>(makeInitialRows);
  const [showErrors, setShowErrors] = useState(false);
  const [enteringId, setEnteringId] = useState<string | null>(null);
  const [leavingIds, setLeavingIds] = useState<string[]>([]);
  const [errorNonce, setErrorNonce] = useState(0);
  const nextRowNumber = useRef(STARTING_ROWS + 1);

  const result = useMemo(
    () => calculateCgpa(rows, gradingSystem),
    [rows, gradingSystem],
  );

  // Plain-text summary for the "Copy result" button. Null until there is a result.
  const copyText = useMemo(() => {
    if (result.cgpa === null) return null;
    return [
      `${universityName} - Cumulative CGPA: ${formatGpa(result.cgpa)} / ${formatPoints(gradingSystem.gpaScale)}`,
      `Percentage (approx.): ${formatPercentage(gpaToPercentage(result.cgpa, gradingSystem.gpaScale))}`,
      `Total credit hours: ${formatPoints(result.totalCreditHours)}`,
      `Total quality points: ${formatPoints(result.totalQualityPoints)}`,
      `Semesters counted: ${result.countedSemesters}`,
      shareUrl,
    ].join("\n");
  }, [result, gradingSystem.gpaScale, universityName, shareUrl]);

  function updateRow(
    id: string,
    field: keyof Omit<SemesterRow, "id">,
    value: string,
  ) {
    setRows((current) =>
      current.map((row) => (row.id === id ? { ...row, [field]: value } : row)),
    );
  }

  function addRow() {
    const number = nextRowNumber.current++;
    const id = `semester-${number}`;
    setRows((current) => [...current, makeRow(id, `Semester ${number}`)]);
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
        }}
        noValidate
      >
        <ul className="space-y-4">
          {rows.map((row, index) => {
            const rowResult = result.rows[index];
            const error = showErrors ? (rowResult?.error ?? null) : null;
            const leaving = leavingIds.includes(row.id);

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
                      Semester (optional)
                    </label>
                    <input
                      id={`${row.id}-name`}
                      type="text"
                      value={row.name}
                      onChange={(event) =>
                        updateRow(row.id, "name", event.target.value)
                      }
                      placeholder={`Semester ${index + 1}`}
                      className={inputClass}
                      autoComplete="off"
                    />
                  </div>

                  <div>
                    <label className={fieldLabelClass} htmlFor={`${row.id}-gpa`}>
                      GPA
                    </label>
                    <input
                      id={`${row.id}-gpa`}
                      type="number"
                      inputMode="decimal"
                      min={0}
                      max={gradingSystem.gpaScale}
                      step={0.01}
                      value={row.gpa}
                      onChange={(event) =>
                        updateRow(row.id, "gpa", event.target.value)
                      }
                      placeholder="3.50"
                      aria-invalid={error ? true : undefined}
                      className={`${inputClass} ${error ? `${invalidInputClass} animate-nudge` : ""}`}
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
                      type="number"
                      inputMode="decimal"
                      min={0.5}
                      max={60}
                      step={0.5}
                      value={row.creditHours}
                      onChange={(event) =>
                        updateRow(row.id, "creditHours", event.target.value)
                      }
                      placeholder="15"
                      aria-invalid={error ? true : undefined}
                      className={`${inputClass} ${error ? `${invalidInputClass} animate-nudge` : ""}`}
                    />
                  </div>

                  <div className="flex justify-end sm:pb-1">
                    <button
                      type="button"
                      onClick={() => removeRow(row.id)}
                      disabled={rows.length === 1}
                      className={removeButtonClass}
                      aria-label={`Remove semester ${index + 1}`}
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
            Add semester
          </button>
          <button type="submit" className={primaryButtonClass}>
            Calculate CGPA
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

      <div className="mt-6">
        <ResultSummary
          universityName={universityName}
          shareUrl={shareUrl}
          headlineLabel="Cumulative CGPA"
          value={result.cgpa}
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
                    current: result.cgpa ?? 0,
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
              label: "Total quality points",
              value: formatPoints(result.totalQualityPoints),
            },
            {
              label: "Semesters counted",
              value: String(result.countedSemesters),
            },
          ]}
        />
      </div>
    </div>
  );
}
