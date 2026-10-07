import Link from "next/link";

export interface Crumb {
  label: string;
  href: string;
  /** Shorter wording for the phone's "back" link, when the full label is long. */
  shortLabel?: string;
}

function Chevron({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="m6 3.5 4.5 4.5L6 12.5" />
    </svg>
  );
}

/**
 * Breadcrumb trail. It helps students go back one level and it also gives
 * search engines a clear picture of the site hierarchy.
 *
 * On a phone a four-level trail wrapped onto two lines and looked cramped, so
 * there it shows one thing: a "back to <parent>" link. From the `sm` breakpoint
 * up it shows the full trail with chevrons, as plain text with no pill around
 * it. Both versions are real links, and the full list stays in the HTML.
 */
export function Breadcrumbs({ items }: { items: Crumb[] }) {
  if (items.length < 2) return null;
  const parent = items[items.length - 2];

  return (
    <nav aria-label="Breadcrumb" className="text-sm">
      {/* Phone: one back link. */}
      <Link
        href={parent.href}
        className="-ml-1 inline-flex min-h-10 items-center gap-1 rounded-full px-1 font-semibold text-brand-700 transition-colors hover:text-brand-900 sm:hidden"
      >
        <Chevron className="h-4 w-4 rotate-180" />
        <span className="max-w-[16rem] truncate">{parent.shortLabel ?? parent.label}</span>
      </Link>

      {/* sm and up: the full trail. */}
      <ol className="hidden max-w-full flex-wrap items-center gap-x-1.5 gap-y-1 sm:flex">
        {items.map((item, index) => {
          const isCurrent = index === items.length - 1;
          return (
            <li key={item.href} className="flex min-w-0 items-center gap-1.5">
              {index > 0 && <Chevron className="h-3.5 w-3.5 shrink-0 text-ink-700/50" />}
              {isCurrent ? (
                <span aria-current="page" className="truncate font-semibold text-ink-900">
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="text-ink-700 underline-offset-4 transition-colors hover:text-brand-700 hover:underline"
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
