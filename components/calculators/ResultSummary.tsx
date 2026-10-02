"use client";

/**
 * Shared result panel for both calculators.
 *
 * Three pieces of behaviour beyond displaying numbers:
 *  1. The headline value counts up, so the moment the answer appears is felt.
 *  2. A ring around it shows how far along the scale the result sits.
 *  3. "Copy result" puts a plain-text summary on the clipboard, because
 *     students routinely screenshot a GPA to send to someone.
 */

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

import { downloadResultCard } from "@/lib/calculators/result-card";

import { resultContent, targetPlannerPageContent } from "@/data/site-content";
import { formatPercentage, gpaToPercentage } from "@/lib/calculators/validation";

/**
 * Copies text using the pre-clipboard-API technique: put the text in an
 * off-screen textarea, select it, and ask the browser to copy the selection.
 * Returns false when the browser refuses.
 */
function legacyCopy(text: string): boolean {
  try {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.top = "0";
    textarea.style.left = "-9999px";

    document.body.appendChild(textarea);
    textarea.select();
    textarea.setSelectionRange(0, text.length);

    const succeeded = document.execCommand("copy");
    document.body.removeChild(textarea);
    return succeeded;
  } catch {
    return false;
  }
}

/** True when the visitor has asked their device to reduce motion. */
function prefersReducedMotion(): boolean {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Counts from the previous value to the new one over ~500ms.
 * Uses requestAnimationFrame rather than a timer so it stays in step with the
 * browser's own paint cycle.
 */
function useCountUp(target: number | null, decimals = 2): number | null {
  const [display, setDisplay] = useState<number | null>(target);
  const fromRef = useRef<number>(target ?? 0);

  useEffect(() => {
    if (target === null) {
      setDisplay(null);
      fromRef.current = 0;
      return;
    }

    const from = fromRef.current;
    const distance = target - from;

    // Skip the animation when it would not be noticed, or is not wanted.
    if (Math.abs(distance) < 0.01 || prefersReducedMotion()) {
      setDisplay(target);
      fromRef.current = target;
      return;
    }

    const duration = 500;
    const start = performance.now();
    let frame = 0;

    const step = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(1, elapsed / duration);
      // Ease-out: quick at first, settling gently on the final number.
      const eased = 1 - (1 - progress) ** 3;
      const value = from + distance * eased;

      setDisplay(Number(value.toFixed(decimals)));

      if (progress < 1) {
        frame = requestAnimationFrame(step);
      } else {
        fromRef.current = target;
      }
    };

    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [target, decimals]);

  return display;
}

/** Colour band for the result, based on how far up the scale it is. */
function bandFor(ratio: number) {
  // Ring colours are mid-tones; number colours are darker so they stay easy to
  // read on the light result card.
  if (ratio >= 0.85) {
    return { ring: "#4a8a6d", number: "text-brand-700" };
  }
  if (ratio >= 0.65) {
    return { ring: "#5f8fb5", number: "text-[#3d6a8f]" };
  }
  if (ratio >= 0.5) {
    return { ring: "#c99a3b", number: "text-[#8a6418]" };
  }
  return { ring: "#d06a5d", number: "text-terracotta-600" };
}

interface ResultSummaryProps {
  universityName: string;
  shareUrl: string;
  headlineLabel: string;
  /** The raw value, or null when there is nothing to show yet. */
  value: number | null;
  /** Formatted placeholder shown when value is null, e.g. an em dash. */
  emptyValue: string;
  /** Maximum of the scale as a number, e.g. 4. */
  scale: number;
  /** Maximum of the scale, formatted for display, e.g. "4". */
  scaleLabel: string;
  items: Array<{ label: string; value: string }>;
  copyText?: string | null;
  /** Builds the href for a preset goal (from this result's value) into the standalone Target GPA Calculator, pre-loaded for this university. */
  targetPlannerHref?: (target: number) => string;
}

export function ResultSummary({
  universityName,
  shareUrl,
  headlineLabel,
  value,
  emptyValue,
  scale,
  scaleLabel,
  items,
  copyText,
  targetPlannerHref,
}: ResultSummaryProps) {
  const [downloadStatus, setDownloadStatus] = useState("");
  const [downloading, setDownloading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [failed, setFailed] = useState(false);
  const animated = useCountUp(value);

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(timer);
  }, [copied]);

  async function handleCopy() {
    if (!copyText) return;

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(copyText);
        setFailed(false);
        setCopied(true);
        return;
      }
    } catch {
      // Denied or unavailable - fall through to the older method below.
    }

    if (legacyCopy(copyText)) {
      setFailed(false);
      setCopied(true);
      return;
    }

    setFailed(true);
  }

  const ratio = value === null || scale <= 0 ? 0 : Math.min(1, value / scale);
  const band = bandFor(ratio);
  const percentage = value === null ? null : gpaToPercentage(value, scale);

  // Ring geometry. The dash offset is what makes the arc appear to fill.
  const radius = 34;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - ratio);

  return (
    <div
      aria-live="polite"
      className="relative overflow-hidden rounded-2xl border border-brand-200 bg-brand-50 p-5 text-ink-900 shadow-sm sm:p-6"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          {/* ---------- Progress ring ---------- */}
          <div className="relative hidden h-20 w-20 shrink-0 sm:block">
            <svg viewBox="0 0 80 80" className="h-20 w-20 -rotate-90">
              <circle
                cx="40"
                cy="40"
                r={radius}
                fill="none"
                stroke="rgba(31,46,41,0.12)"
                strokeWidth="7"
              />
              <circle
                cx="40"
                cy="40"
                r={radius}
                fill="none"
                stroke={band.ring}
                strokeWidth="7"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={dashOffset}
                className="transition-[stroke-dashoffset,stroke] duration-700 ease-out"
              />
            </svg>
            {/* The ring's figure IS the percentage: GPA / scale x 100, which
                on a four point scale is the usual "GPA x 25" conversion. */}
            <span className="absolute inset-0 flex flex-col items-center justify-center leading-none">
              <span className="text-sm font-bold text-ink-900">
                {percentage === null ? "—" : `${Math.round(percentage)}%`}
              </span>
              <span className="mt-0.5 text-[10px] font-medium text-ink-700">
                {resultContent.approxLabel}
              </span>
            </span>
          </div>

          <div>
            <p className="text-sm font-semibold text-ink-700">{headlineLabel}</p>
            <p className="mt-1 font-[family-name:var(--font-display)] text-5xl font-extrabold tabular-nums">
              <span className={value === null ? "text-ink-900" : band.number}>
                {animated === null ? emptyValue : animated.toFixed(2)}
              </span>
              <span className="ml-1 text-lg font-semibold text-ink-700">
                / {scaleLabel}
              </span>
            </p>
          </div>
        </div>

        {copyText && (
          <button
            type="button"
            onClick={handleCopy}
            className="shrink-0 rounded-full border border-ink-900/25 bg-white px-4 py-2 text-xs font-bold text-ink-900 transition-all hover:border-ink-900"
          >
            {copied ? resultContent.copiedLabel : resultContent.copyLabel}
          </button>
        )}
      </div>

      {value !== null && <div className="mt-4 flex flex-wrap items-center gap-3">
        <button type="button" disabled={downloading} className="min-h-11 rounded-full bg-ink-900 px-5 py-2 text-sm font-bold text-white transition-colors hover:bg-brand-700 disabled:opacity-60" onClick={async () => {
          setDownloading(true);
          setDownloadStatus("");
          try { await downloadResultCard({ title: headlineLabel, university: universityName, url: shareUrl, value, scale: scaleLabel, items }); setDownloadStatus("Your result card is ready."); }
          catch { setDownloadStatus("Could not download. Please try again or use Copy result."); }
          finally { setDownloading(false); }
        }}>{downloading ? "Creating card…" : "Download result card ↗"}</button>
        <span role="status" className="text-xs text-ink-700">{downloadStatus}</span>
      </div>}
      <dl className="mt-5 grid grid-cols-2 gap-4 border-t border-ink-900/10 pt-4 text-sm">
        {/* Percentage first: it is the number most students are looking for
            after the GPA itself. */}
        <div>
          <dt className="text-ink-700">{resultContent.percentageLabel}</dt>
          <dd className="mt-0.5 text-base font-bold tabular-nums text-ink-900">
            {formatPercentage(percentage)}
          </dd>
        </div>
        {items.map((item) => (
          <div key={item.label}>
            <dt className="text-ink-700">{item.label}</dt>
            <dd className="mt-0.5 text-base font-bold tabular-nums text-ink-900">{item.value}</dd>
          </div>
        ))}
      </dl>

      {percentage !== null && (
        <p className="mt-4 border-t border-ink-900/10 pt-3 text-xs leading-relaxed text-ink-700">
          {resultContent.percentageNote}
        </p>
      )}

      {failed && (
        <p className="mt-3 text-xs font-semibold text-terracotta-600">{resultContent.copyFailed}</p>
      )}

      {targetPlannerHref && value !== null && (
        <div className="mt-4 border-t border-ink-900/10 pt-4">
          <p className="text-sm font-bold text-ink-900">{resultContent.targetCtaHeading}</p>
          <p className="mt-0.5 text-xs text-ink-700">{resultContent.targetCtaCaption}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {targetPlannerPageContent.presets.map((preset) => (
              <Link
                key={preset.key}
                href={targetPlannerHref(preset.ratio * scale)}
                className="rounded-full border border-ink-900/25 bg-white px-4 py-2 text-xs font-bold text-ink-900 transition-all hover:border-brand-600 hover:bg-brand-100"
              >
                {preset.label} ({(preset.ratio * scale).toFixed(2)})
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
