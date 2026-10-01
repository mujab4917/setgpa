/**
 * Netlify build script for https://setgpa.com
 *
 * Netlify runs this (see `command` in netlify.toml) every time you push to
 * GitHub. It does everything the site needs, in order, so nothing has to be
 * done by hand after the first setup:
 *
 *   1. Check that DATABASE_URL is set, with a clear message if it is not.
 *   2. Prepare the database connection settings (see below).
 *   3. `prisma generate`       - build the typed database client.
 *   4. `prisma migrate deploy` - apply any new migrations from prisma/migrations.
 *                                Safe to run on every deploy: already-applied
 *                                migrations are skipped.
 *   5. Seed the database ONLY if it is empty (first deploy). After that your
 *      data is never overwritten, so edits made in the database survive deploys.
 *   6. `next build`            - build and pre-render every page.
 *
 * Run locally (optional, to test the production build):  npm run build:netlify
 */

import { execSync } from "node:child_process";

/** Runs a shell command, streaming its output into the build log. */
function run(command) {
  console.log(`\n> ${command}`);
  execSync(command, { stdio: "inherit", env: process.env });
}

// ---------------------------------------------------------------------------
// 1. DATABASE_URL must exist
// ---------------------------------------------------------------------------
if (!process.env.DATABASE_URL) {
  console.error(
    [
      "",
      "ERROR: DATABASE_URL is not set.",
      "SetGPA reads its universities and grade tables from a PostgreSQL database.",
      "In Netlify open Site configuration -> Environment variables and add",
      "DATABASE_URL (and DIRECT_URL). Step-by-step: docs/DEPLOY-NETLIFY.md",
      "",
    ].join("\n"),
  );
  process.exit(1);
}

// ---------------------------------------------------------------------------
// 2. Connection settings
// ---------------------------------------------------------------------------

// Prisma migrations need a direct (non-pooled) connection. If DIRECT_URL was
// not provided, reuse DATABASE_URL so the build still works on a plain
// PostgreSQL server.
process.env.DIRECT_URL ??= process.env.DATABASE_URL;

// `next build` pre-renders pages in parallel workers and each worker opens its
// own connection pool. Capping each pool keeps the total under the database's
// connection limit ("too many clients already"). Only added when you have not
// set a limit yourself.
try {
  const url = new URL(process.env.DATABASE_URL);
  if (!url.searchParams.has("connection_limit")) {
    url.searchParams.set("connection_limit", "5");
    process.env.DATABASE_URL = url.toString();
  }
} catch {
  // Not a standard URL: leave it exactly as given and let Prisma report it.
}

// ---------------------------------------------------------------------------
// 3-4. Database client and migrations
// ---------------------------------------------------------------------------
run("npx prisma generate");
run("npx prisma migrate deploy");

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
