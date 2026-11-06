import type { Metadata } from "next";
import Link from "next/link";

import { GuideBrowser } from "@/components/guides/GuideBrowser";
import { GuideCover } from "@/components/guides/GuideCover";
import { GuideHeroBand } from "@/components/guides/GuideHeroBand";
import { GuideCta } from "@/components/guides/GuideParts";
import { JsonLd } from "@/components/seo/JsonLd";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Container } from "@/components/ui/Container";
import { articles } from "@/data/articles";
import { getSummary, guideSummaries } from "@/data/guide-index";
import { gpaVsCgpaFaq, howToFaq } from "@/data/guides";
import { routes } from "@/lib/routes";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { breadcrumbJsonLd, webPageJsonLd } from "@/lib/seo/schema";

/**
 * GUIDES HUB -> /guides
 *
 * A magazine front page: a headline and the newest guide, every guide as an
 * illustrated card, shortcuts by goal, a "start here" feature and a list of
 * quick answers. Guides written as data (data/articles) appear automatically;
 * the two hand-built ones are listed in data/guide-index.ts.
 */

const TITLE = "GPA and CGPA Guides: Formulas, Conversions, Examples";
const DESCRIPTION =
  "Plain-language GPA and CGPA guides with worked examples: formulas, CGPA to percentage, SGPA to CGPA and what each term means.";

export const metadata: Metadata = buildPageMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: routes.guides(),
});

/** Shortcuts by what the reader has in front of them. */
const goals = [
  { href: routes.cgpaToPercentage(), heading: "I have a CGPA and need a percentage", hint: "CGPA to percentage converter" },
  { href: routes.sgpaToCgpa(), heading: "I have my semester results", hint: "SGPA to CGPA calculator" },
  { href: routes.cgpaFullForm(), heading: "I want the terms explained", hint: "CGPA, SGPA and GPA in plain words" },
];

/** First question of every guide, then the second of the newest ones: 8 quick answers. */
function quickAnswers() {
  const faqs = [
    ...articles.map((a) => ({ href: routes.guide(a.slug), category: a.category, faq: a.faq })),
    { href: routes.howToCalculateGpa(), category: "Basics", faq: howToFaq },
    { href: routes.gpaVsCgpa(), category: "Basics", faq: gpaVsCgpaFaq },
  ];
  const firsts = faqs.map((f) => ({ href: f.href, category: f.category, question: f.faq[0].question }));
  const seconds = faqs.slice(0, 3).map((f) => ({ href: f.href, category: f.category, question: f.faq[1].question }));
  return [...firsts, ...seconds];
}

export default function GuidesPage() {
  const [lead] = guideSummaries;
  const start = getSummary(routes.howToCalculateGpa());
  const answers = quickAnswers();

  return (
    <>
      <JsonLd
        data={webPageJsonLd({
          type: "CollectionPage",
          name: "GPA and CGPA guides",
          description: DESCRIPTION,
          path: routes.guides(),
        })}
      />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: routes.home() },
          { name: "Guides", path: routes.guides() },
        ])}
      />

      {/* ---------- Hero: headline + the newest guide ---------- */}
      <GuideHeroBand tone="brand" glyph="4.0">
        <Container className="relative z-10 grid gap-12 pb-16 pt-6 sm:pb-24 sm:pt-10 lg:grid-cols-[1fr_1.05fr] lg:items-center lg:gap-14 lg:pb-28 lg:pt-14">
          <div>
            <Breadcrumbs
              onDark
              items={[
                { label: "Home", href: routes.home() },
                { label: "Guides", href: routes.guides() },
              ]}
            />
            <h1 className="mt-6 font-serif text-[2.6rem] font-semibold leading-[1] tracking-[-0.035em] text-[#fbf6ea] sm:text-7xl">
              Grades, explained so you can check them yourself.
            </h1>
            <p className="mt-6 max-w-xl text-[1.075rem] leading-relaxed text-[#fbf6ea]/85 sm:text-lg">
              Short guides with real numbers and free converters for GPA, CGPA and SGPA, whichever country or
              grading scale you study under.
            </p>
            <dl className="mt-9 flex gap-9 border-t border-white/20 pt-6">
              {[
                [String(guideSummaries.length), "guides"],
                ["2", "free converters"],
                ["4.0 & 10", "point scales"],
              ].map(([value, label]) => (
                <div key={label}>
                  <dt className="sr-only">{label}</dt>
                  <dd className="font-serif text-4xl font-semibold text-marker-300">{value}</dd>
                  <dd className="text-sm text-white/75">{label}</dd>
                </div>
              ))}
            </dl>
          </div>

          <Link href={lead.href} className="group relative block pb-6">
            <span aria-hidden="true" className="absolute -right-5 -top-6 h-32 w-32 rounded-full bg-marker-300 sm:h-44 sm:w-44" />
            <span aria-hidden="true" className="absolute -left-5 bottom-12 h-24 w-24 rotate-12 rounded-3xl bg-terracotta-500 sm:h-28 sm:w-28" />
            <GuideCover
              cover={lead.cover}
              className="relative aspect-[3/2] rounded-[2rem] shadow-elevation-3 ring-1 ring-white/15 transition-transform duration-300 group-hover:-translate-y-1"
            />
            <div className="absolute bottom-0 left-4 right-4 rounded-2xl bg-white p-5 text-ink-900 shadow-elevation-2 sm:left-8 sm:right-auto sm:max-w-sm">
              <p className="text-xs font-bold text-terracotta-600">New: {lead.category}</p>
              <p className="mt-1 font-serif text-lg font-semibold leading-snug group-hover:text-brand-700">
                {lead.title}
              </p>
              <p className="mt-1 text-sm text-ink-700">{lead.readingMinutes} min read</p>
            </div>
          </Link>
        </Container>
      </GuideHeroBand>

      {/* ---------- Latest guides ---------- */}
      <section aria-labelledby="latest-heading" className="py-12 sm:py-16">
        <Container>
          <h2 id="latest-heading" className="font-serif text-3xl font-semibold text-ink-900 sm:text-4xl">
            Latest guides
          </h2>
          <p className="mt-2 max-w-xl text-ink-700">Every guide, newest first. Filter by topic.</p>
          <div className="mt-7">
            <GuideBrowser guides={guideSummaries} />
          </div>
        </Container>
      </section>

      {/* ---------- Pick your goal ---------- */}
      <section aria-labelledby="goal-heading" className="bg-brand-50 py-12 sm:py-16">
        <Container>
          <h2 id="goal-heading" className="font-serif text-3xl font-semibold text-ink-900 sm:text-4xl">
            Start with what you have
          </h2>
          <p className="mt-2 max-w-xl text-ink-700">Pick the situation closest to yours.</p>
          <ul className="mt-7 grid gap-5 md:grid-cols-3">
            {goals.map((goal) => {
              const g = getSummary(goal.href);
              if (!g) return null;
              return (
                <li key={goal.href}>
                  <Link
                    href={goal.href}
                    className="group block overflow-hidden rounded-3xl bg-white shadow-elevation-1 transition-shadow hover:shadow-elevation-2"
                  >
                    <GuideCover cover={g.cover} className="aspect-[16/9]" />
                    <span className="block p-6">
                      <span className="block font-serif text-[1.35rem] font-semibold leading-snug text-ink-900 group-hover:text-brand-700">
                        {goal.heading}
                      </span>
                      <span className="mt-2 block text-sm text-ink-700">{goal.hint}</span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </Container>
      </section>

      {/* ---------- Start here (the editor's pick) ---------- */}
      {start && (
        <section aria-labelledby="start-heading" className="py-12 sm:py-20">
          <Container className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <div className="relative">
              <GuideCover cover={start.cover} className="aspect-[4/3] rounded-[2rem] shadow-elevation-3" />
              <span
                aria-hidden="true"
                className="absolute -right-2 -top-4 flex h-24 w-24 rotate-6 items-center justify-center rounded-full bg-marker-300 text-center font-serif text-base font-semibold leading-tight text-ink-900 shadow-elevation-2 sm:-right-6 sm:h-28 sm:w-28"
              >
                Start
                <br />
                here
              </span>
            </div>
            <div>
              <p className="text-sm font-bold text-terracotta-600">New to GPA?</p>
              <h2 id="start-heading" className="mt-2 font-serif text-3xl font-semibold leading-tight text-ink-900 sm:text-5xl">
                The method behind every number
              </h2>
              <p className="mt-4 max-w-lg text-lg leading-relaxed text-ink-700">{start.description}</p>
              <ul className="mt-5 space-y-2.5">
                {start.points.map((point) => (
                  <li key={point} className="flex gap-3 text-base text-ink-900">
                    <span aria-hidden="true" className="mt-2 h-2 w-2 shrink-0 rounded-full bg-terracotta-500" />
                    {point}
                  </li>
                ))}
              </ul>
              <Link
                href={start.href}
                className="mt-7 inline-flex rounded-full bg-ink-900 px-7 py-3.5 text-sm font-bold text-white transition-colors hover:bg-brand-700"
              >
                Read the guide
              </Link>
            </div>
          </Container>
        </section>
      )}

      {/* ---------- Quick answers ---------- */}
      <section aria-labelledby="answers-heading" className="bg-white/60 py-12 sm:py-16">
        <Container>
          <h2 id="answers-heading" className="font-serif text-3xl font-semibold text-ink-900 sm:text-4xl">
            Quick answers
          </h2>
          <p className="mt-2 max-w-xl text-ink-700">The questions students ask most, each answered in its guide.</p>
          <ul className="mt-7 divide-y divide-ink-900/10 overflow-hidden rounded-3xl border border-ink-900/10 bg-white">
            {answers.map((item) => (
              <li key={item.question}>
                <Link
                  href={`${item.href}#faq-heading`}
                  className="flex items-center justify-between gap-4 px-5 py-4 transition-colors hover:bg-brand-50 sm:px-7 sm:py-5"
                >
                  <span>
                    <span className="block text-xs font-bold text-terracotta-600">{item.category}</span>
                    <span className="mt-0.5 block font-serif text-lg font-semibold leading-snug text-ink-900">
                      {item.question}
                    </span>
                  </span>
                  <span
                    aria-hidden="true"
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-ink-900/20 text-ink-900"
                  >
                    &rsaquo;
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* ---------- Closing band ---------- */}
      <Container className="pb-12 sm:pb-16">
        <GuideCta />
      </Container>
    </>
  );
}
