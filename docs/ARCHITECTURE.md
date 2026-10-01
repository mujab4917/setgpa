# How this project works

Written for a software engineering student who can already program, but has not
necessarily used Next.js, Prisma or the App Router before.

---

## The one-paragraph version

There is **one** application. When a browser asks for
`/universities/lahore/fast-nuces`, Next.js runs a function **on the server**.
That function asks Prisma for the university and its grade table, Prisma sends
SQL to PostgreSQL, and the rows come back as typed JavaScript objects. The
server renders the page to HTML and sends it to the browser. The only piece of
that page that becomes interactive JavaScript is the two calculator forms; they
receive the grade table as props and do their arithmetic in the browser.

```
Browser  →  Next.js (server)  →  lib/queries/*  →  Prisma  →  DATABASE_URL  →  PostgreSQL
                    ↓
              HTML + a little JS
                    ↓
         Calculator components (browser)
```

---

## 1. What Next.js is doing

Next.js is the framework that turns the `app/` folder into a website.

- **Routing by folders.** `app/page.tsx` is `/`.
  `app/universities/[citySlug]/page.tsx` is `/universities/lahore`.
  A folder in square brackets is a *dynamic segment*: the value in the URL is
  handed to the page as `params`.
- **Server rendering.** Files in `app/` are **Server Components** by default.
  They run on the server, can talk to the database directly, and send finished
  HTML. That is why this project has no `/api` routes for reading data: the page
  *is* the backend call.
- **Metadata.** `generateMetadata()` produces the `<title>`, meta description,
  canonical URL and Open Graph tags for each page.
- **Special files.** `not-found.tsx` (404), `error.tsx` (error screen),
  `sitemap.ts` (`/sitemap.xml`), `robots.ts` (`/robots.txt`), `layout.tsx` (the
  shell around every page).
- **Caching.** `export const revalidate = 3600` tells Next.js it may reuse the
  rendered page for an hour before asking the database again.

## 2. What React is doing

React builds the UI out of components — functions that return markup.

Two kinds are used here:

- **Server Components** (everything without `"use client"`): rendered once on the
  server. No JavaScript for them is downloaded. The header, footer, grade table
  and university text are all server components.
- **Client Components** (`"use client"` at the top of the file): shipped to the
  browser so they can hold state and react to typing. Only
  `GpaCalculator.tsx`, `CgpaCalculator.tsx` and `error.tsx` are client
  components, which keeps the pages light.

Inside the calculators, `useState` holds the rows, and `useMemo` re-runs the
calculation only when the rows change.

## 3. What TypeScript is doing

TypeScript is JavaScript plus type annotations, checked before the code runs.

It catches things like passing a `string` where a `number` is expected, or
forgetting that `university` can be `null`. Prisma generates types from your
schema, so if you rename a database column, `npm run typecheck` tells you every
file that needs updating. The shapes the UI uses live in `types/domain.ts` and
`lib/calculators/types.ts`.

## 4. What Tailwind CSS is doing

Tailwind is a CSS framework of small utility classes (`px-4`, `text-slate-700`,
`rounded-xl`). Instead of writing separate CSS files, you compose styles in the
markup, and the build step keeps only the classes you actually used.

In Tailwind v4 there is no `tailwind.config.js`: `app/globals.css` imports the
framework and declares the design tokens (for example `--color-brand-600`) in an
`@theme` block. Repeated form styles are kept in
`components/calculators/calculator-ui.ts` so both calculators look the same.

## 5. What the backend / server side is doing

"Backend" here is not a separate program. It is the code that only ever runs on
the server:

- `lib/db.ts` — creates the Prisma client
- `lib/queries/cities.ts`, `lib/queries/universities.ts` — the database reads
- the page functions in `app/**/page.tsx`
- `app/sitemap.ts`, `app/robots.ts`

None of this is bundled into the browser. Server work: read the URL, query the
database, return 404 when the slug is unknown, build SEO metadata, render HTML.

## 6. What Prisma is doing

Prisma is the ORM — the translator between TypeScript objects and SQL.

- `prisma/schema.prisma` defines the models (`City`, `University`, `GradeRule`).
- `npx prisma migrate dev` turns the schema into SQL files in
  `prisma/migrations/` and applies them to the database.
- `npx prisma generate` builds a typed client from the schema, so
  `prisma.university.findFirst({ ... })` is autocompleted and type-checked.
- `npx prisma studio` opens a browser UI for viewing and editing rows.

## 7. What PostgreSQL is doing

PostgreSQL is the actual database server. It stores the three tables, enforces
the constraints declared in the schema (a city slug is unique; a university slug
is unique **within** its city; deleting a city deletes its universities), and
answers the SQL Prisma sends.

## 8. How the frontend talks to the database

It does not — not directly. The chain is:

```
app/universities/[citySlug]/[universitySlug]/page.tsx   (Server Component)
        │  await getUniversityBySlug(citySlug, universitySlug)
        ▼
lib/queries/universities.ts                              (server only)
        │  prisma.university.findFirst({ ... })
        ▼
lib/db.ts → Prisma client → DATABASE_URL → PostgreSQL
        │
        ▼  plain objects (types/domain.ts)
page renders HTML, and passes `gradingSystem` as a prop
        ▼
<GpaCalculator gradingSystem={…} />                      (Client Component)
```

The browser never sees `DATABASE_URL`, never sees SQL, and there is no fetch
call to load university data. The grade table arrives already embedded in the
page.

## 9. Where the GPA calculation logic lives

`lib/calculators/gpa.ts` → `calculateGpa(courses, gradingSystem)`.

A pure function: no React, no database, no browser APIs. It validates each row,
multiplies credit hours by grade points, sums, divides, and returns totals plus
per-row error messages. Tested in `tests/gpa.test.ts`.

## 10. Where the CGPA calculation logic lives

`lib/calculators/cgpa.ts` → `calculateCgpa(semesters, gradingSystem)`.

Same idea one level up: each semester's GPA is weighted by that semester's
credit hours. Tested in `tests/cgpa.test.ts`.

Shared input parsing, rounding and formatting live in
`lib/calculators/validation.ts`, which is why a GPA can never come out as `NaN`.

## 11. Where university data is stored

In the `University` table in PostgreSQL. The demo rows are written in
`prisma/seed.ts`; after seeding you can also edit them in Prisma Studio.

## 12. Where grading rules are stored

In the `GradeRule` table — one row per grade, linked to a university by
`universityId`, ordered by `sortOrder`. The `gpaScale` (4.00, 5.00 …) sits on
the `University` row.

This is what makes the architecture scale: the page reads those rows into a
single `GradingSystem` object and hands it to the calculators. Adding the
hundredth university is a data change, not a code change.

```
University row (gpaScale) + GradeRule rows
        ▼
   GradingSystem { gpaScale, grades[] }
        ▼
  GpaCalculator ─┐
                 ├─ same components for every university
  CgpaCalculator ┘
```

## 13. Where SEO metadata is stored

Three layers, most specific wins:

1. **Database** — `University.metaTitle`, `metaDescription`, `ogTitle`,
   `ogDescription`; `City.metaTitle`, `metaDescription`.
2. **`lib/seo/metadata.ts`** — builds the `Metadata` object, adds the canonical
   URL and Open Graph/Twitter tags, and generates a sensible title when the
   database field is empty.
3. **`lib/site-config.ts`** — site name, default title and description, base URL.

`app/layout.tsx` sets `metadataBase` and the title template
(`"<page title> | Pakistan GPA Calculator"`). `app/sitemap.ts` lists every city
and university straight from the database, so new pages are crawlable as soon as
they exist.

## 14. How dynamic university pages work

1. A request arrives for `/universities/lahore/fast-nuces`.
2. Next.js matches `app/universities/[citySlug]/[universitySlug]/page.tsx` and
   provides `params = { citySlug: "lahore", universitySlug: "fast-nuces" }`.
   (In Next.js 15 `params` is a Promise, so the page does `await params`.)
3. `generateStaticParams()` has already listed every active university, so the
   page can be pre-rendered at build time and refreshed every hour.
4. `generateMetadata()` loads the same university and builds the SEO tags.
5. The page component loads the university plus its grade rules. If the query
   returns `null`, it calls `notFound()` and `app/not-found.tsx` is rendered
   with a 404 status.
6. The grade rules become a `GradingSystem` object, passed as a prop to
   `GpaCalculator` and `CgpaCalculator`.
7. The browser receives HTML for the text and the grade table, and a small
   JavaScript bundle for the two forms.

---

## Error handling, at a glance

| Situation | What happens |
| --- | --- |
| Unknown city or university slug | `notFound()` → `app/not-found.tsx`, HTTP 404, page marked `noindex` |
| Database unreachable / query throws | `app/error.tsx` shows a friendly message; the real error is logged on the server only |
| Sitemap cannot read the database | Falls back to listing the homepage instead of failing |
| Credit hours are 0, negative, huge or not a number | Row is marked invalid with a message; it is not counted |
| A grade that is not in this university's table | Row is marked invalid |
| GPA above the university's scale or negative | Row is marked invalid |
| Every row empty | Result shows `—`, not `NaN`, with a "add at least one…" message |

## Performance choices

- Server Components everywhere except the two calculator forms.
- `Promise.all` where a page needs two queries (city page).
- `select:` in every Prisma query, so only the needed columns cross the wire.
- `revalidate = 3600` plus `generateStaticParams()` so pages are pre-rendered.
- One shared Prisma client instead of a new connection per request.
- No image files or web fonts to download on first paint.
