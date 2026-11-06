import Link from "next/link";

import { GuideCover } from "@/components/guides/GuideCover";
import { getSummary } from "@/data/guide-index";

/** "Keep reading": up to three other guides, as small cards. */
export function RelatedGuides({ hrefs }: { hrefs: string[] }) {
  const items = hrefs.map(getSummary).filter((g): g is NonNullable<typeof g> => Boolean(g));
  if (items.length === 0) return null;
  return (
    <section aria-labelledby="related-heading" className="mt-14">
      <h2 id="related-heading" className="font-serif text-[1.65rem] font-semibold text-ink-900 sm:text-[2.1rem]">
        Keep reading
      </h2>
      <ul className="mt-5 grid gap-4 sm:grid-cols-3">
        {items.map((g) => (
          <li key={g.href}>
            <Link
              href={g.href}
              className="group flex h-full flex-col overflow-hidden rounded-2xl border border-ink-900/10 bg-white transition-colors hover:border-brand-400"
            >
              <GuideCover cover={g.cover} className="h-36" />
              <span className="p-4 font-serif text-lg font-semibold leading-snug text-ink-900 group-hover:text-brand-700">
                {g.title}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
