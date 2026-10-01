import type { Metadata } from "next";

import { WhatsAppContact } from "@/components/feedback/WhatsAppContact";
import { PageHero } from "@/components/layout/PageHero";
import { SocialLinks } from "@/components/layout/SocialLinks";
import { Container } from "@/components/ui/Container";
import { MailIcon } from "@/components/ui/icons";
import { contactContent, footerContent } from "@/data/site-content";
import { routes } from "@/lib/routes";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { siteConfig } from "@/lib/site-config";
import { generalFeedbackMessage } from "@/lib/whatsapp";

/**
 * CONTACT PAGE -> /contact
 *
 * Two direct channels, WhatsApp and email, and no contact form. A form needs
 * an email service, spam handling and an inbox someone watches; a WhatsApp
 * message or a mailto link needs none of that.
 *
 * All wording lives in data/site-content.ts -> contactContent.
 */

export const metadata: Metadata = buildPageMetadata({
  title: contactContent.metaTitle,
  description: contactContent.metaDescription,
  path: routes.contact(),
});

export default function ContactPage() {
  const email = siteConfig.contactEmail.trim();

  return (
    <>
      <PageHero
        title={contactContent.heading}
        description={contactContent.intro}
        breadcrumbs={[
          { label: footerContent.homeLabel, href: routes.home() },
          { label: contactContent.heading, href: routes.contact() },
        ]}
      />

      <Container className="py-10 sm:py-14">
        <div className="grid gap-5 lg:grid-cols-2">
          <WhatsAppContact message={generalFeedbackMessage()} />

          {email && (
            <section
              aria-labelledby="email-contact-heading"
              className="rounded-xl border border-ink-900/10 bg-white p-5 sm:p-6"
            >
              <h2
                id="email-contact-heading"
                className="text-xl font-bold text-ink-900"
              >
                {contactContent.emailHeading}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-ink-700">
                {contactContent.emailBody}
              </p>
              <a
                href={`mailto:${email}?subject=${encodeURIComponent(contactContent.emailSubject)}`}
                className="mt-4 inline-flex items-center gap-2 rounded-lg border border-ink-900/20 bg-white px-5 py-2.5 text-sm font-semibold text-ink-900 transition-colors hover:border-brand-500 hover:bg-brand-50 hover:text-brand-800"
              >
                <MailIcon />
                {email}
              </a>
            </section>
          )}
        </div>

        <div className="mt-10 grid max-w-4xl gap-8 sm:grid-cols-2">
          <section>
            <h2 className="text-xl font-bold text-ink-900">
              {contactContent.reasonsHeading}
            </h2>
            <ul className="mt-3 space-y-2 text-sm leading-relaxed text-ink-700">
              {contactContent.reasons.map((reason) => (
                <li key={reason} className="flex gap-2">
                  <span aria-hidden="true" className="text-brand-600">
                    &bull;
                  </span>
                  <span>{reason}</span>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-ink-900">
              {contactContent.helpfulHeading}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-ink-700">
              {contactContent.helpfulBody}
            </p>
            <p className="mt-4 text-sm text-ink-700">
              {contactContent.responseNote}
            </p>

            <h2 className="mt-8 text-xl font-bold text-ink-900">
              {contactContent.followHeading}
            </h2>
            <SocialLinks className="mt-3" />
          </section>
        </div>
      </Container>
    </>
  );
}
