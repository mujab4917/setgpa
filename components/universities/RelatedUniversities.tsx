import Link from "next/link";

import { fillTemplate, relatedContent } from "@/data/site-content";
import { routes } from "@/lib/routes";
import type { UniversityListItem } from "@/types/domain";

/**
 * "Other universities in <city>" - shown at the bottom of a university page.
 *
 * Two reasons this exists:
 *  1. Students often compare campuses, or land on the wrong one from search.
 *  2. Internal links let search engines reach every university page from any
 *     other university page, instead of only from the city page.
 *
 * Server Component: plain links, no JavaScript shipped.
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

  return (
    <section aria-labelledby="related-heading" className="mt-12">
      <h2 id="related-heading" className="text-2xl font-bold text-ink-900">
        {fillTemplate(relatedContent.heading, { city: cityName })}
      </h2>

      <ul className="mt-4 grid gap-3 sm:grid-cols-2">
        {universities.map((university) => (
          <li key={university.id}>
            <Link
              href={routes.university(university.citySlug, university.slug)}
              className="flex h-full flex-col rounded-lg border border-ink-900/10 bg-white p-4 transition-colors hover:border-brand-500 hover:bg-brand-50/40"
            >
              <span className="font-medium text-ink-900">{university.name}</span>
              <span className="mt-1 text-sm text-brand-700">
                {relatedContent.linkLabel}
              </span>
            </Link>
          </li>
        ))}
      </ul>

      <Link
        href={routes.city(citySlug)}
        className="mt-4 inline-block text-sm font-medium text-brand-700 underline underline-offset-2 hover:text-brand-800"
      >
        {fillTemplate(relatedContent.seeAllLabel, { city: cityName })}
      </Link>
    </section>
  );
}
