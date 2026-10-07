/**
 * Facts about how grading differs between the universities of ONE city,
 * computed from their grade tables.
 *
 * Nothing here is written by hand per city: every sentence is built from the
 * grade rules in the database, so the text is specific to each city, stays
 * correct when a table is edited, and never invents a claim.
 */

export interface OverviewGradeRule {
  grade: string;
  gradePoint: number;
}

export interface OverviewUniversity {
  name: string;
  shortName: string | null;
  slug: string;
  sector: string | null;
  universityType: string | null;
  gradeRules: OverviewGradeRule[];
}

export interface OverviewRow {
  slug: string;
  label: string;
  topGrade: string;
  aPoints: number | null;
  bPlusPoints: number | null;
  lowestPass: string;
  hasMinusGrades: boolean;
}

export interface CityOverview {
  intro: string;
  rows: OverviewRow[];
  takeaways: string[];
  faq: { question: string; answer: string }[];
}

const points = (value: number) => value.toFixed(2);

function labelOf(university: OverviewUniversity): string {
  return university.shortName ?? university.name;
}

function pointsFor(rules: OverviewGradeRule[], grade: string): number | null {
  return rules.find((rule) => rule.grade === grade)?.gradePoint ?? null;
}

/** The lowest grade that still earns points, e.g. "D (1.00)". */
function lowestPassing(rules: OverviewGradeRule[]): OverviewGradeRule | null {
  const passing = rules.filter((rule) => rule.gradePoint > 0);
  return passing.length > 0 ? passing[passing.length - 1] : null;
}

/** "A, B and C". Long lists become a count so a sentence never runs on. */
export function joinNames(names: string[], maxNamed = 4): string {
  if (names.length > maxNamed) return `${names.length} universities`;
  if (names.length <= 1) return names.join("");
  return `${names.slice(0, -1).join(", ")} and ${names[names.length - 1]}`;
}

/** Groups labels by a value: [{ value: "4.00", names: ["A", "B"] }, ...]. */
function groupBy(items: { label: string; value: string }[]): { value: string; names: string[] }[] {
  const groups = new Map<string, string[]>();
  for (const item of items) {
    groups.set(item.value, [...(groups.get(item.value) ?? []), item.label]);
  }
  return [...groups.entries()]
    .map(([value, names]) => ({ value, names }))
    .sort((a, b) => b.names.length - a.names.length);
}

/** "An A is worth 4.00 at X and Y, and 3.70 at Z." (or "...at every university listed."). */
function describeGroups(
  prefix: string,
  groups: { value: string; names: string[] }[],
  total: number,
): string | null {
  if (groups.length === 0) return null;
  if (groups.length === 1) {
    return groups[0].names.length === total && total > 1
      ? `${prefix} ${groups[0].value} at every university listed.`
      : `${prefix} ${groups[0].value} at ${joinNames(groups[0].names)}.`;
  }
  const parts = groups.map((group) => `${group.value} at ${joinNames(group.names)}`);
  return `${prefix} ${parts.slice(0, -1).join(", ")} and ${parts[parts.length - 1]}.`;
}

export function buildCityOverview(
  cityName: string,
  universities: OverviewUniversity[],
): CityOverview | null {
  const total = universities.length;
  if (total === 0) return null;

  const rows: OverviewRow[] = universities.map((university) => {
    const lowest = lowestPassing(university.gradeRules);
    return {
      slug: university.slug,
      label: labelOf(university),
      topGrade: university.gradeRules[0]
        ? `${university.gradeRules[0].grade} = ${points(university.gradeRules[0].gradePoint)}`
        : "-",
      aPoints: pointsFor(university.gradeRules, "A"),
      bPlusPoints: pointsFor(university.gradeRules, "B+"),
      lowestPass: lowest ? `${lowest.grade} = ${points(lowest.gradePoint)}` : "-",
      hasMinusGrades: university.gradeRules.some((rule) => rule.grade.endsWith("-")),
    };
  });

  // ---- Intro: who is in this city ----
  const publicCount = universities.filter((u) => u.sector === "Public").length;
  const privateCount = universities.filter((u) => u.sector === "Private").length;
  const noun = total === 1 ? "university" : "universities";
  const sectorText =
    publicCount + privateCount === total && publicCount > 0 && privateCount > 0
      ? `, ${publicCount} public and ${privateCount} private`
      : publicCount === total
        ? ", all public"
        : privateCount === total
          ? ", all private"
          : "";
  const types = [
    ...new Set(
      universities
        .map((u) => u.universityType?.toLowerCase())
        .filter((type): type is string => Boolean(type) && type !== "general"),
    ),
  ];
  const typeText =
    types.length > 0 ? ` Besides general universities, the list includes ${joinNames(types, 5)} institutions.` : "";
  const intro = `SetGPA lists ${total} ${noun} in ${cityName}${sectorText}.${typeText} Each one has its own grade table, so the same letter grade can be worth different points depending on where you study.`;

  // ---- Takeaways: where the tables disagree ----
  const takeaways: string[] = [];

  const aText = describeGroups(
    "An A is worth",
    groupBy(rows.filter((r) => r.aPoints !== null).map((r) => ({ label: r.label, value: points(r.aPoints as number) }))),
    total,
  );
  if (aText) takeaways.push(aText);

  const bPlusText = describeGroups(
    "A B+ is worth",
    groupBy(rows.filter((r) => r.bPlusPoints !== null).map((r) => ({ label: r.label, value: points(r.bPlusPoints as number) }))),
    total,
  );
  if (bPlusText) takeaways.push(bPlusText);

  const minus = rows.filter((r) => r.hasMinusGrades);
  if (total > 1) {
    if (minus.length === total) {
      takeaways.push("Every table uses minus grades, but not the same ones, so check your own result card for the exact letters.");
    } else if (minus.length === 0) {
      takeaways.push("None of these tables use minus grades; a grade is a plain letter such as A, B+ or C.");
    } else {
      takeaways.push(
        `${joinNames(minus.map((r) => r.label))} ${minus.length === 1 ? "uses" : "use"} minus grades such as B-; the others do not.`,
      );
    }
  }

  const lowestText = describeGroups(
    "The lowest passing grade is",
    groupBy(rows.filter((r) => r.lowestPass !== "-").map((r) => ({ label: r.label, value: r.lowestPass.replace(" = ", " (") + ")" }))),
    total,
  );
  if (lowestText) takeaways.push(lowestText);

  // ---- FAQ ----
  const distinctA = new Set(rows.map((r) => r.aPoints)).size;
  const distinctB = new Set(rows.map((r) => r.bPlusPoints)).size;
  const sameScale = total > 1 && distinctA === 1 && distinctB === 1;

  const faq = [
    {
      question: `Do all universities in ${cityName} use the same grade points?`,
      answer:
        total === 1
          ? `${cityName} has one university on SetGPA, so there is nothing to compare. Its page shows the full grade table.`
          : sameScale
            ? `The top grades match here, but lower grades and minus grades can still differ. Open your university's page and use its own table.`
            : `No. ${takeaways[0] ?? ""} ${takeaways[1] ?? ""} Always use the table of your own university, because a calculator built for another one will give the wrong GPA.`.replace(/\s+/g, " ").trim(),
    },
    {
      question: `How do I calculate my GPA at a ${cityName} university?`,
      answer: `Pick your university from the list above, enter each course's credit hours and grade, and press Calculate. The calculator uses that university's grade table, so a B+ is worth what your university says it is worth. To track several semesters, switch to the CGPA tab on the same page.`,
    },
    ...(lowestText
      ? [
          {
            question: `What is the lowest passing grade at ${cityName} universities?`,
            answer: `${lowestText} Passing rules can also depend on your program, so confirm with your department before relying on it.`,
          },
        ]
      : []),
  ];

  return { intro, rows, takeaways, faq };
}
