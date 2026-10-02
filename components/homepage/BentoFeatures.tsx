import Link from "next/link";

import { TiltCard } from "@/components/ui/TiltCard";
import { routes } from "@/lib/routes";

/**
 * The pitch in one grid. The big cell shows the actual problem - the same
 * letter grade is worth different points at different campuses - instead of
 * describing it. Cells are deliberately different sizes and colours so the
 * grid reads as a composition rather than a row of identical cards.
 */
const SAMPLE = [
  { grade: "A-", campus: "Scale A", point: "3.67" },
  { grade: "A-", campus: "Scale B", point: "3.70" },
  { grade: "A-", campus: "Scale C", point: "3.75" },
];

export function BentoFeatures({
  cityCount,
  universityCount,
}: {
  cityCount: number;
  universityCount: number;
}) {
  return (
    <div className="grid grid-cols-2 gap-2.5 sm:gap-4 lg:grid-cols-6 lg:grid-rows-2">
      <TiltCard maxTilt={3} className="col-span-2 rounded-2xl sm:rounded-[1.75rem] lg:col-span-4 lg:row-span-2">
        <div className="flex h-full flex-col justify-between rounded-2xl border border-ink-900/10 bg-white p-4 sm:rounded-[1.75rem] sm:p-10">
          <div>
            <h3 className="max-w-md text-xl font-bold text-ink-900 sm:text-4xl sm:leading-[1.05]">
              The same grade is not worth the same points everywhere.
            </h3>
            <p className="mt-2 max-w-md text-sm leading-relaxed text-ink-700 sm:mt-4 sm:text-base">
              An A- can be 3.67 at one campus and higher at another. Each university here keeps
              its own grade table, so your result matches your transcript.
            </p>
          </div>

          <ul className="mt-4 grid grid-cols-3 gap-2 sm:mt-8 sm:gap-3" aria-label="Example: one grade, three scales">
            {SAMPLE.map((row) => (
              <li key={row.campus} className="rounded-xl bg-cream-100 p-2.5 sm:rounded-2xl sm:p-4">
                <p className="font-[family-name:var(--font-display)] text-2xl font-extrabold text-ink-900 sm:text-4xl">
                  {row.grade}
                </p>
                <p className="tabular mt-0.5 text-lg font-bold text-brand-600 sm:mt-1 sm:text-2xl">{row.point}</p>
                <p className="mt-1 text-xs text-ink-700">{row.campus}</p>
              </li>
            ))}
          </ul>

          <Link
            href={routes.cities()}
            className="mt-4 inline-flex w-fit items-center rounded-full bg-ink-900 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-700 sm:mt-8 sm:px-6 sm:py-3"
          >
            Find your university
          </Link>
        </div>
      </TiltCard>

      <div className="rounded-2xl bg-brand-600 p-4 text-white sm:rounded-[1.75rem] sm:p-7 lg:col-span-2">
        <p className="tabular font-[family-name:var(--font-display)] text-4xl font-extrabold leading-none sm:text-6xl">
          {universityCount}
        </p>
        <p className="mt-1.5 text-xs text-white/85 sm:mt-2 sm:text-base">universities, {cityCount} cities</p>
      </div>

      <Link
        href={routes.targetPlanner()}
        className="group flex cursor-pointer flex-col lg:col-span-2 justify-between rounded-2xl bg-marker-300 p-4 sm:rounded-[1.75rem] sm:p-7 text-ink-900 shadow-sm ring-1 ring-marker-400/60 transition-all duration-200 hover:-translate-y-1 hover:bg-marker-400 hover:shadow-[0_18px_30px_-14px_rgba(31,46,41,0.45)] active:translate-y-0"
      >
        <p className="text-sm font-bold leading-tight sm:text-xl">Aiming for a CGPA? See the grades you need.</p>
        <span className="mt-3 inline-flex w-fit items-center gap-1.5 rounded-full bg-ink-900 px-3 py-1.5 text-xs font-semibold text-white transition-colors group-hover:bg-brand-700 sm:mt-4 sm:gap-2 sm:px-4 sm:py-2 sm:text-sm">
          Open target planner
          <span aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-1">&rarr;</span>
        </span>
      </Link>
    </div>
  );
}
