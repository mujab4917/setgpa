# SetGPA: GPA & CGPA Calculator for Pakistani Universities

**Live site: <https://setgpa.com>** · Hosted on Netlify · Source: <https://github.com/mujab4917/setgpa>

University-specific GPA and CGPA calculators for Pakistani universities, a
target GPA planner, and guides on how GPA and CGPA work.

**Journey:** Pakistan → City → Universities → University details → GPA / CGPA calculator.
Currently covers **24 cities and 121 universities**.

> ⚠️ **The grading data shipped in `prisma/seed.ts` is DEMO DATA.** It has not been
> checked against official university documents. Every seeded university has
> `isVerified: false`, and the website shows a visible "demo data" notice while
> that flag is false. Replace the values with information you have verified, then
> set `isVerified: true`.

---

## START HERE

**This PC is already set up.** Node.js, PostgreSQL, the dependencies, the
database, the migration and the demo data are all in place.

Open this folder in VS Code (**File → Open Folder…**), then open a terminal with
**Ctrl + `**. If PowerShell refuses to run `npm` ("running scripts is disabled
on this system"), run this once and reopen the terminal:

```bash
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
```

To work on the site:

```bash
npm run db:start
```

```bash
npm run dev
```

Open <http://localhost:3000>. You should see the homepage with **Lahore**.

The database is a *portable* PostgreSQL, so it does not start automatically when
you boot the PC — that is what `npm run db:start` is for. Details, including the
local password and how to swap it for a normal install, are in
[`docs/DATABASE-LOCAL.md`](docs/DATABASE-LOCAL.md).

**One thing still to do:** open `.env` and replace
`NEXT_PUBLIC_WHATSAPP_NUMBER="YOUR_WHATSAPP_NUMBER"` with your real number in
international format, digits only (e.g. `923001234567`). Until then the
WhatsApp button is replaced by a short "not configured" note. Restart
`npm run dev` after changing it.

### Setting this up on a different computer

```bash
npm install
```

```bash
Copy-Item .env.example .env
```

Fill in `DATABASE_URL` and `NEXT_PUBLIC_WHATSAPP_NUMBER`, then:

```bash
npx prisma migrate dev --name init
```

```bash
npm run db:seed
```

Starting from a fresh Windows PC with nothing installed? Follow
[`docs/SETUP-WINDOWS.md`](docs/SETUP-WINDOWS.md).

Want to understand how the pieces fit together? Read
[`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md).

---

## Features

- Homepage with an introduction and a **Cities** section (Lahore only for now)
- **University search** — type a university or city name and go straight to the calculator
- City page listing the universities in that city
- University page with description, grade table, formulas, and both calculators
- **Copy result** button on both calculators, with a fallback for older browsers
- **FAQ per university**, generated from that university's own data
- **Related universities** links at the bottom of every university page
- **Social preview images** generated per university for WhatsApp/Facebook shares
- **One** GPA engine and **one** CGPA engine shared by every university
- Grade tables, descriptions and SEO text stored in PostgreSQL, not in code
- WhatsApp feedback link with a pre-filled message
- Dynamic `sitemap.xml`, `robots.txt`, canonical URLs, Open Graph tags
- Unit tests for the calculation logic

## Tech stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js 15 (App Router) |
| UI | React 19 + Tailwind CSS 4 |
| Language | TypeScript |
| Database | PostgreSQL |
| ORM | Prisma 6 |
| Tests | Vitest |
| Runtime | Node.js 20+ |

One Next.js project holds both the frontend and the server code.

## Folder structure

```
app/                                 Routes + pages (Next.js App Router)
  layout.tsx                         HTML shell, header, footer, site-wide metadata
  page.tsx                           Homepage (cities)
  error.tsx                          Friendly error screen
  not-found.tsx                      404 page
  robots.ts                          /robots.txt
  sitemap.ts                         /sitemap.xml (built from the database)
  globals.css                        Tailwind import + design tokens
  universities/
    [citySlug]/page.tsx              /universities/lahore
    [citySlug]/[universitySlug]/page.tsx   /universities/lahore/fast-nuces
    [citySlug]/[universitySlug]/opengraph-image.tsx  Social preview PNG

components/                          React components (UI only, no maths)
  calculators/GpaCalculator.tsx      GPA form  (client component)
  calculators/CgpaCalculator.tsx     CGPA form (client component)
  calculators/ResultSummary.tsx      Shared result panel
  calculators/calculator-ui.ts       Shared Tailwind classes for the forms
  cities/CityCard.tsx
  universities/UniversityCard.tsx
  universities/UniversitySearch.tsx  Type-to-find search (client component)
  universities/GradeScaleTable.tsx
  universities/UniversityFaq.tsx     FAQ list (<details>, no JavaScript)
  universities/RelatedUniversities.tsx  "Other universities in <city>"
  universities/DataQualityNotice.tsx Demo-data / verified notice
  feedback/WhatsAppContact.tsx
  layout/SiteHeader.tsx, SiteFooter.tsx
  ui/Container.tsx, Breadcrumbs.tsx

lib/                                 Business logic + server code
  calculators/gpa.ts                 GPA maths   (pure functions, tested)
  calculators/cgpa.ts                CGPA maths  (pure functions, tested)
  calculators/validation.ts          Input parsing, rounding, formatting
  calculators/types.ts               Calculator types
  queries/cities.ts                  Database reads for cities   (server only)
  queries/universities.ts            Database reads for universities (server only)
  seo/metadata.ts                    Titles, descriptions, canonical, Open Graph
  seo/faq.ts                         Builds each university's FAQ from its own data
  db.ts                              Prisma client instance      (server only)
  routes.ts                          URL builders
  site-config.ts                     Site name, URL, WhatsApp number
  whatsapp.ts                        wa.me link builder

data/site-content.ts                 All static page text (headings, paragraphs)
prisma/schema.prisma                 Database models
prisma/seed.ts                       Demo city, universities and grade rules
types/domain.ts                      Shapes passed from the server to the UI
tests/                               Vitest tests for the calculator logic
public/logos/                        Optional university logo images
scripts/                             start/stop the local portable PostgreSQL
docs/SETUP-WINDOWS.md                Fresh-PC setup guide
docs/ARCHITECTURE.md                 How every part of the stack works
docs/DATABASE-LOCAL.md               Your local database: paths, password, commands
```

## Environment variables

Copy `.env.example` to `.env` and fill it in.

| Variable | Visible to the browser? | What it does |
| --- | --- | --- |
| `DATABASE_URL` | **No** (server only) | PostgreSQL connection string the website uses (pooled on a hosted database). |
| `DIRECT_URL` | **No** (server only) | Direct PostgreSQL connection string used by Prisma migrations. Locally the same as `DATABASE_URL`. |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Yes | Your WhatsApp number, digits only (e.g. `923001234567`). |
| `NEXT_PUBLIC_CONTACT_EMAIL` | Yes | Contact email shown on the site. Empty hides it. |
| `NEXT_PUBLIC_SITE_URL` | Yes | Base URL for canonical links, sitemap and Open Graph. Production is `https://setgpa.com` (set in `netlify.toml`). |

Only variables that start with `NEXT_PUBLIC_` are sent to the browser. Never put
a password or a database URL behind that prefix.

**`.env` vs `.env.local` vs `.env.example`**

- `.env` — your real local values. Prisma reads this file. **Git-ignored.**
- `.env.local` — also read by Next.js and also git-ignored; it overrides `.env`.
  The Prisma CLI does *not* read it, so for this project keep everything in `.env`
  to avoid two sources of truth.
- `.env.example` — a committed template with no real values, so anyone cloning
  the repo knows which variables to create.

In production (Netlify) you do not upload `.env`; you enter the same variables in
the Netlify dashboard. See [`docs/DEPLOY-NETLIFY.md`](docs/DEPLOY-NETLIFY.md).

## Commands

| Command | What it does |
| --- | --- |
| `npm install` | Install dependencies |
| `npm run dev` | Start the development server on <http://localhost:3000> |
| `npm run build` | Generate the Prisma client and build for production |
| `npm start` | Run the production build (after `npm run build`) |
| `npm test` | Run the calculator tests once |
| `npm run test:watch` | Re-run tests as you edit |
| `npm run typecheck` | Check TypeScript without building |
| `npm run db:start` | Start the local portable PostgreSQL (needed before `dev`) |
| `npm run db:stop` | Stop it again |
| `npm run db:migrate` | Create/apply a migration from `schema.prisma` (development) |
| `npm run db:deploy` | Apply existing migrations (production) |
| `npm run db:generate` | Regenerate the Prisma client |
| `npm run db:seed` | Insert the demo city, universities and grade rules |
| `npm run db:studio` | Open Prisma Studio to browse and edit rows |
| `npm run db:reset` | Drop the database, re-run migrations, re-seed (destroys data) |

## Database setup

```bash
npx prisma migrate dev --name init
```

That command reads `prisma/schema.prisma`, creates the SQL migration in
`prisma/migrations/`, applies it to the database in `DATABASE_URL`, and
regenerates the Prisma client. Then load the demo content:

```bash
npm run db:seed
```

Inspect what is in the database at any time:

```bash
npm run db:studio
```

---

## How to edit the content

Two rules: **page text that is the same everywhere lives in `data/site-content.ts`;
anything that belongs to a specific city or university lives in the database.**

| I want to change… | Edit here |
| --- | --- |
| Homepage heading, intro, "How it works" steps, "Cities" heading | `data/site-content.ts` |
| City page / university page section headings, formulas, button labels | `data/site-content.ts` |
| WhatsApp message text | `data/site-content.ts` → `whatsappMessages` |
| Footer text and disclaimer | `data/site-content.ts` → `footerContent` |
| 404 / error page wording | `data/site-content.ts` → `errorContent` |
| Site name, tagline, default SEO title/description | `lib/site-config.ts` |
| WhatsApp number | `.env` → `NEXT_PUBLIC_WHATSAPP_NUMBER` |
| City name, tagline, description, city SEO | `City` row (seed file or Prisma Studio) |
| University name, description, campus, website, logo | `University` row |
| University SEO title / meta description / OG title / OG description | `University` row |
| Grade table (A = 4.00 …) | `GradeRule` rows for that university |
| GPA scale (4.00, 5.00 …) | `University.gpaScale` |
| "How GPA/CGPA is calculated" paragraph for one university | `University.gpaExplanation` / `cgpaExplanation` |
| URL of a university | `University.slug` |
| Search box labels and "no results" message | `data/site-content.ts` → `searchContent` |
| FAQ questions and answers | `lib/seo/faq.ts` — they are generated from each university's row, so fixing a grade rule fixes the FAQ too |
| Copied result text | `components/calculators/GpaCalculator.tsx` / `CgpaCalculator.tsx` → `copyText` |
| Social preview image design | `app/universities/[citySlug]/[universitySlug]/opengraph-image.tsx` |
| Colours, spacing, fonts | `app/globals.css` and the Tailwind classes in `components/` |

Two ways to edit database content:

1. **Prisma Studio** (`npm run db:studio`) — click a cell, type, save. Good for a
   quick fix. It changes your local database only.
2. **`prisma/seed.ts`** — edit the object, then `npm run db:seed`. The seed uses
   upserts, so it updates existing rows instead of duplicating them. This is the
   right place for changes you want in Git and on the live site.

### How to add a city

1. Add an object to the `cities` array in `prisma/seed.ts`:

```ts
{
  name: "Islamabad",
  slug: "islamabad",              // becomes /universities/islamabad
  tagline: "Capital city campuses",
  description: "Intro paragraph shown on the city page.",
  metaTitle: "University GPA & CGPA Calculators in Islamabad",
  metaDescription: "…",
}
```

2. `npm run db:seed`

The homepage lists every active city automatically — no React change needed.

### How to add a university

1. Add an object to the `universities` array in `prisma/seed.ts`, with
   `citySlug` pointing at an existing city and a `slug` that is unique inside
   that city.
2. Fill in `gradeRules`, highest grade first (`sortOrder` is filled in for you).
3. `npm run db:seed`

The new page appears at `/universities/<citySlug>/<slug>`, it is added to
`sitemap.xml`, and both calculators immediately use its grade table. **No
calculator code changes.**

### How to mark data as verified

Once you have checked a university against its official handbook, set
`isVerified: true` and write a `sourceNote` (e.g. "Undergraduate handbook 2025,
page 14"). The amber demo-data banner is replaced by the source line.

### How to connect a different PostgreSQL database

1. Change `DATABASE_URL` in `.env` (or in your hosting dashboard).
2. Apply the schema to the new database:
   - development: `npx prisma migrate dev`
   - production / an existing database: `npx prisma migrate deploy`
3. Optionally load content: `npm run db:seed`

Nothing else changes — no code references the database host directly.

## Deployment (Netlify + hosted PostgreSQL)

The site deploys to Netlify from this GitHub repository, and the domain is
`setgpa.com`. All deployment configuration is in Git:

- `netlify.toml` — build command, Node version, `www` redirect, security headers.
- `scripts/netlify-build.mjs` — on every deploy: generates the Prisma client,
  applies new migrations, seeds an **empty** database once, then builds the site.

One-time setup (hosted database, connecting the repository, environment
variables, the domain) is in [`docs/DEPLOY-NETLIFY.md`](docs/DEPLOY-NETLIFY.md).
After that, every push to `main` deploys automatically.

## Scope

Built: cities → universities → university information → grading rules → GPA
calculator → CGPA calculator → WhatsApp feedback.

Deliberately **not** built: percentage/attendance/merit/admission/entry-test
calculators, blog, news, accounts, login, payments, admin panel, rankings,
reviews, comments, chat.
