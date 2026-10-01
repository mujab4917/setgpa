/**
 * EXPORT UNIVERSITIES  -  run with:  npm run db:export
 *
 * Dumps every active city, university and grade rule to JSON so the data can
 * be reviewed outside the app - in a spreadsheet, or by someone checking it
 * against their own university handbook.
 *
 * Writes to exports/universities.json by default; pass a path to change it.
 */

import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main(): Promise<void> {
  const outPath = resolve(
    process.argv[2] ?? "exports/universities.json",
  );

  const cities = await prisma.city.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" },
    select: { name: true, slug: true, tagline: true },
  });

  const universities = await prisma.university.findMany({
    where: { isActive: true },
    orderBy: [{ city: { name: "asc" } }, { name: "asc" }],
    select: {
      name: true,
      shortName: true,
      slug: true,
      campus: true,
      website: true,
      establishedYear: true,
      sector: true,
      universityType: true,
      notableFor: true,
      gpaScale: true,
      isVerified: true,
      sourceNote: true,
      city: { select: { name: true, slug: true } },
      gradeRules: {
        orderBy: { sortOrder: "asc" },
        select: {
          grade: true,
          gradePoint: true,
          minPercentage: true,
          maxPercentage: true,
          sortOrder: true,
        },
      },
    },
  });

  const payload = {
    exportedAt: new Date().toISOString(),
    counts: {
      cities: cities.length,
      universities: universities.length,
      gradeRules: universities.reduce((n, u) => n + u.gradeRules.length, 0),
      verified: universities.filter((u) => u.isVerified).length,
    },
    cities,
    universities,
  };

  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, JSON.stringify(payload, null, 2), "utf8");

  console.log(`Exported to ${outPath}`);
  console.log(
    `  ${payload.counts.cities} cities, ${payload.counts.universities} universities, ${payload.counts.gradeRules} grade rules (${payload.counts.verified} verified)`,
  );
}

main()
  .catch((error: unknown) => {
    console.error("Export failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
