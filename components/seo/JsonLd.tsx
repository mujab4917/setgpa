import { serializeJsonLd } from "@/lib/seo/schema";

/**
 * Renders one JSON-LD block (Schema.org structured data) for search engines.
 *
 * The data is built on the server from our own database and code, never from
 * visitor input, and serializeJsonLd() escapes "<" so it cannot break out of
 * the <script> tag.
 */
export function JsonLd({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }}
    />
  );
}
