/**
 * TARGET GPA TEASER
 *
 * Not a calculator - a link. Every university page used to embed the full
 * target planner form here; now that planner lives on its own page
 * (/target-gpa-calculator), and this card's only job is to earn one click
 * that gets there with this university already selected, via
 * routes.targetPlannerFor(). Server-rendered: no client state, no form.
 */

import Link from "next/link";

import { targetTeaserContent } from "@/data/site-content";
import { routes } from "@/lib/routes";

export function TargetGpaTeaser({
  citySlug,
  universitySlug,
  universityName,
  gpaScale,
}: {
  citySlug: string;
  universitySlug: string;
  universityName: string;
  gpaScale: number;
}) {
  const href = routes.targetPlannerFor({ citySlug, universitySlug });

  return (
    <section
      id="target-planner"
      aria-labelledby="target-planner-heading"
      className="scroll-mt-24 overflow-hidden rounded-[1.75rem] bg-brand-800 text-white"
    >
      <Link href={href} className="group grid gap-6 p-5 sm:grid-cols-[1fr_auto] sm:items-center sm:p-8">
        <div>
          <p className="text-sm font-bold text-marker-300">{targetTeaserContent.eyebrow}</p>
          <h2 id="target-planner-heading" className="mt-2 text-xl font-extrabold text-white sm:text-3xl">
            {targetTeaserContent.heading}
          </h2>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-white/75">
            {targetTeaserContent.body.replace("{university}", universityName)}
          </p>
          <p className="mt-3 text-xs text-white/55">
            {targetTeaserContent.hint} &middot; {gpaScale.toFixed(2)} GPA scale
          </p>
        </div>

        <span className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-marker-300 group-hover:bg-marker-400 px-6 py-3 text-center text-sm font-bold text-ink-900 shadow-[0_8px_18px_-8px_rgba(31,46,41,0.4)] transition-transform duration-200 group-hover:-translate-y-0.5">
          {targetTeaserContent.ctaLabel.replace("{university}", universityName)}
          <span aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-1">
            &rarr;
          </span>
        </span>
      </Link>
    </section>
  );
}
