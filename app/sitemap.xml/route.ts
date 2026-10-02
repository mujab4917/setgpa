import { absoluteUrl } from "@/lib/seo/metadata";
import { latest, renderSitemapIndex, xmlResponse, type SitemapEntry } from "@/lib/seo/sitemap";
import { getCityEntries, getStaticPageEntries, getUniversityEntries } from "@/lib/seo/sitemap-data";

/**
 * SITEMAP INDEX -> https://setgpa.com/sitemap.xml
 *
 * This is the one address to submit in Google Search Console. It lists the
 * three sitemaps below, each with the date its newest page changed.
 */

export const revalidate = 3600;

export async function GET() {
  const [pages, cities, universities] = [
    getStaticPageEntries(),
    await getCityEntries(),
    await getUniversityEntries(),
  ];

  const index: SitemapEntry[] = [
    { url: absoluteUrl("/sitemaps/pages.xml"), lastModified: latest(pages) },
    { url: absoluteUrl("/sitemaps/cities.xml"), lastModified: latest(cities) },
    { url: absoluteUrl("/sitemaps/universities.xml"), lastModified: latest(universities) },
  ];

  return xmlResponse(renderSitemapIndex(index));
}
