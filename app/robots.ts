import type { MetadataRoute } from "next";

import { absoluteUrl } from "@/lib/seo/metadata";

/**
 * robots.txt - served at /robots.txt.
 * Everything is crawlable; the sitemap tells search engines where the
 * university pages are.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
      },
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
