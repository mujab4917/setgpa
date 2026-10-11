"use client";

import { useInView, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { useRef, useState } from "react";

import type { GradeSpreadItem } from "@/lib/queries/universities";

export interface GradeSpread {
  grade: string;
  items: GradeSpreadItem[];
}

/**
 * "The same grade is not worth the same points everywhere" - as something to
 * play with. Pick a grade and see how far apart the real values are across the
 * universities on SetGPA: a big range, a stamp that re-stamps with the grade,
 * and one bar per real value (with how many universities use it).
 *
 * Every number comes from the database, so it cannot drift from the tables.
 * The bars' scale is fitted to the values shown, not drawn from zero, because
 * the real gaps are small; the card says so.
 */

function barRange(values: number[]): { min: number; max: number } {
  const low = Math.min(...values);
  const high = Math.max(...values);
  const min = Math.floor((low - 0.05) * 20 + 1e-9) / 20;
  const max = Math.ceil((high + 0.05) * 20 - 1e-9) / 20;
  return { min, max: max > min ? max : min + 0.1 };
}

/** "An A-", "An F", but "A B+" and "A C": it depends on how the letter is said. */
function article(grade: string): string {
  return "AEFHILMNORSX".includes(grade.trim().charAt(0).toUpperCase()) ? "An" : "A";
}

export function GradeExplorer({ spreads }: { spreads: GradeSpread[] }) {
  const usable = spreads.filter((spread) => spread.items.length > 0);
  const [selected, setSelected] = useState(
    usable.find((spread) => spread.grade === "A-")?.grade ?? usable[0]?.grade ?? "",
  );
  const rootRef = useRef<HTMLDivElement>(null);
  const inView = useInView(rootRef, { amount: 0.3, once: true });
  const reduceMotion = useReducedMotion();

  const current = usable.find((spread) => spread.grade === selected);
  if (!current) return null;

  const items = current.items;
  const lowest = items[0].gradePoint;
  const highest = items[items.length - 1].gradePoint;
  const gap = highest - lowest;
  const range = barRange(items.map((item) => item.gradePoint));
  const mostCommon = items.reduce((best, item) => (item.count > best.count ? item : best), items[0]);

  return (
    <div ref={rootRef} data-inview={inView || reduceMotion ? "true" : "false"} className="grid items-center gap-10 lg:grid-cols-[1fr_1.05fr] lg:gap-16">
      {/* ---------- Left: the claim, and the control ---------- */}
      <div>
        <h2 className="text-[2rem] font-extrabold leading-[1.04] text-white sm:text-5xl lg:text-6xl">
          The same grade is not worth the same points everywhere.
        </h2>
        <p className="mt-4 max-w-lg text-base leading-relaxed text-white/70 sm:mt-5 sm:text-lg">
          Every university keeps its own grade table. Pick a grade and see how far apart the real values are.
        </p>

        {/* Five equal buttons on one row on a phone (they used to wrap, leaving "C+" alone). */}
        <div
          role="radiogroup"
          aria-label="Pick a grade"
          style={{ gridTemplateColumns: `repeat(${usable.length}, minmax(0, 1fr))` }}
          className="mt-6 grid gap-2 sm:mt-8 sm:flex sm:flex-wrap"
        >
          {usable.map((spread) => {
            const on = spread.grade === selected;
            return (
              <button
                key={spread.grade}
                type="button"
                role="radio"
                aria-checked={on}
                onClick={() => setSelected(spread.grade)}
                className={`min-h-12 min-w-0 rounded-2xl border px-0 text-base font-extrabold transition-all duration-200 sm:min-w-14 sm:px-5 sm:text-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-marker-300 ${
                  on
                    ? "-translate-y-0.5 border-marker-300 bg-marker-300 text-ink-900 shadow-[0_10px_22px_-10px_rgba(248,208,176,0.8)]"
                    : "border-white/20 bg-white/5 text-white hover:border-white/50 hover:bg-white/10"
                }`}
              >
                {spread.grade}
              </button>
            );
          })}
        </div>

        <Link
          href="#cities"
          className="group mt-7 inline-flex items-center gap-3 rounded-full bg-white py-1.5 pl-6 pr-1.5 text-base font-bold text-ink-900 transition-colors hover:bg-brand-100 sm:mt-9"
        >
          Find your university
          <span
            aria-hidden="true"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-600 text-white transition-transform duration-300 group-hover:translate-x-1"
          >
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
              <path d="M3 8h10M9 4l4 4-4 4" />
            </svg>
          </span>
        </Link>
      </div>

      {/* ---------- Right: what that grade is worth ---------- */}
      <div className="relative">
        {/* The stamp: the same motif as the gradebook above, re-stamped for each grade. */}
        <div
          key={selected}
          aria-hidden="true"
          className="absolute -top-5 right-4 z-10 flex h-14 w-14 items-center justify-center rounded-full border-[3px] border-terracotta-500 bg-white/95 font-[family-name:var(--font-display)] text-2xl font-extrabold text-terracotta-500 shadow-lg backdrop-blur-sm sm:-right-5 sm:-top-10 sm:h-28 sm:w-28 sm:border-4 sm:text-5xl"
          style={{ animation: reduceMotion ? undefined : "stamp-in 0.5s cubic-bezier(0.22,1,0.36,1) both" }}
        >
          {selected}
        </div>

        <div className="rounded-3xl bg-cream-50 p-5 shadow-[0_30px_60px_-24px_rgba(0,0,0,0.55)] sm:rounded-[2rem] sm:p-8">
          <p className="text-sm font-semibold text-ink-700">
            {article(selected)} {selected} is worth
          </p>
          <p
            className="tabular mt-1 font-[family-name:var(--font-display)] text-5xl font-extrabold leading-none text-ink-900 sm:text-7xl"
            aria-live="polite"
          >
            {lowest.toFixed(2)}
            {gap > 0 && (
              <>
                <span className="mx-2 text-3xl font-bold text-ink-700/50 sm:text-5xl">to</span>
                {highest.toFixed(2)}
              </>
            )}
          </p>
          <p className="mt-2 text-sm text-ink-700 sm:text-base">
            {gap > 0
              ? `points, depending on the university. That is up to ${gap.toFixed(2)} apart.`
              : "points, the same at every university shown."}
          </p>

          {/* key remounts the bars when the grade changes, which replays their growth. */}
          <ul key={`bars-${selected}`} className="mt-6 space-y-4 sm:mt-7" aria-label={`Grade points for ${selected} across universities`}>
            {items.map((item, index) => {
              const fill = Math.max(0.08, Math.min(1, (item.gradePoint - range.min) / (range.max - range.min)));
              const others = item.count - item.examples.length;
              return (
                <li key={item.gradePoint} className="grid grid-cols-[3.4rem_1fr] items-center gap-x-3 gap-y-1 sm:grid-cols-[4.2rem_1fr] sm:gap-x-4">
                  <span className="tabular font-[family-name:var(--font-display)] text-xl font-extrabold leading-none text-ink-900 sm:text-2xl">
                    {item.gradePoint.toFixed(2)}
                  </span>
                  <div className="h-3.5 overflow-hidden rounded-full bg-cream-200 sm:h-4">
                    <div
                      className={`spread-bar h-full rounded-full ${item.gradePoint === mostCommon.gradePoint ? "bg-brand-600" : "bg-marker-400"}`}
                      style={{ width: `${fill * 100}%`, ["--i" as string]: index }}
                    />
                  </div>
                  <p className="col-start-2 text-xs leading-snug text-ink-700 sm:text-sm">
                    <span className="font-semibold text-ink-900">
                      {item.count} {item.count === 1 ? "university" : "universities"}
                    </span>
                    , such as {item.examples.join(" and ")}
                    {others > 0 ? ` and ${others} more` : ""}
                  </p>
                </li>
              );
            })}
          </ul>

          {items.length > 1 && (
            <p className="mt-4 text-xs text-ink-700">
              Bars run from {range.min.toFixed(2)} to {range.max.toFixed(2)} so the gaps are easy to see. The green bar is the most common value.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
