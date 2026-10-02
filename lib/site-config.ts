/**
 * Site-wide configuration.
 *
 * EDIT HERE: site name, tagline, default SEO text, WhatsApp number fallback.
 * Values that change between your computer and the live site come from
 * environment variables (.env) - see .env.example.
 */

export const siteConfig = {
  /** Shown in the header, the footer and the browser tab. */
  name: "SetGPA",
  /** Short line under the logo. */
  tagline: "University-specific GPA & CGPA calculators",

  /**
   * Public base URL. Used for canonical URLs, sitemap.xml and Open Graph.
   * Set NEXT_PUBLIC_SITE_URL in .env (local) and in your hosting dashboard (production).
   */
  url: (
    process.env.NEXT_PUBLIC_SITE_URL ??
    // Production builds default to the real domain, so canonical URLs and the
    // sitemap can never accidentally say "localhost". Local dev stays local.
    (process.env.NODE_ENV === "production" ? "https://setgpa.com" : "http://localhost:3000")
  ).replace(/\/$/, ""),

  /** Default <title> and meta description for pages that do not set their own. */
  defaultMetaTitle: "GPA Calculator Pakistan: Free GPA & CGPA Calculator",
  defaultMetaDescription:
    "Free GPA calculator and CGPA calculator for Pakistani universities. Pick your university, use its own grade table and get your GPA, CGPA and target grades.",

  /**
   * WhatsApp number in international format, digits only (no +, no spaces).
   * EDIT HERE: set NEXT_PUBLIC_WHATSAPP_NUMBER in .env - do not type your number in the code.
   */
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "",

  /**
   * Public contact email. Set NEXT_PUBLIC_CONTACT_EMAIL in .env.
   * Leave the variable empty to hide the email everywhere on the site.
   */
  contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "",

  /**
   * Whether search engines may index this build. Netlify sets CONTEXT to
   * "production" for the live site and to "deploy-preview" / "branch-deploy"
   * for test copies. Outside Netlify (local development) CONTEXT is unset and
   * the site counts as indexable, which has no effect because it is not public.
   */
  indexable: (process.env.CONTEXT ?? "production") === "production",

  /** Language used in the <html lang> attribute. */
  locale: "en_PK",
} as const;

/**
 * Social profiles shown in the header and footer.
 *
 * EDIT HERE: replace each `href` with your real profile URL. Set a value to
 * an empty string to hide that icon - nothing else needs changing.
 *
 * These are PLACEHOLDER links pointing at each platform's home page. Replace
 * them before you launch, otherwise visitors land on a generic page.
 */
export const socialLinks = [
  { name: "Facebook", href: "https://www.facebook.com/", icon: "facebook" },
  { name: "Instagram", href: "https://www.instagram.com/", icon: "instagram" },
  { name: "LinkedIn", href: "https://www.linkedin.com/", icon: "linkedin" },
  { name: "X", href: "https://x.com/", icon: "x" },
] as const;

export type SocialIconName = (typeof socialLinks)[number]["icon"];
