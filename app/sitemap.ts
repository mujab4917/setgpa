import type { MetadataRoute } from "next";

import { GUIDE_UPDATED } from "@/data/guides";
import { getActiveCitySlugs } from "@/lib/queries/cities";
import { getAllUniversityPaths } from "@/lib/queries/universities";
import { routes } from "@/lib/routes";
import { absoluteUrl } from "@/lib/seo/metadata";

/**
 * sitemap.xml - generated from the database, so every city and university you
 * add later appears automatically. Served at /sitemap.xml.
 *
 * lastModified uses real dates (the content's own update date), never
 * `new Date()`: stamping every URL "modified just now" teaches search engines
 * to ignore the field.
 */

export const revalidate = 3600;

/** Bump this when the static pages' content changes in a meaningful way. */
const SITE_CONTENT_UPDATED = new Date(GUIDE_UPDATED);

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Pages that always exist, whatever is in the database.
  const staticPages: MetadataRoute.Sitemap = [
    { url: absoluteUrl(routes.home()), lastModified: SITE_CONTENT_UPDATED, changeFrequency: "weekly", priority: 1 },
    { url: absoluteUrl(routes.howToCalculateGpa()), lastModified: SITE_CONTENT_UPDATED, changeFrequency: "monthly", priority: 0.9 },
    { url: absoluteUrl(routes.gpaVsCgpa()), lastModified: SITE_CONTENT_UPDATED, changeFrequency: "monthly", priority: 0.9 },
    { url: absoluteUrl(routes.cities()), lastModified: SITE_CONTENT_UPDATED, changeFrequency: "weekly", priority: 0.9 },
    { url: absoluteUrl(routes.targetPlanner()), lastModified: SITE_CONTENT_UPDATED, changeFrequency: "monthly", priority: 0.8 },
    { url: absoluteUrl("/about"), lastModified: SITE_CONTENT_UPDATED, changeFrequency: "monthly", priority: 0.4 },
    { url: absoluteUrl("/contact"), lastModified: SITE_CONTENT_UPDATED, changeFrequency: "monthly", priority: 0.4 },
  ];

  try {
    const [citySlugs, universityPaths] = await Promise.all([
      getActiveCitySlugs(),
      getAllUniversityPaths(),
    ]);

    return [
      ...staticPages,
      ...citySlugs.map((citySlug) => ({
        url: absoluteUrl(routes.city(citySlug)),
        lastModified: SITE_CONTENT_UPDATED,
        changeFrequency: "weekly" as const,
        priority: 0.8,
      })),
      ...universityPaths.map((path) => ({
        url: absoluteUrl(routes.university(path.citySlug, path.slug)),
        lastModified: path.updatedAt,
        changeFrequency: "monthly" as const,
        priority: 0.7,
      })),
    ];
  } catch (error) {
    // A database problem should not break the whole sitemap response.
    console.error("sitemap: could not read from the database", error);
    return staticPages;
  }
}
