"use client";

/**
 * CITY DIRECTORY
 *
 * One compact, filterable list of every city: search by name, narrow by
 * province, sort by popularity or A to Z. The whole list is already on the
 * page, so every change is instant and nothing is fetched.
 */

import { useEffect, useMemo, useState } from "react";

import { CityTile } from "@/components/cities/CityTile";
import { EmptyState } from "@/components/ui/EmptyState";
import { citiesPageContent } from "@/data/site-content";
import { trackEvent } from "@/lib/analytics";
import { getRegion, REGION_ORDER, type Region } from "@/lib/regions";
import type { CityListItem } from "@/types/domain";

type Sort = "popular" | "az";

function normalise(value: string): string {
  return value.toLowerCase().replace(/\s+/g, " ").trim();
}

export function CityDirectory({ cities }: { cities: CityListItem[] }) {
  const [query, setQuery] = useState("");
  const [region, setRegion] = useState<Region | "All">("All");
  const [sort, setSort] = useState<Sort>("popular");

  const regionCounts = useMemo(() => {
    const counts = new Map<Region, number>();
    for (const city of cities) {
      const r = getRegion(city.slug);
      counts.set(r, (counts.get(r) ?? 0) + 1);
    }
    return REGION_ORDER.filter((r) => counts.has(r)).map((r) => ({ region: r, count: counts.get(r)! }));
  }, [cities]);

  const visible = useMemo(() => {
    const q = normalise(query);
    const filtered = cities.filter(
      (city) =>
        (region === "All" || getRegion(city.slug) === region) &&
        (q === "" || normalise(city.name).includes(q)),
    );
    // `cities` arrives in curated "popular" order from the server.
    return sort === "az" ? [...filtered].sort((a, b) => a.name.localeCompare(b.name)) : filtered;
  }, [cities, query, region, sort]);

  // Analytics: what people type into the city search, once they pause.
  useEffect(() => {
    const term = normalise(query);
    if (term.length < 2) return;
    const timer = window.setTimeout(() => {
      trackEvent("search", { search_term: term, search_context: "cities", results_count: visible.length });
      if (visible.length === 0) trackEvent("search_no_results", { search_term: term, search_context: "cities" });
    }, 1200);
    return () => window.clearTimeout(timer);
  }, [query, visible.length]);

  const chip = (active: boolean) =>
    `rounded-full border px-3.5 py-1.5 text-[13px] font-semibold transition-all duration-200 sm:px-4 sm:py-2 sm:text-sm ${
      active
        ? "border-brand-700 bg-brand-700 text-white shadow-sm"
        : "border-ink-900/20 bg-white text-ink-900 hover:border-brand-600 hover:bg-brand-50"
    }`;

  return (
    <div>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="w-full max-w-md">
          <label htmlFor="city-search" className="block text-sm font-semibold text-ink-900">
            {citiesPageContent.searchLabel}
          </label>
          <input
            id="city-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={citiesPageContent.searchPlaceholder}
            autoComplete="off"
            className="mt-2 w-full rounded-xl border border-ink-900/20 bg-white px-4 py-3 text-ink-900 shadow-sm placeholder:text-ink-700/60 focus:border-brand-600 focus:ring-2 focus:ring-brand-200"
          />
        </div>

        <div role="group" aria-label="Sort cities" className="inline-flex w-fit rounded-full bg-cream-200 p-1">
          {([
            ["popular", "Most searched"],
            ["az", "A to Z"],
          ] as const).map(([id, label]) => (
            <button
              key={id}
              type="button"
              aria-pressed={sort === id}
              onClick={() => setSort(id)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                sort === id ? "bg-ink-900 text-white" : "text-ink-700 hover:text-ink-900"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div role="group" aria-label="Filter by province" className="chip-row chip-row--wrap mt-4 sm:mt-5">
        <button type="button" aria-pressed={region === "All"} onClick={() => setRegion("All")} className={chip(region === "All")}>
          All <span className="ml-1 tabular-nums opacity-70">{cities.length}</span>
        </button>
        {regionCounts.map(({ region: r, count }) => (
          <button key={r} type="button" aria-pressed={region === r} onClick={() => setRegion(r)} className={chip(region === r)}>
            {r} <span className="ml-1 tabular-nums opacity-70">{count}</span>
          </button>
        ))}
      </div>

      <p aria-live="polite" className="mt-6 text-sm text-ink-700">
        Showing <span className="font-semibold text-ink-900 tabular-nums">{visible.length}</span> of {cities.length} cities
      </p>

      {visible.length === 0 ? (
        <div className="mt-4">
          <EmptyState title={citiesPageContent.noResultsTitle} message={citiesPageContent.noResults} />
        </div>
      ) : (
        <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((city) => (
            <li key={city.id}>
              <CityTile city={city} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
