"use client";

import { useEffect, useState } from "react";

/**
 * The "In this guide" list beside an article on wide screens. It stays in view
 * while you read and marks the section you are in. Without JavaScript it is
 * still a plain list of working links.
 */
export function ArticleToc({ items }: { items: Array<{ id: string; label: string }> }) {
  const [active, setActive] = useState(items[0]?.id);

  useEffect(() => {
    const targets = items.map((i) => document.getElementById(i.id)).filter((el): el is HTMLElement => Boolean(el));
    if (targets.length === 0 || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-12% 0px -72% 0px" },
    );
    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [items]);

  return (
    <nav aria-label="In this guide" className="sticky top-24">
      <p className="font-serif text-lg font-semibold text-ink-900">In this guide</p>
      <ul className="mt-3 border-l-2 border-ink-900/10">
        {items.map((item) => {
          const on = item.id === active;
          return (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                aria-current={on ? "true" : undefined}
                className={`-ml-0.5 block border-l-2 py-1.5 pl-4 text-sm leading-snug transition-colors ${
                  on
                    ? "border-terracotta-600 font-bold text-ink-900"
                    : "border-transparent text-ink-700 hover:border-ink-900/30 hover:text-ink-900"
                }`}
              >
                {item.label}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
