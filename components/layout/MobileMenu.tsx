"use client";

/**
 * MOBILE MENU
 *
 * Below the desktop breakpoint the nav links live behind this button instead
 * of fighting for space in the header bar (they used to wrap onto a second
 * row). HeaderNav, the horizontal version, only renders from `lg` up.
 *
 * THE BUTTON is a solid brand-green pill that says "Menu" (and "Close" when
 * open), with an icon that morphs between three lines and a cross. Words plus
 * a filled shape read as something to press, which a bare 3-line square does
 * not.
 *
 * THE PANEL has large tap targets, a one-line hint under each link, a clear
 * current-page state, a full-width WhatsApp button and the social links, over
 * a dimmed backdrop.
 *
 * Closes on route change, outside tap (the backdrop), and Escape - the three
 * ways a user actually expects a menu to close.
 */

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { SocialLinks } from "@/components/layout/SocialLinks";
import { WhatsAppIcon } from "@/components/ui/icons";
import { navContent } from "@/data/site-content";

function isActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  if (href === "/cities") return pathname === "/cities" || pathname.startsWith("/universities");
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function MobileMenu({ whatsappHref }: { whatsappHref?: string | null }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const rootRef = useRef<HTMLDivElement>(null);

  // Route change - a Link click already navigated, so just close.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative lg:hidden">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls="mobile-menu-panel"
        aria-label={open ? "Close menu" : "Open menu"}
        className={`flex h-10 items-center gap-2 rounded-full pl-4 pr-3.5 text-sm font-bold text-white shadow-[0_6px_14px_-6px_rgba(31,46,41,0.5)] transition-all duration-200 active:scale-95 ${
          open ? "bg-ink-900" : "bg-brand-600 hover:bg-brand-700"
        }`}
      >
        <span aria-hidden="true">{open ? "Close" : "Menu"}</span>
        <span aria-hidden="true" className="relative block h-3.5 w-[18px]">
          <span
            className={`absolute left-0 top-0 h-0.5 w-[18px] rounded-full bg-current transition-transform duration-200 ${
              open ? "translate-y-[6px] rotate-45" : ""
            }`}
          />
          <span
            className={`absolute left-0 top-1/2 h-0.5 w-[18px] -translate-y-1/2 rounded-full bg-current transition-opacity duration-200 ${
              open ? "opacity-0" : "opacity-100"
            }`}
          />
          <span
            className={`absolute bottom-0 left-0 h-0.5 w-[18px] rounded-full bg-current transition-transform duration-200 ${
              open ? "-translate-y-[6px] -rotate-45" : ""
            }`}
          />
        </span>
      </button>

      {open && (
        <>
          {/* Dims the page behind the menu; tapping it closes the menu. */}
          <div aria-hidden="true" className="fixed inset-0 z-30 bg-ink-900/30" />

          <div
            id="mobile-menu-panel"
            className="animate-slide-down-fade absolute right-0 top-full z-40 mt-3 w-[min(21rem,calc(100vw-1.5rem))] overflow-hidden rounded-3xl border border-ink-900/10 bg-white shadow-[0_24px_60px_-20px_rgba(31,46,41,0.5)]"
          >
            <nav aria-label="Mobile" className="p-2">
              <ul className="space-y-1">
                {navContent.links.map((link) => {
                  const active = isActive(pathname, link.href);
                  return (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        aria-current={active ? "page" : undefined}
                        className={`flex items-center justify-between gap-3 rounded-2xl px-4 py-3 transition-colors ${
                          active
                            ? "bg-marker-200 text-ink-900"
                            : "text-ink-900 hover:bg-brand-100 active:bg-brand-200"
                        }`}
                      >
                        <span>
                          <span className="block text-base font-bold">{link.label}</span>
                          <span className="block text-xs text-ink-700">{link.hint}</span>
                        </span>
                        <span
                          aria-hidden="true"
                          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                            active ? "bg-ink-900 text-white" : "bg-brand-100 text-brand-800"
                          }`}
                        >
                          &rarr;
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>

            <div className="space-y-4 border-t border-ink-900/10 bg-cream-50 p-4">
              {whatsappHref && (
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 rounded-full bg-ink-900 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-brand-700"
                >
                  <WhatsAppIcon />
                  Chat on WhatsApp
                </a>
              )}
              <div className="flex items-center justify-center gap-3">
                <SocialLinks />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
