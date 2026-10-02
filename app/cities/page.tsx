import type { Metadata } from "next";

import { CityDirectory } from "@/components/cities/CityDirectory";
import { WhatsAppContact } from "@/components/feedback/WhatsAppContact";
import { JsonLd } from "@/components/seo/JsonLd";
import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/Container";
import { citiesPageContent, footerContent } from "@/data/site-content";
import { getActiveCities } from "@/lib/queries/cities";
import { routes } from "@/lib/routes";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { breadcrumbJsonLd } from "@/lib/seo/schema";
import { generalFeedbackMessage } from "@/lib/whatsapp";

/**
 * ALL CITIES PAGE -> /cities
 *
 * The homepage shows only the largest few cities so it stays short. This page
 * is the full list, with a search box for when the list grows past the point
 * where scanning it is practical. A stats strip, a parallax photo band and a
 * proper closing CTA break up what would otherwise be one long, uniform grid.
 */

export const metadata: Metadata = buildPageMetadata({
  title: citiesPageContent.metaTitle,
  description: citiesPageContent.metaDescription,
  path: routes.cities(),
});

export const revalidate = 3600;

export default async function CitiesPage() {
  const cities = await getActiveCities();
  const totalUniversities = cities.reduce((sum, city) => sum + city.universityCount, 0);

  return (
    <>
      <JsonLd data={breadcrumbJsonLd([
              { name: "Home", path: routes.home() },
              { name: citiesPageContent.heading, path: routes.cities() },
            ])} />
      <PageHero
        compact
        title={citiesPageContent.heading}
        description={citiesPageContent.intro}
        breadcrumbs={[
          { label: footerContent.homeLabel, href: routes.home() },
          { label: citiesPageContent.heading, href: routes.cities() },
        ]}
      >
        {/* A quick sense of scale before the list itself - the same trick a
            lot of directory sites use to make a long page feel worth diving
            into rather than just a wall of cards. */}
        <dl className="mt-6 grid max-w-xl grid-cols-3 gap-4">
          <div>
            <dt className="text-sm font-semibold text-ink-700">Cities</dt>
            <dd className="mt-1 text-2xl font-bold text-ink-900">{cities.length}+</dd>
          </div>
          <div>
            <dt className="text-sm font-semibold text-ink-700">Universities</dt>
            <dd className="mt-1 text-2xl font-bold text-ink-900">{totalUniversities}+</dd>
          </div>
          <div>
            <dt className="text-sm font-semibold text-ink-700">Cost</dt>
            <dd className="mt-1 text-2xl font-bold text-ink-900">Free</dd>
          </div>
        </dl>
      </PageHero>

      <Container className="pb-4 pt-8 sm:pt-10">
        <CityDirectory cities={cities} />
      </Container>

      {/* The payoff for reaching the bottom of the page: a clear, friendly
          place to land if a city or university is still missing. */}
      <Container className="py-14">
        <WhatsAppContact message={generalFeedbackMessage()} />
      </Container>
    </>
  );
}
