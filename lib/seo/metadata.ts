/**
 * SEO helpers.
 *
 * Every page builds its <title>, meta description, canonical URL and Open
 * Graph tags through these functions, so the rules live in one file.
 *
 * RULES ENFORCED HERE
 *   - Titles are at most 60 characters and put the keyword first. The brand
 *     name is added only when it still fits.
 *   - Descriptions are at most 155 characters, cut on a word boundary.
 *   - Titles and descriptions for cities and universities are GENERATED from
 *     live data (name, grade scale, top grade). The generic text stored in the
 *     database columns by the seed is deliberately ignored, so one change here
 *     improves every page.
 *
 * KEYWORD MAP (one primary keyword per page)
 *   /                         gpa calculator pakistan
 *   /how-to-calculate-gpa     how to calculate gpa
 *   /gpa-vs-cgpa              gpa vs cgpa
 *   /target-gpa-calculator    target gpa calculator
 *   /universities/<city>      gpa calculator for <city> universities
 *   /universities/<c>/<u>     <university> gpa calculator / cgpa calculator
 */

import type { Metadata } from "next";

import { formatGpa } from "@/lib/calculators/validation";
import { siteConfig } from "@/lib/site-config";
import { routes } from "@/lib/routes";
import type { CityDetail, UniversityDetail } from "@/types/domain";

export const TITLE_MAX = 60;
export const DESCRIPTION_MAX = 155;

/** Turns "/universities/lahore" into "https://example.com/universities/lahore". */
export function absoluteUrl(path: string): string {
  return `${siteConfig.url}${path.startsWith("/") ? path : `/${path}`}`;
}

/** Cuts text to `max` characters on a word boundary. */
function trimToLength(text: string, max: number): string {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max - 1);
  const lastSpace = cut.lastIndexOf(" ");
  return `${(lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut).replace(/[ ,;:-]+$/, "")}…`;
}

/** "<keyword title> | SetGPA" when it fits in 60 characters, else just the title. */
export function fitTitle(base: string, withBrand = true): string {
  const branded = `${base} | ${siteConfig.name}`;
  if (withBrand && branded.length <= TITLE_MAX) return branded;
  return trimToLength(base, TITLE_MAX);
}

export function fitDescription(text: string): string {
  return trimToLength(text, DESCRIPTION_MAX);
}

interface PageMetadataInput {
  /** Keyword-first title WITHOUT the brand; the brand is appended if it fits. */
  title: string;
  description: string;
  path: string;
  ogTitle?: string;
  ogDescription?: string;
  /** Set false when the title already contains the brand (the homepage). */
  brand?: boolean;
  type?: "website" | "article";
}

/** Shared builder: canonical URL + Open Graph + Twitter card. */
export function buildPageMetadata({
  title,
  description,
  path,
  ogTitle,
  ogDescription,
  brand = true,
  type = "website",
}: PageMetadataInput): Metadata {
  const url = absoluteUrl(path);
  const finalTitle = fitTitle(title, brand);
  const finalDescription = fitDescription(description);
  const socialTitle = ogTitle ?? title;
  const socialDescription = ogDescription ?? finalDescription;

  return {
    // `absolute` stops the layout's title template from adding the brand again.
    title: { absolute: finalTitle },
    description: finalDescription,
    alternates: { canonical: url },
    openGraph: {
      title: socialTitle,
      description: socialDescription,
      url,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      type,
    },
    twitter: {
      card: "summary",
      title: socialTitle,
      description: socialDescription,
    },
  };
}

/** Homepage metadata. Primary keyword: "gpa calculator pakistan". */
export function buildHomeMetadata(): Metadata {
  return buildPageMetadata({
    title: siteConfig.defaultMetaTitle,
    description: siteConfig.defaultMetaDescription,
    path: routes.home(),
  });
}

/** City page metadata. Primary keyword: "gpa calculator for <city> universities". */
export function buildCityMetadata(city: CityDetail, universityNames: string[] = []): Metadata {
  const count = universityNames.length;
  const examples = universityNames.slice(0, 3).join(", ");

  const description =
    count > 0
      ? `Find your ${city.name} university and use its GPA and CGPA calculator. ${count} ${
          count === 1 ? "university" : "universities"
        } with their own grade tables, including ${examples}.`
      : `Find your university in ${city.name} and calculate your GPA or CGPA with its own grade table.`;

  return buildPageMetadata({
    title: `GPA Calculator for ${city.name} Universities`,
    description,
    path: routes.city(city.slug),
  });
}

/**
 * University page metadata.
 * Primary keywords: "<name> gpa calculator" and "<name> cgpa calculator".
 */
export function buildUniversityMetadata(university: UniversityDetail): Metadata {
  const label = university.shortName ?? university.name;

  // Both exact phrases ("... GPA Calculator" and "... CGPA Calculator") appear
  // in the long form; fall back to the short form for very long names.
  const long = `${label} GPA Calculator & CGPA Calculator`;
  const title = long.length <= TITLE_MAX ? long : `${label} GPA & CGPA Calculator`;

  const top = university.gradeRules[0];
  const scale = formatGpa(university.gpaScale);
  const gradeFact = top ? ` (${top.grade} = ${formatGpa(top.gradePoint)})` : "";

  const description = `Free ${label} GPA calculator and CGPA calculator for ${university.city.name} students. Uses the ${scale}-point grade table${gradeFact}, with the formulas explained.`;

  return buildPageMetadata({
    title,
    description,
    path: routes.university(university.city.slug, university.slug),
    ogTitle: `${label} GPA & CGPA Calculator`,
  });
}
