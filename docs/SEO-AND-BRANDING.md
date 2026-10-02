# SEO files and branding (setgpa.com)

Everything search engines and social apps read from SetGPA, and where it lives.

## What is where

| What | File | Address on the live site |
| --- | --- | --- |
| Sitemap index (submit this one) | `app/sitemap.xml/route.ts` | `https://setgpa.com/sitemap.xml` |
| Sitemap: main pages | `app/sitemaps/pages.xml/route.ts` | `/sitemaps/pages.xml` |
| Sitemap: cities | `app/sitemaps/cities.xml/route.ts` | `/sitemaps/cities.xml` |
| Sitemap: universities | `app/sitemaps/universities.xml/route.ts` | `/sitemaps/universities.xml` |
| robots.txt | `app/robots.ts` | `/robots.txt` |
| Titles, descriptions, canonical, Open Graph, Twitter cards | `lib/seo/metadata.ts` | in every page's `<head>` |
| Structured data (JSON-LD) | `lib/seo/schema.ts`, `components/seo/JsonLd.tsx` | in every page's `<head>` |
| Favicon and app icons | `public/favicon.ico`, `public/icon-192.png`, `public/apple-touch-icon.png`, declared in `app/layout.tsx` | `/favicon.ico` and friends |
| Web app manifest | `app/manifest.ts` | `/manifest.webmanifest` |
| Share image (WhatsApp, Facebook, LinkedIn, X) | `public/og-image.png` | `/og-image.png` |
| Per-university share image | `app/universities/[citySlug]/[universitySlug]/opengraph-image.tsx` | generated for each university |
| Logos | `public/logo.png`, `public/logo-light.png`, `public/logo-square.png` | `/logo.png` ... |
| Original logo | `brand/setgpa-logo-source.webp` | not published |

## Submitting the sitemap in Google Search Console

Submit **one** address: `sitemap.xml`. It is an index that lists the three
sitemaps (pages, cities, universities). Search Console then shows each of them
separately, with how many URLs it found.

## How the sitemap stays right

- It is built from the database, so a new city or university appears
  automatically (within an hour).
- `lastmod` is a real date: a university's own update time; a city's is the
  newest of the city and its universities; the hand-written pages use
  `GUIDE_UPDATED` in `data/guides.ts`. **Change that date whenever you edit the
  home page, the guides, About or Contact in a meaningful way.**
- `priority` and `changefreq` are left out on purpose; Google ignores them.

## robots.txt

- Everything is crawlable on the live site.
- `/target-gpa-calculator?...` (the planner pre-filled for one university) is
  blocked from crawling, because the canonical tag already points to the plain
  page.
- Netlify **deploy previews and branch deploys are blocked completely** and send
  `noindex`, so a test copy never reaches Google. This works because Netlify sets
  the `CONTEXT` variable (`production` only for the live site).

## Structured data (JSON-LD)

| Page | Blocks |
| --- | --- |
| Home | Organization (with logo), WebSite, WebPage |
| Guides hub (`/guides`) | CollectionPage, BreadcrumbList |
| Each guide (`/guides/...`) | Article (author, publisher, logo, image, dates), BreadcrumbList |
| Cities | BreadcrumbList |
| A city | BreadcrumbList |
| A university | WebPage, CollegeOrUniversity, BreadcrumbList |
| Target GPA calculator | WebPage, BreadcrumbList |
| About / Contact | AboutPage / ContactPage |

Deliberately **not** used: `WebApplication` / `SoftwareApplication` (Google's
version needs a star rating, which must never be invented), `FAQPage` (Google
retired FAQ rich results in 2026), `HowTo` (deprecated).

Check any page at <https://search.google.com/test/rich-results> and
<https://validator.schema.org> after it is live.

## Google Analytics 4 (setgpa.com)

- Measurement ID `G-4YQY277MGM` is set in `lib/site-config.ts`. It is a public
  identifier (visible in every page's source), so it is safe in Git. To change it,
  set `NEXT_PUBLIC_GA_MEASUREMENT_ID` in Netlify; set it to an empty value to turn
  Analytics off.
- The tag is added once, in `components/analytics/GoogleAnalytics.tsx`, and only
  on the real site. It stays off on localhost and on Netlify deploy previews, so
  test visits never appear in your reports.
- Events (see `lib/analytics.ts`), found under Reports -> Engagement -> Events:

  | Event | Meaning | Useful parameters |
  | --- | --- | --- |
  | `search` | What a visitor typed in a search box, sent after they pause | `search_term`, `search_context` (home, city, cities), `results_count` |
  | `search_no_results` | A search that matched nothing: universities to add next | `search_term` |
  | `search_result_click` | Which university they chose from the results | `university`, `city`, `position` |
  | `calculate_gpa`, `calculate_cgpa` | A calculation was run | `university`, rows counted |
  | `copy_result`, `download_result_card` | The result was copied or saved | `university` |

  GPA and CGPA values are never sent.
- To see these parameters in reports, register them once in Google Analytics:
  Admin -> Data display -> Custom definitions -> Create custom dimension (event
  scope) for `search_term`, `search_context`, `university` and `city`.
- Visitors from the EU or UK should be asked for consent before Analytics runs.
  The site has no consent banner yet; add one if you expect many such visitors.

## Changing the logo

1. Replace `brand/setgpa-logo-source.webp` with the new logo (transparent
   background, wide shape).
2. Run `node scripts/generate-brand-assets.mjs`.
3. Commit the changed files in `public/`, `lib/seo/og-logo.ts` and `app/`, then push.

That regenerates the header and footer logos, the square logo, the favicons, the
Apple icon, the app icons and the share image.

## Changing a page's title or description

Edit the text in `data/site-content.ts` (home, cities, about, contact, target) or
the builders in `lib/seo/metadata.ts` (cities and universities, generated from
data). Titles are cut to 60 characters and descriptions to 155 automatically.

## Guides

- The hub is `/guides` (`app/guides/page.tsx`). Each guide lives at
  `/guides/<name>`: `/guides/how-to-calculate-gpa` and `/guides/gpa-vs-cgpa`.
- The old addresses `/how-to-calculate-gpa` and `/gpa-vs-cgpa` redirect
  permanently (308) to the new ones; see `redirects()` in `next.config.ts`.
- **To add a guide:** create `app/guides/<name>/page.tsx` (copy an existing one),
  add its route in `lib/routes.ts`, add it to the `guides` list in
  `data/guides.ts`, and add its route to `getStaticPageEntries()` in
  `lib/seo/sitemap-data.ts`. It then appears on the hub page, in the footer and in
  the sitemap.
