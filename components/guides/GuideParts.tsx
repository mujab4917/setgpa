import Link from "next/link";
import type { ReactNode } from "react";

import { routes } from "@/lib/routes";

/** A formula in the same dark block used on university pages. */
export function GuideFormula({ children }: { children: ReactNode }) {
  return (
    <p className="mt-4 overflow-x-auto rounded-2xl bg-ink-900 px-5 py-4 font-mono text-sm text-marker-300">
      {children}
    </p>
  );
}

/** One H2 section with an anchor id, so the table of contents can link to it. */
export function GuideSection({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-heading`} className="mt-16 scroll-mt-24">
      <span aria-hidden="true" className="block h-1 w-12 rounded-full bg-terracotta-500" />
      <h2
        id={`${id}-heading`}
        className="mt-4 font-serif text-[1.65rem] font-semibold leading-tight tracking-tight text-ink-900 sm:text-[2.1rem]"
      >
        {title}
      </h2>
      <div className="mt-5 space-y-5 text-[1.075rem] leading-8 text-ink-700 sm:text-[1.125rem]">{children}</div>
    </section>
  );
}

export function GuideToc({ items }: { items: Array<{ id: string; label: string }> }) {
  return (
    <nav aria-label="On this page" className="rounded-2xl border border-ink-900/10 bg-white p-5">
      <p className="font-serif text-lg font-semibold text-ink-900">In this guide</p>
      <ul className="mt-3 flex flex-wrap gap-2">
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className="inline-block rounded-full border border-ink-900/15 px-4 py-2 text-sm font-semibold text-ink-900 transition-colors hover:border-brand-600 hover:bg-brand-50"
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/** Table wrapper with a visible caption for screen readers. */
export function GuideTable({
  caption,
  head,
  children,
}: {
  caption: string;
  head: string[];
  children: ReactNode;
}) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-ink-900/10 bg-white">
      <table className="w-full min-w-[28rem] text-left text-base">
        <caption className="sr-only">{caption}</caption>
        <thead className="bg-brand-800 text-sm text-white">
          <tr>
            {head.map((label, i) => (
              <th key={label} scope="col" className={`px-4 py-3 font-semibold ${i > 0 ? "text-right" : ""}`}>
                {label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-ink-900/8 text-ink-900">{children}</tbody>
      </table>
    </div>
  );
}

/** Closing call to action: take the guide into the real calculators. */
export function GuideCta() {
  return (
    <section
      aria-labelledby="guide-cta-heading"
      className="relative mt-20 overflow-hidden rounded-[2rem] bg-ink-900 p-8 text-white sm:p-12"
    >
      <span aria-hidden="true" className="absolute -right-16 -top-20 h-64 w-64 rounded-full bg-brand-700/60" />
      <span aria-hidden="true" className="absolute -bottom-24 right-24 h-48 w-48 rounded-full bg-terracotta-600/40" />
      <h2 id="guide-cta-heading" className="relative font-serif text-3xl font-semibold sm:text-4xl">
        Calculate it for your own university
      </h2>
      <p className="relative mt-3 max-w-xl text-white/80">
        Every university uses its own grade table. Pick yours and the GPA calculator and CGPA calculator
        use the right grade points.
      </p>
      <div className="relative mt-6 flex flex-wrap gap-3">
        <Link
          href={routes.cities()}
          className="inline-flex rounded-full bg-marker-300 px-6 py-3 text-sm font-bold text-ink-900 transition-colors hover:bg-marker-400"
        >
          Find your university
        </Link>
        <Link
          href={routes.targetPlanner()}
          className="inline-flex rounded-full border border-white/40 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-white/10"
        >
          Open the target GPA calculator
        </Link>
      </div>
    </section>
  );
}

/** An in-text link in the site's link style. */
export function GuideLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link href={href} className="font-semibold text-brand-700 underline underline-offset-4">
      {children}
    </Link>
  );
}

/** A highlighted aside for the one caveat a reader must not miss. */
export function GuideNote({ title, children }: { title: string; children: ReactNode }) {
  return (
    <aside className="rounded-2xl border border-marker-400/70 bg-marker-200 px-5 py-4 text-base leading-relaxed text-ink-900">
      <p className="font-extrabold">{title}</p>
      <div className="mt-1 space-y-2">{children}</div>
    </aside>
  );
}
