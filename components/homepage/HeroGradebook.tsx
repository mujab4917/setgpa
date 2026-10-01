"use client";

import { useEffect, useRef, useState } from "react";

/**
 * The hero's live gradebook. Three sample courses on a 4.00 scale; tap a grade
 * chip and the semester GPA recounts. It is the site in miniature - and the one
 * animated thing on the page that people can actually touch.
 */

const GRADES = [
  { label: "A", point: 4 },
  { label: "B+", point: 3.33 },
  { label: "B", point: 3 },
  { label: "C", point: 2 },
  { label: "F", point: 0 },
] as const;

const COURSES = [
  { name: "Data Structures", credits: 3 },
  { name: "Calculus II", credits: 3 },
  { name: "Technical Writing", credits: 2 },
];

function useCountUp(target: number) {
  const [value, setValue] = useState(target);
  const from = useRef(target);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setValue(target);
      from.current = target;
      return;
    }
    const start = performance.now();
    const origin = from.current;
    let frame = 0;
    const tick = (now: number) => {
      const t = Math.min((now - start) / 600, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      const next = origin + (target - origin) * eased;
      setValue(next);
      from.current = next;
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target]);

  return value;
}

export function HeroGradebook() {
  const [picked, setPicked] = useState([0, 1, 2]);

  const totalCredits = COURSES.reduce((sum, c) => sum + c.credits, 0);
  const points = COURSES.reduce((sum, c, i) => sum + c.credits * GRADES[picked[i]].point, 0);
  const gpa = points / totalCredits;
  const shown = useCountUp(gpa);

  const verdict =
    gpa >= 3.67 ? "Dean's list range" : gpa >= 3 ? "Solid standing" : gpa >= 2 ? "Room to climb" : "Needs attention";

  return (
    <div className="relative">
      {/* Stamp */}
      <div
        aria-hidden="true"
        key={GRADES[Math.round(picked.reduce((a, b) => a + b, 0) / 3)].label}
        className="absolute -right-3 -top-9 z-10 flex h-20 w-20 items-center justify-center rounded-full border-4 border-terracotta-500 bg-white/80 font-[family-name:var(--font-display)] text-3xl font-extrabold text-terracotta-500 shadow-lg backdrop-blur-sm sm:-right-6 sm:-top-11 sm:h-24 sm:w-24 sm:text-4xl"
        style={{ animation: "stamp-in 0.5s cubic-bezier(0.22,1,0.36,1) both" }}
      >
        {gpa >= 3.67 ? "A" : gpa >= 3.33 ? "B+" : gpa >= 3 ? "B" : gpa >= 2 ? "C" : "F"}
      </div>

      <div className="overflow-hidden rounded-3xl border border-ink-900/10 bg-white shadow-[var(--shadow-elevation-3)]">
        <div className="flex items-center justify-between border-b border-ink-900/10 bg-brand-600 px-5 py-3 text-white">
          <p className="text-sm font-semibold">Try it: semester gradebook, 4.00 scale</p>
        </div>

        <ul className="divide-y divide-ink-900/8 px-5">
          {COURSES.map((course, i) => (
            <li key={course.name} className="py-4">
              <div className="flex items-baseline justify-between gap-3">
                <p className="text-sm font-semibold text-ink-900">{course.name}</p>
                <p className="text-xs text-ink-700">{course.credits} credit hours</p>
              </div>
              <div role="radiogroup" aria-label={`Grade for ${course.name}`} className="mt-2.5 flex flex-wrap gap-1.5">
                {GRADES.map((g, gi) => {
                  const on = picked[i] === gi;
                  return (
                    <button
                      key={g.label}
                      type="button"
                      role="radio"
                      aria-checked={on}
                      onClick={() => setPicked((p) => p.map((v, idx) => (idx === i ? gi : v)))}
                      className={`min-h-10 min-w-11 rounded-lg border px-3 text-sm font-bold transition-all duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 ${
                        on
                          ? "-translate-y-0.5 border-marker-400 bg-marker-300 text-ink-900 shadow-md shadow-ink-900/15"
                          : "border-ink-900/15 bg-white text-ink-700 hover:border-ink-900/40"
                      }`}
                    >
                      {g.label}
                    </button>
                  );
                })}
              </div>
            </li>
          ))}
        </ul>

        <div className="flex items-end justify-between gap-4 border-t border-ink-900/10 bg-cream-50 px-5 py-5" aria-live="polite">
          <div>
            <p className="text-sm text-ink-700">Semester GPA</p>
            <p className="tabular font-[family-name:var(--font-display)] text-6xl font-extrabold leading-none text-ink-900 sm:text-7xl">
              {shown.toFixed(2)}
            </p>
          </div>
          <p className="max-w-[9rem] pb-1 text-right text-sm font-medium text-brand-700">{verdict}</p>
        </div>
      </div>
    </div>
  );
}
