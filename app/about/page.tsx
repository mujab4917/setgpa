import type { Metadata } from "next";

import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/Container";
import { MailIcon, WhatsAppIcon } from "@/components/ui/icons";
import { aboutContent, footerContent } from "@/data/site-content";
import { getActiveCities } from "@/lib/queries/cities";
import { getAllUniversitiesForSearch } from "@/lib/queries/universities";
import { routes } from "@/lib/routes";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { siteConfig } from "@/lib/site-config";
import { buildWhatsAppLink, generalFeedbackMessage } from "@/lib/whatsapp";

/**
 * ABOUT PAGE -> /about
 *
 * A trust page. Students arriving from a search engine have no idea who wrote
 * these grade tables, and search engines reward sites that say plainly who is
 * behind the content and how it is produced.
 *
 * The counts are read from the database, so they never go out of date. The
 * "verified" count is shown on purpose: being open about how many tables have
 * been checked is exactly what makes the rest of the page believable.
 *
 * All wording lives in data/site-content.ts -> aboutContent.
 */

export const metadata: Metadata = buildPageMetadata({
  title: aboutContent.metaTitle,
  description: aboutContent.metaDescription,
  path: "/about",
});

export const revalidate = 3600;

export default async function AboutPage() {
  const [cities, universities] = await Promise.all([getActiveCities(), getAllUniversitiesForSearch()]);
  const verified = universities.filter((university) => university.isVerified).length;

  const [whatItDoes, whereData, whatItIsNot, howToHelp] = aboutContent.sections;
  const email = siteConfig.contactEmail.trim();
  const whatsappHref = buildWhatsAppLink(generalFeedbackMessage());

  const stats = [
    { value: String(cities.length), label: "cities" },
    { value: String(universities.length), label: "universities" },
    { value: String(verified), label: "grade tables verified so far" },
    { value: "Free", label: "no account needed" },
  ];

  return (
    <>
      <PageHero
        compact
        title={aboutContent.heading}
        description={aboutContent.intro}
        breadcrumbs={[
          { label: footerContent.homeLabel, href: routes.home() },
          { label: aboutContent.heading, href: routes.about() },
        ]}
      />

      <Container className="py-7 sm:py-10">
        {/* ---------- At a glance ---------- */}
        <ul className="grid grid-cols-2 gap-2.5 sm:grid-cols-4 sm:gap-4" aria-label="SetGPA at a glance">
          {stats.map((stat) => (
            <li key={stat.label} className="rounded-2xl border border-ink-900/10 bg-white p-3.5 sm:p-5">
              <p className="tabular font-[family-name:var(--font-display)] text-3xl font-extrabold leading-none text-ink-900 sm:text-4xl">
                {stat.value}
              </p>
              <p className="mt-1.5 text-xs leading-snug text-ink-700 sm:text-sm">{stat.label}</p>
            </li>
          ))}
        </ul>

        {/* ---------- What the site does + principles ---------- */}
        <section className="mt-8 grid gap-5 sm:mt-12 lg:grid-cols-2 lg:gap-12">
          <div>
            <h2 className="text-xl font-extrabold text-ink-900 sm:text-3xl">{whatItDoes.heading}</h2>
            <p className="mt-2.5 text-sm leading-relaxed text-ink-700 sm:mt-3 sm:text-lg">{whatItDoes.body}</p>
          </div>

          <div>
            <h2 className="text-lg font-extrabold text-ink-900 sm:text-xl">{aboutContent.principlesHeading}</h2>
            <ul className="mt-3 space-y-2.5">
              {aboutContent.principles.map((principle) => (
                <li
                  key={principle.title}
                  className="flex gap-3 rounded-2xl border border-ink-900/10 bg-white p-3.5 sm:p-4"
                >
                  <span
                    aria-hidden="true"
                    className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-600 text-xs font-bold text-white"
                  >
                    &#10003;
                  </span>
                  <span>
                    <span className="block text-sm font-bold text-ink-900 sm:text-base">{principle.title}</span>
                    <span className="block text-sm text-ink-700">{principle.body}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ---------- Where the data comes from: a real sequence ---------- */}
        <section aria-labelledby="data-heading" className="mt-8 sm:mt-14">
          <h2 id="data-heading" className="text-xl font-extrabold text-ink-900 sm:text-3xl">
            {aboutContent.stepsHeading}
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-ink-700 sm:text-base">{whereData.body}</p>

          <ol className="mt-4 grid gap-2.5 sm:mt-6 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
            {aboutContent.steps.map((step, index) => (
              <li
                key={step.title}
                className="flex items-start gap-3.5 rounded-2xl border border-ink-900/10 bg-white p-3.5 sm:block sm:p-5"
              >
                <span
                  aria-hidden="true"
                  className="font-[family-name:var(--font-display)] text-3xl font-extrabold leading-none text-brand-300 sm:text-5xl"
                >
                  {index + 1}
                </span>
                <div>
                  <h3 className="text-base font-bold text-ink-900 sm:mt-3 sm:text-lg">{step.title}</h3>
                  <p className="mt-0.5 text-[13px] leading-snug text-ink-700 sm:mt-1.5 sm:text-sm sm:leading-relaxed">
                    {step.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* ---------- What it is not ---------- */}
        <section
          aria-labelledby="not-heading"
          className="mt-8 rounded-2xl border border-marker-400/60 bg-marker-200 p-4 sm:mt-14 sm:rounded-3xl sm:p-8"
        >
          <h2 id="not-heading" className="text-lg font-extrabold text-ink-900 sm:text-2xl">
            {whatItIsNot.heading}
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-ink-900 sm:text-base">{whatItIsNot.body}</p>
        </section>

        {/* ---------- How you can help ---------- */}
        <section
          aria-labelledby="help-heading"
          className="mt-4 rounded-2xl bg-brand-800 p-5 text-white sm:mt-6 sm:rounded-3xl sm:p-10"
        >
          <h2 id="help-heading" className="text-xl font-extrabold sm:text-3xl">
            {howToHelp.heading}
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/80 sm:mt-3 sm:text-base">{howToHelp.body}</p>
          <div className="mt-4 flex flex-wrap gap-2.5 sm:mt-6 sm:gap-3">
            {whatsappHref && (
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-marker-300 px-5 py-2.5 text-sm font-bold text-ink-900 transition-colors hover:bg-marker-400"
              >
                <WhatsAppIcon />
                Message on WhatsApp
              </a>
            )}
            <a
              href={routes.contact()}
              className="inline-flex items-center gap-2 rounded-full border border-white/40 px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-white/10"
            >
              {email ? <MailIcon /> : null}
              All the ways to contact us
            </a>
          </div>
        </section>
      </Container>
    </>
  );
}
