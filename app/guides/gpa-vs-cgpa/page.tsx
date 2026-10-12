import type { Metadata } from "next";
import Link from "next/link";

import { GuideCta, GuideFormula, GuideSection, GuideTable, GuideToc } from "@/components/guides/GuideParts";
import { JsonLd } from "@/components/seo/JsonLd";
import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/Container";
import { UniversityFaq } from "@/components/universities/UniversityFaq";
import { computeCgpaExample, GUIDE_PUBLISHED, GUIDE_UPDATED, gpaVsCgpaFaq } from "@/data/guides";
import { universityPageContent } from "@/data/site-content";
import { routes } from "@/lib/routes";
import { articleJsonLd, breadcrumbJsonLd } from "@/lib/seo/schema";
import { buildPageMetadata } from "@/lib/seo/metadata";

/**
 * GUIDE -> /guides/gpa-vs-cgpa
 *
 * Targets "GPA vs CGPA", "difference between GPA and CGPA", "what is CGPA".
 * The one-sentence answer comes first, then a comparison table.
 */

const TITLE = "GPA vs CGPA: What's the Difference? (With Examples)";
const DESCRIPTION =
  "GPA is one semester, CGPA is your whole degree so far. See the difference, both formulas, a worked example and when each one matters.";

export const metadata: Metadata = buildPageMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: routes.gpaVsCgpa(),
  type: "article",
});

const TOC = [
  { id: "difference", label: "The difference" },
  { id: "comparison", label: "Side by side" },
  { id: "example", label: "Example" },
  { id: "which-matters", label: "Which matters more" },
];

export default function GpaVsCgpaPage() {
  const cgpa = computeCgpaExample();
  const lastSemester = cgpa.rows[cgpa.rows.length - 1];
  const before = cgpa.rows.slice(0, -1);
  const beforeCredits = before.reduce((s, r) => s + r.credits, 0);
  const cgpaBefore = before.reduce((s, r) => s + r.quality, 0) / beforeCredits;

  return (
    <>
      <JsonLd data={articleJsonLd({
              headline: "GPA vs CGPA: what is the difference?",
              description: DESCRIPTION,
              path: routes.gpaVsCgpa(),
              datePublished: GUIDE_PUBLISHED,
              dateModified: GUIDE_UPDATED,
            })} />
      <JsonLd data={breadcrumbJsonLd([
              { name: "Home", path: routes.home() },
              { name: "Guides", path: routes.guides() },
              { name: "GPA vs CGPA", path: routes.gpaVsCgpa() },
            ])} />

      <PageHero
        title="GPA vs CGPA: what is the difference?"
        description="GPA is your grade point average for one semester. CGPA is your cumulative grade point average across every semester you have completed."
        breadcrumbs={[
          { label: "Home", href: routes.home() },
          { label: "Guides", href: routes.guides() },
          { label: "GPA vs CGPA", href: routes.gpaVsCgpa() },
        ]}
      />

      <Container className="pb-8 pt-4">
        <div className="max-w-3xl">
          <GuideToc items={TOC} />

          <GuideSection id="difference" title="GPA vs CGPA in one minute">
            <p>
              <strong>GPA</strong> (grade point average) answers &ldquo;how did I do this semester?&rdquo; It uses
              only the courses from that term.
            </p>
            <p>
              <strong>CGPA</strong> (cumulative grade point average) answers &ldquo;how am I doing overall?&rdquo; It
              combines every completed semester, weighted by credit hours. Some universities call the semester
              figure SGPA; it means the same as GPA here.
            </p>
            <GuideFormula>{universityPageContent.gpaFormula}</GuideFormula>
            <GuideFormula>{universityPageContent.cgpaFormula}</GuideFormula>
          </GuideSection>

          <GuideSection id="comparison" title="GPA and CGPA side by side">
            <div className="overflow-x-auto rounded-2xl border border-ink-900/10 bg-white">
              <table className="w-full min-w-[30rem] text-left text-base">
                <caption className="sr-only">Comparison of GPA and CGPA</caption>
                <thead className="bg-brand-800 text-sm text-white">
                  <tr>
                    <th scope="col" className="px-4 py-3 font-semibold" />
                    <th scope="col" className="px-4 py-3 font-semibold">
                      GPA
                    </th>
                    <th scope="col" className="px-4 py-3 font-semibold">
                      CGPA
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink-900/8 text-ink-900">
                  {[
                    ["Full name", "Grade point average", "Cumulative grade point average"],
                    ["Covers", "One semester", "All completed semesters"],
                    ["Changes", "Fresh each semester", "Moves a little every semester"],
                    ["Weighted by", "Credit hours of each course", "Credit hours of each semester"],
                    ["Scale", "Your university's scale", "The same scale"],
                    ["Often used for", "Semester results, probation checks", "Graduation, scholarships, applications"],
                  ].map(([label, gpa, cgpaText]) => (
                    <tr key={label}>
                      <th scope="row" className="px-4 py-3 font-semibold">
                        {label}
                      </th>
                      <td className="px-4 py-3">{gpa}</td>
                      <td className="px-4 py-3">{cgpaText}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GuideSection>

          <GuideSection id="example" title="Example: how one semester moves your CGPA">
            <p>
              After two semesters ({before.map((s) => s.gpa.toFixed(2)).join(" and ")} GPA, {beforeCredits} credit
              hours in total) the CGPA is <strong className="text-ink-900">{cgpaBefore.toFixed(2)}</strong>. A third
              semester with a GPA of {lastSemester.gpa.toFixed(2)} over {lastSemester.credits} credit hours is below
              that CGPA, so the CGPA falls to <strong className="text-ink-900">{cgpa.cgpa.toFixed(2)}</strong>.
            </p>
            <GuideTable caption="CGPA after each semester" head={["Semester", "GPA", "Credit hours"]}>
              {cgpa.rows.map((row) => (
                <tr key={row.name}>
                  <th scope="row" className="px-4 py-3 font-semibold">
                    {row.name}
                  </th>
                  <td className="px-4 py-3 text-right tabular-nums">{row.gpa.toFixed(2)}</td>
                  <td className="px-4 py-3 text-right tabular-nums">{row.credits}</td>
                </tr>
              ))}
              <tr className="bg-cream-100 font-bold">
                <th scope="row" className="px-4 py-3">
                  CGPA
                </th>
                <td className="px-4 py-3 text-right tabular-nums">{cgpa.cgpa.toFixed(2)}</td>
                <td className="px-4 py-3 text-right tabular-nums">{cgpa.credits}</td>
              </tr>
            </GuideTable>
            <p>
              The step-by-step method is in{" "}
              <Link href={routes.howToCalculateGpa()} className="font-semibold text-brand-700 underline underline-offset-4">
                how to calculate GPA and CGPA
              </Link>
              .
            </p>
          </GuideSection>

          <GuideSection id="which-matters" title="Which matters more, GPA or CGPA?">
            <p>
              For most decisions that last beyond one semester (graduation requirements, scholarships, internships
              and applications) CGPA is the number people look at. GPA matters for each term&rsquo;s result and for
              checks such as probation. The exact thresholds are set by your university, so confirm them in your
              handbook.
            </p>
            <p>
              To plan ahead, use the{" "}
              <Link href={routes.targetPlanner()} className="font-semibold text-brand-700 underline underline-offset-4">
                target GPA calculator
              </Link>{" "}
              to find the GPA you need next semester to reach a chosen CGPA.
            </p>
          </GuideSection>

          <UniversityFaq items={gpaVsCgpaFaq} />
          <GuideCta />

          <p className="mt-10 text-sm text-ink-700">
            Last updated 2 October 2026. Your university&rsquo;s official regulations always take priority.
          </p>
        </div>
      </Container>
    </>
  );
}
