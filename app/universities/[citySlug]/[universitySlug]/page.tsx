import { TargetGpaTeaser } from "@/components/calculators/TargetGpaTeaser";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { webApplicationJsonLd } from "@/lib/seo/schema";

import { UniversityCalculator } from "@/components/calculators/UniversityCalculator";
import { WhatsAppContact } from "@/components/feedback/WhatsAppContact";
import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/Container";
import { DataQualityNotice } from "@/components/universities/DataQualityNotice";
import { GradeScaleTable } from "@/components/universities/GradeScaleTable";
import { RelatedUniversities } from "@/components/universities/RelatedUniversities";
import { UniversityFaq } from "@/components/universities/UniversityFaq";
import { Reveal } from "@/components/ui/Reveal";
import { footerContent, universityPageContent } from "@/data/site-content";
import type { GradingSystem } from "@/lib/calculators/types";
import {
  getAllUniversityPaths,
  getRelatedUniversities,
  getUniversityBySlug,
} from "@/lib/queries/universities";
import { routes } from "@/lib/routes";
import { buildUniversityFaq } from "@/lib/seo/faq";
import { absoluteUrl, buildUniversityMetadata } from "@/lib/seo/metadata";
import { universityFeedbackMessage } from "@/lib/whatsapp";

/**
 * UNIVERSITY PAGE  ->  /universities/lahore/fast-nuces
 *
 * This Server Component loads one university (and its grade table) from the
 * database and passes its grading system to the shared calculator panel and
 * target planner. Content sections remain server rendered.
 */

interface UniversityPageProps {
  params: Promise<{ citySlug: string; universitySlug: string }>;
}

export const revalidate = 3600;

/**
 * Only the universities listed by generateStaticParams exist.
 *
 * With this false, a URL for a university that is not in the database gets a
 * real 404 straight from the router. Left at its default (true), Next renders
 * the page on demand, hits notFound(), then CACHES that result and replays it
 * with a 200 status - a "soft 404", which search engines treat as a thin
 * duplicate page rather than a missing one.
 *
 * Trade-off: a university added to the database after a deploy will not be
 * reachable until the next build. That matches the workflow here, where
 * adding a university means editing the seed data and redeploying.
 */
export const dynamicParams = false;

/** Pre-renders every active university page at build time. */
export async function generateStaticParams() {
  const paths = await getAllUniversityPaths();
  return paths.map((path) => ({
    citySlug: path.citySlug,
    universitySlug: path.slug,
  }));
}

/** Per-page SEO, built from the University row in the database. */
export async function generateMetadata({
  params,
}: UniversityPageProps): Promise<Metadata> {
  const { citySlug, universitySlug } = await params;
  const university = await getUniversityBySlug(citySlug, universitySlug);

  if (!university) {
    return {
      title: "University not found",
      robots: { index: false, follow: false },
    };
  }
  return buildUniversityMetadata(university);
}

export default async function UniversityPage({ params }: UniversityPageProps) {
  const { citySlug, universitySlug } = await params;

  // Both queries run at the same time instead of one after the other.
  const [university, related] = await Promise.all([
    getUniversityBySlug(citySlug, universitySlug),
    getRelatedUniversities(citySlug, universitySlug),
  ]);

  if (!university) notFound();

  // The single object every calculator needs. It is 100% database driven.
  const gradingSystem: GradingSystem = {
    gpaScale: university.gpaScale,
    grades: university.gradeRules,
  };

  const cityUrl = routes.city(university.city.slug);
  const pageUrl = routes.university(university.city.slug, university.slug);
  const absolutePageUrl = absoluteUrl(pageUrl);

  // Questions generated from this university's own data (lib/seo/faq.ts).
  const faqItems = buildUniversityFaq(university);

  // Breadcrumb structured data helps Google show the path in search results.
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: absoluteUrl(routes.home()),
      },
      {
        "@type": "ListItem",
        position: 2,
        name: university.city.name,
        item: absoluteUrl(cityUrl),
      },
      {
        "@type": "ListItem",
        position: 3,
        name: university.name,
        item: absolutePageUrl,
      },
    ],
  };

  // FAQPage structured data, built from the same array the page renders.
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        // Static, server-generated JSON - no user input goes in here.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            webApplicationJsonLd({
              name: `${university.shortName ?? university.name} GPA & CGPA Calculator`,
              path: pageUrl,
              description: `Free GPA calculator and CGPA calculator for ${university.name}, built on its ${university.gpaScale.toFixed(2)}-point grade table.`,
            }),
          ),
        }}
      />

      <PageHero
        eyebrow={university.city.name}
        title={`${university.name} GPA & CGPA Calculator`}
        compact
        description={`Free GPA calculator and CGPA calculator for ${university.shortName ?? university.name}, using its ${university.gpaScale.toFixed(2)}-point grade table.`}
        breadcrumbs={[
          { label: footerContent.homeLabel, href: routes.home() },
          { label: university.city.name, href: cityUrl },
          { label: university.shortName ?? university.name, href: pageUrl },
        ]}
      />

      <Container className="pb-8 pt-2 sm:pb-12">
        <UniversityCalculator gradingSystem={gradingSystem} universityName={university.name} shareUrl={absolutePageUrl} />
        <nav aria-label="University page sections" className="my-6 flex flex-wrap gap-2 text-sm">
          {[["#target-planner", "Target GPA planner"], ["#grading-heading", "Grade scale"], ["#gpa-heading", "How it works"], ["#university-info-heading", "About university"]].map(([href, label]) => (
            <a key={href} href={href} className="rounded-full border border-ink-900/15 bg-white px-4 py-3 font-semibold text-ink-900 transition-colors hover:border-ink-900 hover:bg-marker-300 focus-visible:outline-brand-600">{label}</a>
          ))}
        </nav>
        <div className="mb-10">
          <TargetGpaTeaser
            citySlug={university.city.slug}
            universitySlug={university.slug}
            universityName={university.name}
            gpaScale={university.gpaScale}
          />
        </div>
      <div className="mt-6 lg:grid lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-14">
      <div className="min-w-0">
      {/* ---------- Grading system ---------- */}
      <Reveal as="section" className="mt-14">
        <div aria-labelledby="grading-heading">
        <h2 id="grading-heading" className="text-2xl font-extrabold text-ink-900 sm:text-3xl">
          {university.shortName ?? university.name} grading system and grade points
        </h2>
        {university.gradingSystemNotes && (
          <p className="mt-3 max-w-3xl leading-relaxed text-ink-700">
            {university.gradingSystemNotes}
          </p>
        )}
          <div className="mt-5 max-w-3xl">
            <GradeScaleTable grades={university.gradeRules} scale={university.gpaScale} />
          </div>
        </div>
      </Reveal>


        {/* ---------- Basic information ---------- */}
        <section aria-labelledby="university-info-heading" className="mt-16">
        <h2
          id="university-info-heading"
          className="text-2xl font-extrabold text-ink-900 sm:text-3xl"
        >
          {universityPageContent.basicInfoHeading}
        </h2>
        <p className="mt-3 max-w-3xl leading-relaxed text-ink-700">{university.description}</p>

        {university.notableFor && (
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-ink-700">
            <span className="font-medium text-ink-900">
              {universityPageContent.knownForLabel}{" "}
            </span>
            {university.notableFor}
          </p>
        )}


      </section>

      {/* ---------- GPA explanation ---------- */}
      <section aria-labelledby="gpa-heading" className="mt-16">
        <h2 id="gpa-heading" className="text-2xl font-extrabold text-ink-900 sm:text-3xl">
          How to calculate GPA at {university.shortName ?? university.name}
        </h2>
        <p className="mt-3 max-w-3xl leading-relaxed text-ink-700">
          {university.gpaExplanation ??
            universityPageContent.howGpaWorksDefaultText}
        </p>
        <Formula>{universityPageContent.gpaFormula}</Formula>

      </section>

      {/* ---------- CGPA explanation ---------- */}
      <section aria-labelledby="cgpa-heading" className="mt-16">
        <h2 id="cgpa-heading" className="text-2xl font-extrabold text-ink-900 sm:text-3xl">
          How to calculate CGPA at {university.shortName ?? university.name}
        </h2>
        <p className="mt-3 max-w-3xl leading-relaxed text-ink-700">
          {university.cgpaExplanation ??
            universityPageContent.howCgpaWorksDefaultText}
        </p>
        <Formula>{universityPageContent.cgpaFormula}</Formula>
        <p className="mt-4 max-w-3xl text-ink-700">
          New to this? Read{" "}
          <Link href={routes.howToCalculateGpa()} className="font-semibold text-brand-700 underline underline-offset-4">
            how to calculate GPA and CGPA
          </Link>{" "}
          or{" "}
          <Link href={routes.gpaVsCgpa()} className="font-semibold text-brand-700 underline underline-offset-4">
            the difference between GPA and CGPA
          </Link>
          .
        </p>

      </section>

      <UniversityFaq items={faqItems} />
      </div>
        <aside aria-label="University fact sheet" className="mt-12 lg:mt-0">
          <div className="rounded-3xl border border-ink-900/10 bg-white p-6 shadow-[var(--shadow-elevation-2)] lg:sticky lg:top-24">
            <h2 className="text-xl font-extrabold text-ink-900">Fact sheet</h2>
            <dl className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
          <InfoRow label={universityPageContent.cityLabel} value={university.city.name} />
          {university.campus && (
            <InfoRow
              label={universityPageContent.campusLabel}
              value={university.campus}
            />
          )}
          {university.establishedYear && (
            <InfoRow
              label={universityPageContent.establishedLabel}
              value={String(university.establishedYear)}
            />
          )}
          {university.sector && (
            <InfoRow
              label={universityPageContent.sectorLabel}
              value={university.sector}
            />
          )}
          {university.universityType && (
            <InfoRow
              label={universityPageContent.typeLabel}
              value={university.universityType}
            />
          )}
          <InfoRow
            label={universityPageContent.scaleLabel}
            value={university.gpaScale.toFixed(2)}
          />
          {university.website && (
            <div>
              <dt className="text-xs font-semibold text-ink-700">
                {universityPageContent.websiteLabel}
              </dt>
              <dd className="mt-0.5 text-sm">
                <a
                  href={university.website}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  className="font-semibold text-brand-700 underline underline-offset-2 hover:text-brand-900"
                >
                  {university.website.replace(/^https?:\/\//, "")}
                </a>
              </dd>
            </div>
          )}
        </dl>
            <p className={`mt-6 rounded-2xl px-4 py-3 text-sm font-medium ${university.isVerified ? "bg-brand-100 text-brand-900" : "bg-marker-200 text-ink-900"}`}>
              {university.isVerified
                ? "Grade table checked against an official source."
                : "Demo data: confirm grades with your department."}
            </p>
          </div>
        </aside>
      </div>


      <RelatedUniversities
        universities={related}
        cityName={university.city.name}
        citySlug={university.city.slug}
      />

        <WhatsAppContact
          className="mt-16"
          message={universityFeedbackMessage(university.name, university.city.name)}
        />

        {/* Small note about the grading data, at the end of the page. */}
        <DataQualityNotice
          isVerified={university.isVerified}
          sourceNote={university.sourceNote}
          universityName={university.name}
          cityName={university.city.name}
        />
      </Container>
    </>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-semibold text-ink-700">
        {label}
      </dt>
      <dd className="mt-0.5 text-sm text-ink-900">{value}</dd>
    </div>
  );
}

function Formula({ children }: { children: string }) {
  return (
    <p className="mt-4 max-w-3xl overflow-x-auto rounded-2xl bg-ink-900 px-5 py-4 font-mono text-sm text-marker-300">
      {children}
    </p>
  );
}
