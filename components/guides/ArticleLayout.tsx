import type { ReactNode } from "react";

import { ArticleToc } from "@/components/guides/ArticleToc";
import { GuideCover } from "@/components/guides/GuideCover";
import { GuideCta, GuideToc } from "@/components/guides/GuideParts";
import { RelatedGuides } from "@/components/guides/RelatedGuides";
import { GuideHeroBand } from "@/components/guides/GuideHeroBand";
import { Breadcrumbs, type Crumb } from "@/components/ui/Breadcrumbs";
import { Container } from "@/components/ui/Container";
import { UniversityFaq } from "@/components/universities/UniversityFaq";
import type { GuideCategory, GuideCover as Cover } from "@/data/articles/types";
import { formatLongDate } from "@/lib/guides/format-date";
import type { FaqItem } from "@/lib/seo/faq";

/**
 * The page every guide is shown in, so they all read as articles from one
 * magazine: a big serif headline beside an illustration, a "key takeaways" box,
 * a contents list that follows you down the page, then the body, FAQ,
 * "keep reading" and a closing call to action.
 *
 * Used by the data-driven guides (app/guides/[slug]) and by the two hand-built
 * ones, so all five look identical.
 */
export function ArticleLayout({
  title,
  intro,
  category,
  readingMinutes,
  updated,
  cover,
  breadcrumbs,
  keyPoints,
  toc,
  faq,
  related,
  children,
}: {
  title: string;
  intro: string;
  category: GuideCategory;
  readingMinutes: number;
  updated: string;
  cover: Cover;
  breadcrumbs: Crumb[];
  keyPoints: string[];
  toc: Array<{ id: string; label: string }>;
  faq: FaqItem[];
  related: string[];
  children: ReactNode;
}) {
  const date = formatLongDate(updated);
  // Peach artwork on the terracotta band needs shapes in other colours, or it blends in.
  const shapes =
    cover.tone === "marker"
      ? { dot: "bg-brand-300", square: "bg-brand-600" }
      : { dot: "bg-marker-300", square: "bg-terracotta-500" };

  return (
    <>
      {/* ---------- Header: headline beside the illustration ---------- */}
      <GuideHeroBand tone={cover.tone} art={cover.art}>
        <Container className="relative z-10 grid gap-10 pb-14 pt-6 sm:pb-20 sm:pt-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-14 lg:pb-24 lg:pt-14">
          <div>
            <Breadcrumbs items={breadcrumbs} onDark />
            <p className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm font-bold">
              <span className="rounded-full bg-marker-300 px-3.5 py-1 text-ink-900">{category}</span>
              <span className="text-white/75">{readingMinutes} min read</span>
            </p>
            <h1 className="mt-5 font-serif text-[2.35rem] font-semibold leading-[1.03] tracking-[-0.03em] text-[#fbf6ea] sm:text-5xl lg:text-[3.6rem]">
              {title}
            </h1>
            <p className="mt-5 max-w-xl text-[1.075rem] leading-relaxed text-[#fbf6ea]/85 sm:text-lg">{intro}</p>
          </div>

          <div className="relative pb-12">
            <span aria-hidden="true" className={`absolute -right-5 -top-5 h-28 w-28 rounded-full sm:h-36 sm:w-36 ${shapes.dot}`} />
            <span aria-hidden="true" className={`absolute -left-4 bottom-16 h-20 w-20 rotate-12 rounded-3xl sm:h-24 sm:w-24 ${shapes.square}`} />
            <GuideCover
              cover={cover}
              className="relative aspect-[3/2] rounded-[1.75rem] shadow-elevation-3 ring-1 ring-white/15 sm:rounded-[2rem]"
            />
            <div className="absolute bottom-0 left-4 rounded-2xl bg-white px-5 py-3.5 text-ink-900 shadow-elevation-2 sm:left-8">
              <p className="text-xs font-bold text-terracotta-600">{category}</p>
              <p className="mt-0.5 font-serif text-base font-semibold">Updated {date}</p>
            </div>
          </div>
        </Container>
      </GuideHeroBand>

      {/* ---------- Body: contents list + article ---------- */}
      <Container className="pb-6 pt-10 lg:pt-14">
        <div className="grid gap-10 lg:grid-cols-[13.5rem_minmax(0,44rem)] lg:justify-center lg:gap-16">
          <div className="hidden lg:block">
            <ArticleToc items={toc} />
          </div>

          <article className="min-w-0">
            <div className="lg:hidden">
              <GuideToc items={toc} />
            </div>

            <aside
              aria-labelledby="key-points-heading"
              className="mt-8 rounded-3xl border-l-[6px] border-terracotta-500 bg-white p-6 shadow-elevation-1 sm:p-8 lg:mt-0"
            >
              <h2 id="key-points-heading" className="font-serif text-2xl font-semibold text-ink-900">
                Key takeaways
              </h2>
              <ul className="mt-4 space-y-3">
                {keyPoints.map((point) => (
                  <li key={point} className="flex gap-3 text-base leading-relaxed text-ink-900 sm:text-[1.05rem]">
                    <span
                      aria-hidden="true"
                      className="mt-2 h-2 w-2 shrink-0 rounded-full bg-terracotta-500"
                    />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </aside>

            {children}

            <UniversityFaq items={faq} serif />
            <RelatedGuides hrefs={related} />

            <p className="mt-12 border-t border-ink-900/10 pt-6 text-sm text-ink-700">
              Last updated {date}. This guide explains the standard method; your university&rsquo;s official
              regulations always take priority.
            </p>
          </article>
        </div>

        <GuideCta />
      </Container>
    </>
  );
}
