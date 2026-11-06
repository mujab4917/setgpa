import { GuideFormula, GuideLink, GuideNote, GuideTable } from "@/components/guides/GuideParts";
import { computeCgpaExample } from "@/data/guides";
import { routes } from "@/lib/routes";

import type { Article } from "./types";

/**
 * GUIDE -> /guides/cgpa-full-form
 * Targets "cgpa full form", "cgpa meaning", "what is cgpa", "sgpa full form".
 */

const cgpa = computeCgpaExample();

export const cgpaFullForm: Article = {
  slug: "cgpa-full-form",
  title: "CGPA full form: meaning, formula and scale",
  metaTitle: "CGPA Full Form: Meaning, Formula and Scale Explained",
  metaDescription:
    "CGPA stands for Cumulative Grade Point Average. Learn what it means, how it differs from SGPA and GPA, the formula, and the 10-point and 4.0 scales.",
  category: "Basics",
  readingMinutes: 4,
  published: "2026-11-06",
  updated: "2026-11-06",
  intro:
    "CGPA stands for Cumulative Grade Point Average: your grade point average across every semester you have completed. SGPA is the same idea for a single semester.",
  points: ["CGPA and SGPA full forms", "The formula with a worked example", "10-point vs 4.0 scale"],
  keyPoints: [
    "CGPA stands for Cumulative Grade Point Average. SGPA stands for Semester Grade Point Average.",
    "Both are weighted by credit hours, so a semester with more credits moves your CGPA more.",
    "A CGPA can be out of 10 or out of 4.0 depending on the university. Never compare results from different scales.",
  ],
  cover: { art: "terms", tone: "marker" },
  card: {
    subtitle: "SGPA, CGPA and GPA",
    panelTitle: "In short",
    rows: [
      ["SGPA", "1 term"],
      ["CGPA", "All terms"],
      ["GPA", "= SGPA"],
    ],
    chip: "Guide",
  },
  related: [routes.sgpaToCgpa(), routes.cgpaToPercentage(), routes.howToCalculateGpa()],
  sections: [
    {
      id: "full-form",
      title: "CGPA full form",
      body: (
        <>
          <p>
            <strong>CGPA</strong> = <strong>C</strong>umulative <strong>G</strong>rade <strong>P</strong>oint{" "}
            <strong>A</strong>verage.
          </p>
          <p>
            <strong>SGPA</strong> = <strong>S</strong>emester <strong>G</strong>rade <strong>P</strong>oint{" "}
            <strong>A</strong>verage. <strong>GPA</strong> = <strong>G</strong>rade <strong>P</strong>oint{" "}
            <strong>A</strong>verage. Many universities use GPA and SGPA to mean the same thing, your average for
            one semester.
          </p>
        </>
      ),
    },
    {
      id: "meaning",
      title: "What CGPA means",
      body: (
        <>
          <p>
            Each grade you earn is turned into <em>grade points</em>, for example 4.0 for an A on a 4.0 scale. Your
            SGPA averages those points for one semester, weighted by credit hours. Your CGPA averages them across all
            semesters so far.
          </p>
          <p>
            It is one number that summarises your degree. It changes a little at the end of each semester, and a
            semester with more credit hours moves it more.
          </p>
        </>
      ),
    },
    {
      id: "formula",
      title: "CGPA formula and example",
      body: (
        <>
          <GuideFormula>SGPA = Σ (course credit hours × grade points) ÷ Σ credit hours of the semester</GuideFormula>
          <GuideFormula>CGPA = Σ (SGPA × semester credit hours) ÷ Σ credit hours of all semesters</GuideFormula>
          <p>
            Example: three semesters with SGPAs of {cgpa.rows.map((r) => r.gpa.toFixed(1)).join(", ")} and{" "}
            {cgpa.rows.map((r) => r.credits).join(", ")} credit hours. The quality points are{" "}
            {cgpa.quality.toFixed(1)} over {cgpa.credits} credit hours, so the CGPA is{" "}
            <strong className="text-ink-900">{cgpa.cgpa.toFixed(2)}</strong>. The plain average of the three SGPAs
            would be {cgpa.simpleAverage.toFixed(2)}, which is not the same because the semesters carry different
            credits.
          </p>
          <p>
            Want the full method with a table? See{" "}
            <GuideLink href={routes.howToCalculateGpa()}>how to calculate GPA and CGPA</GuideLink>, or add your own
            semesters in the <GuideLink href={routes.sgpaToCgpa()}>SGPA to CGPA calculator</GuideLink>.
          </p>
        </>
      ),
    },
    {
      id: "scales",
      title: "CGPA out of 10 or out of 4?",
      body: (
        <>
          <p>It depends on the university. Both are common:</p>
          <GuideTable caption="Common CGPA scales" head={["Scale", "Where you see it", "Top grade"]}>
            <tr>
              <th scope="row" className="px-4 py-3 font-semibold">
                Out of 10
              </th>
              <td className="px-4 py-3 text-right">Many Indian universities and the CBSE</td>
              <td className="px-4 py-3 text-right tabular-nums">10</td>
            </tr>
            <tr>
              <th scope="row" className="px-4 py-3 font-semibold">
                Out of 4.0
              </th>
              <td className="px-4 py-3 text-right">Pakistan, the United States, Canada and others</td>
              <td className="px-4 py-3 text-right tabular-nums">4.00</td>
            </tr>
          </GuideTable>
          <GuideNote title="Never compare CGPAs from different scales">
            <p>
              A 3.5 on a 4.0 scale is a very strong result. A 3.5 on a 10-point scale is a poor one. Always say which
              scale your CGPA is on. To turn a 10-point CGPA into a percentage, use the{" "}
              <GuideLink href={routes.cgpaToPercentage()}>CGPA to percentage converter</GuideLink>.
            </p>
          </GuideNote>
        </>
      ),
    },
    {
      id: "good-cgpa",
      title: "What counts as a good CGPA?",
      body: (
        <p>
          Nobody can give you one number that fits every case. Cut-offs for scholarships, honours, probation, job
          applications and further study are set by each university or employer, and they differ widely. Look for the
          figure in the notice or handbook that applies to you. If you need to know what next semester must deliver,
          the <GuideLink href={routes.targetPlanner()}>target GPA calculator</GuideLink> works it out.
        </p>
      ),
    },
  ],
  faq: [
    {
      question: "What is the full form of CGPA?",
      answer: "CGPA stands for Cumulative Grade Point Average. It is your grade point average across all completed semesters.",
    },
    {
      question: "What is the full form of SGPA?",
      answer:
        "SGPA stands for Semester Grade Point Average: your average for a single semester. Some universities simply call it GPA.",
    },
    {
      question: "Is CGPA out of 10 or out of 4?",
      answer:
        "Either, depending on the university. Many Indian institutions use a 10-point scale, while Pakistan, the United States and Canada mostly use 4.0. Check your own grade table.",
    },
    {
      question: "Is CGPA the same as percentage?",
      answer:
        "No. CGPA is an average of grade points, while percentage is an average of marks. You can convert between them only with a rule published by your university or board.",
    },
    {
      question: "What is the difference between GPA and CGPA?",
      answer:
        "GPA covers one semester and CGPA covers all your semesters so far. Both are weighted by credit hours.",
    },
  ],
};
