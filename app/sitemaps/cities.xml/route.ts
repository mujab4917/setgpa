import { renderUrlSet, xmlResponse } from "@/lib/seo/sitemap";
import { getCityEntries } from "@/lib/seo/sitemap-data";

/** https://setgpa.com/sitemaps/cities.xml: one page per city. */

export const revalidate = 3600;

export async function GET() {
  return xmlResponse(renderUrlSet(await getCityEntries()));
}
