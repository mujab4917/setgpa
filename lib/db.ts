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

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
