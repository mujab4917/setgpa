"use client";

import { useId, useState } from "react";

import { fieldLabelClass, inputClass } from "@/components/calculators/calculator-ui";
import { conversionMethods, formatNumber, getMethod, type ConversionMethod } from "@/lib/guides/cgpa-convert";

type Direction = "toPercentage" | "toCgpa";

/**
 * CGPA <-> percentage converter for the 10-point scale. It runs in the browser
 * and sends nothing anywhere. The student picks the rule their university uses,
 * because there is no national rule.
 */
export function CgpaConverter() {
  const uid = useId();
  const [direction, setDirection] = useState<Direction>("toPercentage");
  const [methodId, setMethodId] = useState<ConversionMethod["id"]>("cbse");
  const [raw, setRaw] = useState("8.2");

  const method = getMethod(methodId);
  const toPct = direction === "toPercentage";
  const max = toPct ? 10 : 100;
  const value = raw.trim() === "" ? null : Number(raw);

  let result: string | null = null;
  let error: string | null = null;
  if (value !== null) {
    if (!Number.isFinite(value) || value < 0 || value > max) {
      error = toPct ? "Enter a CGPA between 0 and 10." : "Enter a percentage between 0 and 100.";
    } else {
      const out = toPct ? method.toPercentage(value) : method.toCgpa(value);
      if (out < 0 || (!toPct && out > 10)) {
        error = toPct
          ? "This rule gives no percentage for a CGPA this low."
          : "A percentage this high is above 10 CGPA under this rule. Check the rule or the number.";
      } else {
        result = toPct ? `${formatNumber(out)}%` : formatNumber(out);
      }
    }
  }

  return (
    <div className="not-prose rounded-3xl border border-ink-900/10 bg-white p-5 shadow-[0_18px_40px_-28px_rgba(31,46,41,0.5)] sm:p-7">
      <div role="group" aria-label="Direction" className="inline-flex rounded-full bg-cream-100 p-1">
        {(
          [
            ["toPercentage", "CGPA to percentage"],
            ["toCgpa", "Percentage to CGPA"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            aria-pressed={direction === id}
            onClick={() => {
              setDirection(id);
              setRaw(id === "toPercentage" ? "8.2" : "77.9");
            }}
            className={`min-h-10 rounded-full px-4 text-sm font-bold transition-colors ${
              direction === id ? "bg-brand-800 text-white" : "text-ink-900 hover:bg-white"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor={`${uid}-value`} className={fieldLabelClass}>
            {toPct ? "Your CGPA (out of 10)" : "Your percentage"}
          </label>
          <input
            id={`${uid}-value`}
            inputMode="decimal"
            value={raw}
            onChange={(e) => setRaw(e.target.value)}
            aria-invalid={error ? true : undefined}
            aria-describedby={`${uid}-result`}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor={`${uid}-method`} className={fieldLabelClass}>
            Conversion rule
          </label>
          <select
            id={`${uid}-method`}
            value={methodId}
            onChange={(e) => setMethodId(e.target.value as ConversionMethod["id"])}
            className={inputClass}
          >
            {conversionMethods.map((m) => (
              <option key={m.id} value={m.id}>
                {m.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div
        id={`${uid}-result`}
        aria-live="polite"
        className="mt-5 flex items-center gap-4 rounded-2xl bg-brand-800 px-5 py-4 text-white"
      >
        {result ? (
          <>
            <span className="text-4xl font-extrabold tabular-nums sm:text-5xl">{result}</span>
            <span className="text-sm text-white/80">
              {toPct ? `${raw} CGPA in percentage` : `${raw}% in CGPA`}
            </span>
          </>
        ) : (
          <span className="text-sm font-semibold text-marker-300">
            {error ?? (toPct ? "Type your CGPA to see the percentage." : "Type your percentage to see the CGPA.")}
          </span>
        )}
      </div>

      <p className="mt-3 text-sm leading-relaxed text-ink-700">{method.rule}</p>
    </div>
  );
}
