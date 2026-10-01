import Link from "next/link";

export interface Crumb {
  label: string;
  href: string;
}

/**
 * Small breadcrumb trail. It helps students go back one level and it also
 * gives search engines a clear picture of the site hierarchy.
 */
export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-sm">
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-ink-700 [&_a]:underline-offset-4 [&_a:hover]:underline [&_a:hover]:text-brand-700">
        {items.map((item, index) => (
          <li key={item.href} className="flex items-center gap-2">
            {index > 0 && <span aria-hidden="true">/</span>}
            <Link
              href={item.href}
              className="rounded hover:text-brand-700 hover:underline"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ol>
    </nav>
  );
}
