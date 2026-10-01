import type { GradeOption } from "@/lib/calculators/types";
import { formatGpa, formatPercentageRange } from "@/lib/calculators/validation";
import { gradeColor } from "@/components/calculators/calculator-ui";
import { universityPageContent } from "@/data/site-content";

/**
 * The university's grade table, rendered as a real HTML <table>.
 * The rows come from the GradeRule table in the database.
 *
 * The marks column only appears when the university's published ranges are
 * known. Showing an invented range would be worse than showing none.
 */
export function GradeScaleTable({ grades, scale }: { grades: GradeOption[]; scale: number }) {
  if (grades.length === 0) {
    return (
      <p className="rounded-xl border border-ink-900/10 bg-white p-5 text-sm text-ink-700">
        No grade rules have been added for this university yet.
      </p>
    );
  }

  const hasPercentages = grades.some(
    (option) =>
      option.minPercentage !== null &&
      option.minPercentage !== undefined &&
      option.maxPercentage !== null &&
      option.maxPercentage !== undefined,
  );

  return (
    <div className="overflow-hidden rounded-2xl border border-ink-900/10 bg-white shadow-sm">
      <table className="w-full text-left text-sm">
        <caption className="sr-only">
          {universityPageContent.gradingTableCaption}
        </caption>
        <thead className="bg-brand-800 text-sm text-white">
          <tr>
            <th scope="col" className="px-4 py-3 font-semibold">
              {universityPageContent.gradeColumnLabel}
            </th>
            {hasPercentages && (
              <th scope="col" className="px-4 py-3 text-right font-semibold">
                {universityPageContent.marksColumnLabel}
              </th>
            )}
            <th scope="col" className="px-4 py-3 text-right font-semibold">
              {universityPageContent.gradePointColumnLabel}
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-ink-900/8">
          {grades.map((option) => {
            const range = formatPercentageRange(
              option.minPercentage ?? null,
              option.maxPercentage ?? null,
            );

            return (
              <tr key={option.grade} className="transition-colors hover:bg-cream-100">
                <th scope="row" className="px-4 py-2.5 font-semibold text-ink-900">
                  <span className="inline-flex min-h-9 min-w-11 items-center justify-center rounded-lg px-2 font-bold text-ink-900" style={{ backgroundColor: `${gradeColor(option.gradePoint, scale)}33`, boxShadow: `inset 0 0 0 1.5px ${gradeColor(option.gradePoint, scale)}` }}>{option.grade}</span>
                </th>
                {hasPercentages && (
                  <td className="px-4 py-2.5 text-right tabular-nums text-ink-700">
                    {range ?? "—"}
                  </td>
                )}
                <td className="px-4 py-2.5 text-right tabular-nums text-ink-700">
                  <span className="font-bold text-ink-900">{formatGpa(option.gradePoint)}</span>
                  <div aria-hidden="true" className="ml-auto mt-1.5 h-1.5 w-20 overflow-hidden rounded-full bg-cream-200 sm:w-32"><div className="h-full rounded-full" style={{ backgroundColor: gradeColor(option.gradePoint, scale), width: `${Math.max(0, Math.min(100, option.gradePoint / scale * 100))}%` }} /></div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
