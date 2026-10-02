import type { MetadataRoute } from "next";

import { absoluteUrl } from "@/lib/seo/metadata";
import { siteConfig } from "@/lib/site-config";

/**
 * robots.txt - served at https://setgpa.com/robots.txt
 *
 * Live site:
 *   - Everything is crawlable, including /_next/ files, because Google needs
 *     the CSS and JavaScript to render the pages.
 *   - The only exception is the Target GPA Calculator with a query string
 *     (?city=...&university=...). Those are the same page pre-filled for one
 *     university, and the page's canonical tag already points to the plain
 *     address, so crawling every variant would only waste crawl budget.
 *   - The sitemap index is announced here, so crawlers find it without being
 *     told in Search Console.
 *
 * Netlify deploy previews and branch deploys: everything is disallowed, so a
 * test copy of the site can never appear in search results.
 */
export default function robots(): MetadataRoute.Robots {
  if (!siteConfig.indexable) {
    return { rules: [{ userAgent: "*", disallow: "/" }] };
  }

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/target-gpa-calculator?*"],
      },
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
