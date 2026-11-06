"use client";

import Link from "next/link";
import { useState } from "react";

import { GuideCover } from "@/components/guides/GuideCover";
import type { GuideCategory, GuideSummary } from "@/data/articles/types";
import { formatLongDate } from "@/lib/guides/format-date";

/**
 * "Latest guides": topic chips that filter a grid of illustrated cards. Every
 * card is a real link in the server-rendered HTML, so search engines see all
 * guides whatever the filter.
 */

type Filter = "All" | GuideCategory;

export function GuideBrowser({ guides }: { guides: GuideSummary[] }) {
  const [filter, setFilter] = useState<Filter>("All");
  const categories = Array.from(new Set(guides.map((g) => g.category)));
  const chips: Filter[] = ["All", ...categories];
  const shown = filter === "All" ? guides : guides.filter((g) => g.category === filter);

  return (
    <div>
      <div role="group" aria-label="Filter guides by topic" className="flex flex-wrap gap-2">
        {chips.map((chip) => {
          const count = chip === "All" ? guides.length : guides.filter((g) => g.category === chip).length;
          const active = filter === chip;
          return (
            <button
              key={chip}
              type="button"
              aria-pressed={active}
              onClick={() => setFilter(chip)}
              className={`min-h-10 rounded-full border px-4 text-sm font-bold transition-colors ${
                active
                  ? "border-ink-900 bg-ink-900 text-white"
                  : "border-ink-900/20 bg-white text-ink-900 hover:border-ink-900"
              }`}
            >
              {chip} <span className={active ? "text-white/70" : "text-ink-700"}>{count}</span>
            </button>
          );
        })}
      </div>

      <ul className="mt-7 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((guide) => (
          <li key={guide.href}>
            <article className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-ink-900/10 bg-white transition-shadow duration-200 hover:shadow-elevation-2">
              <GuideCover cover={guide.cover} className="h-48" />
              <div className="flex flex-1 flex-col p-6">
                <p className="flex items-center justify-between gap-3 text-xs font-bold">
                  <span className="text-terracotta-600">{guide.category}</span>
                  <span className="font-semibold text-ink-700">{guide.readingMinutes} min read</span>
                </p>
                <h3 className="mt-3 font-serif text-[1.35rem] font-semibold leading-snug text-ink-900">
                  <Link href={guide.href} className="after:absolute after:inset-0 group-hover:text-brand-700">
                    {guide.title}
                  </Link>
                </h3>
                <p className="mt-2.5 line-clamp-3 flex-1 text-[15px] leading-relaxed text-ink-700">
                  {guide.description}
                </p>
                <p className="mt-5 text-xs font-semibold text-ink-700">Updated {formatLongDate(guide.updated)}</p>
              </div>
            </article>
          </li>
        ))}
      </ul>
    </div>
  );
}
