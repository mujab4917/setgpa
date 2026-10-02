/**
 * City queries. SERVER ONLY - imported by Server Components and by sitemap.ts.
 *
 * Every function here returns a plain view model from types/domain.ts, so the
 * pages never work with raw Prisma rows.
 */

import { cityOrder } from "@/data/site-content";
import { prisma } from "@/lib/db";
import type { CityDetail, CityListItem } from "@/types/domain";

/**
 * Sorts cities by the curated list in data/site-content.ts, then
 * alphabetically for anything not on that list.
 *
 * The order lives in the content layer rather than the database so you can
 * reorder the homepage by editing one array, with no migration.
 */
function byCuratedOrder(a: CityListItem, b: CityListItem): number {
  const rankA = cityOrder.priority.indexOf(a.slug);
  const rankB = cityOrder.priority.indexOf(b.slug);

  // indexOf gives -1 for cities not in the list; push those to the end.
  const safeA = rankA === -1 ? Number.MAX_SAFE_INTEGER : rankA;
  const safeB = rankB === -1 ? Number.MAX_SAFE_INTEGER : rankB;

  if (safeA !== safeB) return safeA - safeB;
  return a.name.localeCompare(b.name);
}

/** All active cities, with how many active universities each one has. */
export async function getActiveCities(): Promise<CityListItem[]> {
  const cities = await prisma.city.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
      slug: true,
      tagline: true,
      _count: {
        select: { universities: { where: { isActive: true } } },
      },
    },
  });

  return cities
    .map((city) => ({
      id: city.id,
      name: city.name,
      slug: city.slug,
      tagline: city.tagline,
      universityCount: city._count.universities,
    }))
    .sort(byCuratedOrder);
}

/** One city by its URL slug, or null when it does not exist / is not active. */
export async function getCityBySlug(slug: string): Promise<CityDetail | null> {
  const city = await prisma.city.findFirst({
    where: { slug, isActive: true },
    select: {
      id: true,
      name: true,
      slug: true,
      tagline: true,
      description: true,
      metaTitle: true,
      metaDescription: true,
    },
  });

  return city;
}

/**
 * Every active city with the date its page last changed, for the sitemap.
 * A city page changes when the city OR any of its universities changes (the
 * page lists them), so the date is the latest of those.
 */
export async function getCitySitemapEntries(): Promise<Array<{ slug: string; updatedAt: Date }>> {
  const cities = await prisma.city.findMany({
    where: { isActive: true },
    orderBy: { slug: "asc" },
    select: {
      slug: true,
      updatedAt: true,
      universities: { where: { isActive: true }, select: { updatedAt: true } },
    },
  });

  return cities.map((city) => ({
    slug: city.slug,
    updatedAt: new Date(
      Math.max(city.updatedAt.getTime(), ...city.universities.map((u) => u.updatedAt.getTime())),
    ),
  }));
}

/** Slugs of every active city - used by generateStaticParams. */
export async function getActiveCitySlugs(): Promise<string[]> {
  const cities = await prisma.city.findMany({
    where: { isActive: true },
    select: { slug: true },
  });
  return cities.map((city) => city.slug);
}
