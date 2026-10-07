/**
 * Extra questions for the priority pages in data/focus-pages.ts.
 *
 * Chosen from what students type around "uog gpa", "uog cgpa calculator" and
 * "uog grading system", and from what the pages ranking for those searches
 * leave unanswered. Every number comes from the university's own grade table,
 * so an answer cannot disagree with the table on the page.
 */

import type { FaqItem } from "@/lib/seo/faq";
import { formatGpa, formatPercentage, formatPoints, gpaToPercentage } from "@/lib/calculators/validation";
import type { UniversityDetail } from "@/types/domain";

export function buildFocusFaq(university: UniversityDetail, alias: string): FaqItem[] {
  const rules = university.gradeRules;
  if (rules.length === 0) return [];

  const name = university.name;
  const scale = formatGpa(university.gpaScale);
  const table = rules.map((rule) => `${rule.grade} = ${formatGpa(rule.gradePoint)}`).join(", ");
  const items: FaqItem[] = [];

  items.push({
    question: `What is the ${alias} grading system?`,
    answer: `${name} uses a ${scale} scale with these grade points: ${table}. Each course's grade points are multiplied by its credit hours, and the total is divided by the total credit hours to give the GPA.`,
  });

  // Marks -> grade, only when the table really has marks ranges.
  const ranged = rules.filter(
    (rule) => typeof rule.minPercentage === "number" && typeof rule.maxPercentage === "number",
  );
  if (ranged.length > 0) {
    const bands = ranged
      .map((rule, index) =>
        index === 0
          ? `${rule.grade} from ${formatPoints(rule.minPercentage as number)} marks up`
          : `${rule.grade} ${formatPoints(rule.minPercentage as number)} to ${formatPoints(rule.maxPercentage as number)}`,
      )
      .join(", ");
    items.push({
      question: `How do I find my ${alias} grade from my marks?`,
      answer: `In the ${alias} table used here: ${bands}. A mark exactly on a boundary moves up to the higher grade. In the calculator at the top of the page, type your marks in the Marks box and the grade fills in for you.`,
    });
  }

  const lowestPass = [...rules].reverse().find((rule) => rule.gradePoint > 0);
  if (lowestPass) {
    items.push({
      question: `What is the lowest passing grade at ${alias}?`,
      answer: `In the table used here the lowest grade that still earns points is ${lowestPass.grade}, worth ${formatGpa(lowestPass.gradePoint)}; an F is worth ${formatGpa(0)}. Departments can set stricter rules for progression and graduation, so confirm yours with your department.`,
    });
  }

  const present = new Set(rules.map((rule) => rule.grade));
  const minus = rules.filter((rule) => rule.grade.endsWith("-"));
  const missingMinus = ["A-", "C-", "D+"].filter((grade) => !present.has(grade));
  if (minus.length > 0) {
    items.push({
      question: `Does ${alias} have minus grades like A- or C-?`,
      answer: `The ${alias} table here includes ${minus
        .map((rule) => `${rule.grade} (${formatGpa(rule.gradePoint)})`)
        .join(" and ")}${missingMinus.length > 0 ? ` but not ${missingMinus.join(", ")}` : ""}. Other universities use different letters, so never reuse another university's table for your ${alias} result.`,
    });
  }

  const example = gpaToPercentage(3, university.gpaScale);
  items.push({
    question: `How do I convert my ${alias} CGPA to a percentage?`,
    answer: `There is no single official conversion that every university prints. The calculator on this page shows an approximate percentage (CGPA divided by ${scale}, times 100), so a ${formatGpa(3)} CGPA is about ${formatPercentage(example)}. For degrees, transcripts and applications, use the percentage printed on your own result card or ask the university.`,
  });

  items.push({
    question: `Is the ${alias} GPA and CGPA calculator free?`,
    answer: `Yes. It is free, needs no account, and nothing you enter is saved or shared. It is an independent student project, not a ${name} service.`,
  });

  items.push({
    question: `Is "${alias}" the University of Gujrat?`,
    answer: `Yes. UOG is the usual short name for the University of Gujrat, which students also search for as Gujrat University. This page uses the grade table for the Hafiz Hayat Campus. Other Gujrat institutions, such as UOL Gujrat Campus, have their own pages because their grade points differ.`,
  });

  items.push({
    question: `Has ${alias} changed its grading rules?`,
    answer: `${alias} publishes its semester rules on uog.edu.pk, and revised semester-system rules from 2025 are listed there. The table on this page is the one students report on their result cards. If you were admitted recently, compare it with your department's notification before relying on a result.`,
  });

  return items;
}
