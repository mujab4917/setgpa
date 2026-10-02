import Image from "next/image";
import Link from "next/link";

import { SocialLinks } from "@/components/layout/SocialLinks";
import { Container } from "@/components/ui/Container";
import { MailIcon, WhatsAppIcon } from "@/components/ui/icons";
import { guideLinks } from "@/data/guides";
import { footerContent, navContent } from "@/data/site-content";
import { siteConfig } from "@/lib/site-config";
import { buildWhatsAppLink, generalFeedbackMessage } from "@/lib/whatsapp";

/** Footer shown on every page. Server Component - no client JavaScript. */
export function SiteFooter() {
  const year = new Date().getFullYear();
  const whatsappHref = buildWhatsAppLink(generalFeedbackMessage());
  const email = siteConfig.contactEmail.trim();

  return (
    <footer className="mt-0 bg-ink-900 text-white/75">
      <Container className="grid grid-cols-2 gap-x-6 gap-y-8 py-8 sm:gap-10 sm:py-12 lg:grid-cols-4">
        {/* ---------- Brand ---------- */}
        <div className="col-span-2 lg:col-span-1">
          <Image
            src="/logo-light.png"
            alt={siteConfig.name}
            width={1200}
            height={277}
            className="h-9 w-auto"
          />

          <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/65">
            {footerContent.description}
          </p>

          <SocialLinks className="mt-5" variant="dark" />
        </div>

        {/* ---------- Links ---------- */}
        <div>
          <p className="text-sm font-semibold text-white">
            {footerContent.quickLinksHeading}
          </p>
          <ul className="mt-3 space-y-2 text-sm">
            {navContent.links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-white/65 transition-colors underline-offset-4 hover:text-white hover:underline"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* ---------- Guides (internal links to the keyword pages) ---------- */}
        <div>
          <p className="text-sm font-semibold text-white">Guides</p>
          <ul className="mt-3 space-y-2 text-sm">
            {guideLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-white/65 transition-colors underline-offset-4 hover:text-white hover:underline"
                >
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
          <ul className="mt-3 space-y-3 text-sm">
            {whatsappHref && (
              <li>
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-white/65 transition-colors underline-offset-4 hover:text-white hover:underline"
                >
                  <WhatsAppIcon />
                  {footerContent.whatsappLabel}
                </a>
              </li>
            )}
            {email && (
              <li>
                <a
                  href={`mailto:${email}`}
                  className="inline-flex items-center gap-2 break-all text-white/65 transition-colors underline-offset-4 hover:text-white hover:underline"
                >
                  <MailIcon />
                  {email}
                </a>
              </li>
            )}
          </ul>

          <p className="mt-5 max-w-sm text-xs leading-relaxed text-white/45">
            {footerContent.disclaimer}
          </p>
        </div>
      </Container>

      <div className="border-t border-white/10">
        <Container className="py-5">
          <p className="text-xs text-white/45">
            &copy; {year} {siteConfig.name}. {footerContent.rightsLabel}
          </p>
        </Container>
      </div>
    </footer>
  );
}
