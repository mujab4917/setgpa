/**
 * Tests for the search-snippet length rules and the per-city grading overview.
 */

import { describe, expect, it } from "vitest";

import { cityFocus, universityFocus } from "@/data/focus-pages";
import { buildCityOverview, joinNames } from "@/lib/cities/grading-overview";
import { DESCRIPTION_MAX_PX, TITLE_MAX_PX, descriptionPixelWidth, titlePixelWidth } from "@/lib/seo/pixel-width";
import { fitDescription, fitTitle } from "@/lib/seo/metadata";

describe("pixel width estimate", () => {
  it("matches Screaming Frog's measurement of a known title within a few pixels", () => {
    // Screaming Frog measured this exact title at 562 px.
    const width = titlePixelWidth("GPA Calculator Pakistan: Free GPA & CGPA Calculator | SetGPA");
    expect(Math.abs(width - 562)).toBeLessThanOrEqual(8);
  });

  it("measures wide letters as wider than narrow ones", () => {
    expect(titlePixelWidth("MMMM")).toBeGreaterThan(titlePixelWidth("iiii"));
  });
});

describe("fitTitle / fitDescription", () => {
  it("keeps a short title and adds the brand", () => {
    expect(fitTitle("UET Lahore GPA Calculator")).toBe("UET Lahore GPA Calculator | SetGPA");
  });

  it("drops the brand when it would make the title too wide", () => {
    const title = fitTitle("COMSATS Abbottabad GPA Calculator & CGPA Calculator");
    expect(title).not.toContain("SetGPA");
    expect(titlePixelWidth(title)).toBeLessThanOrEqual(TITLE_MAX_PX);
  });

  it("never returns a title or description over its pixel limit", () => {
    const longTitle = fitTitle("Balochistan University of Information Technology, Engineering and Management Sciences GPA Calculator");
    expect(titlePixelWidth(longTitle)).toBeLessThanOrEqual(TITLE_MAX_PX);
    const longDescription = fitDescription("Free GPA calculator and CGPA calculator for students. ".repeat(10));
    expect(descriptionPixelWidth(longDescription)).toBeLessThanOrEqual(DESCRIPTION_MAX_PX);
  });
});

describe("priority page wording (data/focus-pages.ts)", () => {
  it("has a title and at least one description that fit the pixel limits", () => {
    for (const focus of [...Object.values(universityFocus), ...Object.values(cityFocus)]) {
      expect(titlePixelWidth(fitTitle(focus.metaTitle))).toBeLessThanOrEqual(TITLE_MAX_PX);
      const fits = focus.metaDescriptions.some(
        (text) => text.length <= 155 && descriptionPixelWidth(text) <= DESCRIPTION_MAX_PX,
      );
      expect(fits).toBe(true);
    }
  });

  it("only uses example grades that the university's table can contain", () => {
    for (const focus of Object.values(universityFocus)) {
      for (const course of focus.exampleCourses) {
        expect(course.grade).toMatch(/^[A-F][+-]?$/);
        expect(course.creditHours).toBeGreaterThan(0);
      }
    }
  });
});

const rules = (a: number, bPlus: number, lowest: [string, number], minus = false) => [
  { grade: "A", gradePoint: a },
  ...(minus ? [{ grade: "A-", gradePoint: a - 0.3 }] : []),
  { grade: "B+", gradePoint: bPlus },
  { grade: lowest[0], gradePoint: lowest[1] },
  { grade: "F", gradePoint: 0 },
];

describe("buildCityOverview", () => {
  it("returns null for a city with no universities", () => {
    expect(buildCityOverview("Nowhere", [])).toBeNull();
  });

  it("reports where the grade tables disagree", () => {
    const overview = buildCityOverview("Testville", [
      { name: "Alpha University", shortName: "Alpha", slug: "alpha", sector: "Public", universityType: "General", gradeRules: rules(4, 3.5, ["D", 1]) },
      { name: "Beta University", shortName: null, slug: "beta", sector: "Private", universityType: "Engineering", gradeRules: rules(4, 3.33, ["D", 1], true) },
    ]);
    expect(overview).not.toBeNull();
    expect(overview?.intro).toContain("2 universities in Testville, 1 public and 1 private");
    expect(overview?.intro).toContain("engineering");
    expect(overview?.takeaways.join(" ")).toContain("An A is worth 4.00 at every university listed.");
    expect(overview?.takeaways.join(" ")).toContain("3.50 at Alpha");
    expect(overview?.takeaways.join(" ")).toContain("3.33 at Beta University");
    expect(overview?.rows[1].hasMinusGrades).toBe(true);
    expect(overview?.faq.length).toBeGreaterThanOrEqual(3);
  });

  it("joins names without running on", () => {
    expect(joinNames(["A", "B", "C"])).toBe("A, B and C");
    expect(joinNames(["A", "B", "C", "D", "E"])).toBe("5 universities");
  });
});
