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
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6 lg:grid-rows-2">
      <TiltCard maxTilt={3} className="rounded-[1.75rem] sm:col-span-2 lg:col-span-4 lg:row-span-2">
        <div className="flex h-full flex-col justify-between rounded-[1.75rem] border border-ink-900/10 bg-white p-7 sm:p-10">
          <div>
            <h3 className="max-w-md text-3xl font-bold text-ink-900 sm:text-4xl sm:leading-[1.05]">
              The same grade is not worth the same points everywhere.
            </h3>
            <p className="mt-4 max-w-md leading-relaxed text-ink-700">
              An A- can be 3.67 at one campus and higher at another. Each university here keeps
              its own grade table, so your result matches your transcript.
            </p>
          </div>

          <ul className="mt-8 grid grid-cols-3 gap-3" aria-label="Example: one grade, three scales">
            {SAMPLE.map((row) => (
              <li key={row.campus} className="rounded-2xl bg-cream-100 p-4">
                <p className="font-[family-name:var(--font-display)] text-4xl font-extrabold text-ink-900">
                  {row.grade}
                </p>
                <p className="tabular mt-1 text-2xl font-bold text-brand-600">{row.point}</p>
                <p className="mt-1 text-xs text-ink-700">{row.campus}</p>
              </li>
            ))}
          </ul>

          <Link
            href={routes.cities()}
            className="mt-8 inline-flex w-fit items-center rounded-full bg-ink-900 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
          >
            Find your university
          </Link>
        </div>
      </TiltCard>

      <div className="rounded-[1.75rem] bg-brand-600 p-7 text-white lg:col-span-2">
        <p className="tabular font-[family-name:var(--font-display)] text-6xl font-extrabold leading-none">
          {universityCount}
        </p>
        <p className="mt-2 text-white/85">universities, {cityCount} cities</p>
      </div>

      <Link
        href={routes.targetPlanner()}
        className="group flex cursor-pointer flex-col lg:col-span-2 justify-between rounded-[1.75rem] bg-marker-300 p-7 text-ink-900 shadow-sm ring-1 ring-marker-400/60 transition-all duration-200 hover:-translate-y-1 hover:bg-marker-400 hover:shadow-[0_18px_30px_-14px_rgba(31,46,41,0.45)] active:translate-y-0"
      >
        <p className="text-xl font-bold leading-tight">Aiming for a CGPA? See the grades you need.</p>
        <span className="mt-4 inline-flex w-fit items-center gap-2 rounded-full bg-ink-900 px-4 py-2 text-sm font-semibold text-white transition-colors group-hover:bg-brand-700">
          Open target planner
          <span aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-1">&rarr;</span>
        </span>
      </Link>
    </div>
  );
}
