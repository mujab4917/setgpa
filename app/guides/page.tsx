import type { Metadata } from "next";
import Link from "next/link";

import { PageHero } from "@/components/layout/PageHero";
import { JsonLd } from "@/components/seo/JsonLd";
import { Container } from "@/components/ui/Container";
import { guides } from "@/data/guides";
import { routes } from "@/lib/routes";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { breadcrumbJsonLd, webPageJsonLd } from "@/lib/seo/schema";

/**
 * GUIDES HUB -> /guides
 *
 * The home of every guide. Each guide lives at /guides/<name>, is listed here
 * and in the footer, and is included in the sitemap. The list itself is in
 * data/guides.ts (`guides`), so adding a guide there adds it to this page.
 */

const TITLE = "GPA and CGPA Guides for Pakistani Students";
const DESCRIPTION =
  "Plain-language guides to calculating GPA and CGPA, the difference between them and planning your grades, with worked examples.";

export const metadata: Metadata = buildPageMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: routes.guides(),
});

export default function GuidesPage() {
  return (
    <>
      <JsonLd
        data={webPageJsonLd({
          type: "CollectionPage",
          name: "GPA and CGPA guides",
          description: DESCRIPTION,
          path: routes.guides(),
        })}
      />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: routes.home() },
          { name: "Guides", path: routes.guides() },
        ])}
      />

      <PageHero
        compact
        title="GPA and CGPA guides"
        description="Short, clear explanations with real numbers, so you can check your own result and understand every step."
        breadcrumbs={[
          { label: "Home", href: routes.home() },
          { label: "Guides", href: routes.guides() },
        ]}
      />

      <Container className="py-7 sm:py-12">
        <ul className="grid gap-3 sm:gap-5 md:grid-cols-2">
          {guides.map((guide) => (
            <li key={guide.href}>
              <article className="flex h-full flex-col rounded-2xl border border-ink-900/10 bg-white p-4 transition-colors hover:border-brand-400 sm:rounded-3xl sm:p-7">
                <h2 className="text-xl font-extrabold text-ink-900 sm:text-2xl">
                  <Link href={guide.href} className="hover:text-brand-700">
                    {guide.title}
                  </Link>
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-ink-700 sm:text-base">{guide.description}</p>

                <ul className="mt-4 space-y-2">
                  {guide.points.map((point) => (
                    <li key={point} className="flex gap-2.5 text-sm text-ink-900 sm:text-base">
                      <span
                        aria-hidden="true"
                        className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-600 text-[11px] font-bold text-white"
                      >
                        &#10003;
                      </span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={guide.href}
                  className="mt-5 inline-flex w-fit rounded-full bg-ink-900 px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-brand-700 sm:mt-6"
                >
                  Read the guide
                </Link>
              </article>
            </li>
          ))}
        </ul>

        {/* ---------- After reading: use the tools ---------- */}
        <section aria-labelledby="tools-heading" className="mt-8 sm:mt-14">
          <h2 id="tools-heading" className="text-xl font-extrabold text-ink-900 sm:text-3xl">
            Ready to calculate?
          </h2>
          <p className="mt-1.5 max-w-2xl text-sm text-ink-700 sm:mt-2 sm:text-base">
            Every university uses its own grade table, so the calculators are built per university.
          </p>
          <div className="mt-4 grid gap-3 sm:mt-6 sm:grid-cols-2 sm:gap-5">
            <Link
              href={routes.cities()}
              className="group rounded-2xl bg-brand-800 p-5 text-white transition-transform duration-200 hover:-translate-y-0.5 sm:rounded-3xl sm:p-7"
            >
              <h3 className="text-lg font-extrabold sm:text-xl">Find your university</h3>
              <p className="mt-1.5 text-sm text-white/80">
                Open the GPA and CGPA calculator that uses your own grade table.
              </p>
              <span className="mt-3 inline-block text-sm font-bold text-marker-300 underline underline-offset-4">
                Browse cities
              </span>
            </Link>
            <Link
              href={routes.targetPlanner()}
              className="group rounded-2xl border border-marker-400/60 bg-marker-200 p-5 text-ink-900 transition-transform duration-200 hover:-translate-y-0.5 sm:rounded-3xl sm:p-7"
            >
              <h3 className="text-lg font-extrabold sm:text-xl">Plan your target CGPA</h3>
              <p className="mt-1.5 text-sm text-ink-900/80">
                See the GPA you need next semester to reach the CGPA you want.
              </p>
              <span className="mt-3 inline-block text-sm font-bold underline underline-offset-4">
                Open the target planner
              </span>
            </Link>
          </div>
        </section>
      </Container>
    </>
  );
}
