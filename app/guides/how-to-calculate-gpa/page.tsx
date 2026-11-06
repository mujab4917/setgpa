import type { Metadata } from "next";
import Link from "next/link";

import { ArticleLayout } from "@/components/guides/ArticleLayout";
import { GuideFormula, GuideLink, GuideNote, GuideSection, GuideTable } from "@/components/guides/GuideParts";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  computeCgpaExample,
  computeGpaExample,
  GUIDE_PUBLISHED,
  GUIDE_UPDATED,
  howToFaq,
} from "@/data/guides";
import { universityPageContent } from "@/data/site-content";
import { routes } from "@/lib/routes";
import { articleJsonLd, breadcrumbJsonLd } from "@/lib/seo/schema";
import { buildPageMetadata } from "@/lib/seo/metadata";

/**
 * GUIDE -> /guides/how-to-calculate-gpa
 *
 * Targets "how to calculate GPA", "how to calculate CGPA" and "GPA formula".
 * Answer-first: the formula is in the first screen, the worked example right
 * after, and the mistakes people actually make last.
 */

const TITLE = "How to Calculate GPA and CGPA: Formula and Examples";
const DESCRIPTION =
  "Learn how to calculate GPA and CGPA step by step: the formula, a worked example and common mistakes. Then use your own university's grade table.";

export const metadata: Metadata = buildPageMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: routes.howToCalculateGpa(),
  type: "article",
  defaultImage: false,
});

const PATH = routes.howToCalculateGpa();

const TOC = [
  { id: "gpa-formula", label: "GPA formula" },
  { id: "gpa-steps", label: "Step by step" },
  { id: "gpa-example", label: "Worked example" },
  { id: "cgpa", label: "How to calculate CGPA" },
  { id: "scales", label: "GPA scales worldwide" },
  { id: "mistakes", label: "Common mistakes" },
];

export default function HowToCalculateGpaPage() {
  const gpa = computeGpaExample();
  const cgpa = computeCgpaExample();

  return (
    <>
      <JsonLd data={articleJsonLd({
              headline: "How to calculate GPA and CGPA",
              description: DESCRIPTION,
              path: routes.howToCalculateGpa(),
              datePublished: GUIDE_PUBLISHED,
              dateModified: GUIDE_UPDATED,
            })} />
      <JsonLd data={breadcrumbJsonLd([
              { name: "Home", path: routes.home() },
              { name: "Guides", path: routes.guides() },
              { name: "How to calculate GPA", path: routes.howToCalculateGpa() },
            ])} />

      <ArticleLayout
        title="How to calculate GPA and CGPA"
        intro="Your GPA is the average of your grade points for one semester, weighted by credit hours. Your CGPA is the same calculation across every semester you have finished."
        category="Basics"
        readingMinutes={6}
        updated={GUIDE_UPDATED}
        cover={{ art: "gpa", tone: "cream" }}
        breadcrumbs={[
          { label: "Home", href: routes.home() },
          { label: "Guides", href: routes.guides() },
          { label: "How to calculate GPA", href: PATH },
        ]}
        keyPoints={[
          "GPA = total quality points ÷ total credit hours, where quality points are credit hours × grade points.",
          "CGPA uses the same idea across semesters, weighting each semester by its credit hours.",
          "The method is identical on a 4.0 or a 10-point scale. Only the grade points change.",
          "Use your own university's grade table, because points for grades like A- differ between universities.",
        ]}
        toc={TOC}
        faq={howToFaq}
        related={[routes.cgpaFullForm(), routes.sgpaToCgpa(), routes.cgpaToPercentage()]}
      >
        <GuideSection id="gpa-formula" title="The GPA formula">
          <p>
            GPA stands for grade point average. Each course adds <strong>quality points</strong>: its credit hours
            multiplied by the grade points of the grade you earned. Add the quality points of all your courses,
            then divide by the total credit hours.
          </p>
          <GuideFormula>{universityPageContent.gpaFormula}</GuideFormula>
          <p>
            Grade points come from your university&rsquo;s grade table. On a 4.00 scale an A is usually 4.00 and an
            F is 0.00, but the points for grades like A- and B+ differ between universities, which is why a
            generic GPA calculator can be wrong. See{" "}
            <Link href={routes.cities()} className="font-semibold text-brand-700 underline underline-offset-4">
              the grade table for your university
            </Link>
            .
          </p>
        </GuideSection>

        <GuideSection id="gpa-steps" title="How to calculate GPA step by step">
          <ol className="list-decimal space-y-3 pl-6 marker:font-bold marker:text-brand-700">
            <li>
              <strong>Write down each course</strong> with its credit hours and the letter grade you received.
            </li>
            <li>
              <strong>Look up the grade points</strong> for each letter in your university&rsquo;s grade table.
            </li>
            <li>
              <strong>Multiply</strong> credit hours by grade points to get the quality points for each course.
            </li>
            <li>
              <strong>Add</strong> all the quality points, and add all the credit hours.
            </li>
            <li>
              <strong>Divide</strong> total quality points by total credit hours. That is your semester GPA.
            </li>
          </ol>
        </GuideSection>

        <GuideSection id="gpa-example" title="GPA calculation example">
          <p>One semester with four courses, using a common 4.00 scale (A = 4.00, A- = 3.67, B+ = 3.33, B = 3.00):</p>
          <GuideTable
            caption="Worked GPA example"
            head={["Course", "Grade", "Credit hours", "Quality points"]}
          >
            {gpa.rows.map((row) => (
              <tr key={row.name}>
                <th scope="row" className="px-4 py-3 font-semibold">
                  {row.name}
                </th>
                <td className="px-4 py-3 text-right tabular-nums">
                  {row.grade} ({row.point.toFixed(2)})
                </td>
                <td className="px-4 py-3 text-right tabular-nums">{row.credits}</td>
                <td className="px-4 py-3 text-right tabular-nums">{row.quality.toFixed(2)}</td>
              </tr>
            ))}
            <tr className="bg-cream-100 font-bold">
              <th scope="row" className="px-4 py-3">
                Total
              </th>
              <td className="px-4 py-3" />
              <td className="px-4 py-3 text-right tabular-nums">{gpa.credits}</td>
              <td className="px-4 py-3 text-right tabular-nums">{gpa.quality.toFixed(2)}</td>
            </tr>
          </GuideTable>
          <p>
            GPA = {gpa.quality.toFixed(2)} &divide; {gpa.credits} ={" "}
            <strong className="text-ink-900">{gpa.gpa.toFixed(2)}</strong>
          </p>
        </GuideSection>

        <GuideSection id="cgpa" title="How to calculate CGPA">
          <p>
            CGPA is your cumulative GPA. Treat each semester like a big course: multiply the semester GPA by that
            semester&rsquo;s credit hours, add those results across all semesters, then divide by the total credit
            hours.
          </p>
          <GuideFormula>{universityPageContent.cgpaFormula}</GuideFormula>
          <GuideTable caption="Worked CGPA example" head={["Semester", "GPA", "Credit hours", "Quality points"]}>
            {cgpa.rows.map((row) => (
              <tr key={row.name}>
                <th scope="row" className="px-4 py-3 font-semibold">
                  {row.name}
                </th>
                <td className="px-4 py-3 text-right tabular-nums">{row.gpa.toFixed(2)}</td>
                <td className="px-4 py-3 text-right tabular-nums">{row.credits}</td>
                <td className="px-4 py-3 text-right tabular-nums">{row.quality.toFixed(2)}</td>
              </tr>
            ))}
            <tr className="bg-cream-100 font-bold">
              <th scope="row" className="px-4 py-3">
                Total
              </th>
              <td className="px-4 py-3" />
              <td className="px-4 py-3 text-right tabular-nums">{cgpa.credits}</td>
              <td className="px-4 py-3 text-right tabular-nums">{cgpa.quality.toFixed(2)}</td>
            </tr>
          </GuideTable>
          <p>
            CGPA = {cgpa.quality.toFixed(2)} &divide; {cgpa.credits} ={" "}
            <strong className="text-ink-900">{cgpa.cgpa.toFixed(2)}</strong>. Notice this is not the plain average
            of the three GPAs ({cgpa.simpleAverage.toFixed(2)}): the 18-credit semester counts for more than the
            12-credit one. Want to see how the two measures differ? Read{" "}
            <Link href={routes.gpaVsCgpa()} className="font-semibold text-brand-700 underline underline-offset-4">
              GPA vs CGPA
            </Link>
            .
          </p>
        </GuideSection>

        <GuideSection id="scales" title="GPA scales: 4.0, 10-point and others">
          <p>
            The method above is the same everywhere, but the scale is not. Pakistan, the United States and Canada
            mostly use a 4.0 scale, where an A is about 4.0. Many Indian institutions use a 10-point scale, where the
            top grade is 10. Some countries use 5.0 or other scales. Always calculate with the grade points your own
            university assigns, and say which scale your result is on.
          </p>
          <GuideNote title="Do not compare results from different scales">
            <p>
              A 3.5 is excellent on a 4.0 scale and weak on a 10-point scale. If you need a percentage from a
              10-point CGPA, see <GuideLink href={routes.cgpaToPercentage()}>CGPA to percentage</GuideLink>. To go from
              semester results to a CGPA, use the <GuideLink href={routes.sgpaToCgpa()}>SGPA to CGPA calculator</GuideLink>.
            </p>
          </GuideNote>
        </GuideSection>

        <GuideSection id="mistakes" title="Common GPA calculation mistakes">
          <ul className="list-disc space-y-3 pl-6 marker:text-brand-700">
            <li>
              <strong>Averaging semester GPAs.</strong> CGPA must be weighted by credit hours, as shown above.
            </li>
            <li>
              <strong>Leaving out failed courses.</strong> An F adds 0 quality points but its credit hours still
              count in the total.
            </li>
            <li>
              <strong>Using the wrong grade table.</strong> The points for A- or B+ differ between universities.
            </li>
            <li>
              <strong>Rounding too early.</strong> Keep full precision until the final division, then round the
              result.
            </li>
            <li>
              <strong>Ignoring repeat rules.</strong> Whether a repeated course replaces or adds to the old grade is
              set by your university&rsquo;s regulations.
            </li>
          </ul>
        </GuideSection>
      </ArticleLayout>
    </>
  );
}
