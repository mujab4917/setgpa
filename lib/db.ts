/**
 * The single Prisma client instance for the whole application.
 *
 * SERVER ONLY. Never import this file from a component that has "use client"
 * at the top - the database connection must never reach the browser.
 *
 * In development Next.js reloads modules on every file change, which would
 * open a new database connection each time. Caching the client on globalThis
 * avoids running out of PostgreSQL connections.
 */

import { PrismaClient } from "@prisma/client";

/**
 * Which database to connect to.
 *
 *   1. DATABASE_URL, if set. This is how local development works (your own
 *      PostgreSQL, see .env) and how an external database such as Neon works.
 *      Prisma reads it by itself, so nothing is returned here.
 *   2. Otherwise NETLIFY_DB_URL, the connection string Netlify Database gives
 *      the live site at https://setgpa.com. Prisma does not know this name, so
 *      it is passed in explicitly.
 *
 * Two safety settings are added to the Netlify string because a serverless
 * site opens many short-lived connections:
 *   - pgbouncer=true   works through a connection pooler (no prepared statements)
 *   - connection_limit keeps each server instance to a few connections
 * Both are only added when the string does not already set them.
 */
function netlifyDatabaseUrl(): string | undefined {
  if (process.env.DATABASE_URL) return undefined;

  const raw = process.env.NETLIFY_DB_URL;
  if (!raw) return undefined;

  try {
    const url = new URL(raw);
    if (!url.searchParams.has("pgbouncer")) url.searchParams.set("pgbouncer", "true");
    if (!url.searchParams.has("connection_limit")) url.searchParams.set("connection_limit", "3");
    return url.toString();
  } catch {
    return raw;
  }
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const datasourceUrl = netlifyDatabaseUrl();

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    ...(datasourceUrl ? { datasourceUrl } : {}),
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
