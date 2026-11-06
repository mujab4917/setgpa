import { CgpaConverter } from "@/components/guides/CgpaConverter";
import { GuideFormula, GuideLink, GuideNote, GuideTable } from "@/components/guides/GuideParts";
import { conversionMethods, formatNumber, getMethod } from "@/lib/guides/cgpa-convert";
import { routes } from "@/lib/routes";

import type { Article } from "./types";

/**
 * GUIDE -> /guides/cgpa-to-percentage
 * Targets "cgpa to percentage", "how to convert cgpa into percentage",
 * "percentage to cgpa", "cgpa to percentage calculator", "8 cgpa in percentage".
 */

const cbse = getMethod("cbse");
const vtu = getMethod("vtu");
const tableCgpas = [6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10];

const example = { cgpa: 8.2, pct: cbse.toPercentage(8.2) };
const reverse = { pct: 72, cgpa: cbse.toCgpa(72) };

export const cgpaToPercentage: Article = {
  slug: "cgpa-to-percentage",
  title: "CGPA to percentage: formula, converter and table",
  metaTitle: "CGPA to Percentage: Formula, Converter and Table",
  metaDescription:
    "Convert CGPA to percentage with the CBSE ×9.5 rule or your university's own. Free converter, a 6 to 10 CGPA table and percentage to CGPA.",
  category: "Conversion",
  readingMinutes: 5,
  published: "2026-11-06",
  updated: "2026-11-06",
  intro:
    "To convert CGPA to percentage, multiply your CGPA by 9.5 if your institution follows the CBSE rule. Other universities use their own rule, so check the one printed on your marksheet or in your regulations.",
  points: ["Free converter, both directions", "Table for 6.0 to 10 CGPA", "Which rule to trust for your marksheet"],
  keyPoints: [
    `For a CGPA out of 10, the CBSE rule is CGPA × 9.5. A CGPA of ${example.cgpa} becomes ${formatNumber(example.pct)}%.`,
    "VTU uses (CGPA − 0.75) × 10 and some colleges use CGPA × 10, so the same CGPA can give very different percentages.",
    "Your marksheet or university regulations decide which rule counts. Any online converter is only an estimate.",
    "Never apply the ×9.5 rule to a CGPA out of 4.0.",
  ],
  cover: { art: "percent", tone: "brand" },
  card: {
    subtitle: "Free converter and table",
    panelTitle: "CGPA × 9.5",
    rows: [10, 9, 8, 7, 6].map((c): [string, string] => [String(c), `${formatNumber(cbse.toPercentage(c))}%`]),
    chip: "Guide",
  },
  related: [routes.sgpaToCgpa(), routes.cgpaFullForm(), routes.gpaVsCgpa()],
  sections: [
    {
      id: "formula",
      title: "The CGPA to percentage formula",
      body: (
        <>
          <p>
            There is no single national rule for turning a CGPA into a percentage. Each board or university decides
            its own. The two rules students meet most often are these, for a CGPA out of 10:
          </p>
          <GuideFormula>CBSE rule: Percentage = CGPA × 9.5</GuideFormula>
          <GuideFormula>VTU rule: Percentage = (CGPA − 0.75) × 10</GuideFormula>
          <p>
            Take a CGPA of {example.cgpa} under the CBSE rule: {example.cgpa} × 9.5 ={" "}
            <strong className="text-ink-900">{formatNumber(example.pct)}%</strong>. Under the simple CGPA × 10 rule that
            some colleges use, the same CGPA would give {formatNumber(example.cgpa * 10)}%. The gap is why the rule
            matters.
          </p>
        </>
      ),
    },
    {
      id: "converter",
      title: "CGPA to percentage converter",
      body: (
        <>
          <p>
            Type your CGPA, pick the rule your university uses, and read the percentage. Switch the direction to go
            from percentage back to CGPA.
          </p>
          <CgpaConverter />
        </>
      ),
    },
    {
      id: "table",
      title: "CGPA to percentage table (out of 10)",
      body: (
        <>
          <p>
            The same CGPAs under each of the three rules. Notice how far apart the answers are at the top of the
            scale.
          </p>
          <GuideTable caption="CGPA to percentage under three rules" head={["CGPA", ...conversionMethods.map((m) => m.label)]}>
            {tableCgpas.map((c) => (
              <tr key={c}>
                <th scope="row" className="px-4 py-3 font-semibold">
                  {c.toFixed(1)}
                </th>
                {conversionMethods.map((m) => (
                  <td key={m.id} className="px-4 py-3 text-right tabular-nums">
                    {formatNumber(m.toPercentage(c))}%
                  </td>
                ))}
              </tr>
            ))}
          </GuideTable>
        </>
      ),
    },
    {
      id: "percentage-to-cgpa",
      title: "How to convert percentage to CGPA",
      body: (
        <>
          <p>Reverse the rule. For the CBSE rule, divide the percentage by 9.5:</p>
          <GuideFormula>CGPA = Percentage ÷ 9.5</GuideFormula>
          <p>
            Example: {reverse.pct}% ÷ 9.5 = <strong className="text-ink-900">{formatNumber(reverse.cgpa)}</strong>{" "}
            CGPA. For the VTU rule the reverse is CGPA = (Percentage ÷ 10) + 0.75, which gives{" "}
            {formatNumber(vtu.toCgpa(reverse.pct))} for the same {reverse.pct}%.
          </p>
        </>
      ),
    },
    {
      id: "which-rule",
      title: "Which rule should you use?",
      body: (
        <>
          <p>Use the rule that the institution reading your result will accept. In order of trust:</p>
          <ol className="list-decimal space-y-3 pl-6 marker:font-bold marker:text-brand-700">
            <li>
              <strong>Your marksheet or transcript.</strong> Many print the conversion, sometimes in small type at the
              bottom.
            </li>
            <li>
              <strong>Your university&rsquo;s regulations or website.</strong> Search for &ldquo;CGPA to percentage&rdquo;
              on the official site.
            </li>
            <li>
              <strong>The exam or admissions office.</strong> A short email gets you the rule in writing.
            </li>
            <li>
              <strong>The employer or university you are applying to.</strong> Some state the conversion they apply.
            </li>
          </ol>
          <GuideNote title="Treat any online converter as an estimate">
            <p>
              That includes this one. A converter shows what a published rule would give. It does not make the
              number official. For applications, use the figure your university states on its own documents.
            </p>
          </GuideNote>
        </>
      ),
    },
    {
      id: "four-point",
      title: "What about a CGPA out of 4.0?",
      body: (
        <>
          <p>
            Do not use the ×9.5 rule on a 4.0 scale. A CGPA of 3.5 out of 4.0 is nowhere near 33%. Universities on the
            4.0 scale, including most in Pakistan, publish their own grade table and sometimes a marks range for each
            grade. There is no single conversion.
          </p>
          <p>
            Find your university&rsquo;s table on its{" "}
            <GuideLink href={routes.cities()}>GPA calculator page</GuideLink>, or read how the two scales relate in{" "}
            <GuideLink href={routes.cgpaFullForm()}>CGPA full form and meaning</GuideLink>.
          </p>
        </>
      ),
    },
    {
      id: "mistakes",
      title: "Common mistakes",
      body: (
        <ul className="list-disc space-y-3 pl-6 marker:text-brand-700">
          <li>
            <strong>Using ×9.5 on a 4.0 or 5.0 scale.</strong> That rule is only for a CGPA out of 10.
          </li>
          <li>
            <strong>Converting each SGPA, then averaging.</strong> Work out your CGPA first (see{" "}
            <GuideLink href={routes.sgpaToCgpa()}>SGPA to CGPA</GuideLink>), then convert it once.
          </li>
          <li>
            <strong>Assuming one rule fits every university.</strong> The same CGPA can map to different percentages.
          </li>
          <li>
            <strong>Rounding up for an application.</strong> Quote the figure your documents give, not a rounded one.
          </li>
        </ul>
      ),
    },
  ],
  faq: [
    {
      question: "How do I convert CGPA to percentage?",
      answer:
        "Multiply your CGPA (out of 10) by 9.5 if your institution follows the CBSE rule. For example, 8.2 × 9.5 = 77.9%. Some universities use a different rule, such as (CGPA − 0.75) × 10 at VTU, so check your own regulations.",
    },
    {
      question: "How do I convert percentage to CGPA?",
      answer:
        "Divide the percentage by 9.5 under the CBSE rule. For example, 72% ÷ 9.5 = 7.58 CGPA. Under the VTU rule it is (percentage ÷ 10) + 0.75.",
    },
    {
      question: "What is 8 CGPA in percentage?",
      answer:
        "Under the CBSE rule, 8 CGPA is 76%. Under the VTU rule it is 72.5%, and under the simple CGPA × 10 rule it is 80%. Your university's own rule decides which figure is correct for you.",
    },
    {
      question: "Is the CGPA × 9.5 formula official for every university?",
      answer:
        "No. It is the CBSE rule and many colleges follow it, but each university can publish its own conversion. Always use the rule on your marksheet, transcript or regulations.",
    },
    {
      question: "Can I convert a 4.0 CGPA to percentage?",
      answer:
        "There is no single formula. Universities on the 4.0 scale publish their own grade tables, and some give a marks range for each grade. Use your university's table rather than a general converter.",
    },
  ],
};
