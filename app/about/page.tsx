import type { Metadata } from "next";

import { WhatsAppContact } from "@/components/feedback/WhatsAppContact";
import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/Container";
import { aboutContent, footerContent } from "@/data/site-content";
import { routes } from "@/lib/routes";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { generalFeedbackMessage } from "@/lib/whatsapp";

/**
 * ABOUT PAGE -> /about
 *
 * A trust page. Students arriving from a search engine have no idea who wrote
 * these grade tables, and search engines reward sites that say plainly who is
 * behind the content and how it is produced.
 *
 * All wording lives in data/site-content.ts -> aboutContent.
 */

export const metadata: Metadata = buildPageMetadata({
  title: aboutContent.metaTitle,
  description: aboutContent.metaDescription,
  path: "/about",
});

export default function AboutPage() {
  return (
    <>
      <PageHero
        title={aboutContent.heading}
        description={aboutContent.intro}
        breadcrumbs={[
          { label: footerContent.homeLabel, href: routes.home() },
          { label: aboutContent.heading, href: routes.about() },
        ]}
      />

      <Container className="py-10 sm:py-14">
        <div className="max-w-3xl space-y-8">
        {aboutContent.sections.map((section) => (
          <section key={section.heading}>
            <h2 className="text-2xl font-bold text-ink-900">
              {section.heading}
            </h2>
            <p className="mt-2 leading-relaxed text-ink-700">{section.body}</p>
          </section>
        ))}
      </div>

        <WhatsAppContact
          className="mt-12 max-w-3xl"
          message={generalFeedbackMessage()}
        />
      </Container>
    </>
  );
}
