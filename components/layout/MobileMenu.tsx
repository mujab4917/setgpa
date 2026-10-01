"use client";

/**
 * MOBILE MENU
 *
 * Five nav links plus a logo, social icons and a WhatsApp button no longer
 * fit on one line below the desktop breakpoint - they used to wrap onto a
 * second row (an actual bug: "Contact" stranding itself alone under the
 * rest), which is exactly the kind of thing that makes a header look
 * unfinished. Below `lg`, the links move into this dropdown instead of
 * fighting for space in the bar itself; HeaderNav (the horizontal version)
 * only renders from `lg` up, where everything genuinely fits on one row.
 *
 * Closes on route change, outside click, and Escape - the three ways a user
 * actually expects a menu to close.
 */

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { SocialLinks } from "@/components/layout/SocialLinks";
import { navContent } from "@/data/site-content";

function isActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  if (href === "/cities") return pathname === "/cities" || pathname.startsWith("/universities");
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function MobileMenu() {
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
        className="flex h-10 w-10 items-center justify-center rounded-lg border border-ink-900/10 text-ink-700 transition-colors hover:border-brand-300 hover:text-brand-700"
      >
        <span className="relative block h-3.5 w-4">
          <span
            aria-hidden="true"
            className={`absolute left-0 top-0 h-0.5 w-4 rounded-full bg-current transition-transform duration-200 ${
              open ? "translate-y-[6px] rotate-45" : ""
            }`}
          />
          <span
            aria-hidden="true"
            className={`absolute left-0 top-1/2 h-0.5 w-4 -translate-y-1/2 rounded-full bg-current transition-opacity duration-200 ${
              open ? "opacity-0" : "opacity-100"
            }`}
          />
          <span
            aria-hidden="true"
            className={`absolute bottom-0 left-0 h-0.5 w-4 rounded-full bg-current transition-transform duration-200 ${
              open ? "-translate-y-[6px] -rotate-45" : ""
            }`}
          />
        </span>
      </button>

      {open && (
        <div
          id="mobile-menu-panel"
          className="animate-slide-down-fade absolute right-0 top-full z-40 mt-3 w-64 overflow-hidden rounded-2xl border border-ink-900/10 bg-white shadow-xl"
        >
          <nav aria-label="Mobile" className="py-2">
            <ul>
              {navContent.links.map((link) => {
                const active = isActive(pathname, link.href);
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      aria-current={active ? "page" : undefined}
                      className={`block px-5 py-3 text-sm font-medium transition-colors ${
                        active ? "bg-brand-50 text-brand-700" : "text-ink-700 hover:bg-brand-200 hover:text-brand-900"
                      }`}
                    >
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-3 border-t border-slate-100 px-5 py-4">
            <SocialLinks />
          </div>
        </div>
      )}
    </div>
  );
}
