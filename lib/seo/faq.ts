/**
 * Builds the FAQ for a university page.
 *
 * The questions are the ones students actually type into search ("how is GPA
 * calculated at ...", "what is an A worth at ..."), and every answer is derived
 * from that university's own database row. Nothing is hand-written per
 * university, so a university added next year gets a correct FAQ for free.
 *
 * The same array feeds the visible <details> list and the FAQPage structured
 * data, so the two can never drift apart.
 */

import { universityPageContent } from "@/data/site-content";
import { formatGpa, formatPoints } from "@/lib/calculators/validation";
import type { UniversityDetail } from "@/types/domain";

export interface FaqItem {
  question: string;
  /** Plain text: it is reused inside JSON-LD, so it must not contain markup. */
  answer: string;
}

/**
 * Picks "a" or "an" for a grade letter.
 *
 * It depends on how the letter is *said*, not how it is spelled: "an A",
 * "an F" and "an S" are correct because those letter names begin with a vowel
 * sound, while "a B" and "a C" do not.
 */
function article(grade: string): string {
  const first = grade.trim().charAt(0).toUpperCase();
  return "AEFHILMNORSX".includes(first) ? "an" : "a";
}

export function buildUniversityFaq(university: UniversityDetail): FaqItem[] {
  const label = university.shortName ?? university.name;
  const scale = formatPoints(university.gpaScale);
  const items: FaqItem[] = [];

  items.push({
    question: `How to calculate GPA at ${label}?`,
    answer: `${
      university.gpaExplanation ?? universityPageContent.howGpaWorksDefaultText
    } In short: ${universityPageContent.gpaFormula}.`,
  });

  items.push({
    question: `How to calculate CGPA at ${label}?`,
    answer: `${
      university.cgpaExplanation ?? universityPageContent.howCgpaWorksDefaultText
    } In short: ${universityPageContent.cgpaFormula}.`,
  });

  items.push({
    question: `What is the difference between GPA and CGPA at ${label}?`,
    answer: `At ${university.name}, GPA is your average for one semester and CGPA is your cumulative average across every completed semester. Both are worked out on the same ${formatGpa(
      university.gpaScale,
    )} scale and weighted by credit hours. The CGPA calculator on this page takes your semester GPAs and credit hours and returns the cumulative result.`,
  });

  items.push({
    question: `What GPA scale does ${label} use?`,
    answer: `${university.name} uses a ${formatGpa(
      university.gpaScale,
    )} scale, so the highest possible GPA or CGPA is ${formatGpa(
      university.gpaScale,
    )}.`,
  });

  // The top of the grade table, taken straight from the GradeRule rows.
  const best = university.gradeRules[0];
  if (best) {
    items.push({
      question: `How many grade points is ${article(best.grade)} ${best.grade} worth at ${label}?`,
      answer: `${article(best.grade) === "an" ? "An" : "A"} ${best.grade} is worth ${formatGpa(
        best.gradePoint,
      )} grade points at ${university.name}. Multiply that by the credit hours of the course to get the quality points the course contributes.`,
    });
  }

  // Only mention failing if this university actually has a zero-point grade.
  const failing = university.gradeRules.find((rule) => rule.gradePoint === 0);
  if (failing) {
    items.push({
      question: `Does ${article(failing.grade)} ${failing.grade} affect your GPA at ${label}?`,
      answer: `Yes. ${article(failing.grade) === "an" ? "An" : "A"} ${failing.grade} is worth ${formatGpa(
        failing.gradePoint,
      )} grade points, but its credit hours are still counted in the total you divide by. That is why one failed course pulls the whole semester GPA down, and why the calculator on this page includes ${failing.grade} rows in the total credit hours.`,
    });
  }

  items.push({
    question: `Is this calculator official for ${label}?`,
    answer: university.isVerified
      ? `No. This is an independent student project, not a ${university.name} service. The grade table used here has been checked against the source noted on this page, but always confirm anything important with your own department.`
      : `No. This is an independent student project, not a ${university.name} service, and the grade table currently shown is demo data that has not been verified against official documents. Confirm the values with your own department before relying on a result.`,
  });

  return items;
}
