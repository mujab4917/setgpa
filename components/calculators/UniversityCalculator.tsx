"use client";

import { useId, useRef, useState } from "react";
import { GpaCalculator } from "./GpaCalculator";
import { CgpaCalculator } from "./CgpaCalculator";
import type { GradingSystem } from "@/lib/calculators/types";

const modes = ["gpa", "cgpa"] as const;
type Mode = (typeof modes)[number];

export function UniversityCalculator(props: {
  gradingSystem: GradingSystem;
  universityName: string;
  shareUrl: string;
}) {
  const [mode, setMode] = useState<Mode>("gpa");
  const id = useId();
  const tabs = useRef<Array<HTMLButtonElement | null>>([]);

  return (
    <section id="calculator" aria-label="GPA and CGPA calculator" className="scroll-mt-24 overflow-hidden rounded-[1.75rem] border border-ink-900/10 bg-white shadow-[var(--shadow-elevation-3)]">
      <div className="border-b border-ink-900/10 bg-cream-50 p-3 sm:p-7">
        <div role="tablist" aria-label="Calculation type" className="grid grid-cols-2 gap-1 rounded-full bg-cream-200 p-1.5">
          {modes.map((item, index) => (
            <button
              key={item}
              ref={(element) => { tabs.current[index] = element; }}
              id={`${id}-${item}-tab`}
              type="button"
              role="tab"
              aria-selected={mode === item}
              aria-controls={`${id}-${item}-panel`}
              tabIndex={mode === item ? 0 : -1}
              onClick={() => setMode(item)}
              onKeyDown={(event) => {
                let next: number;
                if (event.key === "ArrowRight") next = (index + 1) % modes.length;
                else if (event.key === "ArrowLeft") next = (index + modes.length - 1) % modes.length;
                else if (event.key === "Home") next = 0;
                else if (event.key === "End") next = modes.length - 1;
                else return;
                event.preventDefault();
                setMode(modes[next]);
                tabs.current[next]?.focus();
              }}
              className={`min-h-12 rounded-full px-3 py-3 text-sm font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2 ${mode === item ? "bg-ink-900 text-white shadow-sm" : "text-ink-700 hover:bg-white hover:text-ink-900"}`}
            >
              {item.toUpperCase()} Calculator
            </button>
          ))}
        </div>
        <div className="mt-5 flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-lg font-extrabold text-ink-900 sm:text-3xl">
            {mode === "gpa" ? "Your semester, calculated." : "Your overall progress, calculated."}
          </h2>
          <span className="rounded-full bg-marker-300 px-3 py-1 text-xs font-bold text-ink-900">
            {props.gradingSystem.gpaScale.toFixed(2)} GPA scale
          </span>
        </div>
        <p className="mt-2 text-sm leading-relaxed text-ink-700">
          {mode === "gpa" ? "Add your course credits and grades to find your semester GPA." : "Add each semester’s GPA and total credits to find your CGPA."}
          <span className="mt-1 block text-xs text-ink-700/80">Switch tabs without losing your entries.</span>
        </p>
      </div>
      {/* Keep both forms mounted so switching modes preserves student input. */}
      {modes.map((item) => (
        <div key={item} id={`${id}-${item}-panel`} role="tabpanel" aria-labelledby={`${id}-${item}-tab`} hidden={mode !== item} tabIndex={0} className="rounded-b-[1.75rem] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600">
          {item === "gpa" ? <GpaCalculator {...props} /> : <CgpaCalculator {...props} />}
        </div>
      ))}
    </section>
  );
}
