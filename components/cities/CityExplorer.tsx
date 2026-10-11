"use client";

import Link from "next/link";
import { useState } from "react";

import { getCityTheme } from "@/lib/city-theme";
import { routes } from "@/lib/routes";

export interface CityPoster {
  slug: string;
  name: string;
  universityCount: number;
  /** The province or territory, shown small under the name on wide screens. */
  region: string;
  /** Which filter this city belongs to. */
  group: string;
}

function Arrow({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className}>
      <path d="M3 8h10M9 4l4 4-4 4" />
    </svg>
  );
}

/**
 * FIND YOUR CITY
 *
 * No pictures: the site has no real photographs of these cities, and a
 * placeholder drawing repeated 24 times only pretended to be one.
 *
 * Wide screens: a typographic index. The heading and the province filters sit
 * on the left and stay in view; on the right every city is a large row (name,
 * province, university count, arrow).
 *
 * Phones: the same links as a compact two-column grid of tiles (name and
 * count), so 24 cities take a short scroll instead of a very long list.
 *
 * All cities are always in the page: filtering only hides the ones that do not
 * match, it never removes them, so every city page stays one link away for a
 * search engine as well as for a student.
 */
export function CityExplorer({
  cities,
  groups,
  universityTotal,
}: {
  cities: CityPoster[];
  groups: string[];
  universityTotal: number;
}) {
  const [active, setActive] = useState("All");

  // The biggest city, which every bar is measured against.
  const maxCount = Math.max(1, ...cities.map((city) => city.universityCount));

  const countFor = (group: string) =>
    group === "All" ? cities.length : cities.filter((city) => city.group === group).length;

  return (
    // grid-cols-1 (a minmax(0, 1fr) column) and min-w-0 on both halves keep the
    // scrolling row of filter chips from stretching the column past a phone's width.
    <div className="grid grid-cols-1 gap-7 lg:grid-cols-[16rem_minmax(0,1fr)] lg:gap-10 xl:grid-cols-[22rem_minmax(0,1fr)] xl:gap-16">
      {/* ---------- Left: heading and province filters ---------- */}
      <div className="min-w-0 lg:sticky lg:top-24 lg:self-start">
        <h2 id="cities-heading" className="text-3xl font-extrabold leading-[1.05] text-ink-900 sm:text-5xl lg:text-4xl xl:text-5xl">
          Find your city
        </h2>
        <p className="mt-3 max-w-sm text-base leading-relaxed text-ink-700 sm:text-lg">
          {universityTotal} universities in {cities.length} cities. Pick yours to get its own grade table.
        </p>

        <div
          role="group"
          aria-label="Filter cities by province"
          className="-mx-4 mt-5 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:mt-6 sm:flex-wrap sm:overflow-visible sm:px-0 lg:flex-col lg:flex-nowrap"
        >
          {["All", ...groups].map((group) => {
            const on = group === active;
            return (
              <button
                key={group}
                type="button"
                aria-pressed={on}
                onClick={() => setActive(group)}
                className={`inline-flex min-h-11 shrink-0 items-center justify-between gap-3 rounded-full border px-4 text-sm font-semibold transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 lg:w-full lg:rounded-2xl ${
                  on
                    ? "border-ink-900 bg-ink-900 text-white shadow-sm"
                    : "border-ink-900/15 bg-white text-ink-900 hover:border-ink-900/40"
                }`}
              >
                {group}
                <span
                  className={`rounded-full px-2 py-0.5 text-xs tabular-nums ${on ? "bg-white/20 text-white" : "bg-cream-200 text-ink-700"}`}
                >
                  {countFor(group)}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ---------- Right: every city ---------- */}
      <div className="min-w-0">
        {/* key replays the entrance each time the filter changes */}
        <ul key={active} className="grid grid-cols-2 gap-2.5 sm:gap-4">
          {cities.map((city, index) => {
            const show = active === "All" || city.group === active;
            const theme = getCityTheme(city.slug);
            const gradient = `linear-gradient(135deg, ${theme.from}, ${theme.to})`;
            const universities = city.universityCount === 1 ? "university" : "universities";
            // How this city compares with the biggest one, for the bar (never a sliver).
            const share = Math.max(0.1, city.universityCount / maxCount);
            return (
              <li
                key={city.slug}
                className={`min-w-0 ${show ? "animate-fade-up" : "hidden"}`}
                style={show ? { animationDelay: `${Math.min(index, 8) * 40}ms` } : undefined}
              >
                <Link
                  href={routes.city(city.slug)}
                  aria-label={`Universities in ${city.name}`}
                  style={{ ["--c" as string]: theme.from }}
                  className="group relative isolate flex h-full min-h-[4.75rem] items-center gap-2 overflow-hidden rounded-2xl border border-ink-900/10 bg-cream-50 p-2.5 transition-all duration-300 hover:border-brand-500 hover:bg-brand-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 min-[400px]:gap-2.5 min-[400px]:p-3 sm:min-h-[7.25rem] sm:items-start sm:gap-4 sm:bg-white sm:p-4 sm:shadow-sm sm:hover:-translate-y-1 sm:hover:border-[var(--c)] sm:hover:shadow-[0_20px_36px_-20px_rgba(31,46,41,0.55)]"
                >
                  {/* Wide screens: a wash of the city's own tint slides in behind the card on hover. */}
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 -z-10 hidden origin-left scale-x-0 transition-transform duration-500 ease-out group-hover:scale-x-100 sm:block"
                    style={{ background: `linear-gradient(100deg, ${theme.soft} 0%, rgba(255,255,255,0) 85%)` }}
                  />

                  {/* Phone: a small dot in the city's colour. */}
                  <span aria-hidden="true" className="h-2.5 w-2.5 shrink-0 rounded-full sm:hidden" style={{ backgroundColor: theme.from }} />

                  {/* Wide screens: a monogram that tilts and grows when the card is pointed at. */}
                  <span
                    aria-hidden="true"
                    className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-2xl font-[family-name:var(--font-display)] text-xl xl:h-12 xl:w-12 xl:text-2xl font-extrabold text-white shadow-sm transition-transform duration-300 ease-out group-hover:-rotate-6 group-hover:scale-110 sm:flex"
                    style={{ backgroundImage: gradient }}
                  >
                    {city.name.charAt(0)}
                  </span>

                  <span className="min-w-0 flex-1">
                    {/* Smaller on narrow phones so the longest name, "Muzaffarabad", fits its tile; and
                        as a last resort a long word may break rather than cross the border. */}
                    <span className="block font-[family-name:var(--font-display)] text-[0.95rem] font-extrabold leading-tight text-ink-900 transition-colors [overflow-wrap:anywhere] group-hover:text-brand-700 min-[400px]:text-lg sm:text-xl sm:[overflow-wrap:normal] xl:text-2xl">
                      {city.name}
                    </span>
                    {/* Phone: the count. Wide screens: the province, with the count and bar below. */}
                    <span className="mt-0.5 block text-xs text-ink-700 sm:hidden">
                      {city.universityCount} {universities}
                    </span>
                    <span className="mt-0.5 hidden text-sm text-ink-700 sm:block">{city.region}</span>

                    <span className="mt-3 hidden text-sm font-semibold tabular-nums text-ink-900 sm:block">
                      {city.universityCount}
                      <span className="font-normal text-ink-700"> {universities}</span>
                    </span>
                    <span className="mt-1.5 hidden h-1.5 overflow-hidden rounded-full bg-ink-900/10 sm:block">
                      <span
                        key={active}
                        className="city-bar block h-full rounded-full"
                        style={{ width: `${share * 100}%`, backgroundImage: gradient, ["--i" as string]: index }}
                      />
                    </span>
                  </span>

                  <span
                    aria-hidden="true"
                    className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-full border border-ink-900/20 text-ink-900 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:border-transparent group-hover:bg-[var(--c)] group-hover:text-white sm:flex"
                  >
                    <Arrow className="h-4 w-4 transition-transform duration-300 group-hover:-rotate-45" />
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="mt-6 sm:mt-8">
          <Link
            href={routes.cities()}
            className="inline-flex min-h-11 items-center justify-center rounded-full border border-ink-900/20 bg-white px-6 text-sm font-semibold text-ink-900 shadow-sm transition-colors hover:border-brand-500 hover:bg-brand-50"
          >
            Search all {cities.length} cities
          </Link>
        </div>
      </div>
    </div>
  );
}
