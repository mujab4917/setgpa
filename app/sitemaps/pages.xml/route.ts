import { renderUrlSet, xmlResponse } from "@/lib/seo/sitemap";
import { getStaticPageEntries } from "@/lib/seo/sitemap-data";

/** https://setgpa.com/sitemaps/pages.xml: home, guides, cities list, target planner, about, contact. */

export const revalidate = 3600;

export async function GET() {
  return xmlResponse(renderUrlSet(getStaticPageEntries()));
}
