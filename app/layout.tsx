import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Instrument_Sans } from "next/font/google";

import "./globals.css";
import { GoogleAnalytics } from "@/components/analytics/GoogleAnalytics";
import { BackToTop } from "@/components/layout/BackToTop";
import { ScrollProgress } from "@/components/layout/ScrollProgress";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { siteConfig } from "@/lib/site-config";

/**
 * next/font downloads both families at BUILD time and serves them from our
 * own domain - no request to Google at runtime, no layout shift while a font
 * loads.
 *
 * Two families, one job each: Inter reads well at small sizes (body copy,
 * form labels, buttons) - Fraunces is the "premium" half of the pairing, a
 * warm, slightly editorial serif with real personality used only for display
 * headings, so the site reads as designed rather than templated without
 * touching legibility anywhere that actually needs it.
 */
const body = Instrument_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-body",
});

/** Display face: Bricolage Grotesque, a variable grotesque with ink-trap character. */
const heading = Bricolage_Grotesque({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-heading",
  axes: ["opsz", "wdth"],
});

/**
 * Root layout: the HTML shell every page is rendered inside.
 *
 * `metadataBase` lets Next.js turn the relative canonical URLs produced in
 * lib/seo/metadata.ts into absolute ones.
 */
export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.defaultMetaTitle,
    // Page titles become "FAST Lahore GPA Calculator & CGPA Calculator | SetGPA"
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.defaultMetaDescription,
  applicationName: siteConfig.name,
  category: "education",
  // Only the real site (setgpa.com) may be indexed. Netlify deploy previews and
  // branch deploys get "noindex", so Google never lists a half-finished copy.
  // The googleBot values allow full-size image previews and long snippets.
  robots: {
    index: siteConfig.indexable,
    follow: siteConfig.indexable,
    googleBot: {
      index: siteConfig.indexable,
      follow: siteConfig.indexable,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  // Icons are declared here (files live in public/, made by
  // scripts/generate-brand-assets.mjs) so each one states its true size.
  // Google asks for a favicon whose size is a multiple of 48 px: 48 and 192.
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "48x48", type: "image/x-icon" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  // Stops phones from turning numbers like 3.67 into phone-number links.
  formatDetection: { telephone: false, email: false, address: false },
};

/** Browser address-bar colour on phones: the brand green. */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#3a7459",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${body.variable} ${heading.variable}`}
      // The inline script below adds a "js" class to <html> before React
      // hydrates, so the client DOM deliberately differs from the server HTML
      // at this one element. Without this, React reports a hydration mismatch.
      // It only applies to <html> itself, not to anything inside it, so real
      // mismatches deeper in the page are still reported.
      suppressHydrationWarning
    >
      <head>
        {/*
          Marks the page as "JavaScript is working" before anything renders.
          The scroll-reveal styles only hide content under html.js, so if this
          script never runs - JS disabled, blocked, or broken - every section
          stays visible instead of being stuck at opacity 0.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `document.documentElement.classList.add('js')`,
          }}
        />
      </head>
      <body className="flex min-h-screen flex-col">
        <ScrollProgress />
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:shadow"
        >
          Skip to content
        </a>
        <SiteHeader />
        <main id="main-content" className="flex-1">
          {children}
        </main>
        <SiteFooter />
        <BackToTop />
        <GoogleAnalytics />
      </body>
    </html>
  );
}
