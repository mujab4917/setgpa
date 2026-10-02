import Link from "next/link";

export interface Crumb {
  label: string;
  href: string;
}

/**
 * Breadcrumb trail. It helps students go back one level and it also gives
 * search engines a clear picture of the site hierarchy.
 *
 * Styled as a soft white pill with dark text so it stays readable on any
 * page background, including the tinted graph-paper hero banners. Parent
 * pages are links; the last item is the current page and is shown in bold.
 */
export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-sm">
      <ol className="inline-flex max-w-full flex-wrap items-center gap-x-2 gap-y-1 rounded-full border border-ink-900/10 bg-white/80 px-4 py-2 shadow-sm backdrop-blur-sm">
        {items.map((item, index) => {
          const isCurrent = index === items.length - 1;
          return (
            <li key={item.href} className="flex items-center gap-2">
              {index > 0 && (
                <span aria-hidden="true" className="font-semibold text-ink-700">
                  /
                </span>
              )}
              {isCurrent ? (
                <span aria-current="page" className="font-bold text-ink-900">
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="font-semibold text-ink-700 underline-offset-4 transition-colors hover:text-brand-700 hover:underline"
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
