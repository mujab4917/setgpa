/**
 * Content for the two guide pages and the homepage "GPA basics" section.
 *
 * Every number in a worked example is computed here from the raw inputs, so a
 * typo in one place can never put the example out of step with its own answer.
 */

import { routes } from "@/lib/routes";
import { universityPageContent } from "@/data/site-content";

/** ISO dates used in Article structured data and the on-page "updated" line. */
export const GUIDE_PUBLISHED = "2026-10-02";
export const GUIDE_UPDATED = "2026-10-02";

export const guideLinks = [
  { label: "How to calculate GPA", href: routes.howToCalculateGpa() },
  { label: "GPA vs CGPA", href: routes.gpaVsCgpa() },
  { label: "Target GPA calculator", href: routes.targetPlanner() },
] as const;

// ---------------------------------------------------------------------------
// Worked examples (computed)
// ---------------------------------------------------------------------------

export interface ExampleCourse {
  name: string;
  credits: number;
  grade: string;
  point: number;
}

export const gpaExampleCourses: ExampleCourse[] = [
  { name: "Data Structures", credits: 3, grade: "A", point: 4.0 },
  { name: "Calculus II", credits: 3, grade: "B+", point: 3.33 },
  { name: "Technical Writing", credits: 2, grade: "A-", point: 3.67 },
  { name: "Physics", credits: 4, grade: "B", point: 3.0 },
];

export function computeGpaExample() {
  const rows = gpaExampleCourses.map((c) => ({ ...c, quality: c.credits * c.point }));
  const credits = rows.reduce((s, r) => s + r.credits, 0);
  const quality = rows.reduce((s, r) => s + r.quality, 0);
  return { rows, credits, quality, gpa: quality / credits };
}

export interface ExampleSemester {
  name: string;
  credits: number;
  gpa: number;
}

export const cgpaExampleSemesters: ExampleSemester[] = [
  { name: "Semester 1", credits: 18, gpa: 3.2 },
  { name: "Semester 2", credits: 12, gpa: 3.8 },
  { name: "Semester 3", credits: 15, gpa: 2.9 },
];

export function computeCgpaExample() {
  const rows = cgpaExampleSemesters.map((s) => ({ ...s, quality: s.credits * s.gpa }));
  const credits = rows.reduce((sum, r) => sum + r.credits, 0);
  const quality = rows.reduce((sum, r) => sum + r.quality, 0);
  const simpleAverage = rows.reduce((sum, r) => sum + r.gpa, 0) / rows.length;
  return { rows, credits, quality, cgpa: quality / credits, simpleAverage };
}

// ---------------------------------------------------------------------------
// FAQs (visible text; plain strings so they can be reused anywhere)
// ---------------------------------------------------------------------------

export interface GuideFaq {
  question: string;
  answer: string;
}

export const homeFaq: GuideFaq[] = [
  {
    question: "How do I calculate GPA?",
    answer: `Multiply each course's credit hours by the grade points of the grade you got, add those quality points together, then divide by your total credit hours. ${universityPageContent.gpaFormula}. Use the calculator on your own university's page so the grade points match your grade table.`,
  },
  {
    question: "What is the difference between GPA and CGPA?",
    answer:
      "GPA is your average for a single semester. CGPA is your cumulative average across every semester you have completed. Both are weighted by credit hours, and both are measured on your university's grade scale, usually 4.00.",
  },
  {
    question: "How do I calculate CGPA?",
    answer: `Multiply each semester's GPA by that semester's credit hours, add the results for all semesters, then divide by the total credit hours. ${universityPageContent.cgpaFormula}. Do not just average your semester GPAs: semesters with more credit hours count for more.`,
  },
  {
    question: "Why does each university have its own GPA calculator?",
    answer:
      "Pakistani universities do not share one grade table. An A- can be worth 3.67 grade points at one university and 3.70 at another, so a generic GPA calculator can give you the wrong result. Each university page here uses that university's own grade table.",
  },
  {
    question: "Is this GPA calculator free?",
    answer:
      "Yes. The GPA calculator, CGPA calculator and target GPA calculator are free, need no account and run in your browser. Nothing you enter is saved or shared.",
  },
  {
    question: "Is this calculator official?",
    answer:
      "No. This is an independent student project, not a university service. Grade tables are entered by hand and each university page says whether its table has been verified. Confirm anything important with your own department.",
  },
];

export const howToFaq: GuideFaq[] = [
  {
    question: "How do I calculate GPA from marks or percentage?",
    answer:
      "First convert your marks to a letter grade using your university's marks table, then look up the grade points for that letter. Each university page on this site shows its grade table, with the marks range where one is published. There is no single national conversion.",
  },
  {
    question: "How do I calculate GPA for one course?",
    answer:
      "For a single course your GPA for that course is just the grade points of the grade you received. The credit hours only matter once you combine several courses, because they decide how much each course counts.",
  },
  {
    question: "Is CGPA the average of my semester GPAs?",
    answer:
      "Not exactly. CGPA weights each semester by its credit hours, so a heavy semester counts for more than a light one. A plain average of semester GPAs is only correct when every semester has the same credit hours.",
  },
  {
    question: "Do failed courses count in my GPA?",
    answer:
      "In the standard calculation, yes. An F is worth 0 grade points but its credit hours are still included in the total you divide by, which is why one failed course pulls the average down. Rules for repeating a course vary by university, so check your own regulations.",
  },
  {
    question: "What is a good GPA?",
    answer:
      "It depends on your university's scale and rules. Thresholds for probation, honours and scholarships are set by each university, so check your handbook. The target GPA calculator shows what you need next semester to reach a specific CGPA.",
  },
];

export const gpaVsCgpaFaq: GuideFaq[] = [
  {
    question: "What does CGPA stand for?",
    answer:
      "CGPA stands for Cumulative Grade Point Average: your grade point average across all the semesters you have completed so far.",
  },
  {
    question: "Is GPA the same as SGPA?",
    answer:
      "In most cases, yes. Some universities say SGPA (Semester Grade Point Average) for what others simply call GPA: your average for one semester.",
  },
  {
    question: "Which is more important, GPA or CGPA?",
    answer:
      "CGPA is usually what matters for graduation requirements, scholarships and applications, because it reflects your whole degree. GPA matters for each semester's result, dean's list style recognition and probation checks. Your university's regulations decide the exact rules.",
  },
  {
    question: "Can my CGPA go up if my GPA is low one semester?",
    answer:
      "Only if that semester's GPA is higher than your current CGPA. A semester GPA below your CGPA pulls it down, and a semester above it pulls it up. How far it moves depends on the credit hours in that semester compared with your total so far.",
  },
  {
    question: "Can I convert CGPA to percentage?",
    answer:
      "There is no single national formula. Each university publishes its own way to convert grades or CGPA to marks, so use the conversion in your university's regulations or ask your department.",
  },
];
