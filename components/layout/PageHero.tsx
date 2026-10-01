import type { ReactNode } from "react";

import { HeroBackdrop } from "@/components/layout/HeroBackdrop";
import { Breadcrumbs, type Crumb } from "@/components/ui/Breadcrumbs";
import { Container } from "@/components/ui/Container";

/**
 * The warm cream banner at the top of a page.
 *
 * One component for every page so the site looks like one product: same
 * gradient, same dotted texture, same spacing. Pages differ only in their words.
 */
export function PageHero({
  eyebrow,
  title,
  description,
  breadcrumbs,
  children,
  compact = false,
  artwork,
}: {
  compact?: boolean;
  artwork?: ReactNode;
  eyebrow?: string;
  title: string;
  description?: string;
  breadcrumbs?: Crumb[];
  /** Anything extra under the text, e.g. a search box or a notice. */
  children?: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden">
      <HeroBackdrop />
      {artwork && <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 right-0 hidden w-2/5 overflow-hidden opacity-40 lg:block" style={{ maskImage: "linear-gradient(to right, transparent, black 35%)" }}>{artwork}</div>}

      <Container className={compact ? "relative z-10 py-5 sm:py-7" : "relative z-10 py-10 sm:py-14"}>
        {breadcrumbs && (
          <div className="[&_a]:text-ink-700/70 [&_a:hover]:text-ink-900 [&_ol]:text-ink-700/50">
            <Breadcrumbs items={breadcrumbs} />
          </div>
        )}

        {eyebrow && (
          <p
            className="mt-5 animate-fade-up text-sm font-semibold text-brand-700"
            style={{ animationDelay: "40ms" }}
          >
            {eyebrow}
          </p>
        )}

        <h1
          className="mt-2 max-w-3xl animate-fade-up text-4xl font-extrabold leading-[1.02] text-ink-900 sm:text-5xl"
          style={{ animationDelay: "80ms" }}
        >
          {title}
        </h1>

        {description && (
          <p
            className="mt-4 max-w-2xl animate-fade-up text-lg leading-relaxed text-ink-700"
            style={{ animationDelay: "140ms" }}
          >
            {description}
          </p>
        )}

        {children}
      </Container>
    </section>
  );
}
