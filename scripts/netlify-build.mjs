/**
 * Netlify build script for https://setgpa.com
 *
 * Netlify runs this (see `command` in netlify.toml) every time you push to
 * GitHub. It does everything the site needs, in order, so nothing has to be
 * done by hand after the first setup:
 *
 *   1. Find the database connection string (Netlify Database, or your own).
 *   2. Prepare the connection settings (see below).
 *   3. `prisma generate`       - build the typed database client.
 *   4. `prisma migrate deploy` - apply any new migrations from prisma/migrations.
 *                                Safe to run on every deploy: already-applied
 *                                migrations are skipped.
 *   5. Seed the database ONLY if it is empty (first deploy). After that your
 *      data is never overwritten, so edits made in the database survive deploys.
 *   6. `next build`            - build and pre-render every page.
 *
 * Run locally (optional, to test the production build):
 *   node --env-file=.env scripts/netlify-build.mjs
 */

import { execSync } from "node:child_process";

/** Runs a shell command, streaming its output into the build log. */
function run(command, extraEnv = {}) {
  console.log(`\n> ${command}`);
  execSync(command, { stdio: "inherit", env: { ...process.env, ...extraEnv } });
}

// ---------------------------------------------------------------------------
// 1. Find the database
// ---------------------------------------------------------------------------
// DATABASE_URL wins if you set it (local PostgreSQL, Neon, ...). Otherwise use
// NETLIFY_DB_URL, which Netlify Database provides to builds automatically.
let source = "DATABASE_URL";
if (!process.env.DATABASE_URL && process.env.NETLIFY_DB_URL) {
  process.env.DATABASE_URL = process.env.NETLIFY_DB_URL;
  source = "NETLIFY_DB_URL (Netlify Database)";
}

if (!process.env.DATABASE_URL) {
  console.error(
    [
      "",
      "ERROR: no database connection found (neither NETLIFY_DB_URL nor DATABASE_URL).",
      "SetGPA reads its universities and grade tables from a PostgreSQL database.",
      "",
      "  Netlify Database:  add the database to this site (Netlify dashboard ->",
      "                     your site -> Database, or run `netlify database init`),",
      "                     then trigger a new deploy.",
      "  Your own database: add DATABASE_URL (and DIRECT_URL) under",
      "                     Site configuration -> Environment variables.",
      "",
      "Step-by-step: docs/DEPLOY-NETLIFY.md",
      "",
    ].join("\n"),
  );
  process.exit(1);
}
console.log(`Using the database from ${source}.`);

// ---------------------------------------------------------------------------
// 2. Connection settings
// ---------------------------------------------------------------------------

// Prisma migrations prefer a direct (non-pooled) connection. If DIRECT_URL was
// not provided, reuse DATABASE_URL so the build still works on a plain
// PostgreSQL server or Netlify Database.
process.env.DIRECT_URL ??= process.env.DATABASE_URL;

try {
  const url = new URL(process.env.DATABASE_URL);
  // `next build` pre-renders pages in parallel workers and each worker opens its
  // own connection pool. Capping each pool keeps the total under the database's
  // connection limit ("too many clients already"). Only added when you have not
  // set a limit yourself.
  if (!url.searchParams.has("connection_limit")) url.searchParams.set("connection_limit", "5");
  // Netlify's database may sit behind a connection pooler, which cannot use
  // prepared statements. Harmless on a direct connection.
  if (source.startsWith("NETLIFY") && !url.searchParams.has("pgbouncer")) {
    url.searchParams.set("pgbouncer", "true");
  }
  process.env.DATABASE_URL = url.toString();
  if (source.startsWith("NETLIFY")) process.env.DIRECT_URL = process.env.DATABASE_URL;
} catch {
  // Not a standard URL: leave it exactly as given and let Prisma report it.
}

// ---------------------------------------------------------------------------
// 3-4. Database client and migrations
// ---------------------------------------------------------------------------
run("npx prisma generate");
// The advisory lock is switched off because poolers do not support it; the
// build runs one migration at a time, so nothing else needs the lock.
run("npx prisma migrate deploy", { PRISMA_SCHEMA_DISABLE_ADVISORY_LOCK: "1" });

// ---------------------------------------------------------------------------
// 5. First deploy only: load the cities, universities and grade tables
// ---------------------------------------------------------------------------
const { PrismaClient } = await import("@prisma/client");
const prisma = new PrismaClient();
let cityCount = 0;
try {
  cityCount = await prisma.city.count();
} finally {
  await prisma.$disconnect();
}

if (cityCount === 0) {
  console.log("\nDatabase is empty: loading the starter data (first deploy only).");
  run("npx prisma db seed");
} else {
  console.log(`\nDatabase already has ${cityCount} cities: skipping the seed so existing data is kept.`);
}

// ---------------------------------------------------------------------------
// 6. Build the website
// ---------------------------------------------------------------------------
run("npx next build");
