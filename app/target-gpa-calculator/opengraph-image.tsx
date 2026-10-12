import { ImageResponse } from "next/og";

import { OG, OG_SIZE, OgFrame, OgPanel, OgPanelHeader, ogOptions } from "@/lib/seo/og-card";

/**
 * Share card for the Target GPA page: a small worked example, so the card
 * shows what the tool answers. The numbers are a fixed example, not live data:
 * (3.20 x 45 - 3.00 x 30) / 15 = 3.60.
 */

export const alt = "Target GPA calculator: what grade point average you need next semester";
export const size = OG_SIZE;
export const contentType = "image/png";

function Line({ label, value, hot = false }: { label: string; value: string; hot?: boolean }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "9px 0", borderBottom: `2px solid ${OG.line}` }}>
      <div style={{ display: "flex", fontSize: 26, color: OG.ink }}>{label}</div>
      <div style={{ display: "flex", fontSize: 34, color: hot ? OG.terra : OG.pine }}>{value}</div>
    </div>
  );
}

export default async function TargetOpengraphImage() {
  return new ImageResponse(
    (
      <OgFrame
        title="Target GPA Calculator"
        subtitle="What do you need next semester?"
        chip="Free"
        note="Uses your grade table"
        right={
          <OgPanel width={420}>
            <OgPanelHeader left="Example" />
            <Line label="Current CGPA" value="3.00" />
            <Line label="Credits done" value="30" />
            <Line label="Target CGPA" value="3.20" />
            <Line label="Next semester" value="15 cr" />
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: 14, backgroundColor: OG.terra, borderRadius: 22, padding: "12px 0 14px" }}>
              <div style={{ display: "flex", fontSize: 22, color: "#ffffff" }}>You need a GPA of</div>
              <div style={{ display: "flex", fontSize: 76, color: "#ffffff", lineHeight: 1.05 }}>3.60</div>
            </div>
          </OgPanel>
        }
      />
    ),
    await ogOptions(),
  );
}
