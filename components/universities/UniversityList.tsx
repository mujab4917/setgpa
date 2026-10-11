"use client";

/**
 * The university list on a city page.
 *
 * Shows the first dozen cards and a "Show all" button, so a big city does not
 * turn into a long scroll, especially on a phone.
 */

import { useState } from "react";

import { EmptyState } from "@/components/ui/EmptyState";
import { UniversityCard } from "@/components/universities/UniversityCard";
import { universityListContent } from "@/data/site-content";
import type { UniversityListItem } from "@/types/domain";

/** Cards shown before "Show all". */
const PAGE_SIZE = 12;

export function UniversityList({
  universities,
}: {
  universities: UniversityListItem[];
}) {
  const [expanded, setExpanded] = useState(false);

  if (universities.length === 0) {
    return (
      <EmptyState
        title={universityListContent.emptyTitle}
        message={universityListContent.emptyMessage}
      />
    );
  }

  return (
    <div>
      {/* Every university is in the page from the start. The ones past the first
          dozen are only hidden with CSS until "Show all" is pressed, so search
          engines (which never press buttons) still find every link. */}
      <ul className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
        {universities.map((university, index) => (
          <li
            key={university.id}
            className={index >= PAGE_SIZE && !expanded ? "hidden" : "animate-fade-up"}
            style={{ animationDelay: `${Math.min(index, 8) * 60}ms` }}
          >
            <UniversityCard university={university} />
          </li>
        ))}
      </ul>

      {universities.length > PAGE_SIZE && (
        <div className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={() => setExpanded((open) => !open)}
            className="rounded-full border border-ink-900/25 bg-white px-6 py-3 text-sm font-bold text-ink-900 transition-all hover:-translate-y-0.5 hover:border-ink-900"
          >
            {expanded ? "Show fewer" : `Show all ${universities.length} universities`}
          </button>
        </div>
      )}
    </div>
  );
}
