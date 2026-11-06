import type { ReactNode } from "react";

import type { FaqItem } from "@/lib/seo/faq";

export type GuideCategory = "Basics" | "Conversion";
export type CoverTone = "brand" | "marker" | "cream" | "terracotta";

/** Which illustration a guide uses (drawn in components/guides/GuideArt.tsx). */
export type ArtId = "percent" | "terms" | "semesters" | "gpa" | "versus";

/** The illustration on a guide's card and page header. */
export interface GuideCover {
  art: ArtId;
  tone: CoverTone;
}

export interface ArticleSection {
  id: string;
  title: string;
  body: ReactNode;
}

/**
 * One guide. To add a guide: create data/articles/<slug>.tsx exporting an
 * `Article`, then add it to the list in data/articles/index.ts. The page, the
 * hub card, the sitemap and the share image all follow.
 */
export interface Article {
  slug: string;
  /** The H1 and the title of the card. */
  title: string;
  /** Keyword-first <title> without the brand (the brand is added if it fits). */
  metaTitle: string;
  metaDescription: string;
  category: GuideCategory;
  readingMinutes: number;
  /** ISO dates, used in the page, the sitemap and Article structured data. */
  published: string;
  updated: string;
  /** The answer in two sentences: shown under the heading and on the card. */
  intro: string;
  /** 3 or 4 short takeaways, shown in a box at the top of the article. */
  keyPoints: string[];
  /** Three short bullets for the hub card. */
  points: [string, string, string];
  cover: GuideCover;
  /** The right-hand table on the share image. */
  card: { subtitle: string; panelTitle: string; rows: Array<[string, string]>; chip: string };
  sections: ArticleSection[];
  faq: FaqItem[];
  /** Hrefs of guides to suggest after this one (new or old). */
  related: string[];
}

/** Serializable summary of any guide (new or hand-built), for the hub and "related" blocks. */
export interface GuideSummary {
  href: string;
  title: string;
  description: string;
  category: GuideCategory;
  readingMinutes: number;
  updated: string;
  points: string[];
  cover: GuideCover;
}
