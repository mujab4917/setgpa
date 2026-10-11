import Image from "next/image";
import Link from "next/link";

import { SocialLinks } from "@/components/layout/SocialLinks";
import { Container } from "@/components/ui/Container";
import { MailIcon, WhatsAppIcon } from "@/components/ui/icons";
import { guideLinks } from "@/data/guides";
import { footerContent, navContent } from "@/data/site-content";
import { siteConfig } from "@/lib/site-config";
import { buildWhatsAppLink, generalFeedbackMessage } from "@/lib/whatsapp";

const footerLinkClass =
  "inline-block py-1.5 text-white/70 transition-colors underline-offset-4 hover:text-white hover:underline sm:py-1";

const contactButtonClass =
  "inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full border border-white/20 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:border-white/50 hover:bg-white/10 sm:w-auto sm:justify-start";

/** Footer shown on every page. Server Component - no client JavaScript. */
export function SiteFooter() {
  const year = new Date().getFullYear();
  const whatsappHref = buildWhatsAppLink(generalFeedbackMessage());
  const email = siteConfig.contactEmail.trim();

  return (
    <footer className="mt-0 bg-ink-900 text-white/75">
      <Container className="grid grid-cols-2 gap-x-6 gap-y-7 py-9 sm:gap-10 sm:py-12 lg:grid-cols-[1.15fr_0.8fr_1fr_1.6fr]">
        {/* ---------- Brand ---------- */}
        <div className="col-span-2 lg:col-span-1">
          <Image
            src="/logo-light.png"
            alt={siteConfig.name}
            width={1200}
            height={277}
            className="h-8 w-auto sm:h-9"
          />

          <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/65 sm:mt-4">
            {footerContent.description}
          </p>

          <SocialLinks className="mt-4 sm:mt-5" variant="dark" />
        </div>

        {/* ---------- Links ---------- */}
        <div>
          <p className="text-sm font-semibold text-white">
            {footerContent.quickLinksHeading}
          </p>
          <ul className="mt-2 text-sm sm:mt-3">
            {navContent.links.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className={footerLinkClass}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* ---------- Guides (internal links to the keyword pages) ---------- */}
        <div>
          <p className="text-sm font-semibold text-white">Guides</p>
          <ul className="mt-2 text-sm sm:mt-3">
            {guideLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className={footerLinkClass}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* ---------- Contact ---------- */}
        <div className="col-span-2 lg:col-span-1">
          <p className="text-sm font-semibold text-white">
            {footerContent.contactHeading}
          </p>
          <div className="mt-3 flex flex-col gap-2.5 sm:flex-row sm:flex-wrap lg:flex-col">
            {whatsappHref && (
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className={contactButtonClass}
              >
                <WhatsAppIcon />
                {footerContent.whatsappLabel}
              </a>
            )}
            {email && (
              <a href={`mailto:${email}`} className={`${contactButtonClass} [overflow-wrap:anywhere]`}>
                <MailIcon />
                {email}
              </a>
            )}
          </div>

          <p className="mt-4 max-w-sm text-xs leading-relaxed text-white/45 sm:mt-5">
            {footerContent.disclaimer}
          </p>
        </div>
      </Container>


      <div className="border-t border-white/10">
        <Container className="py-4 sm:py-5">
          <p className="text-xs text-white/45">
            &copy; {year} {siteConfig.name}. {footerContent.rightsLabel}
          </p>
        </Container>
      </div>
    </footer>
  );
}
