import { Reveal } from "@/components/ui/Reveal";
import type { ExampleCourse } from "@/data/focus-pages";
import { calculateCgpa } from "@/lib/calculators/cgpa";
import { calculateGpa, findGradePoint } from "@/lib/calculators/gpa";
import type { GradingSystem } from "@/lib/calculators/types";
import { formatGpa, formatPoints } from "@/lib/calculators/validation";

/**
 * A fully worked GPA and CGPA example for one university.
 *
 * Every figure is produced by the same functions the calculator uses, from the
 * university's own grade table, so the example always matches the calculator
 * and the table. Server Component.
 */
export function UniversityWorkedExample({
  label,
  gradingSystem,
  courses,
  secondSemester,
}: {
  label: string;
  gradingSystem: GradingSystem;
  courses: ExampleCourse[];
  secondSemester: { gpa: number; creditHours: number };
}) {
  // Only use example grades that exist in this university's table.
  const usable = courses.filter((course) => findGradePoint(course.grade, gradingSystem) !== null);
  const gpaResult = calculateGpa(
    usable.map((course) => ({ creditHours: course.creditHours, grade: course.grade })),
    gradingSystem,
  );
  if (gpaResult.gpa === null || usable.length === 0) return null;

  const firstGpa = Number(formatGpa(gpaResult.gpa));
  const cgpaResult = calculateCgpa(
    [
      { gpa: firstGpa, creditHours: gpaResult.totalCreditHours },
      { gpa: secondSemester.gpa, creditHours: secondSemester.creditHours },
    ],
    gradingSystem,
  );

  return (
    <Reveal as="section" className="mt-9 sm:mt-16">
      <div aria-labelledby="worked-example-heading">
        <h2 id="worked-example-heading" className="text-xl font-extrabold text-ink-900 sm:text-3xl">
          {label} GPA calculation example
        </h2>
        <p className="mt-3 max-w-3xl leading-relaxed text-ink-700">
          Here is one semester worked out by hand with the {label} grade table above. For each course,
          multiply the grade points by the credit hours. Add those up, then divide by the total credit hours.
        </p>

        <div className="mt-5 max-w-3xl overflow-x-auto rounded-2xl border border-ink-900/10 bg-white shadow-sm">
          <table className="w-full min-w-[28rem] text-left text-sm">
            <caption className="sr-only">Worked semester GPA example for {label}</caption>
            <thead className="bg-brand-800 text-white">
              <tr>
                <th scope="col" className="px-3 py-2.5 font-semibold sm:px-4">Course</th>
                <th scope="col" className="px-3 py-2.5 text-right font-semibold sm:px-4">Credit hours</th>
                <th scope="col" className="px-3 py-2.5 text-right font-semibold sm:px-4">Grade</th>
                <th scope="col" className="px-3 py-2.5 text-right font-semibold sm:px-4">Grade points</th>
                <th scope="col" className="px-3 py-2.5 text-right font-semibold sm:px-4">Quality points</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-900/8">
              {usable.map((course, index) => {
                const points = findGradePoint(course.grade, gradingSystem) ?? 0;
                return (
                  <tr key={`${course.grade}-${index}`}>
                    <th scope="row" className="px-3 py-2 font-semibold text-ink-900 sm:px-4">Course {index + 1}</th>
                    <td className="px-3 py-2 text-right tabular-nums text-ink-700 sm:px-4">{formatPoints(course.creditHours)}</td>
                    <td className="px-3 py-2 text-right font-bold text-ink-900 sm:px-4">{course.grade}</td>
                    <td className="px-3 py-2 text-right tabular-nums text-ink-700 sm:px-4">{formatGpa(points)}</td>
                    <td className="px-3 py-2 text-right tabular-nums text-ink-700 sm:px-4">{formatGpa(points * course.creditHours)}</td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot className="bg-cream-100 font-bold text-ink-900">
              <tr>
                <th scope="row" className="px-3 py-2.5 sm:px-4">Total</th>
                <td className="px-3 py-2.5 text-right tabular-nums sm:px-4">{formatPoints(gpaResult.totalCreditHours)}</td>
                <td className="px-3 py-2.5 sm:px-4" />
                <td className="px-3 py-2.5 sm:px-4" />
                <td className="px-3 py-2.5 text-right tabular-nums sm:px-4">{formatGpa(gpaResult.totalQualityPoints)}</td>
              </tr>
            </tfoot>
          </table>
        </div>

        <p className="mt-4 max-w-3xl leading-relaxed text-ink-700">
          Semester GPA = {formatGpa(gpaResult.totalQualityPoints)} ÷ {formatPoints(gpaResult.totalCreditHours)} ={" "}
          <strong className="text-ink-900">{formatGpa(gpaResult.gpa)}</strong>.
        </p>

        {cgpaResult.cgpa !== null && (
          <>
            <h3 className="mt-8 text-lg font-extrabold text-ink-900 sm:text-2xl">From GPA to CGPA</h3>
            <p className="mt-3 max-w-3xl leading-relaxed text-ink-700">
              CGPA weights each semester by its credit hours. If a second semester gives a GPA of{" "}
              {formatGpa(secondSemester.gpa)} over {formatPoints(secondSemester.creditHours)} credit hours, the
              cumulative result is ({formatGpa(firstGpa)} × {formatPoints(gpaResult.totalCreditHours)} +{" "}
              {formatGpa(secondSemester.gpa)} × {formatPoints(secondSemester.creditHours)}) ÷{" "}
              {formatPoints(cgpaResult.totalCreditHours)} ={" "}
              <strong className="text-ink-900">{formatGpa(cgpaResult.cgpa)}</strong>. Use the CGPA tab in the
              calculator at the top of the page to do this with your own semesters.
            </p>
          </>
        )}
      </div>
    </Reveal>
  );
}
