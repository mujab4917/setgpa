import Link from "next/link";

import { routes } from "@/lib/routes";
import type { CityListItem } from "@/types/domain";

/**
 * "Other cities" - links from a city page to the biggest other cities.
 *
 * Students often search the nearest big city, and these links also let search
 * engines move between city pages instead of only coming back through /cities.
 * Server Component: plain links.
 */
export function OtherCities({
  cities,
  currentSlug,
  limit = 8,
}: {
  cities: CityListItem[];
  currentSlug: string;
  limit?: number;
}) {
  const others = cities
    .filter((city) => city.slug !== currentSlug && city.universityCount > 0)
    .slice(0, limit);
  if (others.length === 0) return null;

  return (
    <section aria-labelledby="other-cities-heading" className="mt-10 sm:mt-14">
      <h2 id="other-cities-heading" className="text-xl font-extrabold text-ink-900 sm:text-3xl">
        GPA calculators in other cities
      </h2>
      <ul className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-4 sm:gap-3">
        {others.map((city) => (
          <li key={city.slug}>
            <Link
              href={routes.city(city.slug)}
              className="flex h-full flex-col rounded-2xl border border-ink-900/10 bg-white px-3.5 py-3 shadow-sm transition-colors hover:border-brand-500 hover:bg-brand-50/60"
            >
              <span className="font-semibold text-ink-900">{city.name}</span>
              <span className="mt-0.5 text-sm text-ink-700">
                {city.universityCount} {city.universityCount === 1 ? "university" : "universities"}
              </span>
            </Link>
          </li>
        ))}
      </ul>
      <Link
        href={routes.cities()}
        className="mt-4 inline-block text-sm font-semibold text-brand-700 underline underline-offset-4 hover:text-brand-900"
      >
        See all cities
      </Link>
    </section>
  );
}
