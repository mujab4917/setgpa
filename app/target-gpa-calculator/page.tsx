import type { Metadata } from "next";
import Link from "next/link";

import { StandaloneTargetPlanner } from "@/components/calculators/StandaloneTargetPlanner";
import { WhatsAppContact } from "@/components/feedback/WhatsAppContact";
import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { UniversitySearch } from "@/components/universities/UniversitySearch";
import { footerContent, targetPlannerPageContent } from "@/data/site-content";
import { calculateTargetGpa } from "@/lib/calculators/target";
import { getAllUniversitiesForSearch, getAllUniversitiesWithGrading } from "@/lib/queries/universities";
import { routes } from "@/lib/routes";
import { absoluteUrl, buildPageMetadata } from "@/lib/seo/metadata";
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
});

interface TargetGpaCalculatorPageProps {
  searchParams: Promise<{ city?: string; university?: string; current?: string; target?: string }>;
}

export default async function TargetGpaCalculatorPage({ searchParams }: TargetGpaCalculatorPageProps) {
  const params = await searchParams;
  const universities = await getAllUniversitiesForSearch();
  const universitiesWithGrading = await getAllUniversitiesWithGrading();

  // A link from a university page (or a "what do you need next" prompt)
  // arrives with ?city=&university= - find that exact row so the picker step
  // can be skipped and the student lands already set up.
  const initialUniversity =
    params.city && params.university
      ? (universitiesWithGrading.find((u) => u.citySlug === params.city && u.slug === params.university) ?? null)
      : null;
  const initialCurrent = params.current !== undefined ? Number(params.current) : undefined;
  const initialTarget = params.target !== undefined ? Number(params.target) : undefined;

  // Every worked example is computed with the real function, not typed by
  // hand, so the numbers on the page can never quietly drift out of sync
  // with what the calculator above actually returns.
  const workedExamples = targetPlannerPageContent.workedExamples.map((example) => {
    const result = calculateTargetGpa(example.current, example.completed, example.upcoming, example.target, example.scale);
    const requiredGpa = result ? (Math.ceil((result.required - 1e-10) * 100) / 100).toFixed(2) : "?";
    return { ...example, requiredGpa };
  });

  const pageUrl = routes.targetPlanner();

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl(routes.home()) },
      {
        "@type": "ListItem",
        position: 2,
        name: targetPlannerPageContent.heading,
        item: absoluteUrl(pageUrl),
      },
    ],
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: targetPlannerPageContent.faq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
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

      <Container className="py-8 sm:py-12">
        <StandaloneTargetPlanner
          universities={universitiesWithGrading}
          initialUniversity={initialUniversity}
          initialCurrent={initialCurrent}
          initialTarget={initialTarget}
        />

        {/* ---------- How it works ---------- */}
        <Reveal as="section" className="mt-12" aria-labelledby="how-it-works-heading">
          <h2 id="how-it-works-heading" className="text-2xl font-bold text-ink-900">
            {targetPlannerPageContent.howItWorksHeading}
          </h2>
          <ol className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {targetPlannerPageContent.howItWorksSteps.map((step, index) => (
              <li key={step.title} className="rounded-2xl border border-ink-900/10 bg-white p-5 shadow-sm">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-brand-500 text-sm font-bold text-white">
                  {index + 1}
                </span>
                <p className="mt-3 font-semibold text-ink-900">{step.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-ink-700">{step.description}</p>
              </li>
            ))}
          </ol>
        </Reveal>

        {/* ---------- Glossary ---------- */}
        <Reveal as="section" className="mt-12" aria-labelledby="glossary-heading">
          <h2 id="glossary-heading" className="text-2xl font-bold text-ink-900">
            {targetPlannerPageContent.glossaryHeading}
          </h2>
          <dl className="mt-5 grid gap-4 sm:grid-cols-2">
            {targetPlannerPageContent.glossary.map((entry) => (
              <div key={entry.term} className="rounded-2xl border border-ink-900/10 bg-white p-5 shadow-sm">
                <dt className="font-semibold text-ink-900">{entry.term}</dt>
                <dd className="mt-1 text-sm leading-relaxed text-ink-700">{entry.definition}</dd>
              </div>
            ))}
          </dl>
        </Reveal>

        {/* ---------- Worked examples ---------- */}
        <Reveal as="section" className="mt-10" aria-labelledby="worked-example-heading">
          <h2 id="worked-example-heading" className="text-2xl font-bold text-ink-900">
            {targetPlannerPageContent.worked.heading}
          </h2>
          <div className="mt-5 grid gap-4">
            {workedExamples.map((example) => (
              <div key={example.heading} className="rounded-2xl border border-ink-900/10 bg-cream-100 p-5">
                <p className="text-sm font-semibold text-violet-700">{example.heading}</p>
                <p className="mt-2 leading-relaxed text-ink-700">
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
        <Reveal as="section" className="mt-10" aria-labelledby="faq-heading">
          <h2 id="faq-heading" className="text-2xl font-bold text-ink-900">
            {targetPlannerPageContent.faqHeading}
          </h2>
          <div className="mt-5 max-w-3xl divide-y divide-slate-200 rounded-2xl border border-ink-900/10 bg-white">
            {targetPlannerPageContent.faq.map((item) => (
              <details key={item.question} className="group p-5">
                <summary className="cursor-pointer list-none font-medium text-ink-900 marker:content-none">
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
          className="mt-12 rounded-3xl border border-brand-200 bg-brand-50 p-6 sm:p-8"
          aria-labelledby="find-university-heading"
        >
          <h2 id="find-university-heading" className="text-2xl font-bold text-ink-900">
            {targetPlannerPageContent.findUniversityHeading}
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-700">
            {targetPlannerPageContent.findUniversityBody}
          </p>
          <div className="mt-5 max-w-xl rounded-2xl bg-white p-4 shadow-sm sm:p-5">
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
