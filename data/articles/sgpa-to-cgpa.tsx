import { GuideFormula, GuideLink, GuideNote, GuideTable } from "@/components/guides/GuideParts";
import { SgpaToCgpaCalculator } from "@/components/guides/SgpaToCgpaCalculator";
import { routes } from "@/lib/routes";

import type { Article } from "./types";

/**
 * GUIDE -> /guides/sgpa-to-cgpa
 * Targets "sgpa to cgpa", "sgpa to cgpa calculator", "how to calculate cgpa from sgpa".
 */

const semesters = [
  { name: "Semester 1", sgpa: 7.8, credits: 24 },
  { name: "Semester 2", sgpa: 8.6, credits: 12 },
  { name: "Semester 3", sgpa: 6.9, credits: 22 },
  { name: "Semester 4", sgpa: 8.4, credits: 20 },
];
const rows = semesters.map((s) => ({ ...s, quality: s.sgpa * s.credits }));
const totalCredits = rows.reduce((sum, r) => sum + r.credits, 0);
const totalQuality = rows.reduce((sum, r) => sum + r.quality, 0);
const cgpa = totalQuality / totalCredits;
const simple = semesters.reduce((sum, s) => sum + s.sgpa, 0) / semesters.length;

export const sgpaToCgpa: Article = {
  slug: "sgpa-to-cgpa",
  title: "SGPA to CGPA: formula, calculator and example",
  metaTitle: "SGPA to CGPA: Formula, Calculator and Example",
  metaDescription:
    "Convert SGPA to CGPA by weighting each semester by its credit hours. Free calculator, the formula and a worked 4-semester example.",
  category: "Conversion",
  readingMinutes: 4,
  published: "2026-11-06",
  updated: "2026-11-06",
  intro:
    "To get your CGPA from your SGPAs, multiply each semester's SGPA by its credit hours, add the results, and divide by your total credit hours. If every semester has the same credits, a plain average works.",
  points: ["Free SGPA to CGPA calculator", "Credit-weighted formula explained", "Why a plain average can be wrong"],
  keyPoints: [
    "CGPA = Σ (SGPA × semester credit hours) ÷ Σ credit hours of all semesters.",
    `With uneven credit loads the plain average can mislead: in the example below the CGPA is ${cgpa.toFixed(2)}, while the plain average is ${simple.toFixed(2)}.`,
    "Work out your CGPA first, then convert it to a percentage once.",
  ],
  cover: { art: "semesters", tone: "terracotta" },
  card: {
    subtitle: "Free calculator with credits",
    panelTitle: "SGPA to CGPA",
    rows: [
      ...rows.map((r): [string, string] => [`S${r.name.slice(-1)}`, r.sgpa.toFixed(1)]),
      ["CGPA", cgpa.toFixed(2)],
    ],
    chip: "Guide",
  },
  related: [routes.cgpaToPercentage(), routes.cgpaFullForm(), routes.howToCalculateGpa()],
  sections: [
    {
      id: "formula",
      title: "The SGPA to CGPA formula",
      body: (
        <>
          <GuideFormula>CGPA = Σ (SGPA × semester credit hours) ÷ Σ credit hours of all semesters</GuideFormula>
          <p>
            Treat each semester like one big course. Its &ldquo;grade&rdquo; is the SGPA and its weight is the
            credit hours. If all semesters carry the same credits, this is the same as adding the SGPAs and dividing by
            the number of semesters.
          </p>
        </>
      ),
    },
    {
      id: "calculator",
      title: "SGPA to CGPA calculator",
      body: (
        <>
          <p>Enter each semester&rsquo;s SGPA and credit hours. The sample numbers show how it works.</p>
          <SgpaToCgpaCalculator />
        </>
      ),
    },
    {
      id: "example",
      title: "Worked example",
      body: (
        <>
          <p>Four semesters with different credit loads:</p>
          <GuideTable caption="SGPA to CGPA example" head={["Semester", "SGPA", "Credit hours", "SGPA × credits"]}>
            {rows.map((r) => (
              <tr key={r.name}>
                <th scope="row" className="px-4 py-3 font-semibold">
                  {r.name}
                </th>
                <td className="px-4 py-3 text-right tabular-nums">{r.sgpa.toFixed(1)}</td>
                <td className="px-4 py-3 text-right tabular-nums">{r.credits}</td>
                <td className="px-4 py-3 text-right tabular-nums">{r.quality.toFixed(1)}</td>
              </tr>
            ))}
            <tr className="bg-cream-100 font-bold">
              <th scope="row" className="px-4 py-3">
                Total
              </th>
              <td className="px-4 py-3" />
              <td className="px-4 py-3 text-right tabular-nums">{totalCredits}</td>
              <td className="px-4 py-3 text-right tabular-nums">{totalQuality.toFixed(1)}</td>
            </tr>
          </GuideTable>
          <p>
            CGPA = {totalQuality.toFixed(1)} ÷ {totalCredits} ={" "}
            <strong className="text-ink-900">{cgpa.toFixed(2)}</strong>. The plain average of the four SGPAs is{" "}
            {simple.toFixed(2)}. It is higher here because the weakest semester (6.9) had 22 credit hours, more than the
            strong 12-credit semester.
          </p>
        </>
      ),
    },
    {
      id: "check",
      title: "Check it against your university's rule",
      body: (
        <GuideNote title="Your marksheet has the final say">
          <p>
            Some universities work out the CGPA from total grade points across all courses, or round each SGPA first.
            That can differ from this method in the second decimal. If your result sheet shows a CGPA, use that figure
            for official purposes.
          </p>
        </GuideNote>
      ),
    },
    {
      id: "next",
      title: "From CGPA to percentage",
      body: (
        <p>
          Once you have your CGPA, convert it once, not semester by semester. The{" "}
          <GuideLink href={routes.cgpaToPercentage()}>CGPA to percentage converter</GuideLink> shows the common rules,
          such as CGPA × 9.5. To learn what SGPA and CGPA stand for, read{" "}
          <GuideLink href={routes.cgpaFullForm()}>CGPA full form and meaning</GuideLink>.
        </p>
      ),
    },
  ],
  faq: [
    {
      question: "How do I convert SGPA to CGPA?",
      answer:
        "Multiply each semester's SGPA by that semester's credit hours, add the results, and divide by the total credit hours of all semesters. If every semester has equal credits, you can simply average the SGPAs.",
    },
    {
      question: "Is CGPA the average of SGPA?",
      answer:
        "Only when every semester has the same credit hours. Otherwise CGPA is a credit-weighted average, so a semester with more credits counts for more.",
    },
    {
      question: "How do I convert SGPA to percentage?",
      answer:
        "Use the conversion rule published by your university or board. Under the CBSE rule you multiply by 9.5, so an SGPA of 8 is 76%. Other universities use different rules.",
    },
    {
      question: "Can I calculate CGPA without credit hours?",
      answer:
        "You can average the SGPAs as an estimate, and it is exact when all semesters have the same credits. For a precise result you need each semester's credit hours.",
    },
  ],
};
