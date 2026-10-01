"use client";

/**
 * The horizontal nav shown from `lg` up, where a logo, five links, social
 * icons and a WhatsApp button all genuinely fit on one line. Below `lg`, this
 * renders nothing at all - MobileMenu.tsx takes over instead of letting these
 * links wrap onto their own stranded row.
 */

import Link from "next/link";
import { usePathname } from "next/navigation";

import { navContent } from "@/data/site-content";

/** "/universities/lahore" counts as being inside "/cities" for highlighting. */
function isActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  if (href === "/cities") {
    return pathname === "/cities" || pathname.startsWith("/universities");
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function HeaderNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Main" className="hidden lg:block">
      <ul className="flex items-center gap-1 text-sm font-medium">
        {navContent.links.map((link) => {
          const active = isActive(pathname, link.href);

          return (
            <li key={link.href}>
              <Link
                href={link.href}
                // Tells screen readers which page you are on, not just colour.
                aria-current={active ? "page" : undefined}
                className={`block whitespace-nowrap rounded-full px-4 py-2 transition-colors ${
                  active
                    ? "bg-ink-900 text-white"
                    : "text-ink-700 hover:bg-brand-200 hover:text-brand-900"
                }`}
              >
                {link.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
