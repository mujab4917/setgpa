"use client";

import { useInView, useReducedMotion } from "framer-motion";
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

/**
 * The self-playing demo: grade choices (indexes into GRADES) for the three
 * courses, one step every couple of seconds. It loops until someone taps a
 * grade, which hands the gradebook over to them for good.
 */
const DEMO_STEPS = [
  [0, 1, 2],
  [0, 0, 2],
  [1, 0, 1],
  [0, 0, 0],
  [1, 2, 2],
  [0, 1, 1],
] as const;
const DEMO_INTERVAL_MS = 2200;

export function HeroGradebook() {
  const [picked, setPicked] = useState<number[]>([...DEMO_STEPS[0]]);
  // True while the demo is playing; any tap turns it off for good.
  const [demo, setDemo] = useState(true);
  const rootRef = useRef<HTMLDivElement>(null);
  const inView = useInView(rootRef, { amount: 0.5 });
  const reduceMotion = useReducedMotion();
  const step = useRef(0);

  // Play the demo only while the gradebook is on screen, and never for people
  // who asked their device to cut down on motion.
  useEffect(() => {
    if (!demo || !inView || reduceMotion) return;
    const timer = window.setInterval(() => {
      step.current = (step.current + 1) % DEMO_STEPS.length;
      setPicked([...DEMO_STEPS[step.current]]);
    }, DEMO_INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, [demo, inView, reduceMotion]);

  const totalCredits = COURSES.reduce((sum, c) => sum + c.credits, 0);
  const points = COURSES.reduce((sum, c, i) => sum + c.credits * GRADES[picked[i]].point, 0);
  const gpa = points / totalCredits;
  const shown = useCountUp(gpa);

  const verdict =
    gpa >= 3.67 ? "Dean's list range" : gpa >= 3 ? "Solid standing" : gpa >= 2 ? "Room to climb" : "Needs attention";

  return (
    <div ref={rootRef} className="relative">
      {/* Stamp */}
      <div
        aria-hidden="true"
        key={GRADES[Math.round(picked.reduce((a, b) => a + b, 0) / 3)].label}
        // On a phone the stamp is smaller and sits INSIDE the card's top-right corner. At its old
        // size it climbed onto the line of text above the card and ran off the screen edge.
        className="absolute -top-5 right-3 z-10 flex h-14 w-14 items-center justify-center rounded-full border-[3px] border-terracotta-500 bg-white/90 font-[family-name:var(--font-display)] text-2xl font-extrabold text-terracotta-500 shadow-lg backdrop-blur-sm sm:-right-6 sm:-top-11 sm:h-24 sm:w-24 sm:border-4 sm:bg-white/80 sm:text-4xl"
        style={{ animation: "stamp-in 0.5s cubic-bezier(0.22,1,0.36,1) both" }}
      >
        {gpa >= 3.67 ? "A" : gpa >= 3.33 ? "B+" : gpa >= 3 ? "B" : gpa >= 2 ? "C" : "F"}
      </div>

      <div className="overflow-hidden rounded-3xl border border-ink-900/10 bg-white shadow-[var(--shadow-elevation-3)]">
        {/* pr-[4.5rem] on a phone keeps the title clear of the stamp in the corner. */}
        <div className="flex items-center justify-between border-b border-ink-900/10 bg-brand-600 py-3 pl-5 pr-[4.5rem] text-white sm:px-5">
          <p className="text-sm font-semibold">Try it: semester gradebook</p>
          {/* A live dot and "Tap a grade" while the demo plays; gone once it is the visitor's turn. */}
          {demo && (
            <span className="mr-14 hidden shrink-0 items-center gap-2 whitespace-nowrap rounded-full bg-white/15 px-3 py-1 text-xs font-semibold min-[400px]:inline-flex sm:mr-20">
              <span aria-hidden="true" className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-marker-300 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-marker-300" />
              </span>
              Tap a grade
            </span>
          )}
        </div>

        <ul className="divide-y divide-ink-900/8 px-5">
          {COURSES.map((course, i) => (
            <li key={course.name} className="py-3 sm:py-4">
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
                      onClick={() => {
                        // The visitor has taken over: stop the demo for good.
                        setDemo(false);
                        setPicked((p) => p.map((v, idx) => (idx === i ? gi : v)));
                      }}
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
            <p className="tabular font-[family-name:var(--font-display)] text-5xl font-extrabold leading-none text-ink-900 sm:text-7xl">
              {shown.toFixed(2)}
            </p>
          </div>
          <p className="max-w-[9rem] pb-1 text-right text-sm font-medium text-brand-700">{verdict}</p>
        </div>
      </div>
    </div>
  );
}
