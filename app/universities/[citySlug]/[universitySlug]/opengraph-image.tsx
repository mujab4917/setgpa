import { ImageResponse } from "next/og";

import {
  getAllUniversityPaths,
  getUniversityBySlug,
} from "@/lib/queries/universities";
import { OG_LOGO_DATA_URL } from "@/lib/seo/og-logo";
import { siteConfig } from "@/lib/site-config";

/**
 * Social preview image for a university page.
 *
 * When someone shares a link on WhatsApp, Facebook or LinkedIn, the platform
 * looks for an Open Graph image. Without one the link is a bare grey box, which
 * reads as untrustworthy - and WhatsApp sharing is exactly how a site like this
 * spreads between students.
 *
 * Next.js finds this file by name and adds the tags automatically. The image is
 * generated at build time alongside the page, so it costs nothing per request.
 */

export const alt = "University GPA and CGPA calculator on SetGPA";
export const size = { width: 1200, height: 630 };

export const contentType = "image/png";

/**
 * Without this, Next.js renders the image on every request. Listing the same
 * universities the page uses turns it into a static PNG produced once at build
 * time, so a shared link costs no database query and no image rendering.
 */
export async function generateStaticParams() {
  const paths = await getAllUniversityPaths();
  return paths.map((path) => ({
    citySlug: path.citySlug,
    universitySlug: path.slug,
  }));
}

export default async function OpengraphImage({
  params,
}: {
  params: Promise<{ citySlug: string; universitySlug: string }>;
}) {
  const { citySlug, universitySlug } = await params;
  const university = await getUniversityBySlug(citySlug, universitySlug);

  const title = university?.name ?? siteConfig.name;
  const city = university?.city.name ?? "Pakistan";

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
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={OG_LOGO_DATA_URL} alt={siteConfig.name} width={300} height={69} />

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              color: "#ffffff",
              fontSize: title.length > 40 ? "60px" : "72px",
              fontWeight: 700,
              lineHeight: 1.1,
            }}
          >
            {title}
          </div>
          <div
            style={{
              display: "flex",
              marginTop: "24px",
              color: "#f8d0b0",
              fontSize: "40px",
              fontWeight: 600,
            }}
          >
            GPA &amp; CGPA Calculator
          </div>
        </div>

        <div style={{ display: "flex", color: "#94a3b8", fontSize: "30px" }}>
          {city} · Built around this university&apos;s own grade table
        </div>
      </div>
    ),
    size,
  );
}
