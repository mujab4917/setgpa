/**
 * FLOATING OBJECTS
 *
 * Small, flat-illustrated icons that stand in for the old plain translucent
 * "glass-shape" blobs drifting through the hero backdrops - a mortarboard, an
 * open book, a diploma scroll, an A+ grade medal and a calculator, all drawn
 * in the same simple, rounded, flat-colour style as the WritingMascot so the
 * whole site reads as one illustrated set rather than a mascot plus some
 * abstract shapes bolted on beside it.
 *
 * Deliberately plain inline SVG (no animation baked in here): a consumer
 * wraps one of these in the `.animate-object-tilt` / `.animate-object-sway`
 * utility classes (see globals.css) to make it drift and tilt in place.
 */

import type { CSSProperties } from "react";

interface IconProps {
  className?: string;
  style?: CSSProperties;
}

export function MortarboardIcon({ className = "", style }: IconProps) {
  return (
    <svg viewBox="0 0 64 64" className={className} style={style} aria-hidden="true">
      <path d="M32 14 60 27 32 40 4 27Z" className="fill-terracotta-500" />
      <path d="M18 32v11c0 4 6.3 8 14 8s14-4 14-8V32l-14 6.5Z" className="fill-terracotta-600" opacity="0.85" />
      <circle cx="32" cy="27" r="3" className="fill-terracotta-200" />
      <path d="M56 27v13" strokeWidth="3" strokeLinecap="round" className="stroke-ink-900/70" fill="none" />
      <circle cx="56" cy="43" r="4" className="fill-ink-900/70" />
    </svg>
  );
}

export function OpenBookIcon({ className = "", style }: IconProps) {
  return (
    <svg viewBox="0 0 64 64" className={className} style={style} aria-hidden="true">
      <path d="M32 20c-5-4-14-6-22-4v28c8-2 17 0 22 4Z" className="fill-cream-50 stroke-ink-900/15" strokeWidth="1.5" />
      <path d="M32 20c5-4 14-6 22-4v28c-8-2-17 0-22 4Z" className="fill-cream-50 stroke-ink-900/15" strokeWidth="1.5" />
      <path d="M32 20v28" className="stroke-ink-900/20" strokeWidth="1.5" />
      <path d="M13 22c5-1 11 0 14 2M13 29c5-1 11 0 14 2M13 36c5-1 11 0 14 2" fill="none" strokeWidth="1.6" strokeLinecap="round" className="stroke-brand-400" />
      <path d="M51 22c-5-1-11 0-14 2M51 29c-5-1-11 0-14 2M51 36c-5-1-11 0-14 2" fill="none" strokeWidth="1.6" strokeLinecap="round" className="stroke-brand-400" />
    </svg>
  );
}

export function DiplomaScrollIcon({ className = "", style }: IconProps) {
  return (
    <svg viewBox="0 0 64 64" className={className} style={style} aria-hidden="true">
      <rect x="12" y="24" width="40" height="16" rx="3" className="fill-cream-50 stroke-ink-900/15" strokeWidth="1.5" />
      <ellipse cx="12" cy="32" rx="5" ry="8" className="fill-cream-100 stroke-ink-900/15" strokeWidth="1.5" />
      <ellipse cx="52" cy="32" rx="5" ry="8" className="fill-cream-100 stroke-ink-900/15" strokeWidth="1.5" />
      <path d="M18 29h20M18 35h14" strokeWidth="1.6" strokeLinecap="round" className="stroke-ink-900/25" />
      <path d="M32 40v14l-6-4-6 4V41" className="fill-terracotta-500" />
      <circle cx="32" cy="42" r="6" className="fill-terracotta-400" />
      <circle cx="32" cy="42" r="2.4" className="fill-terracotta-100" />
    </svg>
  );
}

export function GradeMedalIcon({ className = "", style }: IconProps) {
  return (
    <svg viewBox="0 0 64 64" className={className} style={style} aria-hidden="true">
      <path d="M22 30 14 52l10-3 6 9 9-21Z" className="fill-terracotta-400" />
      <path d="M42 30 50 52l-10-3-6 9-9-21Z" className="fill-terracotta-500" />
      <circle cx="32" cy="26" r="16" className="fill-brand-500" />
      <circle cx="32" cy="26" r="12" className="fill-brand-400" />
      <text x="32" y="31" textAnchor="middle" fontSize="13" fontWeight="700" className="fill-white" fontFamily="inherit">
        A+
      </text>
    </svg>
  );
}

export function CalculatorIcon({ className = "", style }: IconProps) {
  return (
    <svg viewBox="0 0 64 64" className={className} style={style} aria-hidden="true">
      <rect x="14" y="8" width="36" height="48" rx="6" className="fill-ink-900" />
      <rect x="19" y="14" width="26" height="12" rx="2.5" className="fill-terracotta-300" />
      {[0, 1, 2].map((row) =>
        [0, 1, 2].map((col) => (
          <rect
            key={`${row}-${col}`}
            x={19 + col * 9.5}
            y={32 + row * 8.5}
            width="7"
            height="6.5"
            rx="1.6"
            className={col === 2 ? "fill-terracotta-400" : "fill-brand-400"}
          />
        )),
      )}
    </svg>
  );
}
