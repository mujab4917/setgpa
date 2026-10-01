import Link from "next/link";

import { WhatsAppContact } from "@/components/feedback/WhatsAppContact";
import { Container } from "@/components/ui/Container";
import { UniversitySearch } from "@/components/universities/UniversitySearch";
import { errorContent, whatsappMessages } from "@/data/site-content";
import { getAllUniversitiesForSearch } from "@/lib/queries/universities";
import { routes } from "@/lib/routes";

/**
 * 404 page. Next.js renders this whenever a page calls notFound() - for
 * example when a university slug in the URL is not in the database.
 *
 * Rather than being a dead end, it offers the search box: most people who land
 * here mistyped a URL or followed an old link, and are one search away from the
 * page they actually wanted.
 */
export default async function NotFound() {
  // A 404 should never fail. If the database is unreachable, fall back to a
  // plain page with no search box instead of throwing a second error.
  let universities: Awaited<ReturnType<typeof getAllUniversitiesForSearch>> = [];
  try {
    universities = await getAllUniversitiesForSearch();
  } catch (error) {
    console.error("not-found: could not load universities for search", error);
  }

  return (
    <Container className="py-16">
      <p className="text-sm font-semibold text-brand-700">404</p>
      <h1 className="mt-2 text-3xl font-bold text-ink-900">
        {errorContent.notFoundTitle}
      </h1>
      <p className="mt-3 max-w-xl leading-relaxed text-ink-700">
        {errorContent.notFoundBody}
      </p>

      {universities.length > 0 && (
        <UniversitySearch universities={universities} className="mt-8 max-w-xl" />
      )}

      <Link
        href={routes.home()}
        className="mt-8 inline-flex items-center justify-center rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-700"
      >
        {errorContent.notFoundCtaLabel}
      </Link>

      <WhatsAppContact
        className="mt-10 max-w-xl"
        message={whatsappMessages.missingUniversity}
      />
    </Container>
  );
}
