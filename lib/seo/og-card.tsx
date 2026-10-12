import { readFile } from "node:fs/promises";
import path from "node:path";

import type { ReactNode } from "react";

import { OG_LOGO_DATA_URL } from "@/lib/seo/og-logo";
import { siteConfig } from "@/lib/site-config";

/**
 * Shared look of every share card (Google Images thumbnail, WhatsApp preview,
 * LinkedIn card): a cream half with the page's name, and a green half with
 * something useful from the page - a grade table, a list of universities, a
 * worked example. Each page type supplies its own right-hand panel.
 *
 * Satori (the engine behind next/og) only understands a small slice of CSS:
 * every element with more than one child needs display:flex, and there is no grid.
 */

export const OG_SIZE = { width: 1200, height: 630 };

export const OG = {
  ink: "#1f2e29",
  pine: "#1f6b4f",
  pineDark: "#17543e",
  cream: "#fbf6ea",
  line: "#eee6d6",
  peach: "#f8d0b0",
  terra: "#c4553a",
  muted: "#6b7a73",
} as const;

/**
 * The site's own display font (Bricolage Grotesque ExtraBold, SIL Open Font
 * Licence), kept in assets/fonts. The built-in image font has no bold weight,
 * which made names too thin to read as a thumbnail.
 */
const fontData = readFile(path.join(process.cwd(), "assets", "fonts", "BricolageGrotesque-ExtraBold.ttf"));

/** Options for `new ImageResponse(element, await ogOptions())`. */
export async function ogOptions() {
  return {
    ...OG_SIZE,
    fonts: [{ name: "Bricolage", data: await fontData, weight: 800 as const, style: "normal" as const }],
  };
}

/** Font size for a big title, smaller as the text gets longer so it keeps to ~3 lines. */
export function titleSizeFor(text: string): number {
  return text.length > 44 ? 58 : text.length > 36 ? 64 : text.length > 24 ? 76 : 90;
}

/** The white card that sits on the green half. */
export function OgPanel({ children, width = 392 }: { children: ReactNode; width?: number }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width,
        backgroundColor: "#ffffff",
        borderRadius: 30,
        padding: "24px 30px 18px",
        boxShadow: "0 24px 60px rgba(0,0,0,0.4)",
      }}
    >
      {children}
    </div>
  );
}

/** A heading row inside the panel, with a heavy rule under it. */
export function OgPanelHeader({ left, right }: { left: string; right?: string }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: 12, borderBottom: `3px solid ${OG.ink}` }}>
      <div style={{ display: "flex", fontSize: 24, color: OG.ink }}>{left}</div>
      {right ? <div style={{ display: "flex", fontSize: 24, color: OG.ink }}>{right}</div> : null}
    </div>
  );
}

export function OgFrame({
  title,
  subtitle,
  chip,
  note,
  right,
}: {
  title: string;
  subtitle: string;
  /** Peach pill at the bottom left (a city, "Guide", ...). */
  chip: string;
  /** Plain text beside the pill. */
  note: string;
  right: ReactNode;
}) {
  return (
    <div style={{ width: "100%", height: "100%", display: "flex", backgroundColor: OG.cream, fontFamily: "Bricolage", fontWeight: 800 }}>
      {/* ---------- Left: what this page is ---------- */}
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: 690, padding: "56px 30px 54px 64px" }}>
        <div style={{ display: "flex" }}>
          <div style={{ display: "flex", alignItems: "center", backgroundColor: OG.pine, borderRadius: 18, padding: "12px 22px" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={OG_LOGO_DATA_URL} alt={siteConfig.name} width={190} height={44} />
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: titleSizeFor(title), color: OG.ink, lineHeight: 1.04, letterSpacing: -2 }}>{title}</div>
          <div style={{ display: "flex", alignItems: "center", marginTop: 26 }}>
            <div style={{ display: "flex", width: 8, height: 44, backgroundColor: OG.terra, borderRadius: 4, marginRight: 18 }} />
            <div style={{ display: "flex", fontSize: 40, color: OG.pineDark }}>{subtitle}</div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center" }}>
          <div style={{ display: "flex", flexShrink: 0, whiteSpace: "nowrap", fontSize: 28, color: OG.ink, backgroundColor: OG.peach, borderRadius: 30, padding: "8px 22px", marginRight: 14 }}>
            {chip}
          </div>
          <div style={{ display: "flex", whiteSpace: "nowrap", fontSize: 28, color: "#4f5f58" }}>{note}</div>
        </div>
      </div>

      {/* ---------- Right: something useful from the page ---------- */}
      <div style={{ display: "flex", flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: OG.pine, position: "relative" }}>
        <div style={{ display: "flex", position: "absolute", top: -120, right: -120, width: 360, height: 360, borderRadius: 180, backgroundColor: OG.pineDark }} />
        <div style={{ display: "flex", position: "absolute", bottom: -150, left: -90, width: 300, height: 300, borderRadius: 150, backgroundColor: OG.pineDark }} />
        {right}
      </div>
    </div>
  );
}

/** A row of small label + value (a grade and its points, a course and its grade). */
export function OgRow({
  label,
  value,
  hot = false,
  badge = true,
}: {
  label: string;
  value: string;
  hot?: boolean;
  badge?: boolean;
}) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "4px 0", borderBottom: `2px solid ${OG.line}` }}>
      {badge ? (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 72,
            height: 46,
            borderRadius: 14,
            fontSize: 32,
            color: hot ? "#ffffff" : OG.ink,
            backgroundColor: hot ? OG.terra : OG.cream,
          }}
        >
          {label}
        </div>
      ) : (
        <div style={{ display: "flex", fontSize: 28, color: OG.ink }}>{label}</div>
      )}
      <div style={{ display: "flex", fontSize: 38, color: hot ? OG.terra : OG.pine }}>{value}</div>
    </div>
  );
}
