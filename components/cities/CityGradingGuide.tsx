import Link from "next/link";

import { buildCityOverview, type OverviewUniversity } from "@/lib/cities/grading-overview";
import { routes } from "@/lib/routes";

/**
 * "How grades work at universities in <city>" - the part of a city page that
 * compares the universities' grade tables side by side.
 *
 * Everything is computed from the grade tables (lib/cities/grading-overview.ts),
 * so each city gets text that is about its own universities and stays correct
 * when a table changes. Server Component: no client JavaScript.
 */
export function CityGradingGuide({
  cityName,
  citySlug,
  universities,
}: {
  cityName: string;
  citySlug: string;
  universities: OverviewUniversity[];
}) {
  const overview = buildCityOverview(cityName, universities);
  if (!overview) return null;

  const showTable = overview.rows.length > 1;

  return (
    <section aria-labelledby="city-grading-heading" className="mt-10 sm:mt-16">
      <h2 id="city-grading-heading" className="text-xl font-extrabold text-ink-900 sm:text-3xl">
        How grades work at universities in {cityName}
      </h2>
      <p className="mt-3 max-w-3xl leading-relaxed text-ink-700">{overview.intro}</p>

      {overview.takeaways.length > 0 && (
        <ul className="mt-4 max-w-3xl list-disc space-y-1.5 pl-5 leading-relaxed text-ink-700 marker:text-brand-600">
          {overview.takeaways.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      )}

      {/* Phone: one small card per university instead of a table that scrolls sideways. */}
      {showTable && (
        <ul className="mt-5 space-y-2.5 sm:hidden" aria-label={`Grade points compared across universities in ${cityName}`}>
          {overview.rows.map((row) => (
            <li key={row.slug} className="rounded-2xl border border-ink-900/10 bg-white p-3.5 shadow-sm">
              <Link
                href={routes.university(citySlug, row.slug)}
                className="font-semibold text-brand-700 underline underline-offset-4"
              >
                {row.label}
              </Link>
              <dl className="mt-2.5 grid grid-cols-2 gap-x-3 gap-y-2 text-sm">
                {[
                  ["Top grade", row.topGrade],
                  ["A", row.aPoints === null ? "-" : row.aPoints.toFixed(2)],
                  ["B+", row.bPlusPoints === null ? "-" : row.bPlusPoints.toFixed(2)],
                  ["Lowest pass", row.lowestPass],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-xl bg-cream-100 px-3 py-2">
                    <dt className="text-xs text-ink-700">{label}</dt>
                    <dd className="font-bold tabular-nums text-ink-900">{value}</dd>
                  </div>
                ))}
              </dl>
            </li>
          ))}
        </ul>
      )}

      {showTable && (
        <div className="mt-6 hidden overflow-x-auto rounded-2xl border border-ink-900/10 bg-white shadow-sm sm:block">
          <table className="w-full min-w-[34rem] text-left text-sm">
            <caption className="sr-only">
              Grade points compared across universities in {cityName}
            </caption>
            <thead className="bg-brand-800 text-white">
              <tr>
                <th scope="col" className="px-3 py-2.5 font-semibold sm:px-4">University</th>
                <th scope="col" className="px-3 py-2.5 text-right font-semibold sm:px-4">Top grade</th>
                <th scope="col" className="px-3 py-2.5 text-right font-semibold sm:px-4">A</th>
                <th scope="col" className="px-3 py-2.5 text-right font-semibold sm:px-4">B+</th>
                <th scope="col" className="px-3 py-2.5 text-right font-semibold sm:px-4">Lowest pass</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-900/8">
              {overview.rows.map((row) => (
                <tr key={row.slug} className="transition-colors hover:bg-cream-100">
                  <th scope="row" className="px-3 py-2 font-semibold text-ink-900 sm:px-4">
                    <Link
                      href={routes.university(citySlug, row.slug)}
                      className="text-brand-700 underline underline-offset-4 hover:text-brand-900"
                    >
                      {row.label}
                    </Link>
                  </th>
                  <td className="px-3 py-2 text-right tabular-nums text-ink-700 sm:px-4">{row.topGrade}</td>
                  <td className="px-3 py-2 text-right tabular-nums text-ink-700 sm:px-4">
                    {row.aPoints === null ? "-" : row.aPoints.toFixed(2)}
                  </td>
                  <td className="px-3 py-2 text-right tabular-nums text-ink-700 sm:px-4">
                    {row.bPlusPoints === null ? "-" : row.bPlusPoints.toFixed(2)}
                  </td>
                  <td className="px-3 py-2 text-right tabular-nums text-ink-700 sm:px-4">{row.lowestPass}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <p className="mt-3 max-w-3xl text-sm leading-relaxed text-ink-700">
        These are the grade tables shown on each university&apos;s page. Check yours against your latest result card or your department before relying on it.
      </p>

      <h2 className="mt-10 text-xl font-extrabold text-ink-900 sm:text-3xl">
        GPA questions from {cityName} students
      </h2>
      <div className="mt-5 max-w-3xl divide-y divide-ink-900/8 overflow-hidden rounded-2xl border border-ink-900/10 bg-white">
        {overview.faq.map((item) => (
          <div key={item.question} className="px-4 py-4 sm:px-5">
            <h3 className="text-[15px] font-semibold text-ink-900 sm:text-base">{item.question}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-ink-700 sm:text-base">{item.answer}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
