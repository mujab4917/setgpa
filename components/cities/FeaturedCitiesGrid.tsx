"use client";

/**
 * FEATURED CITIES GRID
 *
 * The homepage used to show two full rows of cities (six cards) before
 * linking away to /cities. That is a lot of scrolling before the rest of the
 * page even starts, so this shows one row (three cards) and reveals more,
 * three at a time, on request - each new row flips into place in 3D instead
 * of just appearing. Once every city passed in from the server is showing,
 * the button turns into a plain link to the full /cities page.
 */

import Link from "next/link";

import { CityCard } from "@/components/cities/CityCard";
import { CityTile } from "@/components/cities/CityTile";
import { fillTemplate, homeContent } from "@/data/site-content";
import { routes } from "@/lib/routes";
import type { CityListItem } from "@/types/domain";
import { useState } from "react";

const ROW_SIZE = 3;

export function FeaturedCitiesGrid({
  cities,
  totalCityCount,
}: {
  /** A pool of cities to reveal from, already in display order. */
  cities: CityListItem[];
  /** The true number of active cities, which may be larger than `cities`. */
  totalCityCount: number;
}) {
  const [visibleCount, setVisibleCount] = useState(Math.min(ROW_SIZE, cities.length));

  const visible = cities.slice(0, visibleCount);
  const poolExhausted = visibleCount >= cities.length;
  const hasMoreCities = totalCityCount > cities.length;

  return (
    <div>
      {/* Phones: compact one-line rows, so three cities do not take three screens. */}
      <ul className="grid gap-2 sm:hidden">
        {visible.map((city) => (
          <li key={city.id}>
            <CityTile city={city} />
          </li>
        ))}
      </ul>

      {/* Tablets and desktops: the large illustrated cards. */}
      <ul className="hidden gap-5 sm:grid sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((city, index) => {
          // Only the most recently revealed row should flip in - cities that
          // were already showing must not replay the animation.
          const isNewlyRevealed = index >= visibleCount - ROW_SIZE;
          return (
            <li
              key={city.id}
              className={isNewlyRevealed ? "animate-card-flip-in" : undefined}
              style={
                isNewlyRevealed
                  ? { animationDelay: `${(index % ROW_SIZE) * 90}ms` }
                  : undefined
              }
            >
              <CityCard city={city} />
            </li>
          );
        })}
      </ul>

      <div className="mt-4 text-center sm:mt-8">
        {!poolExhausted ? (
          <button
            type="button"
            onClick={() => setVisibleCount((count) => Math.min(count + ROW_SIZE, cities.length))}
            className="group inline-flex items-center gap-2 rounded-xl border border-ink-900/20 bg-white px-6 py-3 text-sm font-semibold text-ink-900 shadow-sm transition-colors hover:border-brand-500 hover:bg-brand-50"
          >
            Show more cities
            <ChevronDownIcon className="transition-transform duration-300 group-hover:translate-y-0.5" />
          </button>
        ) : hasMoreCities ? (
          <Link
            href={routes.cities()}
            className="inline-flex items-center justify-center rounded-xl border border-ink-900/20 bg-white px-6 py-3 text-sm font-semibold text-ink-900 shadow-sm transition-colors hover:border-brand-500 hover:bg-brand-50"
          >
            {fillTemplate(homeContent.seeAllCitiesLabel, {
              total: String(totalCityCount),
            })}
          </Link>
        ) : null}
      </div>
    </div>
  );
}

function ChevronDownIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={`h-4 w-4 ${className}`}
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}
