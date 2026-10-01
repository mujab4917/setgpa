/**
 * JSON-LD builders (Schema.org structured data).
 *
 * Deliberately NOT used:
 *   - HowTo: deprecated by Google, so the "how to calculate" guides use Article.
 *   - New FAQPage markup: Google retired FAQ rich results in 2026. The visible
 *     FAQ text is the SEO asset; existing university FAQPage markup is harmless.
 */

import { siteConfig } from "@/lib/site-config";
import { absoluteUrl } from "@/lib/seo/metadata";

const ORG_ID = `${siteConfig.url}/#organization`;
const SITE_ID = `${siteConfig.url}/#website`;

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": ORG_ID,
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.defaultMetaDescription,
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": SITE_ID,
    name: siteConfig.name,
    url: siteConfig.url,
    inLanguage: "en",
    publisher: { "@id": ORG_ID },
  };
}

/** A free browser calculator. */
export function webApplicationJsonLd(input: { name: string; path: string; description: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: input.name,
    url: absoluteUrl(input.path),
    description: input.description,
    applicationCategory: "EducationalApplication",
    operatingSystem: "Any",
    browserRequirements: "Requires JavaScript",
    inLanguage: "en",
    isAccessibleForFree: true,
    offers: { "@type": "Offer", price: "0", priceCurrency: "PKR" },
    publisher: { "@id": ORG_ID },
  };
}

export function articleJsonLd(input: {
  headline: string;
  description: string;
  path: string;
  datePublished: string;
  dateModified: string;
}) {
  const url = absoluteUrl(input.path);
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: input.headline,
    description: input.description,
    mainEntityOfPage: url,
    url,
    inLanguage: "en",
    datePublished: input.datePublished,
    dateModified: input.dateModified,
    author: { "@id": ORG_ID },
    publisher: { "@id": ORG_ID },
  };
}

export function breadcrumbJsonLd(items: Array<{ name: string; path: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}
