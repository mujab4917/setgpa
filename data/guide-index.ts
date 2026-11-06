import { articles } from "@/data/articles";
import type { GuideSummary } from "@/data/articles/types";
import { GUIDE_UPDATED } from "@/data/guides";
import { routes } from "@/lib/routes";

/**
 * One list of every guide for the hub, the "keep reading" blocks and the footer:
 * the two hand-built guides plus every article in data/articles. Plain data (no
 * React), so it can be passed to client components.
 */
const handBuilt: GuideSummary[] = [
  {
    href: routes.howToCalculateGpa(),
    title: "How to calculate GPA and CGPA",
    description: "The GPA formula, a step-by-step method and a worked example, then the same for your cumulative CGPA.",
    category: "Basics",
    readingMinutes: 6,
    updated: GUIDE_UPDATED,
    points: ["The GPA and CGPA formulas", "A worked example with real numbers", "Mistakes that give the wrong result"],
    cover: { art: "gpa", tone: "cream" },
  },
  {
    href: routes.gpaVsCgpa(),
    title: "GPA vs CGPA: what is the difference?",
    description: "GPA is one semester and CGPA is your whole degree so far. See how they differ and when each one matters.",
    category: "Basics",
    readingMinutes: 4,
    updated: GUIDE_UPDATED,
    points: ["A side-by-side comparison", "How one semester moves your CGPA", "Which one universities look at"],
    cover: { art: "versus", tone: "marker" },
  },
];

const fromArticles: GuideSummary[] = articles.map((a) => ({
  href: routes.guide(a.slug),
  title: a.title,
  description: a.intro,
  category: a.category,
  readingMinutes: a.readingMinutes,
  updated: a.updated,
  points: [...a.points],
  cover: a.cover,
}));

/** Newest first; the hand-built guides keep their place after the new ones. */
export const guideSummaries: GuideSummary[] = [...fromArticles, ...handBuilt];

export function getSummary(href: string): GuideSummary | undefined {
  return guideSummaries.find((g) => g.href === href);
}
