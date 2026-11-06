"use client";

import { useId, useState } from "react";

import {
  fieldLabelClass,
  inputClass,
  removeButtonClass,
  secondaryButtonClass,
} from "@/components/calculators/calculator-ui";

interface Row {
  id: number;
  sgpa: string;
  credits: string;
}

/**
 * Turns semester SGPAs into a CGPA, weighted by credits (the standard method).
 * Works for any scale: it never assumes the maximum is 10 or 4.
 * Runs in the browser; nothing is saved or sent.
 */
export function SgpaToCgpaCalculator() {
  const uid = useId();
  const [rows, setRows] = useState<Row[]>([
    { id: 1, sgpa: "7.8", credits: "20" },
    { id: 2, sgpa: "8.2", credits: "22" },
    { id: 3, sgpa: "8.5", credits: "21" },
  ]);
  const [nextId, setNextId] = useState(4);
  const [useCredits, setUseCredits] = useState(true);

  const parsed = rows.map((r) => ({
    sgpa: r.sgpa.trim() === "" ? NaN : Number(r.sgpa),
    credits: useCredits ? (r.credits.trim() === "" ? NaN : Number(r.credits)) : 1,
  }));
  const valid = parsed.filter((p) => Number.isFinite(p.sgpa) && p.sgpa >= 0 && Number.isFinite(p.credits) && p.credits > 0);
  const totalCredits = valid.reduce((s, p) => s + p.credits, 0);
  const cgpa = totalCredits > 0 ? valid.reduce((s, p) => s + p.sgpa * p.credits, 0) / totalCredits : null;
  const incomplete = valid.length !== rows.length;

  function update(id: number, field: "sgpa" | "credits", value: string) {
    setRows((rs) => rs.map((r) => (r.id === id ? { ...r, [field]: value } : r)));
  }

  return (
    <div className="not-prose rounded-3xl border border-ink-900/10 bg-white p-5 shadow-[0_18px_40px_-28px_rgba(31,46,41,0.5)] sm:p-7">
      <label className="flex items-center gap-2.5 text-sm font-semibold text-ink-900">
        <input
          type="checkbox"
          checked={useCredits}
          onChange={(e) => setUseCredits(e.target.checked)}
          className="h-5 w-5 rounded border-ink-900/30 accent-brand-600"
        />
        My semesters have different credit hours (recommended)
      </label>

      <ul className="mt-4 space-y-3">
        {rows.map((row, index) => (
          <li key={row.id} className="flex items-end gap-3">
            <div className="w-24 shrink-0 pb-3 text-sm font-semibold text-ink-900 sm:w-28">Semester {index + 1}</div>
            <div className="min-w-0 flex-1">
              <label htmlFor={`${uid}-s${row.id}`} className={fieldLabelClass}>
                SGPA
              </label>
              <input
                id={`${uid}-s${row.id}`}
                inputMode="decimal"
                value={row.sgpa}
                onChange={(e) => update(row.id, "sgpa", e.target.value)}
                className={inputClass}
              />
            </div>
            {useCredits && (
              <div className="min-w-0 flex-1">
                <label htmlFor={`${uid}-c${row.id}`} className={fieldLabelClass}>
                  Credit hours
                </label>
                <input
                  id={`${uid}-c${row.id}`}
                  inputMode="decimal"
                  value={row.credits}
                  onChange={(e) => update(row.id, "credits", e.target.value)}
                  className={inputClass}
                />
              </div>
            )}
            <button
              type="button"
              aria-label={`Remove semester ${index + 1}`}
              disabled={rows.length <= 1}
              onClick={() => setRows((rs) => rs.filter((r) => r.id !== row.id))}
              className={removeButtonClass}
            >
              &times;
            </button>
          </li>
        ))}
      </ul>

      <div className="mt-4 flex flex-wrap gap-3">
        <button
          type="button"
          disabled={rows.length >= 12}
          onClick={() => {
            setRows((rs) => [...rs, { id: nextId, sgpa: "", credits: "" }]);
            setNextId((n) => n + 1);
          }}
          className={secondaryButtonClass}
        >
          Add a semester
        </button>
        <button
          type="button"
          onClick={() => setRows([{ id: nextId, sgpa: "", credits: "" }])}
          className={`${secondaryButtonClass} border-transparent text-ink-700`}
        >
          Clear all
        </button>
      </div>

      <div aria-live="polite" className="mt-5 rounded-2xl bg-brand-800 px-5 py-4 text-white">
        {cgpa !== null ? (
          <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
            <span className="text-sm text-white/80">Your CGPA</span>
            <span className="text-4xl font-extrabold tabular-nums sm:text-5xl">{cgpa.toFixed(2)}</span>
            {incomplete && <span className="text-sm text-marker-300">Rows with missing numbers are left out.</span>}
          </div>
        ) : (
          <span className="text-sm font-semibold text-marker-300">Enter at least one SGPA to see your CGPA.</span>
        )}
      </div>
      <p className="mt-3 text-sm leading-relaxed text-ink-700">
        Each SGPA is multiplied by its semester&rsquo;s credit hours, the results are added, and the total is divided
        by all credit hours. Untick the box if every semester has the same credits.
      </p>
    </div>
  );
}
