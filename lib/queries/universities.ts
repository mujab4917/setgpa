/**
 * University queries. SERVER ONLY.
 *
 * getUniversityBySlug() returns the university together with its grade rules,
 * which is exactly the data the reusable calculators need.
 */

import { prisma } from "@/lib/db";
import type {
  UniversityDetail,
  UniversityGradingListItem,
  UniversityListItem,
  UniversitySitemapEntry,
} from "@/types/domain";

/** Active universities of one city, ordered by name. */
export async function getUniversitiesByCitySlug(
  citySlug: string,
): Promise<UniversityListItem[]> {
  const universities = await prisma.university.findMany({
    where: {
      isActive: true,
      city: { slug: citySlug, isActive: true },
    },
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
      shortName: true,
      slug: true,
      shortDescription: true,
      campus: true,
      logoUrl: true,
      isVerified: true,
      city: { select: { name: true, slug: true } },
    },
  });

  return universities.map((university) => ({
    id: university.id,
    name: university.name,
    shortName: university.shortName,
    slug: university.slug,
    shortDescription: university.shortDescription,
    campus: university.campus,
    logoUrl: university.logoUrl,
    isVerified: university.isVerified,
    citySlug: university.city.slug,
    cityName: university.city.name,
  }));
}

/**
 * One university page, including its grade table.
 * Returns null when the city or the university does not exist.
 */
export async function getUniversityBySlug(
  citySlug: string,
  universitySlug: string,
): Promise<UniversityDetail | null> {
  const university = await prisma.university.findFirst({
    where: {
      slug: universitySlug,
      isActive: true,
      city: { slug: citySlug, isActive: true },
    },
    select: {
      id: true,
      name: true,
      shortName: true,
      slug: true,
      shortDescription: true,
      description: true,
      campus: true,
      logoUrl: true,
      website: true,
      establishedYear: true,
      sector: true,
      universityType: true,
      notableFor: true,
      gpaScale: true,
      gradingSystemNotes: true,
      gpaExplanation: true,
      cgpaExplanation: true,
      metaTitle: true,
      metaDescription: true,
      ogTitle: true,
      ogDescription: true,
      isVerified: true,
      sourceNote: true,
      city: { select: { id: true, name: true, slug: true } },
      gradeRules: {
        orderBy: { sortOrder: "asc" },
        select: {
          grade: true,
          gradePoint: true,
          minPercentage: true,
          maxPercentage: true,
        },
      },
    },
  });

  if (!university) return null;

  // gradeRules is already the { grade, gradePoint } shape the calculators use.
  return university;
}

/**
 * Every active university across every active city.
 *
 * Used to feed the search box. The list is small (one row per university, a few
 * short fields each) so it is cheap to send to the browser once, which lets the
 * search filter instantly with no network round trip per keystroke.
 */
export async function getAllUniversitiesForSearch(): Promise<UniversityListItem[]> {
  const universities = await prisma.university.findMany({
    where: { isActive: true, city: { isActive: true } },
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
      shortName: true,
      slug: true,
      shortDescription: true,
      campus: true,
      logoUrl: true,
      isVerified: true,
      city: { select: { name: true, slug: true } },
    },
  });

  return universities.map((university) => ({
    id: university.id,
    name: university.name,
    shortName: university.shortName,
    slug: university.slug,
    shortDescription: university.shortDescription,
    campus: university.campus,
    logoUrl: university.logoUrl,
    isVerified: university.isVerified,
    citySlug: university.city.slug,
    cityName: university.city.name,
  }));
}

/**
 * Every active university with its grade table attached, so the standalone
 * target GPA planner can let a student search their own university and get
 * its REAL grades instead of a hand-typed generic scale.
 *
 * A little heavier than getAllUniversitiesForSearch() (each row carries its
 * grade rules), but still small enough to send to the browser once and
 * filter instantly - the same tradeoff that search box already makes.
 */
export async function getAllUniversitiesWithGrading(): Promise<UniversityGradingListItem[]> {
  const universities = await prisma.university.findMany({
    where: { isActive: true, city: { isActive: true } },
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
      shortName: true,
      slug: true,
      shortDescription: true,
      campus: true,
      logoUrl: true,
      isVerified: true,
      gpaScale: true,
      city: { select: { name: true, slug: true } },
      gradeRules: {
        orderBy: { sortOrder: "asc" },
        select: { grade: true, gradePoint: true, minPercentage: true, maxPercentage: true },
      },
    },
  });

  return universities.map((university) => ({
    id: university.id,
    name: university.name,
    shortName: university.shortName,
    slug: university.slug,
    shortDescription: university.shortDescription,
    campus: university.campus,
    logoUrl: university.logoUrl,
    isVerified: university.isVerified,
    citySlug: university.city.slug,
    cityName: university.city.name,
    gpaScale: university.gpaScale,
    gradeRules: university.gradeRules,
  }));
}

/**
 * Other universities in the same city, for the "related" section at the bottom
 * of a university page. Internal links like these help students compare
 * campuses and help search engines discover every page.
 */
export async function getRelatedUniversities(
  citySlug: string,
  excludeSlug: string,
  limit = 4,
): Promise<UniversityListItem[]> {
  const universities = await prisma.university.findMany({
    where: {
      isActive: true,
      slug: { not: excludeSlug },
      city: { slug: citySlug, isActive: true },
    },
    orderBy: { name: "asc" },
    take: limit,
    select: {
      id: true,
      name: true,
      shortName: true,
      slug: true,
      shortDescription: true,
      campus: true,
      logoUrl: true,
      isVerified: true,
      city: { select: { name: true, slug: true } },
    },
  });

  return universities.map((university) => ({
    id: university.id,
    name: university.name,
    shortName: university.shortName,
    slug: university.slug,
    shortDescription: university.shortDescription,
    campus: university.campus,
    logoUrl: university.logoUrl,
    isVerified: university.isVerified,
    citySlug: university.city.slug,
    cityName: university.city.name,
  }));
}

/** Every active university - used by generateStaticParams and sitemap.ts. */
export async function getAllUniversityPaths(): Promise<UniversitySitemapEntry[]> {
  const universities = await prisma.university.findMany({
    where: { isActive: true, city: { isActive: true } },
    select: {
      slug: true,
      updatedAt: true,
      city: { select: { slug: true } },
    },
  });

  return universities.map((university) => ({
    slug: university.slug,
    citySlug: university.city.slug,
    updatedAt: university.updatedAt,
  }));
}
