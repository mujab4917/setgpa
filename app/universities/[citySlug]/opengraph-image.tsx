import { ImageResponse } from "next/og";

import { cityFocus } from "@/data/focus-pages";
import { getActiveCitySlugs, getCityBySlug } from "@/lib/queries/cities";
import { getUniversitiesByCitySlug } from "@/lib/queries/universities";
import { OG, OG_SIZE, OgFrame, OgPanel, OgPanelHeader, ogOptions } from "@/lib/seo/og-card";

/**
 * Share card for a city page: the city's name on the left, and the universities
 * a student will find there on the right. Built at build time, one per city.
 */

export const alt = "GPA and CGPA calculators for universities on SetGPA";
export const size = OG_SIZE;
export const contentType = "image/png";

export async function generateStaticParams() {
  const slugs = await getActiveCitySlugs();
  return slugs.map((citySlug) => ({ citySlug }));
}

const MAX_NAMES = 7;

export default async function CityOpengraphImage({ params }: { params: Promise<{ citySlug: string }> }) {
  const { citySlug } = await params;
  const [city, universities] = await Promise.all([getCityBySlug(citySlug), getUniversitiesByCitySlug(citySlug)]);

  const name = city?.name ?? "Pakistan";
  const count = universities.length;

  // A priority city lists its featured university first, as the page does.
  const featured = cityFocus[citySlug]?.featuredUniversitySlug;
  const ordered = [...universities].sort((a, b) => Number(b.slug === featured) - Number(a.slug === featured));
  const shown = ordered.slice(0, count > MAX_NAMES ? MAX_NAMES - 1 : MAX_NAMES);
  const hidden = count - shown.length;

  return new ImageResponse(
    (
      <OgFrame
        title={`GPA Calculator for ${name} Universities`}
        subtitle="Free GPA & CGPA calculators"
        chip={`${count} ${count === 1 ? "university" : "universities"}`}
        note="Own grade tables"
        right={
          <OgPanel width={420}>
            <OgPanelHeader left={name} right={`${count}`} />
            {shown.map((university, index) => (
              <div
                key={university.slug}
                style={{ display: "flex", alignItems: "center", padding: "9px 0", borderBottom: `2px solid ${OG.line}` }}
              >
                <div
                  style={{
                    display: "flex",
                    width: 14,
                    height: 14,
                    borderRadius: 7,
                    marginRight: 16,
                    backgroundColor: index === 0 ? OG.terra : OG.pine,
                  }}
                />
                <div style={{ display: "flex", fontSize: 28, color: OG.ink, lineHeight: 1.1 }}>
                  {(university.shortName ?? university.name).slice(0, 26)}
                </div>
              </div>
            ))}
            {hidden > 0 && (
              <div style={{ display: "flex", justifyContent: "center", paddingTop: 10, fontSize: 22, color: OG.muted }}>
                + {hidden} more
              </div>
            )}
          </OgPanel>
        }
      />
    ),
    await ogOptions(),
  );
}
