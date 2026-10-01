/**
 * Shared types for the calculator engine.
 *
 * These types describe DATA, not UI. The same shapes are produced by the
 * database layer (lib/queries/universities.ts) and consumed by the pure
 * functions in gpa.ts / cgpa.ts and by the React components.
 */

/** One row of a university's grade table, e.g. { grade: "A", gradePoint: 4 }. */
export interface GradeOption {
  grade: string;
  gradePoint: number;
  /**
   * Marks range this grade covers, when the university publishes one.
   * Both null when unknown - the grade table then omits the column entirely
   * rather than showing a guess.
   */
  minPercentage?: number | null;
  maxPercentage?: number | null;
}

/**
 * Everything the calculators need to know about a university's grading.
 * This object always comes from the database - never from hard-coded values.
 */
export interface GradingSystem {
  /** Maximum grade point, e.g. 4 for a 4.00 scale. */
  gpaScale: number;
  /** Grade rows, already sorted for display (highest grade first). */
  grades: GradeOption[];
}

/** Status of a single row after validation. */
export type RowStatus = "counted" | "empty" | "invalid";

/** Raw input for one course row, exactly as it arrives from the form. */
export interface CourseInput {
  name?: string;
  creditHours: string | number;
  /** The grade letter, must match one of GradingSystem.grades. */
  grade: string;
}

/** Result of validating and scoring one course row. */
export interface CourseRowResult {
  index: number;
  status: RowStatus;
  /** Only set when status === "counted". */
  creditHours: number | null;
  gradePoint: number | null;
  qualityPoints: number | null;
  /** Human-readable problem, shown next to the row in the UI. */
  error: string | null;
}

/** Result of a semester GPA calculation. */
export interface GpaResult {
  /** null when no valid course row could be used. */
  gpa: number | null;
  totalCreditHours: number;
  totalQualityPoints: number;
  countedCourses: number;
  rows: CourseRowResult[];
  /** Form-level messages (e.g. "Add at least one course"). */
  errors: string[];
}

/** Raw input for one semester row, exactly as it arrives from the form. */
export interface SemesterInput {
  name?: string;
  gpa: string | number;
  creditHours: string | number;
}

/** Result of validating and scoring one semester row. */
export interface SemesterRowResult {
  index: number;
  status: RowStatus;
  gpa: number | null;
  creditHours: number | null;
  qualityPoints: number | null;
  error: string | null;
}

/** Result of a cumulative CGPA calculation. */
export interface CgpaResult {
  /** null when no valid semester row could be used. */
  cgpa: number | null;
  totalCreditHours: number;
  totalQualityPoints: number;
  countedSemesters: number;
  rows: SemesterRowResult[];
  errors: string[];
}
