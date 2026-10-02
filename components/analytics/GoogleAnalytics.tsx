import Script from "next/script";

import { siteConfig } from "@/lib/site-config";

/**
 * Loads Google Analytics 4 (the "Google tag") once for the whole site.
 *
 * It is switched on ONLY for the real site. It stays off for:
 *   - local development and local test builds (the address contains "localhost")
 *   - Netlify deploy previews and branch deploys (siteConfig.indexable is false)
 * so test visits never appear in your reports.
 *
 * `afterInteractive` loads the script after the page is usable, so Analytics
 * never slows the first paint. Page views for navigation inside the site are
 * recorded automatically by GA4's "enhanced measurement".
 */
export function GoogleAnalytics() {
  const id = siteConfig.gaMeasurementId;
  const enabled =
    Boolean(id) &&
    process.env.NODE_ENV === "production" &&
    siteConfig.indexable &&
    !siteConfig.url.includes("localhost");

  if (!enabled) return null;

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${id}`} strategy="afterInteractive" />
      <Script id="google-analytics" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
window.gtag = gtag;
gtag('js', new Date());
gtag('config', '${id}');`}
      </Script>
    </>
  );
}
