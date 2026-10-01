"use client";

/**
 * The university list on a city page, with filter chips.
 *
 * The "verified" / "demo data" filter is genuinely useful rather than
 * decorative: once you have started checking universities against their
 * handbooks, this is how a student finds the ones whose grade table can be
 * trusted - and how you find the ones still waiting to be checked.
 *
 * Chips only appear when both kinds exist, so the MVP (everything unverified)
 * does not show a filter that can only ever return the same list.
 */

import { useMemo, useState } from "react";

import { EmptyState } from "@/components/ui/EmptyState";
import { UniversityCard } from "@/components/universities/UniversityCard";
import { universityListContent } from "@/data/site-content";
import type { UniversityListItem } from "@/types/domain";

type Filter = "all" | "verified" | "demo";

/** Cards shown before "Show all" - keeps a big city from becoming a long scroll. */
const PAGE_SIZE = 12;

export function UniversityList({
  universities,
}: {
  universities: UniversityListItem[];
}) {
  const [filter, setFilter] = useState<Filter>("all");
  const [expanded, setExpanded] = useState(false);

  const counts = useMemo(
    () => ({
      all: universities.length,
      verified: universities.filter((u) => u.isVerified).length,
      demo: universities.filter((u) => !u.isVerified).length,
    }),
    [universities],
  );

  const visible = useMemo(() => {
    if (filter === "verified") return universities.filter((u) => u.isVerified);
    if (filter === "demo") return universities.filter((u) => !u.isVerified);
    return universities;
  }, [universities, filter]);

  const shown = expanded ? visible : visible.slice(0, PAGE_SIZE);

  // A filter that cannot change anything is just noise.
  const showChips = counts.verified > 0 && counts.demo > 0;

  const chips: Array<{ id: Filter; label: string; count: number }> = [
    { id: "all", label: universityListContent.filterAll, count: counts.all },
    {
      id: "verified",
      label: universityListContent.filterVerified,
      count: counts.verified,
    },
    { id: "demo", label: universityListContent.filterDemo, count: counts.demo },
  ];

  return (
    <div>
      {showChips && (
        <div className="mb-5 flex flex-wrap items-center gap-2">
          {chips.map((chip) => {
            const active = filter === chip.id;
            return (
              <button
                key={chip.id}
                type="button"
                onClick={() => {
                  setFilter(chip.id);
                  setExpanded(false);
                }}
                aria-pressed={active}
                className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition-all duration-200 ${
                  active
                    ? "border-brand-600 bg-brand-600 text-white shadow-sm"
                    : "border-ink-900/20 bg-white text-ink-700 hover:border-brand-400 hover:text-brand-700"
                }`}
              >
                {chip.label}
                <span
                  className={`ml-1.5 tabular-nums ${active ? "text-brand-100" : "text-ink-700/70"}`}
                >
                  {chip.count}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {visible.length === 0 ? (
        <EmptyState
          title={universityListContent.emptyTitle}
          message={universityListContent.emptyMessage}
        />
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((university, index) => (
            <li
              // The key includes the filter so cards re-animate when it changes.
              key={`${filter}-${university.id}`}
              className="animate-fade-up"
              style={{ animationDelay: `${Math.min(index, 8) * 60}ms` }}
            >
              <UniversityCard university={university} />
            </li>
          ))}
        </ul>
      )}

      {visible.length > PAGE_SIZE && (
        <div className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={() => setExpanded((open) => !open)}
            className="rounded-full border border-ink-900/25 bg-white px-6 py-3 text-sm font-bold text-ink-900 transition-all hover:-translate-y-0.5 hover:border-ink-900"
          >
            {expanded ? "Show fewer" : `Show all ${visible.length} universities`}
          </button>
        </div>
      )}
    </div>
  );
}
