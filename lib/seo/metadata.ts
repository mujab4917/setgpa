/**
 * SEO helpers.
 *
 * Every page builds its <title>, meta description, canonical URL and Open
 * Graph tags through these functions, so the rules live in one file.
 *
 * RULES ENFORCED HERE
 *   - Titles are at most 60 characters AND about 555 px wide (Google cuts by
 *     pixels), and put the keyword first. The brand name is added only when
 *     it still fits.
 *   - Descriptions are at most 155 characters and about 970 px wide, cut on a
 *     word boundary.
 *   - Titles and descriptions for cities and universities are GENERATED from
 *     live data (name, grade scale, top grade). The generic text stored in the
 *     database columns by the seed is deliberately ignored, so one change here
 *     improves every page.
 *
 * KEYWORD MAP (one primary keyword per page)
 *   /                         gpa calculator pakistan
 *   /guides                   gpa and cgpa guides
 *   /guides/how-to-calculate-gpa   how to calculate gpa
 *   /guides/gpa-vs-cgpa            gpa vs cgpa
 *   /target-gpa-calculator    target gpa calculator
 *   /universities/<city>      gpa calculator for <city> universities
 *   /universities/<c>/<u>     <university> gpa calculator / cgpa calculator
 */

import type { Metadata } from "next";

import { cityFocus, universityFocus } from "@/data/focus-pages";
import { formatGpa } from "@/lib/calculators/validation";
import {
  DESCRIPTION_MAX_PX,
  TITLE_MAX_PX,
  descriptionPixelWidth,
  titlePixelWidth,
} from "@/lib/seo/pixel-width";
import { siteConfig } from "@/lib/site-config";
import { routes } from "@/lib/routes";
import type { CityDetail, UniversityDetail } from "@/types/domain";

export const TITLE_MAX = 60;
export const DESCRIPTION_MAX = 155;

/** Turns "/universities/lahore" into "https://example.com/universities/lahore". */
export function absoluteUrl(path: string): string {
  // The homepage is always "https://setgpa.com" (no trailing slash), so the
  // canonical tag, Open Graph URL, sitemap and structured data all agree.
  if (path === "/" || path === "") return siteConfig.url;
  return `${siteConfig.url}${path.startsWith("/") ? path : `/${path}`}`;
}

/**
 * Cuts text on a word boundary until it fits BOTH the character limit and the
 * pixel limit. Google truncates by pixels, so wide letters (M, W, O) can
 * overflow a text that is within the character limit.
 */
function trimToFit(text: string, maxChars: number, maxPx: number, measure: (text: string) => number): string {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= maxChars && measure(clean) <= maxPx) return clean;

  const words = clean.split(" ");
  while (words.length > 1) {
    words.pop();
    const candidate = `${words.join(" ").replace(/[ ,;:-]+$/, "")}…`;
    if (candidate.length <= maxChars && measure(candidate) <= maxPx) return candidate;
  }
  return clean.slice(0, maxChars - 1);
}

/**
 * "<keyword title> | SetGPA" when it fits in 60 characters and 555 px. When it
 * does not, the brand is dropped (the keyword matters more than the brand in
 * a search result), and only then is the title itself shortened.
 */
export function fitTitle(base: string, withBrand = true): string {
  const branded = `${base} | ${siteConfig.name}`;
  if (withBrand && branded.length <= TITLE_MAX && titlePixelWidth(branded) <= TITLE_MAX_PX) {
    return branded;
  }
  return trimToFit(base, TITLE_MAX, TITLE_MAX_PX, titlePixelWidth);
}

export function fitDescription(text: string): string {
  return trimToFit(text, DESCRIPTION_MAX, DESCRIPTION_MAX_PX, descriptionPixelWidth);
}

/**
 * Picks the first description (longest first) that fits without being cut.
 * Cutting with "…" reads badly in a search result, so templates offer shorter
 * wordings instead; the last one is trimmed only if even it is too wide.
 */
function firstDescriptionThatFits(variants: string[]): string {
  const fits = variants.find(
    (text) => text.length <= DESCRIPTION_MAX && descriptionPixelWidth(text) <= DESCRIPTION_MAX_PX,
  );
  return fits ?? fitDescription(variants[variants.length - 1]);
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
  /**
   * Set false to leave the share image to the page itself. University pages do
   * this because each one has its own generated image
   * (app/universities/[citySlug]/[universitySlug]/opengraph-image.tsx).
   */
  defaultImage?: boolean;
}

/** The default share image: 1200 x 630, made by scripts/generate-brand-assets.mjs. */
export const SHARE_IMAGE = {
  url: "/og-image.png",
  width: 1200,
  height: 630,
  type: "image/png",
  alt: "SetGPA: GPA and CGPA calculator for Pakistani universities. Your university's own grade table, free, no account.",
} as const;

/** Shared builder: canonical URL + Open Graph + Twitter card. */
export function buildPageMetadata({
  title,
  description,
  path,
  ogTitle,
  ogDescription,
  brand = true,
  type = "website",
  defaultImage = true,
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
      ...(defaultImage ? { images: [SHARE_IMAGE] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description: socialDescription,
      ...(defaultImage ? { images: [{ url: SHARE_IMAGE.url, alt: SHARE_IMAGE.alt }] } : {}),
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
  const noun = count === 1 ? "university" : "universities";

  // Name as many universities as fit, then fall back to fewer.
  const variants =
    count > 0
      ? [3, 2, 1, 0].map((named) => {
          const names = universityNames.slice(0, Math.min(named, count));
          const list =
            names.length === 0
              ? ""
              : `, including ${names.length > 1 ? `${names.slice(0, -1).join(", ")} and ${names[names.length - 1]}` : names[0]}`;
          return `GPA and CGPA calculators for ${count} ${city.name} ${noun}${list}. Each one uses its own grade table.`;
        })
      : [`Find your university in ${city.name} and calculate your GPA or CGPA with its own grade table.`];
  const focus = cityFocus[city.slug];
  const description = firstDescriptionThatFits(focus?.metaDescriptions ?? variants);

  return buildPageMetadata({
    title: focus?.metaTitle ?? `GPA Calculator for ${city.name} Universities`,
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

  const intro = `Free ${label} GPA calculator and CGPA calculator for ${university.city.name} students.`;
  const focus = universityFocus[`${university.city.slug}/${university.slug}`];
  const description = firstDescriptionThatFits(
    focus?.metaDescriptions ?? [
      `${intro} Uses the ${scale}-point grade table${gradeFact}, with the formulas explained.`,
      `${intro} Uses the ${scale}-point grade table${gradeFact}.`,
      `${intro} Uses its own ${scale}-point grade table.`,
      intro,
    ],
  );

  return buildPageMetadata({
    title: focus?.metaTitle ?? title,
    description,
    path: routes.university(university.city.slug, university.slug),
    ogTitle: `${label} GPA & CGPA Calculator`,
    defaultImage: false,
  });
}
