import { ImageResponse } from "next/og";

import { OG, OG_SIZE, OgFrame, OgPanel, OgPanelHeader, ogOptions } from "@/lib/seo/og-card";

/** Share card for the "GPA vs CGPA" guide: the one-line difference, side by side. */

export const alt = "GPA vs CGPA: what is the difference";
export const size = OG_SIZE;
export const contentType = "image/png";

function Block({ name, text, hot = false }: { name: string; text: string; hot?: boolean }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        marginTop: 14,
        padding: "16px 22px",
        borderRadius: 22,
        backgroundColor: hot ? OG.terra : OG.cream,
      }}
    >
      <div style={{ display: "flex", fontSize: 54, color: hot ? "#ffffff" : OG.pine, lineHeight: 1.05 }}>{name}</div>
      <div style={{ display: "flex", fontSize: 28, color: hot ? "#ffffff" : OG.ink, marginTop: 4 }}>{text}</div>
    </div>
  );
}

export default async function GuideOpengraphImage() {
  return new ImageResponse(
    (
      <OgFrame
        title="GPA vs CGPA: What's the Difference?"
        subtitle="With worked examples"
        chip="Guide"
        note="Free · Plain English"
        right={
          <OgPanel width={420}>
            <OgPanelHeader left="The difference" />
            <Block name="GPA" text="One semester" />
            <Block name="CGPA" text="Your whole degree so far" hot />
          </OgPanel>
        }
      />
    ),
    await ogOptions(),
  );
}
