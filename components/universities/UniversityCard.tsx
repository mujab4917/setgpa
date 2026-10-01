import Image from "next/image";
import Link from "next/link";

import { getCityTheme, type CityTheme } from "@/lib/city-theme";
import { routes } from "@/lib/routes";
import type { UniversityListItem } from "@/types/domain";

/** One university in the list on a city page. */
export function UniversityCard({ university }: { university: UniversityListItem }) {
  // Universities inherit their city's colour, so a city page looks like a set.
  const theme = getCityTheme(university.citySlug);

  return (
    <Link
      href={routes.university(university.citySlug, university.slug)}
      className="group relative flex h-full items-start gap-4 overflow-hidden rounded-2xl border border-ink-900/10 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-500 hover:shadow-lg"
    >
      {/* Coloured accent bar that grows down the left edge on hover, matching
          the city's colour so a university feels part of its city. */}
      <span
        aria-hidden="true"
        className="absolute inset-y-0 left-0 w-1 origin-top scale-y-0 transition-transform duration-300 group-hover:scale-y-100"
        style={{
          backgroundImage: `linear-gradient(to bottom, ${theme.from}, ${theme.to})`,
        }}
      />

      <LogoPlaceholder
        name={university.shortName ?? university.name}
        logoUrl={university.logoUrl}
        theme={theme}
      />

      <span className="min-w-0">
        <span className="block font-semibold text-ink-900 group-hover:text-brand-700">
          {university.name}
        </span>
        <span className="mt-1 line-clamp-2 block text-sm leading-relaxed text-ink-700">
          {university.shortDescription}
        </span>
        <span className="mt-3 flex flex-wrap items-center gap-2 text-xs">
          {university.campus && (
            <span className="rounded-full bg-cream-200 px-2.5 py-1 text-ink-700">
              {university.campus}
            </span>
          )}
          {!university.isVerified && (
            <span className="rounded-full bg-amber-100 px-2.5 py-1 font-medium text-amber-800">
              Demo data
            </span>
          )}
        </span>
      </span>
    </Link>
  );
}

/**
 * Shows the university logo when `logoUrl` is set (put the file in /public and
 * store e.g. "/logos/fast.png"), otherwise falls back to the initials.
 */
function LogoPlaceholder({
  name,
  logoUrl,
  theme,
}: {
  name: string;
  logoUrl: string | null;
  theme: CityTheme;
}) {
  if (logoUrl) {
    return (
      <Image
        src={logoUrl}
        alt=""
        width={48}
        height={48}
        className="h-12 w-12 shrink-0 rounded-lg object-contain"
      />
    );
  }

  const initials = name
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word.charAt(0))
    .join("")
    .toUpperCase();

  return (
    <span
      aria-hidden="true"
      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg text-sm font-bold transition-transform duration-300 group-hover:scale-105"
      style={{ backgroundColor: theme.soft, color: theme.ink }}
    >
      {initials}
    </span>
  );
}
