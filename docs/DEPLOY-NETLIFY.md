# Deploying SetGPA to Netlify (https://setgpa.com)

Everything the project needs to deploy is already in this repository:

| File | What it does |
| --- | --- |
| `netlify.toml` | Build command, Node version, the public site URL, the `www` -> apex redirect and security headers. |
| `scripts/netlify-build.mjs` | Runs on every deploy: builds the database client, applies new migrations, loads the starter data **once** into an empty database, then builds the site. |
| `prisma/schema.prisma` | Includes the Linux engine Netlify needs and a separate direct URL for migrations. |
| `.env.example` | Lists every environment variable, with no real values. |

After the one-time setup below, **every `git push` to the `main` branch
deploys automatically**. You do not add files or change settings again.

---

## One-time setup (about 10 minutes)

### 1. Create a hosted PostgreSQL database

Netlify cannot reach the PostgreSQL on your own PC, so the live site needs a
hosted database. Neon has a free plan and works well with Prisma.

1. Sign up at <https://neon.tech> and create a project (any region close to
   Pakistan, e.g. Singapore or Frankfurt).
2. In the project's **Connection details** copy two strings:
   - the **pooled** connection string (the host contains `-pooler`)
   - the **direct** connection string (the same without `-pooler`)

### 2. Connect the GitHub repository to Netlify

1. In Netlify choose **Add new project -> Import an existing project -> GitHub**.
2. Authorise GitHub and pick **`mujab4917/setgpa`**.
3. Leave the build settings as they are: `netlify.toml` already contains them.
4. Before pressing **Deploy**, open **Environment variables** (or do it
   afterwards in *Site configuration -> Environment variables*) and add:

| Variable | Value |
| --- | --- |
| `DATABASE_URL` | the **pooled** string, with `&pgbouncer=true` added to the end |
| `DIRECT_URL` | the **direct** string |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | your WhatsApp number, digits only, e.g. `923001234567` |
| `NEXT_PUBLIC_CONTACT_EMAIL` | the contact email to show on the site (leave empty to hide it) |

   These are set in Netlify, not in Git, on purpose: the repository stays free
   of secrets and of your personal contact details.

5. Press **Deploy**. The first build creates the database tables, loads the
   starter cities and universities, and builds all pages.

### 3. Point setgpa.com at the site

You bought `setgpa.com` through Netlify, so DNS is already managed there:

1. Open the site in Netlify -> **Domain management -> Add a domain**, enter
   `setgpa.com` and choose the domain from your account.
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
| Add or change a university or grade table | Edit `prisma/seed-data/*.ts`, then run `npm run db:seed` against the live database (see below), or edit rows with `npm run db:studio` pointed at the live `DATABASE_URL`. |
| Change the database structure | Edit `prisma/schema.prisma`, run `npm run db:migrate` locally, commit the new folder in `prisma/migrations/`, push. The deploy applies it automatically. |
| See why a deploy failed | Netlify -> **Deploys** -> the failed deploy -> build log. |

To run a command against the live database from your PC, put the live
`DATABASE_URL` and `DIRECT_URL` in a temporary shell variable (never in a file
you commit), run the command, and close the shell.

The seed runs automatically only when the database is **empty**, so edits you
make to live data are never overwritten by a later deploy.

---

## Troubleshooting

| Symptom | Cause and fix |
| --- | --- |
| Build stops with `DATABASE_URL is not set` | Add the variable in Netlify (step 2.4) and redeploy. |
| `Can't reach database server` | Check the connection strings. Neon pauses idle free databases; the first request wakes it. |
| `prepared statement ... already exists` | The pooled `DATABASE_URL` is missing `&pgbouncer=true`. |
| `too many clients already` | Add `&connection_limit=5` to `DATABASE_URL`. |
| Pages show `localhost` in the page source | `NEXT_PUBLIC_SITE_URL` was overridden. Remove it from Netlify; `netlify.toml` sets `https://setgpa.com`. |
| Campus photos are missing | They load from Wikimedia, which sometimes rate-limits. The page falls back to an illustration. Download the images into `public/` for guaranteed loading. |
