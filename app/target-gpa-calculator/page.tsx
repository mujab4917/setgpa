import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

import { StandaloneTargetPlanner } from "@/components/calculators/StandaloneTargetPlanner";
import { WhatsAppContact } from "@/components/feedback/WhatsAppContact";
import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { UniversitySearch } from "@/components/universities/UniversitySearch";
import { footerContent, targetPlannerPageContent } from "@/data/site-content";
import { calculateTargetGpa } from "@/lib/calculators/target";
import { getAllUniversitiesWithGrading } from "@/lib/queries/universities";
import { routes } from "@/lib/routes";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { breadcrumbJsonLd, webPageJsonLd } from "@/lib/seo/schema";
import { generalFeedbackMessage } from "@/lib/whatsapp";

/**
 * TARGET GPA CALCULATOR -> /target-gpa-calculator
 *
 * The full planner: works on any grading scale, has its own URL, its own SEO
 * content and its own FAQ, so it can be found and shared on its own - a
 * student searching "target GPA calculator" or "what GPA do I need this
 * semester" lands here directly.
 *
 * Every university page links here instead of embedding this form
 * (components/calculators/TargetGpaTeaser.tsx), via
 * routes.targetPlannerFor() - so this page also accepts ?city=&university=
 * (and optionally &current=&target=) to arrive with that university, and
 * optionally a starting point, already selected.
 */

export const metadata: Metadata = buildPageMetadata({
  title: targetPlannerPageContent.metaTitle,
  description: targetPlannerPageContent.metaDescription,
  path: routes.targetPlanner(),
  defaultImage: false,
});

/**
 * This page is STATIC and refreshed hourly, like every other page. It used to
 * read searchParams on the server, which forced a fresh render (and two
 * database queries) on every single visit and made it the slowest page on the
 * site. The ?city=&university= link is now read in the browser instead, by
 * StandaloneTargetPlanner.
 */
export const revalidate = 3600;

export default async function TargetGpaCalculatorPage() {
  // One query is enough: the search list is the same rows without the grade tables.
  const universitiesWithGrading = await getAllUniversitiesWithGrading();
  const universities = universitiesWithGrading.map(
    ({ gpaScale: _gpaScale, gradeRules: _gradeRules, ...listItem }) => listItem,
  );

  // Every worked example is computed with the real function, not typed by
  // hand, so the numbers on the page can never quietly drift out of sync
  // with what the calculator above actually returns.
  const workedExamples = targetPlannerPageContent.workedExamples.map((example) => {
    const result = calculateTargetGpa(example.current, example.completed, example.upcoming, example.target, example.scale);
    const requiredGpa = result ? (Math.ceil((result.required - 1e-10) * 100) / 100).toFixed(2) : "?";
    return { ...example, requiredGpa };
  });

  const pageUrl = routes.targetPlanner();

  return (
    <>
      <JsonLd
        data={webPageJsonLd({
          name: targetPlannerPageContent.heading,
          description: targetPlannerPageContent.metaDescription,
          path: pageUrl,
        })}
      />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: routes.home() },
          { name: targetPlannerPageContent.heading, path: pageUrl },
        ])}
      />

      <PageHero
        eyebrow={targetPlannerPageContent.eyebrow}
        title={targetPlannerPageContent.heading}
        description={targetPlannerPageContent.intro}
        breadcrumbs={[
          { label: footerContent.homeLabel, href: routes.home() },
          { label: targetPlannerPageContent.heading, href: pageUrl },
        ]}
      />

      <Container className="py-6 sm:py-12">
        {/* The planner reads the URL in the browser, so it needs a Suspense boundary. */}
        <Suspense
          fallback={
            <div
              aria-busy="true"
              className="min-h-[18rem] rounded-3xl border border-violet-200 bg-gradient-to-br from-violet-50 via-white to-brand-50 p-4 sm:p-8"
            >
              <h2 className="text-xl font-bold text-ink-900 sm:text-2xl">What GPA gets you there?</h2>
              <p className="mt-3 text-sm text-ink-700">Loading the planner...</p>
            </div>
          }
        >
          <StandaloneTargetPlanner universities={universitiesWithGrading} />
        </Suspense>

        {/* ---------- How it works ---------- */}
        <Reveal as="section" className="mt-9 sm:mt-12" aria-labelledby="how-it-works-heading">
          <h2 id="how-it-works-heading" className="text-xl font-bold text-ink-900 sm:text-2xl">
            {targetPlannerPageContent.howItWorksHeading}
          </h2>
          {/* Two columns on a phone so four short steps take one screen, not four. */}
          <ol className="mt-4 grid grid-cols-2 gap-2.5 sm:mt-5 sm:gap-5 lg:grid-cols-4">
            {targetPlannerPageContent.howItWorksSteps.map((step, index) => (
              <li key={step.title} className="rounded-2xl border border-ink-900/10 bg-white p-3.5 shadow-sm sm:p-5">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-brand-500 text-sm font-bold text-white sm:h-8 sm:w-8">
                  {index + 1}
                </span>
                <p className="mt-2 text-sm font-semibold leading-snug text-ink-900 sm:mt-3 sm:text-base">{step.title}</p>
                <p className="mt-1 text-xs leading-relaxed text-ink-700 sm:text-sm">{step.description}</p>
              </li>
            ))}
          </ol>
        </Reveal>

        {/* ---------- Glossary ---------- */}
        <Reveal as="section" className="mt-9 sm:mt-12" aria-labelledby="glossary-heading">
          <h2 id="glossary-heading" className="text-xl font-bold text-ink-900 sm:text-2xl">
            {targetPlannerPageContent.glossaryHeading}
          </h2>
          {/* One ruled list on a phone; separate cards from `sm` up. */}
          <dl className="mt-4 divide-y divide-ink-900/10 overflow-hidden rounded-2xl border border-ink-900/10 bg-white sm:mt-5 sm:grid sm:grid-cols-2 sm:gap-4 sm:divide-y-0 sm:overflow-visible sm:rounded-none sm:border-0 sm:bg-transparent">
            {targetPlannerPageContent.glossary.map((entry) => (
              <div key={entry.term} className="px-4 py-3 sm:rounded-2xl sm:border sm:border-ink-900/10 sm:bg-white sm:p-5 sm:shadow-sm">
                <dt className="font-semibold text-ink-900">{entry.term}</dt>
                <dd className="mt-0.5 text-sm leading-relaxed text-ink-700 sm:mt-1">{entry.definition}</dd>
              </div>
            ))}
          </dl>
        </Reveal>

        {/* ---------- Worked examples ---------- */}
        <Reveal as="section" className="mt-9 sm:mt-10" aria-labelledby="worked-example-heading">
          <h2 id="worked-example-heading" className="text-xl font-bold text-ink-900 sm:text-2xl">
            {targetPlannerPageContent.worked.heading}
          </h2>
          <div className="mt-4 grid gap-3 sm:mt-5 sm:gap-4">
            {workedExamples.map((example) => (
              <div key={example.heading} className="rounded-2xl border border-ink-900/10 bg-cream-100 p-4 sm:p-5">
                <p className="text-sm font-semibold text-violet-700">{example.heading}</p>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-700 sm:mt-2 sm:text-base">
                  {targetPlannerPageContent.worked.template
                    .replace("{current}", example.current.toFixed(2))
                    .replace("{completed}", String(example.completed))
                    .replace("{target}", example.target.toFixed(2))
                    .replace("{upcoming}", String(example.upcoming))
                    .replace("{scale}", example.scale.toFixed(2))
                    .replace("{required}", example.requiredGpa)}
                </p>
              </div>
            ))}
          </div>
        </Reveal>

        {/* ---------- FAQ ---------- */}
        <Reveal as="section" className="mt-9 sm:mt-10" aria-labelledby="faq-heading">
          <h2 id="faq-heading" className="text-xl font-bold text-ink-900 sm:text-2xl">
            {targetPlannerPageContent.faqHeading}
          </h2>
          <div className="mt-4 max-w-3xl divide-y divide-slate-200 overflow-hidden rounded-2xl border border-ink-900/10 bg-white sm:mt-5">
            {targetPlannerPageContent.faq.map((item) => (
              <details key={item.question} className="group px-4 py-3.5 sm:p-5">
                <summary className="cursor-pointer list-none text-[15px] font-medium leading-snug text-ink-900 marker:content-none sm:text-base">
                  <span className="flex items-center justify-between gap-3">
                    {item.question}
                    <span aria-hidden="true" className="shrink-0 text-slate-400 transition-transform group-open:rotate-45">
                      +
                    </span>
                  </span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-ink-700">{item.answer}</p>
              </details>
            ))}
          </div>
        </Reveal>

        {/* ---------- Find your own university's calculator ---------- */}
        <Reveal
          as="section"
          className="mt-9 rounded-3xl border border-brand-200 bg-brand-50 p-5 sm:mt-12 sm:p-8"
          aria-labelledby="find-university-heading"
        >
          <h2 id="find-university-heading" className="text-xl font-bold text-ink-900 sm:text-2xl">
            {targetPlannerPageContent.findUniversityHeading}
          </h2>
          <p className="mt-2 hidden max-w-2xl text-sm leading-relaxed text-ink-700 sm:block">
            {targetPlannerPageContent.findUniversityBody}
          </p>
          <div className="mt-4 max-w-xl rounded-2xl bg-white p-3.5 shadow-sm sm:mt-5 sm:p-5">
            <UniversitySearch universities={universities} />
          </div>
          <p className="mt-4 text-sm">
            <Link href={routes.cities()} className="font-semibold text-brand-700 hover:text-brand-800 hover:underline">
              Or browse every city &rarr;
            </Link>
          </p>
        </Reveal>

        <WhatsAppContact className="mt-12" message={generalFeedbackMessage()} />
      </Container>
    </>
  );
}
