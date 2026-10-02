import { faqContent } from "@/data/site-content";
import type { FaqItem } from "@/lib/seo/faq";

/**
 * FAQ list, rendered with native <details> elements.
 *
 * <details> is keyboard accessible and screen-reader friendly without any
 * JavaScript, and the answer text stays in the HTML even while collapsed, so
 * search engines still read it.
 *
 * Server Component - no client JavaScript.
 */
export function UniversityFaq({ items }: { items: FaqItem[] }) {
  if (items.length === 0) return null;

  return (
    <section aria-labelledby="faq-heading" className="mt-8 sm:mt-12">
      <h2 id="faq-heading" className="text-xl font-bold text-ink-900 sm:text-2xl">
        {faqContent.heading}
      </h2>

      <div className="mt-5 divide-y divide-ink-900/8 overflow-hidden rounded-2xl border border-ink-900/10 bg-white">
        {items.map((item) => (
          <details key={item.question} className="group open:bg-brand-50/70">
            <summary className="cursor-pointer list-none px-4 py-3 text-[15px] font-semibold text-ink-900 sm:px-5 sm:py-4 sm:text-base transition-colors hover:bg-brand-50">
              <span className="flex items-start justify-between gap-4">
                <span>{item.question}</span>
                <span
                  aria-hidden="true"
                  className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-ink-900/25 text-ink-900 transition-all duration-200 group-open:rotate-45 group-open:border-brand-600 group-open:bg-brand-600 group-open:text-white"
                >
                  +
                </span>
              </span>
            </summary>
            <p className="max-w-3xl px-4 pb-4 text-sm leading-relaxed text-ink-700 sm:px-5 sm:pb-5 sm:text-base">
              {item.answer}
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}
