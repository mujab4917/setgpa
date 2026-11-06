import type { ReactNode } from "react";

import type { ArtId, CoverTone } from "@/data/articles/types";

/**
 * The coloured band at the top of the guides hub and of every guide.
 *
 * It is a gradebook page turned dark: graph-paper ruling in faint cream, and a
 * huge outlined symbol behind the headline (4.0, %, Σ ...) that says what the
 * page is about before you read a word. The colour comes from the guide's
 * tone, so the hub shows a spread of colours instead of one green. Every
 * colour here is dark enough for cream text (contrast 7:1 or better).
 */

const bands: Record<CoverTone, string> = {
  brand: "bg-brand-800",
  marker: "bg-terracotta-700",
  cream: "bg-ink-900",
  terracotta: "bg-brand-900",
};

const glyphs: Record<ArtId, string> = {
  percent: "%",
  terms: "A+",
  semesters: "Σ",
  gpa: "4.0",
  versus: "vs",
};

export function GuideHeroBand({
  tone,
  art,
  glyph,
  children,
}: {
  tone: CoverTone;
  /** Picks the outlined symbol. The hub passes `glyph` instead. */
  art?: ArtId;
  glyph?: string;
  children: ReactNode;
}) {
  const symbol = glyph ?? (art ? glyphs[art] : "4.0");
  return (
    <section
      className={`relative overflow-hidden rounded-b-[2.25rem] text-[#fbf6ea] sm:rounded-b-[3.5rem] ${bands[tone]}`}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(251,246,234,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(251,246,234,0.07) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-10 -right-4 select-none font-serif text-[11rem] font-semibold leading-none sm:-bottom-24 sm:-right-8 sm:text-[24rem]"
        style={{ color: "transparent", WebkitTextStroke: "2px rgba(251,246,234,0.17)" }}
      >
        {symbol}
      </span>
      {children}
    </section>
  );
}
