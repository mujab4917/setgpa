import { ImageResponse } from "next/og";

import { OG, OG_SIZE, OgFrame, OgPanel, OgPanelHeader, ogOptions } from "@/lib/seo/og-card";

/** Share card for the "How to calculate GPA and CGPA" guide: its contents list. */

export const alt = "How to calculate GPA and CGPA: formula and examples";
export const size = OG_SIZE;
export const contentType = "image/png";

const SECTIONS = ["GPA formula", "Step by step", "Worked example", "How to calculate CGPA", "Common mistakes"];

export default async function GuideOpengraphImage() {
  return new ImageResponse(
    (
      <OgFrame
        title="How to Calculate GPA and CGPA"
        subtitle="Formula and examples"
        chip="Guide"
        note="Free · Plain English"
        right={
          <OgPanel width={420}>
            <OgPanelHeader left="In this guide" />
            {SECTIONS.map((section, index) => (
              <div key={section} style={{ display: "flex", alignItems: "center", padding: "13px 0", borderBottom: `2px solid ${OG.line}` }}>
                <div style={{ display: "flex", width: 14, height: 14, borderRadius: 7, marginRight: 16, backgroundColor: index === 0 ? OG.terra : OG.pine }} />
                <div style={{ display: "flex", fontSize: 30, color: OG.ink }}>{section}</div>
              </div>
            ))}
          </OgPanel>
        }
      />
    ),
    await ogOptions(),
  );
}
