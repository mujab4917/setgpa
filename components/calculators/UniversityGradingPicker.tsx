"use client";

/**
 * UNIVERSITY GRADING PICKER
 *
 * The standalone target planner's "search your university" step. Same
 * type-ahead UX as components/universities/UniversitySearch.tsx, but instead
 * of navigating to a page, picking a result hands its real grade table back
 * to the caller - the planner then works on the same grades the student's
 * transcript actually uses, instead of a hand-typed scale number.
 */

import { useEffect, useMemo, useRef, useState } from "react";

import type { UniversityGradingListItem } from "@/types/domain";

const MAX_RESULTS = 6;

function normalise(value: string): string {
  return value.toLowerCase().replace(/\s+/g, " ").trim();
}

function matches(university: UniversityGradingListItem, query: string): boolean {
  const haystack = normalise([university.name, university.shortName ?? "", university.cityName].join(" "));
  return query.split(" ").every((word) => haystack.includes(word));
}

export function UniversityGradingPicker({
  universities,
  onSelect,
}: {
  universities: UniversityGradingListItem[];
  onSelect: (university: UniversityGradingListItem) => void;
}) {
  const [query, setQuery] = useState("");
  const [highlighted, setHighlighted] = useState(0);
  const listRef = useRef<HTMLUListElement | null>(null);

  const trimmed = normalise(query);

  const results = useMemo(() => {
    if (trimmed === "") return [];
    return universities.filter((u) => matches(u, trimmed)).slice(0, MAX_RESULTS);
  }, [universities, trimmed]);

  useEffect(() => {
    setHighlighted(0);
  }, [trimmed]);

  useEffect(() => {
    const node = listRef.current?.children[highlighted] as HTMLElement | undefined;
    node?.scrollIntoView({ block: "nearest" });
  }, [highlighted]);

  const hasQuery = trimmed !== "";
  const showNoResults = hasQuery && results.length === 0;

  function onKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (results.length === 0) return;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setHighlighted((current) => (current + 1) % results.length);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setHighlighted((current) => (current - 1 + results.length) % results.length);
    } else if (event.key === "Enter") {
      const chosen = results[highlighted];
      if (chosen) {
        event.preventDefault();
        onSelect(chosen);
      }
    } else if (event.key === "Escape") {
      setQuery("");
    }
  }

  return (
    <div>
      <label htmlFor="university-grading-search" className="block text-sm font-medium text-ink-700">
        Search for your university
      </label>

      <div className="relative mt-2">
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </svg>

        <input
          id="university-grading-search"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Type a university or city, e.g. FAST or Lahore"
          autoComplete="off"
          role="combobox"
          aria-expanded={hasQuery}
          aria-controls="university-grading-results"
          aria-activedescendant={results.length > 0 ? `university-grading-option-${highlighted}` : undefined}
          className="w-full rounded-xl border border-ink-900/20 bg-white py-3 pl-11 pr-4 text-ink-900 shadow-sm transition-shadow placeholder:text-slate-400 focus:border-brand-600 focus:shadow-md focus:ring-2 focus:ring-brand-200"
        />
      </div>

      <div id="university-grading-results" aria-live="polite" className={hasQuery ? "mt-3" : ""}>
        {showNoResults && (
          <p className="animate-slide-down-fade rounded-xl border border-ink-900/10 bg-white p-4 text-sm text-ink-700">
            No university matched that search. You can pick a scale manually instead.
          </p>
        )}

        {results.length > 0 && (
          <ul
            ref={listRef}
            role="listbox"
            className="animate-slide-down-fade divide-y divide-ink-900/8 overflow-hidden rounded-xl border border-ink-900/10 bg-white shadow-sm"
          >
            {results.map((university, index) => (
              <li key={university.id} id={`university-grading-option-${index}`} role="option" aria-selected={index === highlighted}>
                <button
                  type="button"
                  onClick={() => onSelect(university)}
                  onMouseEnter={() => setHighlighted(index)}
                  className={`group flex w-full items-center justify-between gap-3 px-4 py-3 text-left transition-colors ${
                    index === highlighted ? "bg-brand-50" : "hover:bg-brand-50"
                  }`}
                >
                  <span className="min-w-0">
                    <span className="block truncate font-medium text-ink-900">{university.name}</span>
                    <span className="block text-xs text-ink-700">
                      {university.cityName}
                      {university.campus ? ` · ${university.campus}` : ""} · {university.gpaScale.toFixed(2)} scale
                    </span>
                  </span>
                  <span
                    aria-hidden="true"
                    className="shrink-0 text-sm font-medium text-brand-700 transition-transform duration-200 group-hover:translate-x-0.5"
                  >
                    Use this &rarr;
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
