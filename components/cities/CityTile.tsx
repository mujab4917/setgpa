import Link from "next/link";

import { getCityTheme } from "@/lib/city-theme";
import { getRegion } from "@/lib/regions";
import { routes } from "@/lib/routes";
import type { CityListItem } from "@/types/domain";

/**
 * A compact city entry for the directory: a coloured monogram, the name, and
 * how many universities it holds. Small on purpose, so 24 cities fit in a few
 * rows instead of a wall of tall cards.
 */
export function CityTile({ city }: { city: CityListItem }) {
  const theme = getCityTheme(city.slug);
  const count = city.universityCount;

  return (
    <Link
      href={routes.city(city.slug)}
      className="group flex items-center gap-4 rounded-2xl border border-ink-900/10 bg-white p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-brand-500 hover:shadow-[0_14px_28px_-14px_rgba(31,46,41,0.35)]"
    >
      <span
        aria-hidden="true"
        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl font-[family-name:var(--font-display)] text-xl font-extrabold text-white"
        style={{ backgroundImage: `linear-gradient(135deg, ${theme.from}, ${theme.to})` }}
      >
        {city.name.charAt(0)}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate font-bold text-ink-900">{city.name}</span>
        <span className="block truncate text-sm text-ink-700">
          {count} {count === 1 ? "university" : "universities"}, {getRegion(city.slug)}
        </span>
      </span>
      <span
        aria-hidden="true"
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-ink-900/20 text-sm font-semibold text-ink-900 transition-all duration-200 group-hover:border-brand-600 group-hover:bg-brand-600 group-hover:text-white"
      >
        &rarr;
      </span>
    </Link>
  );
}
