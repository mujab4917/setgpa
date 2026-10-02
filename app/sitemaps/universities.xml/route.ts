import { renderUrlSet, xmlResponse } from "@/lib/seo/sitemap";
import { getUniversityEntries } from "@/lib/seo/sitemap-data";

/** https://setgpa.com/sitemaps/universities.xml: one page per university. */

export const revalidate = 3600;

export async function GET() {
  return xmlResponse(renderUrlSet(await getUniversityEntries()));
}
