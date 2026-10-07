/**
 * PRIORITY PAGES
 *
 * Pages we want to rank first get hand-tuned wording here: the exact phrases
 * students type, a worked example, and extra questions. Everything numeric on
 * these pages is still computed from the database grade table, so the text can
 * never disagree with the table above it.
 *
 * Why University of Gujrat first (Semrush, Pakistan, English):
 *   "uog" 33,100 and "university of gujrat" 18,100 are people looking for the
 *   university's own site and portals - we cannot and should not chase those.
 *   The calculator searches are small ("uog gpa" ~30/month, "uog cgpa
 *   calculator" and "uog gpa calculator" too low to be listed) but weakly
 *   served: the results are a Play Store app, a blog post and two generic
 *   calculator sites. One precise, useful page can realistically win them.
 *
 * Keys: universities use "<citySlug>/<universitySlug>", cities use the slug.
 */

export interface ExampleCourse {
  creditHours: number;
  grade: string;
}

export interface UniversityFocus {
  /** The <h1>: includes both "University of Gujrat" and "UOG". */
  h1: string;
  heroDescription: string;
  /** Keyword-first title WITHOUT the brand (the brand is added when it fits). */
  metaTitle: string;
  /** Wordings from longest to shortest; the first that fits is used. */
  metaDescriptions: string[];
  /** A realistic semester for the worked example (grades must exist in the table). */
  exampleCourses: ExampleCourse[];
  /** A second semester for the CGPA example: its GPA and credit hours. */
  secondSemester: { gpa: number; creditHours: number };
}

export const universityFocus: Record<string, UniversityFocus> = {
  "gujrat/university-of-gujrat": {
    h1: "University of Gujrat (UOG) GPA & CGPA Calculator",
    heroDescription:
      "Free UOG GPA calculator and CGPA calculator for University of Gujrat students. Type your marks and the grade fills in.",
    metaTitle: "UOG GPA & CGPA Calculator (University of Gujrat)",
    metaDescriptions: [
      "Free UOG GPA and CGPA calculator for University of Gujrat students. Enter your marks and the grade fills in from the UOG table.",
      "Free UOG GPA and CGPA calculator for University of Gujrat students. Enter marks to get your UOG grade.",
      "Free UOG GPA and CGPA calculator for University of Gujrat students.",
    ],
    exampleCourses: [
      { creditHours: 3, grade: "A" },
      { creditHours: 3, grade: "B+" },
      { creditHours: 3, grade: "B" },
      { creditHours: 2, grade: "B-" },
      { creditHours: 1, grade: "A+" },
    ],
    secondSemester: { gpa: 3.5, creditHours: 15 },
  },
};

export interface CityFocus {
  metaTitle: string;
  metaDescriptions: string[];
  /** Short paragraph shown above the university list. */
  intro: string;
  /** Slug of the university the intro points to. */
  featuredUniversitySlug: string;
  featuredLabel: string;
}

export const cityFocus: Record<string, CityFocus> = {
  gujrat: {
    metaTitle: "GPA Calculator for Gujrat Universities (UOG, UOL)",
    metaDescriptions: [
      "GPA and CGPA calculators for Gujrat universities: University of Gujrat (UOG), UOL Gujrat Campus and Nawaz Sharif Medical College. Each uses its own grade table.",
      "GPA and CGPA calculators for University of Gujrat (UOG), UOL Gujrat Campus and NSMC. Each uses its own grade table.",
      "GPA and CGPA calculators for Gujrat universities, each with its own grade table.",
    ],
    intro:
      "Most students in Gujrat are at the University of Gujrat (UOG), so its calculator comes first below. UOL Gujrat Campus and Nawaz Sharif Medical College have their own pages, because their grade points are not the same as UOG's.",
    featuredUniversitySlug: "university-of-gujrat",
    featuredLabel: "Open the UOG GPA and CGPA calculator",
  },
};
