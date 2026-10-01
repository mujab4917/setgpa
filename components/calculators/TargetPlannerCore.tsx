"use client";

/**
 * TARGET PLANNER CORE
 *
 * The shared brain of the target GPA planner - used by both the version
 * embedded on a university page (TargetGpaPlanner, always has a real grade
 * table) and the standalone /target-gpa-calculator page
 * (StandaloneTargetPlanner, which may only have a scale until a university
 * is picked). Keeping the form logic in one place means the two can never
 * quietly drift into different behaviour.
 *
 * Two ways to plan, one shared "current / completed / target":
 *  - "One overall average": the original single-number planner - how much
 *    GPA, on average, across a block of upcoming credit hours.
 *  - "Course by course": list the actual upcoming courses. Leave a grade
 *    blank to let the plan suggest one, or lock a grade in - the plan
 *    recalculates live for whatever is still open.
 */

import { useEffect, useId, useRef, useState } from "react";

import {
  calculatePerCourseTarget,
  calculateTargetGpa,
  describeTargetFieldError,
  type TargetCourseInput,
} from "@/lib/calculators/target";
import { findGradePoint } from "@/lib/calculators/gpa";
import type { GradingSystem } from "@/lib/calculators/types";
import { formatPoints } from "@/lib/calculators/validation";
import { targetPlannerPageContent } from "@/data/site-content";
import { InfoTooltip } from "@/components/ui/InfoTooltip";
import { TargetResultCard } from "./TargetResultCard";
import { PerCourseResultCard } from "./PerCourseResultCard";
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
} from "./calculator-ui";

type Mode = "average" | "perCourse";

/** Small icon for a goal preset card. Hand-written to match the site's other inline icons (components/ui/icons.tsx). */
function PresetIcon({ icon, className = "" }: { icon: string; className?: string }) {
  if (icon === "shield") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className}>
        <path d="M12 3.25 5 5.75v5.1c0 4.55 3 7.9 7 9.1 4-1.2 7-4.55 7-9.1v-5.1L12 3.25Z" />
        <path d="m9.25 12 2 2 3.5-3.75" />
      </svg>
    );
  }
  if (icon === "trendingUp") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className}>
        <path d="M3.5 16.5 9 11l4 4 7.5-8.5" />
        <path d="M15.5 6h5v5" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M12 2.75l2.76 5.6 6.18.9-4.47 4.36 1.05 6.15L12 16.9l-5.52 2.9 1.05-6.15-4.47-4.36 6.18-.9L12 2.75Z" />
    </svg>
  );
}

/** Tailwind classes for each preset's colour theme. Literal per-branch strings, so Tailwind's compiler can see and keep them. */
function presetTone(tone: string) {
  switch (tone) {
    case "amber":
      return {
        iconWrap: "bg-amber-100 text-amber-700",
        tagText: "text-amber-700",
        selectedBorder: "border-amber-500",
        selectedBg: "bg-amber-50",
        selectedRing: "shadow-amber-500/15",
        value: "text-amber-700",
        checkBg: "bg-amber-600",
        hoverBorder: "hover:border-amber-400",
      };
    case "blue":
      return {
        iconWrap: "bg-blue-100 text-blue-700",
        tagText: "text-blue-700",
        selectedBorder: "border-blue-500",
        selectedBg: "bg-blue-50",
        selectedRing: "shadow-blue-500/15",
        value: "text-blue-700",
        checkBg: "bg-blue-600",
        hoverBorder: "hover:border-blue-400",
      };
    default:
      return {
        iconWrap: "bg-emerald-100 text-emerald-700",
        tagText: "text-emerald-700",
        selectedBorder: "border-emerald-500",
        selectedBg: "bg-emerald-50",
        selectedRing: "shadow-emerald-500/15",
        value: "text-emerald-700",
        checkBg: "bg-emerald-600",
        hoverBorder: "hover:border-emerald-400",
      };
  }
}

interface CourseRow {
  id: string;
  name: string;
  creditHours: string;
  grade: string;
}

const STARTING_ROWS = 3;

/** Heading above a group of clickable cards/chips - darker and bolder than a plain field label, so it reads as a section title rather than blending into the controls below it. */
const sectionHeadingClass = "block text-sm font-semibold text-ink-900";

function makeCourseRow(id: string): CourseRow {
  return { id, name: "", creditHours: "", grade: "" };
}

function makeInitialCourseRows(): CourseRow[] {
  return Array.from({ length: STARTING_ROWS }, (_, index) => makeCourseRow(`upcoming-course-${index + 1}`));
}

export interface TargetPlannerPrefill {
  current: number;
  target: number;
}

interface TargetPlannerCoreProps {
  gradingSystem: GradingSystem;
  prefill?: TargetPlannerPrefill | null;
  onPrefillConsumed?: () => void;
}

export function TargetPlannerCore({ gradingSystem, prefill, onPrefillConsumed }: TargetPlannerCoreProps) {
  const id = useId();
  const scale = gradingSystem.gpaScale;
  const hasGradeTable = gradingSystem.grades.length > 0;

  const [mode, setMode] = useState<Mode>("average");
  const [shared, setShared] = useState({ current: "", completed: "", target: "" });
  const [upcoming, setUpcoming] = useState("");
  const [courses, setCourses] = useState<CourseRow[]>(makeInitialCourseRows);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submitted, setSubmitted] = useState(false);
  const [enteringId, setEnteringId] = useState<string | null>(null);
  const [leavingIds, setLeavingIds] = useState<string[]>([]);
  const nextCourseNumber = useRef(STARTING_ROWS + 1);

  // A GPA/CGPA result elsewhere on the page can hand this planner a starting
  // point. Apply it once, then tell the caller it's been used.
  useEffect(() => {
    if (!prefill) return;
    setShared({
      current: prefill.current.toFixed(2),
      completed: shared.completed,
      target: prefill.target.toFixed(2),
    });
    setSubmitted(false);
    onPrefillConsumed?.();
    // Only the prefill identity should retrigger this - shared.completed is
    // read, not depended on, so the student's own typing isn't overwritten.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prefill]);

  const sharedErrors = {
    current: describeTargetFieldError("current", shared.current, scale),
    completed: describeTargetFieldError("completed", shared.completed, scale),
    target: describeTargetFieldError("target", shared.target, scale),
  };
  const upcomingError = describeTargetFieldError("upcoming", upcoming, scale);

  const sharedFilled = shared.current.trim() !== "" && shared.completed.trim() !== "" && shared.target.trim() !== "";

  const averageResult =
    mode === "average" && sharedFilled && upcoming.trim() !== "" && !sharedErrors.current && !sharedErrors.completed && !sharedErrors.target && !upcomingError
      ? calculateTargetGpa(Number(shared.current), Number(shared.completed), Number(upcoming), Number(shared.target), scale)
      : null;

  const courseInputs: TargetCourseInput[] = courses.map((row) => ({ creditHours: row.creditHours, grade: row.grade }));
  const perCourseResult =
    mode === "perCourse" && sharedFilled && !sharedErrors.current && !sharedErrors.completed && !sharedErrors.target
      ? calculatePerCourseTarget(Number(shared.current), Number(shared.completed), Number(shared.target), scale, courseInputs, gradingSystem)
      : null;

  function setSharedField(key: keyof typeof shared, value: string) {
    setShared((current) => ({ ...current, [key]: value }));
    setSubmitted(false);
  }

  function applyPreset(ratio: number) {
    setSharedField("target", (ratio * scale).toFixed(2));
  }

  function updateCourse(rowId: string, field: keyof Omit<CourseRow, "id">, value: string) {
    setCourses((current) => current.map((row) => (row.id === rowId ? { ...row, [field]: value } : row)));
    setSubmitted(false);
  }

  function addCourse() {
    const rowId = `upcoming-course-${nextCourseNumber.current++}`;
    setCourses((current) => [...current, makeCourseRow(rowId)]);
    setEnteringId(rowId);
  }

  function removeCourse(rowId: string) {
    if (courses.length === 1) return;
    setLeavingIds((current) => [...current, rowId]);
    window.setTimeout(() => {
      setCourses((current) => current.filter((row) => row.id !== rowId));
      setLeavingIds((current) => current.filter((leavingId) => leavingId !== rowId));
    }, ROW_EXIT_MS);
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setTouched({ current: true, completed: true, target: true, upcoming: true });
    setSubmitted(true);
  }

  const perCourseDisplayRows =
    perCourseResult && perCourseResult.rows.some((row) => row.status === "locked" || row.status === "open")
      ? courses
          .map((row, index) => ({ row, result: perCourseResult.rows[index] }))
          .filter(({ result }) => result && (result.status === "locked" || result.status === "open"))
          .map(({ row, result }, order) => ({
            id: row.id,
            name: row.name.trim() || `Course ${order + 1}`,
            creditHours: result!.creditHours ?? 0,
            status: result!.status as "locked" | "open",
            gradeLetter: result!.status === "locked" ? row.grade.toUpperCase() : result!.suggestedGradeLetter,
            gradePoint: result!.status === "locked" ? (result!.gradePoint ?? 0) : (result!.suggestedGradePoint ?? 0),
          }))
      : [];

  return (
    <section
      id="target-planner"
      aria-labelledby={`${id}-heading`}
      className="scroll-mt-24 rounded-3xl border border-violet-200 bg-gradient-to-br from-violet-50 via-white to-brand-50 p-5 sm:p-8"
    >
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-violet-700">Plan your next move</p>
      <h2 id={`${id}-heading`} className="mt-2 text-2xl font-bold text-ink-900">
        What GPA gets you there?
      </h2>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-700">
        Set an overall CGPA goal, then plan it as one average or course by course.
      </p>

      {/* ---------- Mode toggle ---------- */}
      <div className="mt-6" role="radiogroup" aria-label={targetPlannerPageContent.modeHeading}>
        <span className={sectionHeadingClass}>{targetPlannerPageContent.modeHeading}</span>
        <div className="mt-2 grid gap-2 sm:grid-cols-2">
          {targetPlannerPageContent.modeOptions.map((option) => {
            const selected = mode === option.key;
            return (
              <button
                key={option.key}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => {
                  setMode(option.key as Mode);
                  setSubmitted(false);
                }}
                className={`flex cursor-pointer items-start gap-2.5 rounded-xl border p-3 text-left shadow-sm transition-all duration-200 ${
                  selected
                    ? "border-violet-600 bg-violet-50 shadow-md shadow-violet-600/10"
                    : "border-ink-900/20 bg-white hover:-translate-y-0.5 hover:border-violet-400 hover:bg-violet-50 hover:shadow-md active:translate-y-0"
                }`}
              >
                <span
                  aria-hidden="true"
                  className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                    selected ? "border-violet-600 bg-violet-600" : "border-ink-900/20 bg-white"
                  }`}
                >
                  {selected && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
                </span>
                <span>
                  <span className={`block text-sm font-semibold ${selected ? "text-violet-900" : "text-ink-900"}`}>
                    {option.label}
                    {selected && <span className="ml-2 text-[10px] font-bold uppercase tracking-wide text-violet-600">Selected</span>}
                  </span>
                  <span className="mt-0.5 block text-xs leading-relaxed text-ink-700">{option.description}</span>
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <form className="mt-6" onSubmit={handleSubmit} noValidate>
        {/* ---------- Shared fields ---------- */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <div>
            <label htmlFor={`${id}-current`} className={fieldLabelClass}>
              Current CGPA
            </label>
            <input
              placeholder="3.00"
              id={`${id}-current`}
              type="number"
              inputMode="decimal"
              step="0.01"
              value={shared.current}
              onChange={(event) => setSharedField("current", event.target.value)}
              onBlur={() => setTouched((current) => ({ ...current, current: true }))}
              aria-invalid={!!((touched.current || submitted) && sharedErrors.current)}
              className={`${inputClass} ${(touched.current || submitted) && sharedErrors.current ? invalidInputClass : ""}`}
            />
            {(touched.current || submitted) && sharedErrors.current && (
              <p className="mt-1 text-xs font-medium text-red-600">{sharedErrors.current}</p>
            )}
          </div>

          <div>
            <label htmlFor={`${id}-completed`} className={`${fieldLabelClass} inline-flex items-center gap-1.5`}>
              Credits completed
              <InfoTooltip>
                A credit hour is the &quot;weight&quot; a course carries - usually 3 or 4 per course. Add up the credit hours of every
                course you&apos;ve already finished and passed.
              </InfoTooltip>
            </label>
            <input
              placeholder="60"
              id={`${id}-completed`}
              type="number"
              inputMode="decimal"
              step="0.01"
              value={shared.completed}
              onChange={(event) => setSharedField("completed", event.target.value)}
              onBlur={() => setTouched((current) => ({ ...current, completed: true }))}
              aria-invalid={!!((touched.completed || submitted) && sharedErrors.completed)}
              className={`${inputClass} ${(touched.completed || submitted) && sharedErrors.completed ? invalidInputClass : ""}`}
            />
            {(touched.completed || submitted) && sharedErrors.completed && (
              <p className="mt-1 text-xs font-medium text-red-600">{sharedErrors.completed}</p>
            )}
          </div>

          <div>
            <label htmlFor={`${id}-target`} className={fieldLabelClass}>
              Target CGPA
            </label>
            <input
              placeholder="3.20"
              id={`${id}-target`}
              type="number"
              inputMode="decimal"
              step="0.01"
              value={shared.target}
              onChange={(event) => setSharedField("target", event.target.value)}
              onBlur={() => setTouched((current) => ({ ...current, target: true }))}
              aria-invalid={!!((touched.target || submitted) && sharedErrors.target)}
              className={`${inputClass} ${(touched.target || submitted) && sharedErrors.target ? invalidInputClass : ""}`}
            />
            {(touched.target || submitted) && sharedErrors.target && (
              <p className="mt-1 text-xs font-medium text-red-600">{sharedErrors.target}</p>
            )}
          </div>

          {mode === "average" && (
            <div>
              <label htmlFor={`${id}-upcoming`} className={`${fieldLabelClass} inline-flex items-center gap-1.5`}>
                Upcoming credits
                <InfoTooltip>
                  The total credit hours of the courses you&apos;re about to take - a normal full-time semester is usually 12-18 credit
                  hours.
                </InfoTooltip>
              </label>
              <input
                placeholder="15"
                id={`${id}-upcoming`}
                type="number"
                inputMode="decimal"
                step="0.01"
                value={upcoming}
                onChange={(event) => {
                  setUpcoming(event.target.value);
                  setSubmitted(false);
                }}
                onBlur={() => setTouched((current) => ({ ...current, upcoming: true }))}
                aria-invalid={!!((touched.upcoming || submitted) && upcomingError)}
                className={`${inputClass} ${(touched.upcoming || submitted) && upcomingError ? invalidInputClass : ""}`}
              />
              {(touched.upcoming || submitted) && upcomingError && (
                <p className="mt-1 text-xs font-medium text-red-600">{upcomingError}</p>
              )}
            </div>
          )}
        </div>

        {/* ---------- Preset goals ---------- */}
        <div className="mt-6">
          <span className={sectionHeadingClass}>{targetPlannerPageContent.presetsHeading}</span>
          <p className="mt-0.5 text-xs text-ink-700">{targetPlannerPageContent.presetsSubheading}</p>
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            {targetPlannerPageContent.presets.map((preset) => {
              const value = (preset.ratio * scale).toFixed(2);
              const active = shared.target.trim() !== "" && Math.abs(Number(shared.target) - preset.ratio * scale) < 0.005;
              const tone = presetTone(preset.tone);
              return (
                <button
                  key={preset.key}
                  type="button"
                  onClick={() => applyPreset(preset.ratio)}
                  aria-pressed={active}
                  className={`relative cursor-pointer rounded-2xl border-2 bg-white p-4 text-left shadow-sm transition-all duration-200 ${
                    active
                      ? `${tone.selectedBorder} ${tone.selectedBg} shadow-md ${tone.selectedRing}`
                      : `border-ink-900/10 hover:-translate-y-0.5 ${tone.hoverBorder} hover:shadow-md active:translate-y-0`
                  }`}
                >
                  {active && (
                    <span
                      aria-hidden="true"
                      className={`absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full text-white ${tone.checkBg}`}
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3">
                        <path d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                  )}
                  <span className={`inline-flex h-9 w-9 items-center justify-center rounded-xl ${tone.iconWrap}`}>
                    <PresetIcon icon={preset.icon} className="h-5 w-5" />
                  </span>
                  <span className={`mt-3 block text-[11px] font-bold uppercase tracking-wide ${tone.tagText}`}>{preset.tag}</span>
                  <span className="mt-0.5 block text-sm font-semibold text-ink-900">{preset.label}</span>
                  <span className={`mt-1.5 block text-2xl font-bold tabular-nums ${tone.value}`}>
                    {value} <span className="text-xs font-medium text-slate-400">/ {scale.toFixed(2)}</span>
                  </span>
                  <span className="mt-1.5 block text-xs leading-relaxed text-ink-700">{preset.description}</span>
                </button>
              );
            })}
          </div>
          <p className="mt-3 max-w-xl text-xs leading-relaxed text-ink-700">{targetPlannerPageContent.presetsDisclaimer}</p>
        </div>

        {/* ---------- Course-by-course table ---------- */}
        {mode === "perCourse" && (
          <div className="mt-6">
            <h3 className="text-sm font-semibold text-ink-900">{targetPlannerPageContent.perCourse.heading}</h3>
            <p className="mt-1 max-w-2xl text-xs leading-relaxed text-ink-700">{targetPlannerPageContent.perCourse.intro}</p>

            <ul className="mt-4 space-y-3">
              {courses.map((row, index) => {
                const rowResult = perCourseResult?.rows[index];
                const showError = submitted && rowResult?.error;
                const leaving = leavingIds.includes(row.id);
                const gradePoint = row.grade ? findGradePoint(row.grade, gradingSystem) : null;

                return (
                  <li
                    key={row.id}
                    className={`rounded-xl border border-ink-900/10 bg-white/70 p-3 transition-colors sm:border-0 sm:bg-transparent sm:p-0 ${
                      leaving ? "animate-row-out" : ""
                    } ${row.id === enteringId && !leaving ? "animate-row-in" : ""}`}
                  >
                    <div
                      className={`grid grid-cols-2 gap-3 sm:items-end ${
                        hasGradeTable ? "sm:grid-cols-[1fr_6rem_9rem_auto]" : "sm:grid-cols-[1fr_6rem_auto]"
                      }`}
                    >
                      <div className="col-span-2 sm:col-span-1">
                        <label className={fieldLabelClass} htmlFor={`${row.id}-name`}>
                          {targetPlannerPageContent.perCourse.courseNamePlaceholder} (optional)
                        </label>
                        <input
                          id={`${row.id}-name`}
                          type="text"
                          value={row.name}
                          onChange={(event) => updateCourse(row.id, "name", event.target.value)}
                          placeholder={`${targetPlannerPageContent.perCourse.courseNamePlaceholder} ${index + 1}`}
                          className={inputClass}
                          autoComplete="off"
                        />
                      </div>

                      <div>
                        <label className={fieldLabelClass} htmlFor={`${row.id}-credits`}>
                          Credit hours
                        </label>
                        <input
                          id={`${row.id}-credits`}
                          type="number"
                          inputMode="decimal"
                          min={0.5}
                          max={24}
                          step={0.5}
                          value={row.creditHours}
                          onChange={(event) => updateCourse(row.id, "creditHours", event.target.value)}
                          placeholder="3"
                          aria-invalid={!!showError}
                          className={`${inputClass} ${showError ? invalidInputClass : ""}`}
                        />
                      </div>

                      {hasGradeTable && (
                        <div>
                          <label className={fieldLabelClass} htmlFor={`${row.id}-grade`}>
                            Grade
                          </label>
                          <div className="relative">
                            {gradePoint !== null && (
                              <span
                                aria-hidden="true"
                                className="pointer-events-none absolute left-3 top-1/2 z-10 mt-0.5 h-2.5 w-2.5 -translate-y-1/2 rounded-full transition-colors"
                                style={{ backgroundColor: gradeColor(gradePoint, scale) }}
                              />
                            )}
                            <select
                              id={`${row.id}-grade`}
                              value={row.grade}
                              onChange={(event) => updateCourse(row.id, "grade", event.target.value)}
                              className={`${inputClass} ${gradePoint !== null ? "pl-7" : ""}`}
                            >
                              <option value="">{targetPlannerPageContent.perCourse.gradeOpenOption}</option>
                              {gradingSystem.grades.map((option) => (
                                <option key={option.grade} value={option.grade}>
                                  {option.grade} ({formatPoints(option.gradePoint)})
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      )}

                      <div className="col-span-2 flex justify-end sm:col-span-1 sm:pb-1">
                        <button
                          type="button"
                          onClick={() => removeCourse(row.id)}
                          disabled={courses.length === 1}
                          className={removeButtonClass}
                          aria-label={`Remove course ${index + 1}`}
                        >
                          <span aria-hidden="true">&times;</span>
                        </button>
                      </div>
                    </div>
                    {showError && <p className={rowErrorClass}>{rowResult!.error}</p>}
                  </li>
                );
              })}
            </ul>

            <button type="button" onClick={addCourse} className={`${secondaryButtonClass} mt-4`}>
              {targetPlannerPageContent.perCourse.addCourseLabel}
            </button>
          </div>
        )}

        <button className={`${primaryButtonClass} mt-5`} type="submit">
          Find my target GPA <span aria-hidden="true" className="ml-2">↗</span>
        </button>
      </form>

      {submitted && mode === "average" && sharedFilled && upcoming.trim() !== "" && (sharedErrors.current || sharedErrors.completed || sharedErrors.target || upcomingError) && (
        <p className="mt-5 rounded-2xl border border-red-100 bg-red-50 p-4 text-sm text-red-700">Fix the highlighted fields above, then try again.</p>
      )}

      {submitted && mode === "average" && averageResult && (
        <TargetResultCard
          current={Number(shared.current)}
          completed={Number(shared.completed)}
          upcoming={Number(upcoming)}
          target={Number(shared.target)}
          scale={scale}
          result={averageResult}
        />
      )}

      {submitted && mode === "perCourse" && perCourseResult && perCourseResult.errors.length > 0 && (
        <p className="mt-5 rounded-2xl border border-red-100 bg-red-50 p-4 text-sm text-red-700">{perCourseResult.errors[0]}</p>
      )}

      {submitted && mode === "perCourse" && perCourseResult && perCourseResult.errors.length === 0 && (
        <PerCourseResultCard
          current={Number(shared.current)}
          completed={Number(shared.completed)}
          target={Number(shared.target)}
          scale={scale}
          result={perCourseResult}
          rows={perCourseDisplayRows}
        />
      )}
    </section>
  );
}
