/**
 * View models: the plain, serialisable shapes that pages and components use.
 *
 * Why not use the Prisma types directly? Because Prisma rows contain fields the
 * UI does not need (timestamps, foreign keys) and Date objects cannot be passed
 * from a Server Component to a Client Component. The query layer
 * (lib/queries/*) converts Prisma rows into these shapes.
 */

import type { GradeOption } from "@/lib/calculators/types";

/** A city as shown on the homepage card. */
export interface CityListItem {
  id: string;
  name: string;
  slug: string;
  tagline: string | null;
  universityCount: number;
}

/** A city page. */
export interface CityDetail {
  id: string;
  name: string;
  slug: string;
  tagline: string | null;
  description: string;
  metaTitle: string | null;
  metaDescription: string | null;
}

/** A university as shown in the list on a city page. */
export interface UniversityListItem {
  id: string;
  name: string;
  shortName: string | null;
  slug: string;
  shortDescription: string;
  campus: string | null;
  logoUrl: string | null;
  isVerified: boolean;
  citySlug: string;
  cityName: string;
}

/**
 * A university plus its grade table - what the standalone target GPA
 * planner needs once a student picks their own university, instead of a
 * hand-entered generic scale.
 */
export interface UniversityGradingListItem extends UniversityListItem {
  gpaScale: number;
  gradeRules: GradeOption[];
}

/** A full university page, including the grade table that drives the calculators. */
export interface UniversityDetail {
  id: string;
  name: string;
  shortName: string | null;
  slug: string;
  shortDescription: string;
  description: string;
  campus: string | null;
  logoUrl: string | null;
  website: string | null;

  /** Profile details shown in the "University information" panel. */
  establishedYear: number | null;
  sector: string | null;
  universityType: string | null;
  notableFor: string | null;

  gpaScale: number;
  gradingSystemNotes: string | null;
  gpaExplanation: string | null;
  cgpaExplanation: string | null;

  metaTitle: string | null;
  metaDescription: string | null;
  ogTitle: string | null;
  ogDescription: string | null;

  isVerified: boolean;
  sourceNote: string | null;

  city: {
    id: string;
    name: string;
    slug: string;
  };

  /** Sorted by sortOrder: highest grade first. */
  gradeRules: GradeOption[];
}

/** Minimal shape used to build sitemap.xml. */
export interface UniversitySitemapEntry {
  citySlug: string;
  slug: string;
  updatedAt: Date;
}
