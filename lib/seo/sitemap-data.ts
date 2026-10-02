/**
 * The page lists behind each sitemap. SERVER ONLY (reads the database).
 *
 * Kept separate from lib/seo/sitemap.ts (pure XML helpers) so each route file
 * stays a few lines long.
 */

import { GUIDE_UPDATED } from "@/data/guides";
import { getCitySitemapEntries } from "@/lib/queries/cities";
import { getAllUniversityPaths } from "@/lib/queries/universities";
import { routes } from "@/lib/routes";
import { absoluteUrl } from "@/lib/seo/metadata";
import type { SitemapEntry } from "@/lib/seo/sitemap";

/**
 * When the hand-written pages last changed in a meaningful way. Update the
 * date in data/guides.ts (GUIDE_UPDATED) whenever you edit them.
 */
const CONTENT_UPDATED = new Date(GUIDE_UPDATED);

/** Pages that exist whatever is in the database. Most important first. */
export function getStaticPageEntries(): SitemapEntry[] {
  return [
    routes.home(),
    routes.howToCalculateGpa(),
    routes.gpaVsCgpa(),
    routes.cities(),
    routes.targetPlanner(),
    routes.about(),
    routes.contact(),
  ].map((path) => ({ url: absoluteUrl(path), lastModified: CONTENT_UPDATED }));
}

export async function getCityEntries(): Promise<SitemapEntry[]> {
  const cities = await getCitySitemapEntries();
  return cities.map((city) => ({
    url: absoluteUrl(routes.city(city.slug)),
    lastModified: city.updatedAt,
  }));
}

export async function getUniversityEntries(): Promise<SitemapEntry[]> {
  const paths = await getAllUniversityPaths();
  return [...paths]
    .sort((a, b) => a.citySlug.localeCompare(b.citySlug) || a.slug.localeCompare(b.slug))
    .map((path) => ({
      url: absoluteUrl(routes.university(path.citySlug, path.slug)),
      lastModified: path.updatedAt,
    }));
}
