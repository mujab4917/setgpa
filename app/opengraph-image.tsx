import { ImageResponse } from "next/og";

import { OG, OG_SIZE, OgFrame, OgPanel, ogOptions } from "@/lib/seo/og-card";

/**
 * The site-wide share card: used by the home page and by every page that has
 * no card of its own (About, Contact, the cities and guides lists).
 *
 * The right side is a miniature of the home page's gradebook: three courses,
 * a grade each, and the semester GPA they give.
 */

export const alt = "SetGPA: GPA and CGPA calculator for Pakistani universities";
export const size = OG_SIZE;
export const contentType = "image/png";

const COURSES = [
  { name: "Data Structures", grade: "A" },
  { name: "Calculus II", grade: "B+" },
  { name: "Technical Writing", grade: "A" },
  // (4.00 + 3.33 + 4.00) / 3 = 3.78, at equal credits.
];

export default async function SiteOpengraphImage() {
  return new ImageResponse(
    (
      <OgFrame
        title="GPA Calculator Pakistan"
        subtitle="Free CGPA calculator"
        chip="Free"
        note="Your university's own grades"
        right={
          <OgPanel width={420}>
            <div style={{ display: "flex", fontSize: 24, color: OG.ink, paddingBottom: 12, borderBottom: `3px solid ${OG.ink}` }}>
              Semester gradebook
            </div>
            {COURSES.map((course) => (
              <div key={course.name} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: `2px solid ${OG.line}` }}>
                <div style={{ display: "flex", fontSize: 26, color: OG.ink }}>{course.name}</div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 64, height: 44, borderRadius: 14, fontSize: 28, color: OG.ink, backgroundColor: OG.peach }}>
                  {course.grade}
                </div>
              </div>
            ))}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginTop: 14 }}>
              <div style={{ display: "flex", fontSize: 24, color: OG.muted, paddingBottom: 8 }}>Semester GPA</div>
              <div style={{ display: "flex", fontSize: 84, color: OG.terra, lineHeight: 1 }}>3.78</div>
            </div>
          </OgPanel>
        }
      />
    ),
    await ogOptions(),
  );
}
