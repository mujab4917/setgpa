/**
 * JSON-LD builders (Schema.org structured data).
 *
 * RULES THIS FILE FOLLOWS, so Google's Rich Results Test and the Schema.org
 * validator report no errors and no warnings:
 *
 *   - Only types whose required fields we can always fill truthfully:
 *     Organization, WebSite, WebPage, CollectionPage, Article, BreadcrumbList
 *     and CollegeOrUniversity.
 *   - Every block is SELF-CONTAINED: author and publisher are written out in
 *     full instead of pointing at an @id defined on another page.
 *   - NOT used on purpose:
 *       WebApplication / SoftwareApplication - Google's rich-result version
 *         requires a star rating or review, which we must never invent.
 *       FAQPage - Google retired FAQ rich results in 2026; the visible FAQ
 *         text is what matters, not markup for a feature that no longer exists.
 *       HowTo - deprecated by Google.
 *       SearchAction - our search box is not a URL-based search.
 *
 * Every URL is absolute (https://setgpa.com/...).
 */

import { siteConfig } from "@/lib/site-config";
import { absoluteUrl } from "@/lib/seo/metadata";

const CONTEXT = "https://schema.org";

/** Brand logo files, produced by scripts/generate-brand-assets.mjs. */
export const LOGO_URL = () => absoluteUrl("/logo.png");
export const LOGO_SQUARE_URL = () => absoluteUrl("/logo-square.png");
/** The default 1200x630 share image (public/og-image.png). */
export const SHARE_IMAGE_URL = () => absoluteUrl("/og-image.png");

/** Organization reference reused inside other blocks. */
function organizationNode() {
  return {
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.url,
    logo: {
      "@type": "ImageObject",
      url: LOGO_SQUARE_URL(),
      width: 512,
      height: 512,
    },
  };
}

/** Site-wide organisation: who runs SetGPA. Used on the homepage. */
export function organizationJsonLd() {
  return {
    "@context": CONTEXT,
    ...organizationNode(),
    description: siteConfig.defaultMetaDescription,
  };
}

/** The website itself. Used on the homepage. */
export function websiteJsonLd() {
  return {
    "@context": CONTEXT,
    "@type": "WebSite",
    name: siteConfig.name,
    alternateName: "SetGPA Pakistan GPA Calculator",
    url: siteConfig.url,
    inLanguage: "en",
    publisher: organizationNode(),
  };
}

/** A normal page (homepage, about, contact, calculators). */
export function webPageJsonLd(input: {
  name: string;
  description: string;
  path: string;
  type?: "WebPage" | "CollectionPage" | "AboutPage" | "ContactPage";
}) {
  return {
    "@context": CONTEXT,
    "@type": input.type ?? "WebPage",
    name: input.name,
    description: input.description,
    url: absoluteUrl(input.path),
    inLanguage: "en",
    isPartOf: { "@type": "WebSite", name: siteConfig.name, url: siteConfig.url },
  };
}

/** An editorial guide. Self-contained, with author, publisher, image and dates. */
export function articleJsonLd(input: {
  headline: string;
  description: string;
  path: string;
  datePublished: string;
  dateModified: string;
}) {
  const url = absoluteUrl(input.path);
  return {
    "@context": CONTEXT,
    "@type": "Article",
    headline: input.headline,
    description: input.description,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    url,
    image: [SHARE_IMAGE_URL()],
    inLanguage: "en",
    datePublished: input.datePublished,
    dateModified: input.dateModified,
    author: { "@type": "Organization", name: siteConfig.name, url: siteConfig.url },
    publisher: organizationNode(),
  };
}

/** "Home > City > University". Every item has a name and an absolute URL. */
export function breadcrumbJsonLd(items: Array<{ name: string; path: string }>) {
  return {
    "@context": CONTEXT,
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

/**
 * The university a page is about. Only facts we hold are included: the name,
 * the city and (when we have one) the official website.
 */
export function universityJsonLd(input: {
  name: string;
  shortName?: string | null;
  city: string;
  website?: string | null;
  pagePath: string;
}) {
  return {
    "@context": CONTEXT,
    "@type": "CollegeOrUniversity",
    name: input.name,
    ...(input.shortName && input.shortName !== input.name ? { alternateName: input.shortName } : {}),
    ...(input.website ? { url: input.website } : {}),
    address: {
      "@type": "PostalAddress",
      addressLocality: input.city,
      addressCountry: "PK",
    },
    mainEntityOfPage: absoluteUrl(input.pagePath),
  };
}

/** Serialises JSON-LD safely for a <script> tag (a "<" can never close the tag early). */
export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
