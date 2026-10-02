"use client";

/**
 * UNIVERSITY SEARCH
 *
 * A student who already knows their university should not have to walk through
 * city -> list -> university to reach the calculator. They type a few letters
 * and go straight there.
 *
 * Keyboard support matters here: arrow keys move through the results and Enter
 * opens one, so the whole journey works without touching the mouse.
 *
 * The full (small) university list is passed in from the server, so filtering
 * happens instantly in the browser with no request per keystroke. This stays
 * cheap as long as the list is a few hundred rows; past that, switch to a
 * server route handler that queries the database.
 */

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

import { searchContent } from "@/data/site-content";
import { trackEvent } from "@/lib/analytics";
import { routes } from "@/lib/routes";
import type { UniversityListItem } from "@/types/domain";

/** How many matches to show at once, so the list never floods the page. */
const MAX_RESULTS = 6;

/** Lowercase and collapse spaces so "  FAST " matches "fast". */
function normalise(value: string): string {
  return value.toLowerCase().replace(/\s+/g, " ").trim();
}

/**
 * A university matches when the query appears in its name, its short name or
 * its city. Matching the city means "lahore" lists every Lahore campus.
 */
function matches(university: UniversityListItem, query: string): boolean {
  const haystack = normalise(
    [university.name, university.shortName ?? "", university.cityName].join(" "),
  );
  // Every word must appear somewhere, so "fast lahore" still finds FAST Lahore.
  return query.split(" ").every((word) => haystack.includes(word));
}

export function UniversitySearch({
  universities,
  className = "",
  placeholder = searchContent.placeholder,
  context = "site",
}: {
  universities: UniversityListItem[];
  className?: string;
  placeholder?: string;
  /** Where this search box is, so reports can tell them apart: "home", "city", "site". */
  context?: string;
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [highlighted, setHighlighted] = useState(0);
  const listRef = useRef<HTMLUListElement | null>(null);

  const trimmed = normalise(query);

  const results = useMemo(() => {
    if (trimmed === "") return [];
    return universities.filter((u) => matches(u, trimmed)).slice(0, MAX_RESULTS);
  }, [universities, trimmed]);

  // A new search starts from the first result again.
  useEffect(() => {
    setHighlighted(0);
  }, [trimmed]);

  // Keep the highlighted row scrolled into view when arrowing down a long list.
  useEffect(() => {
    const node = listRef.current?.children[highlighted] as HTMLElement | undefined;
    node?.scrollIntoView({ block: "nearest" });
  }, [highlighted]);

  const hasQuery = trimmed !== "";
  const showNoResults = hasQuery && results.length === 0;

  // Analytics: record what people search for, once they pause typing (so "fa",
  // "fas", "fast" is reported as one search, not three).
  useEffect(() => {
    if (trimmed.length < 2) return;
    const timer = window.setTimeout(() => {
      trackEvent("search", { search_term: trimmed, search_context: context, results_count: results.length });
      if (results.length === 0) {
        trackEvent("search_no_results", { search_term: trimmed, search_context: context });
      }
    }, 1200);
    return () => window.clearTimeout(timer);
  }, [trimmed, results.length, context]);

  function trackChoice(university: UniversityListItem, position: number) {
    trackEvent("search_result_click", {
      search_term: trimmed,
      search_context: context,
      university: university.name,
      city: university.cityName,
      position: position + 1,
    });
  }

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
        trackChoice(chosen, highlighted);
        router.push(routes.university(chosen.citySlug, chosen.slug));
      }
    } else if (event.key === "Escape") {
      setQuery("");
    }
  }

  return (
    <div className={className}>
      <label
        htmlFor="university-search"
        className="block text-sm font-medium text-ink-700"
      >
        {searchContent.label}
      </label>

      <div className="relative mt-2">
        {/* Magnifier, purely decorative. */}
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
          id="university-search"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          autoComplete="off"
          role="combobox"
          aria-expanded={hasQuery}
          aria-controls="university-search-results"
          aria-activedescendant={
            results.length > 0 ? `university-option-${highlighted}` : undefined
          }
          className="w-full rounded-xl border border-ink-900/20 bg-white py-3 pl-11 pr-4 text-ink-900 shadow-sm transition-shadow placeholder:text-slate-400 focus:border-brand-600 focus:shadow-md focus:ring-2 focus:ring-brand-200"
        />
      </div>

      <div
        id="university-search-results"
        aria-live="polite"
        className={hasQuery ? "mt-3" : ""}
      >
        {showNoResults && (
          <p className="animate-slide-down-fade rounded-xl border border-ink-900/10 bg-white p-4 text-sm text-ink-700">
            {searchContent.noResults}
          </p>
        )}

        {results.length > 0 && (
          <ul
            ref={listRef}
            role="listbox"
            className="animate-slide-down-fade divide-y divide-ink-900/8 overflow-hidden rounded-xl border border-ink-900/10 bg-white shadow-sm"
          >
            {results.map((university, index) => (
              <li
                key={university.id}
                id={`university-option-${index}`}
                role="option"
                aria-selected={index === highlighted}
              >
                <Link
                  href={routes.university(university.citySlug, university.slug)}
                  onMouseEnter={() => setHighlighted(index)}
                  onClick={() => trackChoice(university, index)}
                  className={`group flex items-center justify-between gap-3 px-4 py-3 transition-colors ${
                    index === highlighted ? "bg-brand-50" : "hover:bg-brand-50"
                  }`}
                >
                  <span className="min-w-0">
                    <span className="block truncate font-medium text-ink-900">
                      {university.name}
                    </span>
                    <span className="block text-xs text-ink-700">
                      {university.cityName}
                      {university.campus ? ` · ${university.campus}` : ""}
                    </span>
                  </span>
                  <span
                    aria-hidden="true"
                    className="shrink-0 text-sm font-medium text-brand-700 transition-transform duration-200 group-hover:translate-x-0.5"
                  >
                    {searchContent.openLabel} &rarr;
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}

        {results.length > 0 && (
          <p className="mt-2 hidden text-xs text-ink-700 sm:block">
            {searchContent.keyboardHint}
          </p>
        )}
      </div>
    </div>
  );
}
