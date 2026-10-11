import Link from "next/link";

import { fillTemplate, relatedContent } from "@/data/site-content";
import { routes } from "@/lib/routes";
import type { UniversityListItem } from "@/types/domain";

/** Universities shown straight away; the rest open under "Show N more". */
const VISIBLE_COUNT = 6;

function Chevron() {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="h-4 w-4 shrink-0 text-brand-700 transition-transform group-hover:translate-x-0.5"
    >
      <path d="m6 3.5 4.5 4.5L6 12.5" />
    </svg>
  );
}

/** One row: short name in bold, the full name underneath when it differs. */
function Row({ university }: { university: UniversityListItem }) {
  const short = university.shortName ?? university.name;
  const showFull = Boolean(university.shortName) && university.shortName !== university.name;

  return (
    // min-w-0 matters: a grid item will not shrink below its content on its own,
    // so one long unbreakable name stretched the whole card past the screen.
    <li className="min-w-0 border-b border-ink-900/10 last:border-b-0 sm:[&:nth-last-child(2):nth-child(odd)]:border-b-0">
      <Link
        href={routes.university(university.citySlug, university.slug)}
        className="group flex min-h-14 min-w-0 items-center justify-between gap-3 py-2.5 text-ink-900 transition-colors hover:text-brand-700"
      >
        <span className="min-w-0 flex-1">
          <span className="block font-semibold leading-snug">{short}</span>
          {showFull && (
            <span className="block truncate text-xs text-ink-700">{university.name}</span>
          )}
        </span>
        <Chevron />
      </Link>
    </li>
  );
}

/**
 * "Other universities in <city>" - shown at the bottom of a university page.
 *
 * Two reasons this exists:
 *  1. Students often compare campuses, or land on the wrong one from search.
 *  2. Internal links let search engines reach every university page from any
 *     other university page, instead of only from the city page.
 *
 * ONE list, not two: the first few rows are visible, the rest sit inside a
 * native <details>, so nothing is repeated and no JavaScript is needed. The
 * links inside a closed <details> are still in the page's HTML, so search
 * engines see every one.
 *
 * Server Component.
 */
export function RelatedUniversities({
  universities,
  cityName,
  citySlug,
}: {
  universities: UniversityListItem[];
  cityName: string;
  citySlug: string;
}) {
  if (universities.length === 0) return null;

  const visible = universities.slice(0, VISIBLE_COUNT);
  const more = universities.slice(VISIBLE_COUNT);
  // grid-cols-1 is minmax(0, 1fr): the column can shrink to the card's width.
  const listClass = "grid grid-cols-1 gap-x-10 sm:grid-cols-2";

  return (
    <section aria-labelledby="related-heading" className="mt-10 sm:mt-12">
      <h2 id="related-heading" className="text-xl font-bold text-ink-900 sm:text-2xl">
        {fillTemplate(relatedContent.heading, { city: cityName })}
      </h2>

      <div className="mt-4 overflow-hidden rounded-2xl border border-ink-900/10 bg-white px-4 shadow-sm sm:px-6">
        <ul className={listClass}>
          {visible.map((university) => (
            <Row key={university.id} university={university} />
          ))}
        </ul>

        {more.length > 0 && (
          <details className="group/more border-t border-ink-900/10">
            <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-3 py-2.5 text-sm font-semibold text-brand-700 hover:text-brand-900 focus-visible:rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 [&::-webkit-details-marker]:hidden">
              <span className="group-open/more:hidden">Show {more.length} more in {cityName}</span>
              <span className="hidden group-open/more:inline">Show fewer</span>
              <svg
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                className="h-4 w-4 transition-transform group-open/more:rotate-180"
              >
                <path d="m3.5 6 4.5 4.5L12.5 6" />
              </svg>
            </summary>
            <ul className={`${listClass} border-t border-ink-900/10`}>
              {more.map((university) => (
                <Row key={university.id} university={university} />
              ))}
            </ul>
          </details>
        )}
      </div>

      <Link
        href={routes.city(citySlug)}
        className="mt-4 inline-flex min-h-10 items-center text-sm font-semibold text-brand-700 underline underline-offset-4 hover:text-brand-900"
      >
        {fillTemplate(relatedContent.seeAllLabel, { city: cityName })}
      </Link>
    </section>
  );
}
