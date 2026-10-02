import type { Metadata } from "next";

import { PageHero } from "@/components/layout/PageHero";
import { SocialLinks } from "@/components/layout/SocialLinks";
import { Container } from "@/components/ui/Container";
import { MailIcon, WhatsAppIcon } from "@/components/ui/icons";
import { contactContent, footerContent } from "@/data/site-content";
import { routes } from "@/lib/routes";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { siteConfig } from "@/lib/site-config";
import { buildWhatsAppLink, generalFeedbackMessage } from "@/lib/whatsapp";

/**
 * CONTACT PAGE -> /contact
 *
 * Two direct channels, WhatsApp and email, and no contact form. A form needs
 * an email service, spam handling and an inbox someone watches; a WhatsApp
 * message or a mailto link needs none of that.
 *
 * The three most common reasons to write each get their own card. A card opens
 * WhatsApp with the message already started (or, if WhatsApp is not set up,
 * an email draft), so the sender only fills in the blanks.
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
  const generalHref = buildWhatsAppLink(generalFeedbackMessage());

  const actions = contactContent.quickActions.map((action) => {
    const whatsapp = buildWhatsAppLink(action.message);
    const mail = email
      ? `mailto:${email}?subject=${encodeURIComponent(action.title)}&body=${encodeURIComponent(action.message)}`
      : null;
    return { ...action, href: whatsapp ?? mail, viaWhatsApp: Boolean(whatsapp) };
  });

  return (
    <>
      <PageHero
        compact
        title={contactContent.heading}
        description={contactContent.intro}
        breadcrumbs={[
          { label: footerContent.homeLabel, href: routes.home() },
          { label: contactContent.heading, href: routes.contact() },
        ]}
      />

      <Container className="py-7 sm:py-10">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_21rem] lg:gap-10">
          {/* ---------- Left: what do you need? ---------- */}
          <div>
            <h2 className="text-xl font-extrabold text-ink-900 sm:text-3xl">{contactContent.actionsHeading}</h2>
            <p className="mt-1.5 text-sm text-ink-700 sm:text-base">{contactContent.actionsIntro}</p>

            <ul className="mt-4 grid gap-3 sm:mt-6">
              {actions.map((action) => (
                <li
                  key={action.title}
                  className="flex flex-col gap-3 rounded-2xl border border-ink-900/10 bg-white p-4 transition-colors hover:border-brand-400 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:p-5"
                >
                  <div>
                    <h3 className="text-base font-bold text-ink-900 sm:text-lg">{action.title}</h3>
                    <p className="mt-0.5 text-sm text-ink-700">{action.body}</p>
                  </div>
                  {action.href && (
                    <a
                      href={action.href}
                      {...(action.viaWhatsApp ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      className="inline-flex w-fit shrink-0 items-center gap-2 rounded-full bg-brand-600 px-5 py-2.5 text-sm font-bold text-white shadow-[0_8px_18px_-8px_rgba(31,46,41,0.4)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-brand-700"
                    >
                      {action.viaWhatsApp ? <WhatsAppIcon /> : <MailIcon />}
                      {action.viaWhatsApp ? "Message on WhatsApp" : "Send an email"}
                    </a>
                  )}
                </li>
              ))}
            </ul>

            <section
              aria-labelledby="checklist-heading"
              className="mt-6 rounded-2xl border border-brand-200 bg-brand-50 p-4 sm:mt-8 sm:p-6"
            >
              <h2 id="checklist-heading" className="text-lg font-extrabold text-ink-900 sm:text-xl">
                {contactContent.checklistHeading}
              </h2>
              <ul className="mt-3 space-y-2.5">
                {contactContent.checklist.map((item) => (
                  <li key={item} className="flex gap-3 text-sm leading-relaxed text-ink-900 sm:text-base">
                    <span
                      aria-hidden="true"
                      className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-600 text-[11px] font-bold text-white"
                    >
                      &#10003;
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          {/* ---------- Right: direct channels ---------- */}
          <aside aria-label="Other ways to reach us" className="space-y-4 lg:sticky lg:top-24 lg:self-start">
            {generalHref && (
              <section className="rounded-2xl bg-brand-800 p-5 text-white sm:p-6">
                <h2 className="text-lg font-extrabold sm:text-xl">Just want to say hello?</h2>
                <p className="mt-1.5 text-sm leading-relaxed text-white/80">
                  WhatsApp is the fastest way to reach us.
                </p>
                <a
                  href={generalHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-2 rounded-full bg-marker-300 px-5 py-2.5 text-sm font-bold text-ink-900 transition-colors hover:bg-marker-400"
                >
                  <WhatsAppIcon />
                  Open WhatsApp
                </a>
              </section>
            )}

            {email && (
              <section
                aria-labelledby="email-contact-heading"
                className="rounded-2xl border border-ink-900/10 bg-white p-5 sm:p-6"
              >
                <h2 id="email-contact-heading" className="text-lg font-extrabold text-ink-900 sm:text-xl">
                  {contactContent.emailHeading}
                </h2>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-700">{contactContent.emailBody}</p>
                <a
                  href={`mailto:${email}?subject=${encodeURIComponent(contactContent.emailSubject)}`}
                  className="mt-4 inline-flex max-w-full items-center gap-2 break-all rounded-xl border border-ink-900/20 px-4 py-2.5 text-sm font-semibold text-ink-900 transition-colors hover:border-brand-600 hover:bg-brand-50"
                >
                  <MailIcon />
                  {email}
                </a>
              </section>
            )}

            <section className="rounded-2xl border border-ink-900/10 bg-white p-5 sm:p-6">
              <h2 className="text-lg font-extrabold text-ink-900 sm:text-xl">{contactContent.responseHeading}</h2>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-700">{contactContent.responseNote}</p>

              <h2 className="mt-5 text-lg font-extrabold text-ink-900 sm:text-xl">{contactContent.followHeading}</h2>
              <SocialLinks className="mt-3" />
            </section>
          </aside>
        </div>
      </Container>
    </>
  );
}
