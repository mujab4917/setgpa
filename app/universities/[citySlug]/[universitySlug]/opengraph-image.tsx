import { ImageResponse } from "next/og";

import {
  getAllUniversityPaths,
  getUniversityBySlug,
} from "@/lib/queries/universities";
import { OG_SIZE, OgFrame, OgPanel, OgPanelHeader, OgRow, ogOptions } from "@/lib/seo/og-card";
import { siteConfig } from "@/lib/site-config";

/**
 * Social preview image for a university page - also the thumbnail Google
 * Images and WhatsApp show for it.
 *
 * Left: the university's name, big, so it reads at thumbnail size.
 * Right: that university's own grade table, so the card shows something
 * useful, not just a logo. The values come from the same database rows as the
 * page, so the card cannot disagree with it.
 *
 * Next.js finds this file by name and adds the tags automatically. The image is
 * generated at build time alongside the page, so it costs nothing per request.
 */

export const alt = "University GPA and CGPA calculator on SetGPA";
export const size = OG_SIZE;

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

const MAX_ROWS = 8;

export default async function OpengraphImage({
  params,
}: {
  params: Promise<{ citySlug: string; universitySlug: string }>;
}) {
  const { citySlug, universitySlug } = await params;
  const university = await getUniversityBySlug(citySlug, universitySlug);

  const title = university?.name ?? siteConfig.name;
  const city = university?.city.name ?? "Pakistan";

  // F is left out: it is always 0 and takes a row from grades people look up.
  const rows = (university?.gradeRules ?? [])
    .filter((rule) => rule.grade !== "F")
    .map((rule) => ({ grade: rule.grade, point: Number(rule.gradePoint) }));
  // One row fewer when a "+ N more" line is added, so the card never touches the edge.
  const shown = rows.slice(0, rows.length > MAX_ROWS ? MAX_ROWS - 1 : MAX_ROWS);
  const hidden = rows.length - shown.length;

  return new ImageResponse(
    (
      <OgFrame
        title={title}
        subtitle="GPA & CGPA Calculator"
        chip={city}
        note="Free · No sign-up"
        right={
          <OgPanel>
            <OgPanelHeader left="Grade" right="Points" />
            {shown.map((row, index) => (
              <OgRow key={row.grade} label={row.grade} value={row.point.toFixed(2)} hot={index === 0} />
            ))}
            {hidden > 0 && (
              <div style={{ display: "flex", justifyContent: "center", paddingTop: 10, fontSize: 22, color: "#6b7a73" }}>
                + {hidden} more on the page
              </div>
            )}
          </OgPanel>
        }
      />
    ),
    await ogOptions(),
  );
}
