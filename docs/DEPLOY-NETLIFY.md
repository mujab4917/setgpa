# Deploying SetGPA to Netlify (https://setgpa.com)

SetGPA runs entirely on Netlify: the website, the HTTPS domain **and** the
PostgreSQL database (Netlify Database).

Everything the project needs is already in this repository:

| File | What it does |
| --- | --- |
| `netlify.toml` | Build command, Node version, the public site URL, the `www` -> apex redirect and security headers. |
| `scripts/netlify-build.mjs` | Runs on every deploy: finds the database, applies new migrations, loads the starter data **once** into an empty database, then builds the site. |
| `lib/db.ts` | Connects to Netlify Database automatically (`NETLIFY_DB_URL`). Your own `DATABASE_URL` still wins if you set one. |
| `package.json` | Lists `@netlify/database`, which tells Netlify this site uses its database. |
| `prisma/schema.prisma` | Includes the Linux engine Netlify needs. |
| `.env.example` | Lists every environment variable, with no real values. |

After the one-time setup below, **every `git push` to the `main` branch
deploys automatically**. You do not add files or change settings again.

---

## Why a database at all?

The site reads its cities, universities and grade tables from PostgreSQL. The
database on your own PC is invisible to the internet, so the live site needs one
that Netlify can reach. Netlify Database is that, inside the same account.

Netlify Database needs a **credit-based plan**. The Free plan is one, with 300
credits a month (hard limit) and up to 3 databases. The database uses credits
only while it is awake, and a small site like this sleeps when idle.

---

## One-time setup (about 10 minutes)

### 1. Connect the GitHub repository to Netlify

1. In Netlify choose **Add new project -> Import an existing project -> GitHub**.
2. Authorise GitHub and pick **`mujab4917/setgpa`**.
3. Leave the build settings as they are: `netlify.toml` already contains them.
4. Under **Environment variables** add these two (public contact details, kept
   out of Git on purpose so they are not scraped from the repository):

| Variable | Value |
| --- | --- |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | your WhatsApp number, digits only, e.g. `923001234567` |
| `NEXT_PUBLIC_CONTACT_EMAIL` | the contact email to show on the site (leave empty to hide it) |

### 2. Add the Netlify Database to the site

Do **one** of these before the first successful deploy:

- **Dashboard:** open the site -> **Database** and create / enable the database.
- **Command line:** install the Netlify CLI (`npm i -g netlify-cli`), run
  `netlify login`, `netlify link` inside the project folder, then
  `netlify database init`. When it asks about a query style, choose
  **direct SQL** (this project uses Prisma, not Drizzle) and say **no** to the
  sample migration and sample data.

Then press **Deploy** (or *Deploys -> Trigger deploy -> Clear cache and deploy
site* if the first build stopped with "no database connection found").

The first build creates the tables, loads the starter cities and universities,
and builds all pages.

### 3. Point setgpa.com at the site

You bought `setgpa.com` through Netlify, so DNS is already managed there:

1. Open the site -> **Domain management -> Add a domain**, enter `setgpa.com`
   and choose the domain from your account.
2. Make `setgpa.com` the **primary domain**. Netlify issues the HTTPS
   certificate automatically.
3. `www.setgpa.com` redirects to `setgpa.com` by itself (see `netlify.toml`).

### 4. Tell Google about the site

1. Add `https://setgpa.com` as a property in Google Search Console.
2. Submit `https://setgpa.com/sitemap.xml`.

---

## Day to day

| I want to... | Do this |
| --- | --- |
| Change page text or design | Edit the files, commit, `git push`. Netlify redeploys. |
| Add or change a university or grade table | Edit rows with `netlify database connect` (or the Database page in the Netlify dashboard), or edit `prisma/seed-data/*.ts` and re-seed a fresh database. |
| Change the database structure | Edit `prisma/schema.prisma`, run `npm run db:migrate` locally, commit the new folder in `prisma/migrations/`, push. The deploy applies it automatically. |
| See why a deploy failed | Netlify -> **Deploys** -> the failed deploy -> build log. |

The seed runs automatically only when the database is **empty**, so edits you
make to live data are never overwritten by a later deploy.

Local development is unchanged: it uses your own PostgreSQL through `.env`
(`npm run db:start`, then `npm run dev`).

---

## Using a different database instead (optional)

Any PostgreSQL works. Set `DATABASE_URL` (and `DIRECT_URL` for migrations) under
*Site configuration -> Environment variables*. When `DATABASE_URL` is set, it is
used instead of Netlify Database. For a pooled host such as Neon, add
`&pgbouncer=true` to the end of `DATABASE_URL` and use the direct (non-pooled)
string for `DIRECT_URL`.

---

## Troubleshooting

| Symptom | Cause and fix |
| --- | --- |
| Build stops with "no database connection found" | The database is not added to the site yet. Do step 2, then clear cache and deploy. |
| "Database feature not available" | Netlify Database needs a credit-based plan. Check the plan under *Team settings -> Billing*. |
| `Can't reach database server` | The database may be asleep or disabled. Check its status on the site's Database page. |
| `prepared statement ... already exists` | Behind a pooler: add `&pgbouncer=true` to the connection string (done automatically for Netlify Database). |
| `too many clients already` | Add `&connection_limit=5` to `DATABASE_URL`. |
| Pages show `localhost` in the page source | `NEXT_PUBLIC_SITE_URL` was overridden. Remove it from Netlify; `netlify.toml` sets `https://setgpa.com`. |
| Campus photos are missing | They load from Wikimedia, which sometimes rate-limits. The page falls back to an illustration. Download the images into `public/` for guaranteed loading. |
