"use client";

/**
 * CITY SEARCH + GRID
 *
 * The search box and the grid live in one client component on purpose: typing
 * filters the grid directly, so there is no separate results list to scan and
 * no page reload. With a handful of cities the filter is instant; the full
 * list is already on the page, so nothing is fetched per keystroke.
 */

import { useMemo, useState } from "react";

import { CityCard } from "@/components/cities/CityCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { WritingMascot } from "@/components/ui/WritingMascot";
import { citiesPageContent } from "@/data/site-content";
import type { CityListItem } from "@/types/domain";

function normalise(value: string): string {
  return value.toLowerCase().replace(/\s+/g, " ").trim();
}

export function CitySearch({ cities }: { cities: CityListItem[] }) {
  const [query, setQuery] = useState("");
  const trimmed = normalise(query);

  const visible = useMemo(() => {
    if (trimmed === "") return cities;
    return cities.filter((city) =>
      normalise(`${city.name} ${city.tagline ?? ""}`).includes(trimmed),
    );
  }, [cities, trimmed]);

  return (
    <div>
      <div className="relative max-w-xl">
        <WritingMascot className="-top-12 -right-8 z-20 h-20 w-20 -rotate-3 sm:-top-16 sm:-right-14 sm:h-28 sm:w-28" />
        <div className="search-pulse rounded-2xl border border-ink-900/10 bg-white p-4 shadow-sm sm:p-5">
          <label
            htmlFor="city-search"
            className="block text-sm font-medium text-ink-700"
          >
            {citiesPageContent.searchLabel}
          </label>
          <input
            id="city-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={citiesPageContent.searchPlaceholder}
            autoComplete="off"
            className="mt-2 w-full rounded-xl border border-ink-900/20 bg-white px-4 py-3 text-ink-900 shadow-sm placeholder:text-slate-400 focus:border-brand-600 focus:ring-2 focus:ring-brand-200"
          />
        </div>
      </div>

      {/* Announced to screen readers when the count changes. The key makes
          the number replay its animation each time the count moves. */}
      <p aria-live="polite" className="mt-4 text-sm text-ink-700">
        <span
          key={visible.length}
          className="inline-block animate-slide-down-fade font-semibold text-ink-700 tabular-nums"
        >
          {visible.length}
        </span>{" "}
        {visible.length === cities.length
          ? visible.length === 1
            ? "city"
            : "cities"
          : `of ${cities.length} cities`}
      </p>

      {visible.length === 0 ? (
        <div className="mt-4">
          <EmptyState
            title={citiesPageContent.noResultsTitle}
            message={citiesPageContent.noResults}
          />
        </div>
      ) : (
        <ul className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((city, index) => (
            // Staggered entrance, capped so a long list never feels slow.
            <li
              key={city.id}
              className="animate-fade-up"
              style={{ animationDelay: `${Math.min(index, 8) * 60}ms` }}
            >
              <CityCard city={city} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
