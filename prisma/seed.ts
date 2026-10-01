/**
 * ============================================================================
 * SEED SCRIPT  -  run with:  npm run db:seed
 * ============================================================================
 *
 * The data itself lives in prisma/seed-data/, split by region so each file
 * stays readable:
 *
 *   seed-data/types.ts                 shared types + the grade scales
 *   seed-data/cities.ts                every city
 *   seed-data/universities-lahore.ts   Lahore
 *   seed-data/universities-punjab.ts   rest of Punjab
 *   seed-data/universities-sindh.ts    Sindh
 *   seed-data/universities-north.ts    Islamabad, KP, Balochistan, AJK
 *
 * ---------------------------------------------------------------------------
 * ABOUT ACCURACY
 *
 * Grade tables follow the patterns published by each university where those
 * were found, and the closest documented pattern otherwise. They are entered
 * by hand and are not guaranteed to be free of mistakes - universities also
 * change their rules, and some departments differ from their own university.
 * Every university page carries a short note asking students to report
 * anything that does not match their handbook.
 *
 * When you confirm a university against its official handbook, set
 * `isVerified: true` and write a `sourceNote` for it in Prisma Studio, or add
 * those fields to its entry in the seed data.
 * ---------------------------------------------------------------------------
 *
 * HOW TO ADD A CITY
 *   1. Add an object to seed-data/cities.ts
 *   2. Add its universities to one of the universities-*.ts files
 *   3. npm run db:seed
 *
 * HOW TO ADD A UNIVERSITY
 *   1. Add an object to the right universities-*.ts file
 *   2. Point `citySlug` at an existing city
 *   3. Give it a unique `slug` inside that city - it becomes the URL
 *   4. Pick a `scale` from GRADE_SCALES in seed-data/types.ts
 *   5. npm run db:seed
 *
 * The script upserts, so re-running it updates existing rows rather than
 * creating duplicates. It never deletes cities or universities.
 */

import { PrismaClient } from "@prisma/client";

import { cities } from "./seed-data/cities";
import {
  GRADE_SCALES,
  type SeedGrade,
  type SeedUniversity,
} from "./seed-data/types";
import { lahoreUniversities } from "./seed-data/universities-lahore";
import { northUniversities } from "./seed-data/universities-north";
import { punjabUniversities } from "./seed-data/universities-punjab";
import { sindhUniversities } from "./seed-data/universities-sindh";

const prisma = new PrismaClient();

const universities: SeedUniversity[] = [
  ...lahoreUniversities,
  ...punjabUniversities,
  ...sindhUniversities,
  ...northUniversities,
];

// ---------------------------------------------------------------------------
// Text that follows the same pattern for every university.
// Edit these builders once and every university page changes.
// ---------------------------------------------------------------------------

/**
 * The grade table for a university: its own `customGrades` when it has them,
 * otherwise the shared named scale.
 */
function gradesFor(university: SeedUniversity): readonly SeedGrade[] {
  return university.customGrades ?? GRADE_SCALES[university.scale];
}

function buildGradingNotes(university: SeedUniversity): string {
  const rules = gradesFor(university);
  const top = rules[0];
  const lowestPass = rules[rules.length - 2];

  return `The table below records the grade points used at ${university.name} on a four point scale. The highest grade, ${top.grade}, is worth ${top.gradePoint.toFixed(2)}, and the lowest passing grade, ${lowestPass.grade}, is worth ${lowestPass.gradePoint.toFixed(2)}. Values are stored per university, so they never affect any other campus.`;
}

function buildGpaExplanation(university: SeedUniversity): string {
  return `For each course, multiply its credit hours by the grade point of the grade you received. That gives the quality points for the course. Add the quality points of every course you took at ${university.shortName} this semester, then divide by the total credit hours of those courses.`;
}

function buildCgpaExplanation(university: SeedUniversity): string {
  return `Your CGPA covers your whole degree at ${university.shortName}, not one semester. Multiply each completed semester's GPA by the credit hours of that semester, add those values together, then divide by the total credit hours of all of those semesters.`;
}

function buildMetaTitle(university: SeedUniversity): string {
  return `${university.shortName} GPA & CGPA Calculator`;
}

function buildMetaDescription(university: SeedUniversity): string {
  return `Calculate your ${university.name} semester GPA and cumulative CGPA using the grade table recorded for this campus, with the formula explained step by step.`;
}

// ---------------------------------------------------------------------------
// The script itself
// ---------------------------------------------------------------------------

async function seedCities(): Promise<Map<string, string>> {
  const cityIdBySlug = new Map<string, string>();

  for (const city of cities) {
    const data = {
      name: city.name,
      tagline: city.tagline,
      description: city.description,
      metaTitle: `University GPA & CGPA Calculators in ${city.name}`,
      metaDescription: `Find your university in ${city.name} and calculate your semester GPA or cumulative CGPA using that university's own grade table.`,
      isActive: true,
    };

    const saved = await prisma.city.upsert({
      where: { slug: city.slug },
      update: data,
      create: { ...data, slug: city.slug },
    });

    cityIdBySlug.set(saved.slug, saved.id);
  }

  console.log(`  cities: ${cities.length}`);
  return cityIdBySlug;
}

async function seedUniversities(cityIdBySlug: Map<string, string>): Promise<void> {
  const countByCity = new Map<string, number>();
  const seenSlugs = new Set<string>();

  for (const university of universities) {
    const cityId = cityIdBySlug.get(university.citySlug);
    if (!cityId) {
      throw new Error(
        `University "${university.name}" points at city "${university.citySlug}", which is not in the cities list.`,
      );
    }

    // Catches a copy-paste slip before it reaches the database, where the
    // second entry would silently overwrite the first.
    const key = `${university.citySlug}/${university.slug}`;
    if (seenSlugs.has(key)) {
      throw new Error(`Duplicate university slug in the seed data: ${key}`);
    }
    seenSlugs.add(key);

    const data = {
      name: university.name,
      shortName: university.shortName,
      shortDescription: university.summary,
      description: university.detail,
      campus: university.campus,
      logoUrl: null,
      website: university.website,
      establishedYear: university.established,
      sector: university.sector,
      universityType: university.type,
      notableFor: university.notableFor,
      gpaScale: 4,
      gradingSystemNotes: buildGradingNotes(university),
      gpaExplanation: buildGpaExplanation(university),
      cgpaExplanation: buildCgpaExplanation(university),
      metaTitle: buildMetaTitle(university),
      metaDescription: buildMetaDescription(university),
      ogTitle: buildMetaTitle(university),
      ogDescription: `Semester GPA and cumulative CGPA calculator built around the ${university.name} grade table.`,
      isVerified: university.verified ?? false,
      sourceNote: university.sourceNote ?? null,
      isActive: true,
    };

    const saved = await prisma.university.upsert({
      where: { cityId_slug: { cityId, slug: university.slug } },
      update: data,
      create: { ...data, slug: university.slug, cityId },
    });

    // Replace the grade table so re-running the seed never leaves stale grades.
    // Each university gets its own rows, from customGrades or its named scale.
    const rules = gradesFor(university);
    await prisma.gradeRule.deleteMany({ where: { universityId: saved.id } });
    await prisma.gradeRule.createMany({
      data: rules.map((rule, index) => ({
        universityId: saved.id,
        grade: rule.grade,
        gradePoint: rule.gradePoint,
        sortOrder: index,
        minPercentage: rule.minPercentage ?? null,
        maxPercentage: rule.maxPercentage ?? null,
      })),
    });

    countByCity.set(
      university.citySlug,
      (countByCity.get(university.citySlug) ?? 0) + 1,
    );
  }

  for (const city of cities) {
    const count = countByCity.get(city.slug) ?? 0;
    console.log(`  ${city.name.padEnd(18)} ${String(count).padStart(2)} universities`);
  }
}

/**
 * Hides universities that are live in the database but no longer in the seed
 * data - for example one that was moved to a different city, which would
 * otherwise leave a copy behind at its old URL.
 *
 * It DEACTIVATES rather than deletes, so nothing you added by hand in Prisma
 * Studio is ever destroyed by running the seed. Anything hidden is listed, and
 * you can set isActive back to true if it was yours.
 */
async function retireMissingUniversities(): Promise<void> {
  const seededKeys = new Set(
    universities.map((university) => `${university.citySlug}/${university.slug}`),
  );

  const live = await prisma.university.findMany({
    where: { isActive: true },
    select: { id: true, name: true, slug: true, city: { select: { slug: true } } },
  });

  const stale = live.filter(
    (university) => !seededKeys.has(`${university.city.slug}/${university.slug}`),
  );

  if (stale.length === 0) return;

  await prisma.university.updateMany({
    where: { id: { in: stale.map((university) => university.id) } },
    data: { isActive: false },
  });

  console.log(`\n  Hid ${stale.length} university page(s) no longer in the seed data:`);
  for (const university of stale) {
    console.log(`    - ${university.city.slug}/${university.slug} (${university.name})`);
  }
  console.log("    These were deactivated, not deleted.");
}

async function main(): Promise<void> {
  console.log("Seeding cities and universities...");
  const cityIdBySlug = await seedCities();
  await seedUniversities(cityIdBySlug);
  await retireMissingUniversities();
  console.log(
    `Seed complete: ${cities.length} cities, ${universities.length} universities.`,
  );
}

main()
  .catch((error: unknown) => {
    console.error("Seed failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
