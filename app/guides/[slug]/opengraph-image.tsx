import { ImageResponse } from "next/og";

import { articles, getArticle } from "@/data/articles";
import { OG_SIZE, OgFrame, OgPanel, OgPanelHeader, OgRow, ogOptions } from "@/lib/seo/og-card";

/** Share card for every guide in data/articles: its title plus a small table from the guide. */

export const alt = "SetGPA guide";
export const size = OG_SIZE;
export const contentType = "image/png";

export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

export default async function GuideOpengraphImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getArticle(slug);
  const rows = article?.card.rows ?? [];

  return new ImageResponse(
    (
      <OgFrame
        title={article?.title ?? "SetGPA guide"}
        subtitle={article?.card.subtitle ?? "Guide"}
        chip={article?.card.chip ?? "Guide"}
        note="Free · Plain English"
        right={
          <OgPanel width={420}>
            <OgPanelHeader left={article?.card.panelTitle ?? "SetGPA"} />
            {rows.map(([label, value], i) => (
              <OgRow key={label + i} label={label} value={value} hot={i === rows.length - 1} badge />
            ))}
          </OgPanel>
        }
      />
    ),
    await ogOptions(),
  );
}
