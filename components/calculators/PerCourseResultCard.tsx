/**
 * PER-COURSE RESULT CARD
 *
 * The course-by-course sibling of TargetResultCard - same visual language
 * (headline, scale line, transparent math) but the payload is a table: one
 * row per upcoming course, each showing whether it's locked in or still
 * needs a suggested grade to hit the target.
 */

import { formatPoints } from "@/lib/calculators/validation";
import type { PerCourseTargetResult } from "@/lib/calculators/target";
import { targetPlannerPageContent } from "@/data/site-content";
import { ScaleMarker } from "./TargetResultCard";

interface CourseDisplayRow {
  id: string;
  name: string;
  creditHours: number;
  status: "locked" | "open";
  gradeLetter: string | null;
  gradePoint: number;
}

interface Props {
  current: number;
  completed: number;
  target: number;
  scale: number;
  result: PerCourseTargetResult;
  rows: CourseDisplayRow[];
}

export function PerCourseResultCard({ current, completed, target, scale, result, rows }: Props) {
  const allLocked = result.requiredForOpen === null;
  const headlineValue = allLocked ? result.projectedCgpa : result.requiredForOpen!;
  const requiredForBar = Math.min(headlineValue, scale);

  return (
    <div role="status" className="mt-5 space-y-5 rounded-2xl border border-violet-100 bg-white p-5 sm:p-6">
      {/* ---------- Headline ---------- */}
      {allLocked ? (
        <div>
          <p className="text-sm text-ink-700">Your CGPA with these exact grades</p>
          <p className="mt-1 text-4xl font-bold tabular-nums text-violet-700 sm:text-5xl">
            {result.projectedCgpa.toFixed(2)} <span className="text-base font-normal text-ink-700">/ {scale.toFixed(2)}</span>
          </p>
          <p className="mt-2 text-sm leading-relaxed text-ink-700">
            {result.possible ? (
              <>That clears your {target.toFixed(2)} target.</>
            ) : (
              <>That falls short of your {target.toFixed(2)} target - try a stronger grade in one of the courses above, or add another upcoming course.</>
            )}
          </p>
        </div>
      ) : result.possible ? (
        <div>
          <p className="text-sm text-ink-700">Average needed across your still-open courses</p>
          <p className="mt-1 text-4xl font-bold tabular-nums text-violet-700 sm:text-5xl">
            {result.requiredForOpen!.toFixed(2)} <span className="text-base font-normal text-ink-700">/ {scale.toFixed(2)}</span>
          </p>
          <p className="mt-2 text-sm leading-relaxed text-ink-700">
            That&rsquo;s achievable on your {scale.toFixed(2)} scale - see the suggested grade next to each open course below.
          </p>
        </div>
      ) : (
        <div>
          <p className="text-lg font-semibold text-red-700">This target isn&rsquo;t reachable with these courses.</p>
          <p className="mt-2 text-sm leading-relaxed text-ink-700">
            Your open courses would need a {result.requiredForOpen!.toFixed(2)} GPA, above your {scale.toFixed(2)} scale. Even with a
            perfect grade in every open course, your CGPA would reach{" "}
            <strong className="font-semibold text-ink-900">{result.bestPossible.toFixed(2)}</strong>. Try a lower target, lock in
            fewer courses, or add more upcoming credit hours.
          </p>
        </div>
      )}

      {/* ---------- Visual scale line ---------- */}
      <div>
        <div className="relative h-2 rounded-full bg-cream-200">
          <div
            className={`absolute inset-y-0 left-0 rounded-full ${result.possible ? "bg-violet-400" : "bg-red-300"}`}
            style={{ width: `${Math.min(100, (requiredForBar / scale) * 100)}%` }}
          />
          <ScaleMarker position={current / scale} label="Now" colorClass="bg-slate-500" />
          <ScaleMarker position={target / scale} label="Target" colorClass="bg-brand-600" />
        </div>
        <div className="mt-6 flex justify-between text-xs text-ink-700">
          <span>0.00</span>
          <span>{scale.toFixed(2)} scale</span>
        </div>
      </div>

      {/* ---------- Per-course breakdown ---------- */}
      <div className="overflow-hidden rounded-xl border border-ink-900/10">
        <table className="w-full text-left text-sm">
          <thead className="bg-cream-100 text-xs uppercase tracking-wide text-ink-700">
            <tr>
              <th className="px-3 py-2 font-medium">Course</th>
              <th className="px-3 py-2 font-medium">Credits</th>
              <th className="px-3 py-2 font-medium">Grade needed</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-900/8">
            {rows.map((row) => (
              <tr key={row.id}>
                <td className="px-3 py-2.5 font-medium text-ink-900">{row.name}</td>
                <td className="px-3 py-2.5 tabular-nums text-ink-700">{formatPoints(row.creditHours)}</td>
                <td className="px-3 py-2.5">
                  {row.status === "locked" ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-cream-200 px-2.5 py-1 text-xs font-semibold text-ink-700">
                      {row.gradeLetter ?? formatPoints(row.gradePoint)}
                      <span className="font-normal text-ink-700">{targetPlannerPageContent.perCourse.lockedBadge}</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-violet-50 px-2.5 py-1 text-xs font-semibold text-violet-700">
                      {row.gradeLetter ? row.gradeLetter : formatPoints(row.gradePoint)}
                      <span className="font-normal text-violet-500">{targetPlannerPageContent.perCourse.openBadge}</span>
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ---------- Transparent math ---------- */}
      <details className="rounded-xl border border-ink-900/10 bg-cream-100 p-4 text-sm" open>
        <summary className="cursor-pointer font-medium text-ink-900 marker:content-none">
          <span className="inline-flex items-center gap-1.5">
            Show the exact math
            <span aria-hidden="true">↓</span>
          </span>
        </summary>
        <ol className="mt-3 space-y-2 text-ink-700">
          <li>
            <strong className="font-medium text-ink-900">1. Quality points you already have:</strong>{" "}
            {current.toFixed(2)} current &times; {formatPoints(completed)} completed credits = {(current * completed).toFixed(2)}
          </li>
          <li>
            <strong className="font-medium text-ink-900">2. Quality points your locked-in courses add:</strong>{" "}
            {formatPoints(result.lockedCredits)} locked credits &rarr;{" "}
            {rows
              .filter((row) => row.status === "locked")
              .map((row) => `${row.name} (${formatPoints(row.creditHours)}×${formatPoints(row.gradePoint)})`)
              .join(" + ") || "none yet"}
          </li>
          {allLocked ? (
            <li>
              <strong className="font-medium text-ink-900">3. Combined CGPA:</strong> total quality points &divide; total credits ={" "}
              <strong className="font-semibold text-violet-700">{result.projectedCgpa.toFixed(2)}</strong>
            </li>
          ) : (
            <>
              <li>
                <strong className="font-medium text-ink-900">3. Still-open credits to plan for:</strong>{" "}
                {formatPoints(result.openCredits)} credit hours
              </li>
              <li>
                <strong className="font-medium text-ink-900">4. Average needed across those open credits:</strong>{" "}
                <strong className="font-semibold text-violet-700">{result.requiredForOpen!.toFixed(2)} GPA</strong>
              </li>
            </>
          )}
        </ol>
      </details>

      <p className="text-xs leading-relaxed text-ink-700">
        An estimate using credit-weighted averages. Repeat-course policies and your university&rsquo;s rounding rules may change the
        final result.
      </p>
    </div>
  );
}
