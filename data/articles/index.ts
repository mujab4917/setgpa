import { cgpaFullForm } from "./cgpa-full-form";
import { cgpaToPercentage } from "./cgpa-to-percentage";
import { sgpaToCgpa } from "./sgpa-to-cgpa";
import type { Article } from "./types";

/**
 * Every guide written as data. To add one, create its file in this folder and
 * add it here: the page (/guides/<slug>), hub card, sitemap and
 * share image are all generated from this list. Most important first.
 */
export const articles: Article[] = [cgpaToPercentage, cgpaFullForm, sgpaToCgpa];

export function getArticle(slug: string): Article | undefined {
  return articles.find((a) => a.slug === slug);
}
