import type { Metadata } from "next";
import Link from "next/link";

import { FeaturedCitiesGrid } from "@/components/cities/FeaturedCitiesGrid";
import { WhatsAppContact } from "@/components/feedback/WhatsAppContact";
import { BentoFeatures } from "@/components/homepage/BentoFeatures";
import { HeroFloaters } from "@/components/homepage/HeroFloaters";
import { HeroGradebook } from "@/components/homepage/HeroGradebook";
import { UniversityTicker } from "@/components/homepage/UniversityTicker";
import { HeroBackdrop } from "@/components/layout/HeroBackdrop";
import { ParallaxBand } from "@/components/layout/ParallaxBand";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { UniversitySearch } from "@/components/universities/UniversitySearch";
import { UniversityShowcase } from "@/components/universities/UniversityShowcase";
import { UniversityFaq } from "@/components/universities/UniversityFaq";
import { homeFaq } from "@/data/guides";
import { homeContent, targetPlannerPageContent, universityPageContent } from "@/data/site-content";
import { siteConfig } from "@/lib/site-config";
import { organizationJsonLd, webApplicationJsonLd, websiteJsonLd } from "@/lib/seo/schema";
import { cityPhotos, pickUniversitiesWithPhotos } from "@/data/place-photos";
import { getActiveCities } from "@/lib/queries/cities";
import { getAllUniversitiesForSearch } from "@/lib/queries/universities";
import { routes } from "@/lib/routes";
import { buildHomeMetadata } from "@/lib/seo/metadata";
import { generalFeedbackMessage } from "@/lib/whatsapp";

/**
 * HOMEPAGE - a Server Component.
 *
 * It runs on the server, reads the cities straight from PostgreSQL through
 * Prisma, and sends finished HTML to the browser. No API call is needed.
 */

export const metadata: Metadata = buildHomeMetadata();

// Rebuild this page at most once an hour; city data changes rarely.
export const revalidate = 3600;

// How many cities the homepage is willing to reveal via "show more" before it
// hands off to the full /cities page. Kept well short of the full list so the
// homepage never turns into a second copy of that page.
const CITY_POOL_SIZE = 9;

export default async function HomePage() {
  const [cities, universities] = await Promise.all([
    getActiveCities(),
    getAllUniversitiesForSearch(),
  ]);

  const cityPool = cities.slice(0, CITY_POOL_SIZE);

  // Universities that have a real, licensed campus photo become the showcase
  // carousel below. Anything without one simply never appears there - no
  // stock photo is ever invented for a campus that doesn't have a curated shot.
  const showcaseUniversities = pickUniversitiesWithPhotos(universities).map(
    (university) => ({
      key: university.id,
      name: university.shortName ?? university.name,
      cityName: university.cityName,
      photo: university.photo,
    }),
  );

  const tickerNames = universities.map((u) => u.shortName ?? u.name);

  // Quick links under the search box: famous PUBLIC (government) universities,
  // shown only when they exist in the database. The label is what the chip says.
  const popularPublic = (
    [
      ["lahore/punjab-university", "Punjab University"],
      ["karachi/ned-university", "NED University"],
      ["islamabad/nust", "NUST"],
      ["lahore/uet-lahore", "UET Lahore"],
      ["islamabad/quaid-i-azam-university", "Quaid-i-Azam University"],
      ["karachi/university-of-karachi", "University of Karachi"],
      ["lahore/gcu-lahore", "GCU Lahore"],
      ["peshawar/university-of-peshawar", "University of Peshawar"],
      ["faisalabad/university-of-agriculture-faisalabad", "UAF"],
    ] as const
  ).flatMap(([key, label]) => {
    const university = universities.find((u) => `${u.citySlug}/${u.slug}` === key);
    return university ? [{ university, label }] : [];
  });

  const structuredData = [
    organizationJsonLd(),
    websiteJsonLd(),
    webApplicationJsonLd({
      name: `${siteConfig.name}: GPA & CGPA Calculator for Pakistan`,
      path: routes.home(),
      description: siteConfig.defaultMetaDescription,
    }),
  ];

  return (
    <>
      {structuredData.map((data) => (
        <script
          key={data["@type"]}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
        />
      ))}

      {/* ---------- Hero ---------- */}
      <section className="relative overflow-hidden">
        <HeroBackdrop />
        <HeroFloaters />
        <Container className="relative z-10 pb-8 pt-7 text-center sm:pb-24 sm:pt-20 lg:pt-24">
          <h1 className="mx-auto max-w-4xl animate-fade-up text-[2rem] font-extrabold leading-[1.06] text-ink-900 sm:text-6xl sm:leading-[0.98] lg:text-7xl">
            {homeContent.heroHeading}
          </h1>
          <p
            className="mx-auto mt-3 max-w-2xl animate-fade-up text-[15px] leading-relaxed text-ink-700 sm:mt-6 sm:text-xl"
            style={{ animationDelay: "90ms" }}
          >
            {homeContent.heroSubheading}
          </p>

          <div className="mx-auto mt-5 max-w-2xl animate-fade-up text-left sm:mt-10" style={{ animationDelay: "170ms" }}>
            <div className="rounded-2xl border border-ink-900/10 bg-white p-3 shadow-[var(--shadow-elevation-3)] sm:rounded-3xl sm:p-5">
              <UniversitySearch universities={universities} />
            </div>
          </div>

          {popularPublic.length > 0 && (
            <div className="mx-auto mt-4 max-w-2xl animate-fade-up sm:mt-6" style={{ animationDelay: "230ms" }}>
              <p className="mb-2 text-left text-xs font-semibold text-ink-700 sm:mb-3 sm:text-center sm:text-sm">
                Popular public universities
              </p>
              <div className="chip-row chip-row--wrap chip-row--center text-left">
                {popularPublic.map(({ university, label }) => (
                  <Link
                    key={university.id}
                    href={routes.university(university.citySlug, university.slug)}
                    className="rounded-full border border-ink-900/15 bg-white/85 px-3.5 py-1.5 text-[13px] font-semibold text-ink-900 transition-all duration-200 hover:-translate-y-0.5 hover:border-brand-600 hover:bg-brand-600 hover:text-white sm:px-4 sm:py-2 sm:text-sm"
                  >
                    {label}
                  </Link>
                ))}
              </div>
            </div>
          )}

          <ul
            className="mx-auto mt-3 grid max-w-3xl animate-fade-up grid-cols-3 gap-2 text-left sm:mt-12 sm:gap-4"
            style={{ animationDelay: "300ms" }}
          >
            {[
              [`${universities.length} universities`, `across ${cities.length} cities`],
              ["Own grade table", "for every university"],
              ["Free forever", "no account needed"],
            ].map(([title, sub]) => (
              <li
                key={title}
                className="flex items-center justify-center gap-3 rounded-xl bg-white/70 px-2 py-2.5 text-center backdrop-blur-sm sm:justify-start sm:rounded-2xl sm:px-4 sm:py-3 sm:text-left"
              >
                <span
                  aria-hidden="true"
                  className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-600 text-sm font-bold text-white sm:flex"
                >
                  &#10003;
                </span>
                <span>
                  <span className="block text-[12px] font-bold leading-tight text-ink-900 sm:text-base">{title}</span>
                  <span className="hidden text-sm text-ink-700 sm:block">{sub}</span>
                </span>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <UniversityTicker names={tickerNames} />

      {/* ---------- Try it ---------- */}
      <section aria-labelledby="try-heading" className="py-9 sm:py-24">
        <Container>
          <div className="grid items-center gap-7 sm:gap-12 lg:grid-cols-[1fr_1.05fr] lg:gap-16">
            <Reveal>
              <h2 id="try-heading" className="text-2xl font-bold text-ink-900 sm:text-5xl sm:leading-[1.05]">
                Try it before you even pick a university.
              </h2>
              <p className="mt-2.5 max-w-lg text-[15px] leading-relaxed text-ink-700 sm:mt-5 sm:text-lg">
                Tap a grade and watch the semester GPA recount. Your own university page works the same way, with
                its real grade table and your own courses.
              </p>
              <Link
                href={routes.cities()}
                className="mt-4 inline-flex items-center rounded-full bg-ink-900 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-700 sm:mt-8 sm:px-7 sm:py-3.5 sm:text-base"
              >
                Find your university
              </Link>
            </Reveal>
            <Reveal delay={120}>
              <HeroGradebook />
            </Reveal>
          </div>
        </Container>
      </section>

      {/* ---------- Why this site ---------- */}
      <section aria-label="Why this site" className="py-3 sm:py-20">
        <Container>
          <Reveal>
            <BentoFeatures cityCount={cities.length} universityCount={universities.length} />
          </Reveal>
        </Container>
      </section>

      {/* ---------- How it works (a real sequence) ---------- */}
      <section aria-labelledby="how-heading" className="pb-9 pt-6 sm:pb-24 sm:pt-0">
        <Container>
          <Reveal>
            <h2 id="how-heading" className="max-w-xl text-2xl font-bold text-ink-900 sm:text-4xl">
              From your transcript to your GPA in three steps
            </h2>
          </Reveal>
          <ol className="relative mt-4 grid gap-2.5 sm:mt-10 sm:gap-5 md:grid-cols-3">
            {[
              ["Choose your city", "Start with the city your campus is in. Every city page lists the universities covered."],
              ["Open your university", "Each university has its own grade table, so the same letter grade is scored the way your department scores it."],
              ["Enter your grades", "Add credit hours and grades. Your GPA, CGPA and the grades you need next come straight out."],
            ].map(([title, body], i) => (
              <li
                key={title}
                className="relative flex items-start gap-3.5 rounded-2xl border border-ink-900/10 bg-white p-3.5 md:block md:rounded-3xl md:p-7"
              >
                <span
                  aria-hidden="true"
                  className="font-[family-name:var(--font-display)] text-3xl font-extrabold leading-none text-brand-300 md:text-6xl md:text-brand-200"
                >
                  {i + 1}
                </span>
                <div>
                  <h3 className="text-base font-bold text-ink-900 md:mt-4 md:text-xl">{title}</h3>
                  <p className="mt-0.5 text-[13px] leading-snug text-ink-700 md:mt-2 md:text-base md:leading-relaxed">{body}</p>
                </div>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      {/* ---------- Cities ---------- */}
      <section id="cities" aria-labelledby="cities-heading" className="scroll-mt-4 bg-white">
        <Container className="py-9 sm:py-20">
          <Reveal>
            <h2 id="cities-heading" className="text-2xl font-bold text-ink-900 sm:text-4xl">
              {homeContent.citiesHeading}
            </h2>
            <p className="mt-1.5 max-w-xl text-sm text-ink-700 sm:mt-2 sm:text-base">{homeContent.citiesSubheading}</p>
          </Reveal>

          {cities.length === 0 ? (
            <p className="mt-6 rounded-xl border border-ink-900/10 bg-white p-5 text-sm text-ink-700">
              {homeContent.citiesEmptyMessage}
            </p>
          ) : (
            <div className="mt-5 sm:mt-8">
              <FeaturedCitiesGrid cities={cityPool} totalCityCount={cities.length} />
            </div>
          )}
        </Container>
      </section>

      {/* ---------- Featured universities: real campus photography ---------- */}
      {showcaseUniversities.length > 0 && (
        <section
          aria-labelledby="universities-heading"
          className="overflow-x-hidden py-9 sm:py-24"
        >
          <Container>
            <Reveal>
              <h2
                id="universities-heading"
                className="max-w-2xl text-2xl font-bold text-ink-900 sm:text-4xl"
              >
                Real campuses, real photographs
              </h2>
              <p className="mt-1.5 max-w-xl text-sm text-ink-700 sm:mt-2 sm:text-base">
                Drag, swipe or use the arrows to look around.
              </p>
            </Reveal>

            <div className="mt-5 sm:mt-10">
              <UniversityShowcase items={showcaseUniversities} />
            </div>
          </Container>
        </section>
      )}

      {/* ---------- Parallax divider ---------- */}
      <ParallaxBand
        photo={cityPhotos.lahore}
        eyebrow="Wherever you study"
        heading="One calculator per university. One grade table per rulebook."
      />

      {/* ---------- Target GPA calculator promo ---------- */}
      <section aria-labelledby="target-planner-heading" className="py-9 sm:py-24">
        <Container>
          <Reveal>
            <div className="relative overflow-hidden rounded-3xl bg-brand-800 p-5 text-white sm:rounded-[2rem] sm:p-14">
              <div
                aria-hidden="true"
                className="absolute inset-0 opacity-30"
                style={{
                  backgroundImage:
                    "linear-gradient(rgba(255,255,255,.12) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.12) 1px, transparent 1px)",
                  backgroundSize: "32px 32px",
                  maskImage: "radial-gradient(ellipse at 100% 0%, black, transparent 65%)",
                }}
              />
              <div className="relative max-w-2xl">
                <h2
                  id="target-planner-heading"
                  className="text-xl font-bold sm:text-5xl sm:leading-[1.05]"
                >
                  Already know your CGPA? Find out what comes next.
                </h2>
                <p className="mt-2.5 max-w-xl text-sm leading-relaxed text-white/75 sm:mt-5 sm:text-lg">
                  {targetPlannerPageContent.intro}
                </p>
                <MagneticButton className="mt-4 sm:mt-8">
                  <Link
                    href={routes.targetPlanner()}
                    className="inline-flex items-center justify-center rounded-full bg-marker-300 px-5 py-2.5 hover:bg-marker-400 text-sm font-bold sm:px-7 sm:py-3.5 sm:text-base text-ink-900 shadow-[0_8px_18px_-8px_rgba(31,46,41,0.4)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_22px_-8px_rgba(31,46,41,0.45)]"
                  >
                    Open the target GPA calculator
                  </Link>
                </MagneticButton>
              </div>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* ---------- GPA basics (keyword content + internal links) ---------- */}
      <section aria-labelledby="basics-heading" className="bg-white py-9 sm:py-24">
        <Container>
          <Reveal>
            <h2 id="basics-heading" className="max-w-2xl text-2xl font-bold text-ink-900 sm:text-4xl">
              GPA calculator basics: how GPA and CGPA work
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-700 sm:mt-3 sm:text-lg">
              A quick answer before you calculate. Your university&rsquo;s own page does the arithmetic with its
              real grade table.
            </p>
          </Reveal>

          <div className="mt-5 grid gap-3 sm:mt-10 sm:gap-5 lg:grid-cols-2">
            <article className="rounded-2xl border border-ink-900/10 bg-cream-50 p-4 sm:rounded-3xl sm:p-8">
              <h3 className="text-lg font-bold text-ink-900 sm:text-2xl">How to calculate GPA</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-700 sm:mt-3 sm:text-base">
                Multiply each course&rsquo;s credit hours by its grade points, add the results, then divide by the
                total credit hours.
              </p>
              <p className="mt-3 overflow-x-auto rounded-xl bg-ink-900 px-4 py-3 font-mono text-xs text-marker-300 sm:mt-4 sm:rounded-2xl sm:px-5 sm:py-4 sm:text-sm">
                {universityPageContent.gpaFormula}
              </p>
              <Link
                href={routes.howToCalculateGpa()}
                className="mt-3 inline-flex text-sm font-semibold text-brand-700 underline underline-offset-4 hover:text-brand-900 sm:mt-5 sm:text-base"
              >
                Read the step-by-step GPA and CGPA guide
              </Link>
            </article>

            <article className="rounded-2xl border border-ink-900/10 bg-cream-50 p-4 sm:rounded-3xl sm:p-8">
              <h3 className="text-lg font-bold text-ink-900 sm:text-2xl">GPA vs CGPA</h3>
              <dl className="mt-2 space-y-2 text-sm leading-relaxed text-ink-700 sm:mt-3 sm:space-y-3 sm:text-base">
                <div>
                  <dt className="inline font-bold text-ink-900">GPA</dt>
                  <dd className="inline"> is your average for one semester.</dd>
                </div>
                <div>
                  <dt className="inline font-bold text-ink-900">CGPA</dt>
                  <dd className="inline"> is your cumulative average across all completed semesters, weighted by credit hours.</dd>
                </div>
              </dl>
              <Link
                href={routes.gpaVsCgpa()}
                className="mt-3 inline-flex text-sm font-semibold text-brand-700 underline underline-offset-4 hover:text-brand-900 sm:mt-5 sm:text-base"
              >
                See the full GPA vs CGPA comparison
              </Link>
            </article>
          </div>

          <UniversityFaq items={homeFaq} />
        </Container>
      </section>

      {/* ---------- WhatsApp feedback ---------- */}
      <Container className="py-9 sm:py-24">
        <WhatsAppContact message={generalFeedbackMessage()} />
      </Container>
    </>
  );
}
