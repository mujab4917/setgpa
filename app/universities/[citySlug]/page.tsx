import { CampusScene } from "@/components/universities/CampusScene";
import { cityPhotos } from "@/data/place-photos";
import { CityArtwork } from "@/components/cities/CityArtwork";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { breadcrumbJsonLd } from "@/lib/seo/schema";

import { WhatsAppContact } from "@/components/feedback/WhatsAppContact";
import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/Container";
import { UniversityList } from "@/components/universities/UniversityList";
import { UniversitySearch } from "@/components/universities/UniversitySearch";
import {
  citiesPageContent,
  cityPageContent,
  fillTemplate,
  footerContent,
} from "@/data/site-content";
import { getActiveCitySlugs, getCityBySlug } from "@/lib/queries/cities";
import {
  getUniversitiesByCitySlug,
} from "@/lib/queries/universities";
import { routes } from "@/lib/routes";
import { buildCityMetadata } from "@/lib/seo/metadata";
import { generalFeedbackMessage } from "@/lib/whatsapp";

/**
 * CITY PAGE  ->  /universities/lahore
 *
 * `[citySlug]` is a dynamic route segment: whatever is in the URL arrives as
 * params.citySlug and is looked up in the database.
 */

interface CityPageProps {
  // In Next.js 15 route params arrive as a Promise and must be awaited.
  params: Promise<{ citySlug: string }>;
}

export const revalidate = 3600;

/**
 * Only the cities listed by generateStaticParams exist. See the longer note in
 * the university page: without this, an unknown city URL is served from cache
 * with a 200 status instead of a real 404.
 */
export const dynamicParams = false;

/** Pre-renders a page for every active city at build time. */
export async function generateStaticParams() {
  const slugs = await getActiveCitySlugs();
  return slugs.map((citySlug) => ({ citySlug }));
}

/** Per-page SEO, built from the City row in the database. */
export async function generateMetadata({
  params,
}: CityPageProps): Promise<Metadata> {
  const { citySlug } = await params;
  const [city, universities] = await Promise.all([
    getCityBySlug(citySlug),
    getUniversitiesByCitySlug(citySlug),
  ]);

  if (!city) {
    return { title: "City not found", robots: { index: false, follow: false } };
  }
  return buildCityMetadata(
    city,
    universities.map((university) => university.shortName ?? university.name),
  );
}

export default async function CityPage({ params }: CityPageProps) {
  const { citySlug } = await params;

  // Load the city and its universities together.
  const [city, universities] = await Promise.all([
    getCityBySlug(citySlug),
    getUniversitiesByCitySlug(citySlug),
  ]);

  // Unknown or inactive city -> show the 404 page.
  if (!city) notFound();

  const heading = fillTemplate(cityPageContent.universitiesHeading, {
    city: city.name,
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: "Home", path: routes.home() },
              { name: citiesPageContent.heading, path: routes.cities() },
              { name: city.name, path: routes.city(city.slug) },
            ]),
          ),
        }}
      />
      <PageHero
        title={heading}
        description={city.tagline ?? `Find your university in ${city.name} and start calculating.`}
        artwork={<CityArtwork slug={city.slug} className="h-full w-full" />}
        breadcrumbs={[
          { label: footerContent.homeLabel, href: routes.home() },
          { label: citiesPageContent.heading, href: routes.cities() },
          { label: city.name, href: routes.city(city.slug) },
        ]}
      >
        <div className="mt-8 max-w-xl rounded-2xl border border-ink-900/10 bg-white p-4 shadow-[var(--shadow-elevation-2)] sm:p-5">
          <UniversitySearch universities={universities} placeholder={`Search universities in ${city.name}`} />
        </div>
      </PageHero>

      <Container className="py-10 sm:py-12">
        <section aria-labelledby="university-list-heading">
        <h2 id="university-list-heading" className="sr-only">
          {heading}
        </h2>

        {universities.length === 0 ? (
          <p className="rounded-xl border border-ink-900/10 bg-white p-5 text-sm text-ink-700">
            {cityPageContent.universitiesEmptyMessage}
          </p>
        ) : (
          <UniversityList universities={universities} />
        )}
      </section>

        <CampusScene key={city.slug} citySlug={city.slug} cityName={city.name} photo={cityPhotos[city.slug]} />
        <p className="max-w-3xl text-sm leading-relaxed text-ink-700">{city.description}</p>
        <WhatsAppContact className="mt-10" message={generalFeedbackMessage()} />
      </Container>
    </>
  );
}
