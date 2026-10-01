/**
 * GRADE TABLE CHECKER  -  run with:  npm run db:check
 *
 * Reads every university in the database and checks its grade table for
 * problems that are provably wrong, whatever the university's real rules are.
 *
 * This does NOT tell you a table matches a university's handbook - nothing
 * automated can do that. What it catches is the class of mistake that makes a
 * calculator produce nonsense:
 *
 *   - a table with no grades at all
 *   - grade points that go UP as the letters get worse (B worth more than A)
 *   - the same letter listed twice
 *   - a top grade that does not reach the university's own GPA scale
 *   - no failing grade, so a failed course silently vanishes from the average
 *   - points outside 0 .. gpaScale
 *
 * Run it after every `npm run db:seed`. It exits with code 1 when anything is
 * wrong, so it also works in a deploy pipeline.
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface Problem {
  university: string;
  url: string;
  issue: string;
}

async function main(): Promise<void> {
  const universities = await prisma.university.findMany({
    where: { isActive: true },
    orderBy: [{ city: { name: "asc" } }, { name: "asc" }],
    select: {
      name: true,
      slug: true,
      gpaScale: true,
      isVerified: true,
      city: { select: { slug: true } },
      gradeRules: {
        orderBy: { sortOrder: "asc" },
        select: { grade: true, gradePoint: true },
      },
    },
  });

  const problems: Problem[] = [];
  let verifiedCount = 0;

  for (const university of universities) {
    const url = `/universities/${university.city.slug}/${university.slug}`;
    const add = (issue: string) =>
      problems.push({ university: university.name, url, issue });

    if (university.isVerified) verifiedCount += 1;

    const rules = university.gradeRules;

    if (rules.length === 0) {
      add("has no grade rules at all");
      continue;
    }

    // Duplicate letters: the calculator would show two identical options.
    const seen = new Set<string>();
    for (const rule of rules) {
      const key = rule.grade.trim().toUpperCase();
      if (seen.has(key)) add(`lists the grade "${rule.grade}" more than once`);
      seen.add(key);
    }

    // Points must never increase as you move down the table. Two grades may
    // share a value (A+ and A are both 4.00 at many universities), but a lower
    // letter worth MORE means the rows are in the wrong order.
    for (let i = 1; i < rules.length; i += 1) {
      const previous = rules[i - 1];
      const current = rules[i];
      if (current.gradePoint > previous.gradePoint) {
        add(
          `"${current.grade}" (${current.gradePoint}) is worth more than "${previous.grade}" (${previous.gradePoint}), which sits above it`,
        );
      }
    }

    // The best grade should reach the scale, otherwise nobody can score 4.00.
    const best = rules[0];
    if (best.gradePoint !== university.gpaScale) {
      add(
        `top grade "${best.grade}" is ${best.gradePoint} but the GPA scale is ${university.gpaScale}`,
      );
    }

    // Without a zero-point grade, failing a course would quietly raise the GPA.
    if (!rules.some((rule) => rule.gradePoint === 0)) {
      add("has no grade worth 0 points, so there is no way to record a fail");
    }

    // Anything outside the scale is a typo.
    for (const rule of rules) {
      if (rule.gradePoint < 0 || rule.gradePoint > university.gpaScale) {
        add(
          `"${rule.grade}" is ${rule.gradePoint}, outside the 0 - ${university.gpaScale} range`,
        );
      }
    }
  }

  // ---- Report ----
  console.log(`Checked ${universities.length} active universities.`);
  console.log(
    `  verified against a source: ${verifiedCount}`,
  );
  console.log(
    `  not yet verified:          ${universities.length - verifiedCount}`,
  );

  // How many distinct table shapes are in use - a quick sanity check that the
  // site is not accidentally giving every university the same grades.
  const shapes = new Map<string, number>();
  for (const university of universities) {
    const shape = university.gradeRules
      .map((rule) => `${rule.grade}=${rule.gradePoint}`)
      .join(",");
    shapes.set(shape, (shapes.get(shape) ?? 0) + 1);
  }
  console.log(`  distinct grade tables:     ${shapes.size}`);

  if (problems.length === 0) {
    console.log("\nNo structural problems found.");
    return;
  }

  console.log(`\n${problems.length} problem(s) found:\n`);
  for (const problem of problems) {
    console.log(`  ${problem.university}`);
    console.log(`    ${problem.url}`);
    console.log(`    -> ${problem.issue}\n`);
  }

  process.exitCode = 1;
}

main()
  .catch((error: unknown) => {
    console.error("Check failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
