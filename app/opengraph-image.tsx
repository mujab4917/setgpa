import { ImageResponse } from "next/og";

import { siteConfig } from "@/lib/site-config";

/**
 * Default social preview image (WhatsApp, Facebook, LinkedIn, X).
 *
 * Next.js attaches this to every page that does not have its own
 * opengraph-image file - the homepage, the guides, the city pages and so on.
 * University pages keep their own image (see
 * app/universities/[citySlug]/[universitySlug]/opengraph-image.tsx).
 *
 * It needs no database, so it is generated once at build time.
 */

export const alt = "SetGPA: GPA and CGPA calculator for Pakistani universities";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function DefaultOpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#1f2e29",
          padding: "72px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "72px",
              height: "72px",
              borderRadius: "18px",
              backgroundColor: "#f8d0b0",
              color: "#1f2e29",
              fontSize: "34px",
              fontWeight: 800,
            }}
          >
            SG
          </div>
          <div style={{ display: "flex", color: "#ffffff", fontSize: "40px", fontWeight: 800 }}>
            {siteConfig.name}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              color: "#ffffff",
              fontSize: "76px",
              fontWeight: 800,
              lineHeight: 1.05,
              maxWidth: "980px",
            }}
          >
            GPA and CGPA calculator for Pakistani universities
          </div>
          <div style={{ display: "flex", color: "#f8d0b0", fontSize: "34px", marginTop: "28px" }}>
            Your university&apos;s own grade table. Free, no account.
          </div>
        </div>

        <div style={{ display: "flex", color: "#b6d9c7", fontSize: "30px" }}>setgpa.com</div>
      </div>
    ),
    size,
  );
}
