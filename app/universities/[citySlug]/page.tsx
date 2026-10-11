import { CampusScene } from "@/components/universities/CampusScene";
import { cityPhotos } from "@/data/place-photos";
import { CityArtwork } from "@/components/cities/CityArtwork";
import { CityGradingGuide } from "@/components/cities/CityGradingGuide";
import { OtherCities } from "@/components/cities/OtherCities";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cityFocus } from "@/data/focus-pages";
import { breadcrumbJsonLd } from "@/lib/seo/schema";

import { WhatsAppContact } from "@/components/feedback/WhatsAppContact";
import { JsonLd } from "@/components/seo/JsonLd";
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
import { getActiveCities, getActiveCitySlugs, getCityBySlug } from "@/lib/queries/cities";
import {
  getCityGradingOverview,
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
  const [city, universities, gradingOverview, allCities] = await Promise.all([
    getCityBySlug(citySlug),
    getUniversitiesByCitySlug(citySlug),
    getCityGradingOverview(citySlug),
    getActiveCities(),
  ]);

  // Unknown or inactive city -> show the 404 page.
  if (!city) notFound();

  const focus = cityFocus[city.slug];
  // A priority city lists its featured university first; the rest stay alphabetical.
  if (focus) {
    const featuredFirst = (a: { slug: string }, b: { slug: string }) =>
      Number(b.slug === focus.featuredUniversitySlug) - Number(a.slug === focus.featuredUniversitySlug);
    universities.sort(featuredFirst);
    gradingOverview.sort(featuredFirst);
  }
  const publicCount = gradingOverview.filter((u) => u.sector === "Public").length;
  const privateCount = gradingOverview.filter((u) => u.sector === "Private").length;
  const heading = fillTemplate(cityPageContent.universitiesHeading, {
    city: city.name,
  });

  return (
    <>
      <JsonLd data={breadcrumbJsonLd([
              { name: "Home", path: routes.home() },
              { name: citiesPageContent.heading, path: routes.cities() },
              { name: city.name, path: routes.city(city.slug) },
            ])} />
      <PageHero
        title={heading}
        description={city.tagline ?? `Find your university in ${city.name} and start calculating.`}
        artwork={<CityArtwork slug={city.slug} className="h-full w-full" />}
        breadcrumbs={[
          { label: footerContent.homeLabel, href: routes.home() },
          { label: citiesPageContent.heading, href: routes.cities(), shortLabel: "All cities" },
          { label: city.name, href: routes.city(city.slug) },
        ]}
      >
        {/* At-a-glance counts: what is in this city, before the list. */}
        {universities.length > 0 && (
          <ul className="mt-4 flex flex-wrap gap-2 text-sm font-semibold text-ink-900 sm:mt-6" aria-label={`${city.name} at a glance`}>
            <li className="rounded-full bg-white/85 px-3.5 py-1.5 shadow-sm ring-1 ring-ink-900/10">
              {universities.length} {universities.length === 1 ? "university" : "universities"}
            </li>
            {publicCount > 0 && (
              <li className="rounded-full bg-brand-100 px-3.5 py-1.5 text-brand-900 ring-1 ring-brand-600/15">{publicCount} public</li>
            )}
            {privateCount > 0 && (
              <li className="rounded-full bg-marker-200 px-3.5 py-1.5 ring-1 ring-ink-900/10">{privateCount} private</li>
            )}
          </ul>
        )}

        {/* A search box only earns its space when there is a list worth searching. */}
        {universities.length > 5 && (
          <div className="mt-5 max-w-xl rounded-2xl border border-ink-900/10 bg-white p-3.5 shadow-[var(--shadow-elevation-2)] sm:mt-8 sm:p-5">
            <UniversitySearch universities={universities} context="city" placeholder={`Search universities in ${city.name}`} />
          </div>
        )}
      </PageHero>

      <Container className="py-8 sm:py-12">
        <p className="mb-6 max-w-3xl leading-relaxed text-ink-700 sm:mb-8">
          {focus ? focus.intro : city.description}
          {focus && (
            <>
              {" "}
              <Link
                href={routes.university(city.slug, focus.featuredUniversitySlug)}
                className="font-semibold text-brand-700 underline underline-offset-4 hover:text-brand-900"
              >
                {focus.featuredLabel}
              </Link>
              .
            </>
          )}
        </p>
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

        <CityGradingGuide cityName={city.name} citySlug={city.slug} universities={gradingOverview} />

        <CampusScene key={city.slug} citySlug={city.slug} cityName={city.name} photo={cityPhotos[city.slug]} />
        {/* The focus intro replaced the description at the top, so show it here instead. */}
        {focus && <p className="max-w-3xl text-sm leading-relaxed text-ink-700">{city.description}</p>}

        <OtherCities cities={allCities} currentSlug={city.slug} />
        <WhatsAppContact className="mt-8 sm:mt-10" message={generalFeedbackMessage()} />
      </Container>
    </>
  );
}
