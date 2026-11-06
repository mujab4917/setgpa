import type { Metadata } from "next";
import Link from "next/link";

import { ArticleLayout } from "@/components/guides/ArticleLayout";
import { GuideFormula, GuideLink, GuideSection, GuideTable } from "@/components/guides/GuideParts";
import { JsonLd } from "@/components/seo/JsonLd";
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
  defaultImage: false,
});

const PATH = routes.gpaVsCgpa();

const TOC = [
  { id: "difference", label: "The difference" },
  { id: "comparison", label: "Side by side" },
  { id: "sgpa", label: "Where SGPA fits" },
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

      <ArticleLayout
        title="GPA vs CGPA: what is the difference?"
        intro="GPA is your grade point average for one semester. CGPA is your cumulative grade point average across every semester you have completed."
        category="Basics"
        readingMinutes={4}
        updated={GUIDE_UPDATED}
        cover={{ art: "versus", tone: "marker" }}
        breadcrumbs={[
          { label: "Home", href: routes.home() },
          { label: "Guides", href: routes.guides() },
          { label: "GPA vs CGPA", href: PATH },
        ]}
        keyPoints={[
          "GPA covers one semester. CGPA covers every semester you have completed.",
          "SGPA usually means the same as GPA: a single semester.",
          "CGPA is what graduation, scholarships and applications usually look at.",
          "A semester below your CGPA pulls it down; one above it pulls it up.",
        ]}
        toc={TOC}
        faq={gpaVsCgpaFaq}
        related={[routes.cgpaFullForm(), routes.cgpaToPercentage(), routes.sgpaToCgpa()]}
      >
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

        <GuideSection id="sgpa" title="Where SGPA fits in">
          <p>
            You will also see <strong>SGPA</strong>, the Semester Grade Point Average. It is the same measure as GPA
            here: one semester. So the real comparison is always one term (GPA or SGPA) against your whole degree
            so far (CGPA). The full forms and the 10-point and 4.0 scales are explained in{" "}
            <GuideLink href={routes.cgpaFullForm()}>CGPA full form and meaning</GuideLink>. To combine your
            semester results, use the <GuideLink href={routes.sgpaToCgpa()}>SGPA to CGPA calculator</GuideLink>.
          </p>
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
      </ArticleLayout>
    </>
  );
}
