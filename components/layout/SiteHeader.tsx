"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import { HeaderNav } from "@/components/layout/HeaderNav";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { Container } from "@/components/ui/Container";
import { WhatsAppIcon } from "@/components/ui/icons";
import { navContent } from "@/data/site-content";
import { siteConfig } from "@/lib/site-config";
import { buildWhatsAppLink, generalFeedbackMessage } from "@/lib/whatsapp";

/**
 * Top bar shown on every page.
 *
 * Layout: logo left, nav + WhatsApp button right, all on one row, always -
 * at the container's own max width, a logo, five nav links, social icons AND
 * a WhatsApp button genuinely do not fit on one line (that was the bug: they
 * used to wrap, stranding "Contact" alone on its own row). Rather than
 * shrink the logo down to an ellipsis to force a fit, the social icons come
 * out of the bar entirely - they already live in the footer, and the mobile
 * menu below still carries them, so nothing is lost, the header just stops
 * being crowded. Below `lg`, HeaderNav also disappears and MobileMenu (a
 * dropdown behind a hamburger button) takes over; the WhatsApp button stays
 * visible at every width, since it's the one action worth never hiding.
 *
 * It is sticky, and compresses slightly once you scroll so it takes less of a
 * small screen. That one behaviour is why this is a Client Component; the
 * whatsapp link is still resolved at build time.
 */
export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const whatsappHref = buildWhatsAppLink(generalFeedbackMessage());

  useEffect(() => {
    let frame = 0;

    const update = () => {
      frame = 0;
      setScrolled(window.scrollY > 12);
    };

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 border-b backdrop-blur-md transition-[background-color,border-color] duration-300 ${
        scrolled ? "border-ink-900/10 bg-white/90" : "border-ink-900/5 bg-cream-100/90"
      }`}
    >
      <Container
        className={`flex items-center justify-between gap-4 transition-[padding] duration-300 ${
          scrolled ? "py-2" : "py-3"
        }`}
      >
        {/* ---------- Logo ---------- */}
        <Link href="/" aria-label={`${siteConfig.name} home`} className="flex shrink-0 items-center">
          <Image
            src="/logo.png"
            alt={siteConfig.name}
            width={1200}
            height={277}
            priority
            className={`w-auto transition-[height] duration-300 ${scrolled ? "h-7 sm:h-8" : "h-8 sm:h-9"}`}
          />
        </Link>

        {/* ---------- Nav (lg+) ---------- */}
        <HeaderNav />

        {/* ---------- Actions ---------- */}
        <div className="flex shrink-0 items-center gap-3">
          {whatsappHref && (
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-ink-900 px-4 py-2.5 text-sm font-semibold text-white transition-colors duration-200 hover:bg-brand-700"
            >
              <WhatsAppIcon />
              <span className="hidden sm:inline">{navContent.ctaLabel}</span>
            </a>
          )}

          <MobileMenu />
        </div>
      </Container>
    </header>
  );
}
