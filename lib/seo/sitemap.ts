/**
 * Sitemap helpers.
 *
 * SetGPA publishes a sitemap INDEX at /sitemap.xml that points to three
 * focused sitemaps:
 *
 *   /sitemaps/pages.xml          home, guides, cities list, target planner, about, contact
 *   /sitemaps/cities.xml         one page per city
 *   /sitemaps/universities.xml   one page per university
 *
 * Splitting by type keeps each file small, and lets Search Console show how
 * many pages of each kind are indexed. Only the two fields Google actually
 * uses are written: <loc> and an accurate <lastmod>. (Google ignores
 * <priority> and <changefreq>, so they are left out rather than guessed.)
 */

export interface SitemapEntry {
  /** Absolute URL, e.g. https://setgpa.com/universities/lahore */
  url: string;
  lastModified: Date;
}

/** Escapes the five characters that are special in XML. */
function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

const XML_HEADER = '<?xml version="1.0" encoding="UTF-8"?>';

/** A normal sitemap: a list of page URLs. */
export function renderUrlSet(entries: SitemapEntry[]): string {
  const urls = entries
    .map(
      (entry) =>
        `  <url>\n    <loc>${escapeXml(entry.url)}</loc>\n    <lastmod>${entry.lastModified.toISOString()}</lastmod>\n  </url>`,
    )
    .join("\n");
  return `${XML_HEADER}\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

/** A sitemap index: a list of other sitemaps. */
export function renderSitemapIndex(entries: SitemapEntry[]): string {
  const sitemaps = entries
    .map(
      (entry) =>
        `  <sitemap>\n    <loc>${escapeXml(entry.url)}</loc>\n    <lastmod>${entry.lastModified.toISOString()}</lastmod>\n  </sitemap>`,
    )
    .join("\n");
  return `${XML_HEADER}\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemaps}\n</sitemapindex>\n`;
}

/** The newest date in a list (used as the lastmod of a sitemap in the index). */
export function latest(entries: SitemapEntry[]): Date {
  return new Date(Math.max(...entries.map((entry) => entry.lastModified.getTime())));
}

/** Wraps XML in a response with the right content type and cache headers. */
export function xmlResponse(body: string): Response {
  return new Response(body, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      // Browsers: always check; Netlify's CDN: reuse for an hour.
      "Cache-Control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
