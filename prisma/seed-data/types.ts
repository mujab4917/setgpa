/**
 * Shared types and grading scales for the seed data.
 *
 * ---------------------------------------------------------------------------
 * ABOUT THE GRADE SCALES
 *
 * Pakistani universities do not share one national grade table. Research into
 * published university rules shows three dominant patterns, plus institution
 * specific variants:
 *
 *   thirds  - 0.33 steps with minus grades (A- 3.67, B+ 3.33). Used by
 *             FAST-NUCES, COMSATS and many private universities.
 *   tenths  - 0.70/0.30 steps with minus grades (A- 3.70, B+ 3.30). Used by
 *             the University of the Punjab and LUMS.
 *   halves  - 0.50 steps, no minus grades (B+ 3.50, D+ 1.50). Used by NUST.
 *   uet     - like halves but the lowest pass is D 1.50, with no D+ and no A+.
 *   simple  - a shorter public-sector table without minus grades.
 *
 * Each university still gets its OWN copy of these rows in the database, so
 * changing one university's table never affects any other.
 *
 * If you have a university's official handbook and its table differs, edit
 * that university's `scale` here - or change the rows directly in Prisma
 * Studio (`npm run db:studio`).
 * ---------------------------------------------------------------------------
 */

export const GRADE_SCALES = {
  /** 0.33 steps with minus grades. FAST-NUCES, COMSATS, many private campuses. */
  thirds: [
    { grade: "A", gradePoint: 4.0 },
    { grade: "A-", gradePoint: 3.67 },
    { grade: "B+", gradePoint: 3.33 },
    { grade: "B", gradePoint: 3.0 },
    { grade: "B-", gradePoint: 2.67 },
    { grade: "C+", gradePoint: 2.33 },
    { grade: "C", gradePoint: 2.0 },
    { grade: "C-", gradePoint: 1.67 },
    { grade: "D+", gradePoint: 1.33 },
    { grade: "D", gradePoint: 1.0 },
    { grade: "F", gradePoint: 0.0 },
  ],

  /** 0.70/0.30 steps with minus grades. University of the Punjab, LUMS. */
  tenths: [
    { grade: "A+", gradePoint: 4.0 },
    { grade: "A", gradePoint: 4.0 },
    { grade: "A-", gradePoint: 3.7 },
    { grade: "B+", gradePoint: 3.3 },
    { grade: "B", gradePoint: 3.0 },
    { grade: "B-", gradePoint: 2.7 },
    { grade: "C+", gradePoint: 2.3 },
    { grade: "C", gradePoint: 2.0 },
    { grade: "C-", gradePoint: 1.7 },
    { grade: "D", gradePoint: 1.0 },
    { grade: "F", gradePoint: 0.0 },
  ],

  /** 0.50 steps, no minus grades. NUST and similar. */
  halves: [
    { grade: "A", gradePoint: 4.0 },
    { grade: "B+", gradePoint: 3.5 },
    { grade: "B", gradePoint: 3.0 },
    { grade: "C+", gradePoint: 2.5 },
    { grade: "C", gradePoint: 2.0 },
    { grade: "D+", gradePoint: 1.5 },
    { grade: "D", gradePoint: 1.0 },
    { grade: "F", gradePoint: 0.0 },
  ],

  /** UET pattern: lowest pass is D 1.50, no D+ and no A+. */
  uet: [
    { grade: "A", gradePoint: 4.0 },
    { grade: "B+", gradePoint: 3.5 },
    { grade: "B", gradePoint: 3.0 },
    { grade: "C+", gradePoint: 2.5 },
    { grade: "C", gradePoint: 2.0 },
    { grade: "D", gradePoint: 1.5 },
    { grade: "F", gradePoint: 0.0 },
  ],

  /** Shorter public-sector table without minus grades. */
  simple: [
    { grade: "A+", gradePoint: 4.0 },
    { grade: "A", gradePoint: 4.0 },
    { grade: "B+", gradePoint: 3.5 },
    { grade: "B", gradePoint: 3.0 },
    { grade: "C+", gradePoint: 2.5 },
    { grade: "C", gradePoint: 2.0 },
    { grade: "D", gradePoint: 1.0 },
    { grade: "F", gradePoint: 0.0 },
  ],
} as const;

export type ScaleName = keyof typeof GRADE_SCALES;

export interface SeedCity {
  name: string;
  slug: string;
  tagline: string;
  description: string;
}

/**
 * One row of a grade table.
 *
 * `minPercentage` / `maxPercentage` are the marks range the grade covers.
 * Only fill them in when the university actually publishes the range - the
 * grade table hides the marks column entirely when they are missing, which is
 * far better than showing an invented range.
 */
export interface SeedGrade {
  grade: string;
  gradePoint: number;
  minPercentage?: number;
  maxPercentage?: number;
}

export interface SeedUniversity {
  citySlug: string;
  name: string;
  shortName: string;
  slug: string;
  campus: string;
  /** Null when the official address has not been confirmed. */
  website: string | null;

  /**
   * The named pattern this university follows, used when `customGrades` is
   * not set. The named scales are shared by many universities, so NEVER edit
   * one to fix a single campus - give that campus `customGrades` instead.
   */
  scale: ScaleName;

  /**
   * This university's own grade table, overriding `scale` completely.
   *
   * Use this whenever you learn a university's real table - it is isolated by
   * design, so correcting one campus can never change another. Highest grade
   * first; sort order follows the array.
   */
  customGrades?: SeedGrade[];

  /**
   * Set true once the grade table has been checked against a source you
   * trust. The university page then shows "Checked against: <sourceNote>"
   * instead of the general note.
   */
  verified?: boolean;
  /** Where the verified table came from. Required when `verified` is true. */
  sourceNote?: string;
  /** Year the institution was founded or granted university status. */
  established: number | null;
  sector: "Public" | "Private";
  /** Broad category: General, Engineering, Medical, Business, Agriculture, IT. */
  type: string;
  /** One line on what the university is known for. */
  notableFor: string;
  /** One or two lines, shown on the city page card. */
  summary: string;
  /** Longer intro, shown at the top of the university page. */
  detail: string;
}
