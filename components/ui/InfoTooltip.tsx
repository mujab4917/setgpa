"use client";

/**
 * INFO TOOLTIP
 *
 * A small "what does this mean?" button next to a field label. Click/tap to
 * toggle, not hover-only - a hover tooltip is invisible to anyone on a phone,
 * and this site's actual audience is mostly on phones. Closes on outside
 * click, Escape, or clicking the button again.
 */

import { useEffect, useId, useRef, useState } from "react";

export function InfoTooltip({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLSpanElement>(null);
  const id = useId();

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return (
    <span ref={rootRef} className="relative inline-flex">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls={id}
        aria-label="What does this mean?"
        className="inline-flex h-4 w-4 items-center justify-center rounded-full border border-slate-400 text-[10px] font-bold leading-none text-ink-700 transition-colors hover:border-violet-500 hover:text-violet-600"
      >
        i
      </button>

      {open && (
        <div
          id={id}
          role="tooltip"
          className="animate-slide-down-fade absolute left-1/2 top-full z-30 mt-2 w-64 -translate-x-1/2 rounded-xl border border-ink-900/10 bg-white p-3 text-xs leading-relaxed text-ink-700 shadow-lg"
        >
          {children}
        </div>
      )}
    </span>
  );
}
