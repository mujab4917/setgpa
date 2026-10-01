"use client";

/**
 * STANDALONE TARGET GPA PLANNER
 *
 * The /target-gpa-calculator page doesn't already know a grading system, so
 * it has to get one first: search a real university (leads with its actual
 * grade table, so course-by-course planning can suggest real letter grades),
 * or fall back to picking a scale number by hand for a university that isn't
 * listed yet. Either way, once a GradingSystem exists, the rest of the form
 * is identical to the embedded planner - both share TargetPlannerCore.
 */

import { useState } from "react";

import type { GradingSystem } from "@/lib/calculators/types";
import type { UniversityGradingListItem } from "@/types/domain";
import { targetPlannerPageContent } from "@/data/site-content";
import { inputClass, fieldLabelClass } from "./calculator-ui";
import { TargetPlannerCore, type TargetPlannerPrefill } from "./TargetPlannerCore";
import { UniversityGradingPicker } from "./UniversityGradingPicker";

interface StandaloneTargetPlannerProps {
  universities: UniversityGradingListItem[];
  /** Set when a link (e.g. from a university page) arrives with ?city=&university= for an exact match. */
  initialUniversity?: UniversityGradingListItem | null;
  /** Set when the link also carried ?current=&target=, e.g. from a GPA result's "what do you need next" prompt. */
  initialCurrent?: number;
  initialTarget?: number;
}

export function StandaloneTargetPlanner({
  universities,
  initialUniversity = null,
  initialCurrent,
  initialTarget,
}: StandaloneTargetPlannerProps) {
  const [university, setUniversity] = useState<UniversityGradingListItem | null>(initialUniversity);
  const [useManualScale, setUseManualScale] = useState(false);
  const [scale, setScale] = useState(4.0);
  const [customScale, setCustomScale] = useState("");
  // Set once, from the URL, and consumed by TargetPlannerCore on mount - not
  // meant to keep re-applying as the student edits the form afterward.
  const [prefill] = useState<TargetPlannerPrefill | null>(() =>
    initialCurrent !== undefined && initialTarget !== undefined ? { current: initialCurrent, target: initialTarget } : null,
  );

  const effectiveScale = scale === -1 ? Number(customScale) : scale;
  const scaleValid = Number.isFinite(effectiveScale) && effectiveScale > 0;

  const gradingSystem: GradingSystem | null = university
    ? { gpaScale: university.gpaScale, grades: university.gradeRules }
    : useManualScale && scaleValid
      ? { gpaScale: effectiveScale, grades: [] }
      : null;

  if (!gradingSystem) {
    return (
      <section
        id="target-planner-setup"
        className="scroll-mt-24 rounded-3xl border border-violet-200 bg-gradient-to-br from-violet-50 via-white to-brand-50 p-5 sm:p-8"
      >
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-violet-700">Plan your next move</p>
        <h2 className="mt-2 text-2xl font-bold text-ink-900">What GPA gets you there?</h2>

        {!useManualScale ? (
          <div className="mt-6">
            <h3 className="text-sm font-semibold text-ink-900">{targetPlannerPageContent.universityPickerHeading}</h3>
            <p className="mt-1 max-w-2xl text-sm leading-relaxed text-ink-700">{targetPlannerPageContent.universityPickerBody}</p>
            <div className="mt-4 rounded-2xl bg-white p-4 shadow-sm sm:p-5">
              <UniversityGradingPicker universities={universities} onSelect={setUniversity} />
            </div>
            <button
              type="button"
              onClick={() => setUseManualScale(true)}
              className="mt-4 text-sm font-semibold text-violet-700 hover:text-violet-800 hover:underline"
            >
              {targetPlannerPageContent.scaleFallbackToggle}
            </button>
          </div>
        ) : (
          <div className="mt-6">
            <span className={fieldLabelClass}>{targetPlannerPageContent.formLabel}</span>
            <div className="mt-2 flex flex-wrap gap-2">
              {targetPlannerPageContent.scalePresets.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setScale(preset)}
                  aria-pressed={scale === preset}
                  className={`min-h-11 rounded-lg border px-4 text-sm font-semibold transition-colors ${
                    scale === preset ? "border-violet-600 bg-violet-600 text-white" : "border-ink-900/20 bg-white text-ink-700 hover:border-violet-400"
                  }`}
                >
                  {preset.toFixed(2)}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setScale(-1)}
                aria-pressed={scale === -1}
                className={`min-h-11 rounded-lg border px-4 text-sm font-semibold transition-colors ${
                  scale === -1 ? "border-violet-600 bg-violet-600 text-white" : "border-ink-900/20 bg-white text-ink-700 hover:border-violet-400"
                }`}
              >
                {targetPlannerPageContent.customScaleLabel}
              </button>
              {scale === -1 && (
                <input
                  type="number"
                  inputMode="decimal"
                  min={1}
                  step="0.01"
                  placeholder="e.g. 20"
                  value={customScale}
                  onChange={(event) => setCustomScale(event.target.value)}
                  aria-label="Custom grading scale"
                  className={`${inputClass} mt-0 w-28`}
                />
              )}
            </div>
            {scale === -1 && !scaleValid && customScale.trim() !== "" && (
              <p className="mt-2 text-xs font-medium text-red-600">Enter a valid grading scale first.</p>
            )}
            <button
              type="button"
              onClick={() => setUseManualScale(false)}
              className="mt-4 block text-sm font-semibold text-violet-700 hover:text-violet-800 hover:underline"
            >
              &larr; Search my university instead
            </button>
          </div>
        )}
      </section>
    );
  }

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-violet-100 bg-white px-4 py-3 text-sm">
        <span className="font-medium text-ink-700">
          Planning for{" "}
          <strong className="font-semibold text-ink-900">
            {university ? university.name : `a ${effectiveScale.toFixed(2)} scale`}
          </strong>
        </span>
        <button
          type="button"
          onClick={() => {
            setUniversity(null);
            setUseManualScale(false);
          }}
          className="font-semibold text-violet-700 hover:text-violet-800 hover:underline"
        >
          {university ? targetPlannerPageContent.changeUniversityLabel : "Change scale"}
        </button>
      </div>
      <TargetPlannerCore gradingSystem={gradingSystem} prefill={prefill} />
    </div>
  );
}
