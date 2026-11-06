import type { ArtId } from "@/data/articles/types";

/**
 * Illustrations for the guides, drawn in code (no stock photos, so nothing to
 * license and nothing to download). Each one shows the idea of its guide:
 * a CGPA turning into a percentage, the letters of CGPA, semesters merging
 * into one number, a grade sheet, GPA beside CGPA.
 *
 * Decorative only: the page title already says the same in words, so they are
 * hidden from screen readers. The viewBox is 480x320 and the scene is kept
 * inside the middle so it survives being cropped to a card or a wide header.
 */

const C = {
  ink: "#1f2e29",
  pine: "#3a7459",
  dark: "#274c3c",
  mint: "#b6d9c7",
  peach: "#f8d0b0",
  terra: "#c4553a",
  cream: "#fbf6ea",
  muted: "#6b7a73",
  white: "#ffffff",
};

function Percent() {
  return (
    <>
      <circle cx="420" cy="40" r="96" fill={C.dark} opacity=".18" />
      <circle cx="40" cy="300" r="70" fill={C.peach} opacity=".5" />
      <g transform="rotate(-5 140 170)">
        <rect x="48" y="62" width="172" height="196" rx="20" fill={C.white} />
        <text x="70" y="104" fontSize="15" fontWeight="700" fill={C.muted}>CGPA</text>
        <text x="68" y="188" fontSize="78" fontWeight="800" fill={C.ink}>8.2</text>
        <rect x="70" y="214" width="112" height="9" rx="4.5" fill={C.mint} />
        <rect x="70" y="232" width="74" height="9" rx="4.5" fill={C.mint} />
      </g>
      <g transform="rotate(5 340 160)">
        <rect x="262" y="52" width="172" height="196" rx="20" fill={C.dark} />
        <text x="284" y="94" fontSize="15" fontWeight="700" fill={C.peach}>PERCENTAGE</text>
        <text x="282" y="172" fontSize="52" fontWeight="800" fill={C.peach}>77.9%</text>
        <rect x="284" y="198" width="112" height="9" rx="4.5" fill={C.pine} />
        <rect x="284" y="216" width="74" height="9" rx="4.5" fill={C.pine} />
      </g>
      <circle cx="240" cy="160" r="34" fill={C.terra} />
      <text x="240" y="168" fontSize="22" fontWeight="800" fill={C.white} textAnchor="middle">×9.5</text>
    </>
  );
}

function Terms() {
  const tiles = [
    { x: 40, l: "C", bg: C.white, fg: C.ink },
    { x: 144, l: "G", bg: C.peach, fg: C.ink },
    { x: 248, l: "P", bg: C.pine, fg: C.white },
    { x: 352, l: "A", bg: C.dark, fg: C.peach },
  ];
  return (
    <>
      <circle cx="60" cy="40" r="80" fill={C.dark} opacity=".15" />
      <circle cx="450" cy="290" r="90" fill={C.peach} opacity=".5" />
      {tiles.map((t, i) => (
        <g key={t.l} transform={`rotate(${i % 2 ? 3 : -3} ${t.x + 44} 130)`}>
          <rect x={t.x} y="78" width="88" height="104" rx="22" fill={t.bg} />
          <text x={t.x + 44} y="150" fontSize="64" fontWeight="800" fill={t.fg} textAnchor="middle">{t.l}</text>
        </g>
      ))}
      <rect x="84" y="214" width="312" height="54" rx="27" fill={C.cream} />
      <text x="240" y="248" fontSize="20" fontWeight="700" fill={C.ink} textAnchor="middle">
        Cumulative Grade Point Average
      </text>
    </>
  );
}

function Semesters() {
  const rows = [
    { y: 36, n: "Semester 1", v: "7.8" },
    { y: 128, n: "Semester 2", v: "8.6" },
    { y: 220, n: "Semester 3", v: "6.9" },
  ];
  return (
    <>
      <circle cx="430" cy="40" r="80" fill={C.dark} opacity=".15" />
      {rows.map((r) => (
        <g key={r.n}>
          <rect x="36" y={r.y} width="200" height="64" rx="18" fill={C.white} />
          <text x="56" y={r.y + 38} fontSize="16" fontWeight="700" fill={C.muted}>{r.n}</text>
          <text x="216" y={r.y + 44} fontSize="32" fontWeight="800" fill={C.ink} textAnchor="end">{r.v}</text>
          <path d={`M236 ${r.y + 32} C 280 ${r.y + 32} 262 160 290 160`} stroke={C.terra} strokeWidth="3" fill="none" strokeLinecap="round" />
        </g>
      ))}
      <circle cx="368" cy="160" r="84" fill={C.dark} />
      <text x="368" y="146" fontSize="18" fontWeight="700" fill={C.peach} textAnchor="middle">CGPA</text>
      <text x="368" y="198" fontSize="56" fontWeight="800" fill={C.white} textAnchor="middle">7.82</text>
    </>
  );
}

function Gpa() {
  const rows = [
    { y: 100, g: "A", p: "4.00" },
    { y: 142, g: "B+", p: "3.33" },
    { y: 184, g: "A-", p: "3.67" },
    { y: 226, g: "B", p: "3.00" },
  ];
  return (
    <>
      <circle cx="40" cy="40" r="76" fill={C.peach} opacity=".5" />
      <g transform="rotate(-3 170 160)">
        <rect x="52" y="34" width="232" height="256" rx="22" fill={C.white} />
        <text x="76" y="76" fontSize="16" fontWeight="700" fill={C.muted}>Semester grades</text>
        {rows.map((r) => (
          <g key={r.g}>
            <rect x="76" y={r.y} width="58" height="32" rx="11" fill={C.cream} />
            <text x="105" y={r.y + 23} fontSize="18" fontWeight="800" fill={C.ink} textAnchor="middle">{r.g}</text>
            <text x="262" y={r.y + 24} fontSize="22" fontWeight="800" fill={C.pine} textAnchor="end">{r.p}</text>
            <rect x="76" y={r.y + 38} width="186" height="2" fill={C.cream} />
          </g>
        ))}
      </g>
      <circle cx="378" cy="160" r="86" fill={C.terra} />
      <text x="378" y="142" fontSize="19" fontWeight="700" fill={C.white} textAnchor="middle">GPA</text>
      <text x="378" y="198" fontSize="58" fontWeight="800" fill={C.white} textAnchor="middle">3.44</text>
    </>
  );
}

function Versus() {
  const bars = [
    { x: 262, h: 106, f: C.pine },
    { x: 318, h: 148, f: C.dark },
    { x: 374, h: 82, f: C.mint },
  ];
  return (
    <>
      <circle cx="430" cy="40" r="84" fill={C.dark} opacity=".15" />
      <circle cx="30" cy="296" r="70" fill={C.peach} opacity=".5" />
      <text x="112" y="68" fontSize="24" fontWeight="800" fill={C.ink} textAnchor="middle">GPA</text>
      <rect x="76" y="118" width="72" height="130" rx="14" fill={C.peach} />
      <text x="112" y="274" fontSize="15" fontWeight="700" fill={C.muted} textAnchor="middle">one semester</text>
      <circle cx="206" cy="170" r="30" fill={C.terra} />
      <text x="206" y="180" fontSize="26" fontWeight="800" fill={C.white} textAnchor="middle">vs</text>
      <text x="346" y="68" fontSize="24" fontWeight="800" fill={C.ink} textAnchor="middle">CGPA</text>
      {bars.map((b) => (
        <rect key={b.x} x={b.x} y={248 - b.h} width="46" height={b.h} rx="12" fill={b.f} />
      ))}
      <line x1="250" y1="134" x2="440" y2="134" stroke={C.terra} strokeWidth="3" strokeDasharray="7 7" strokeLinecap="round" />
      <text x="346" y="274" fontSize="15" fontWeight="700" fill={C.muted} textAnchor="middle">all semesters so far</text>
    </>
  );
}

const scenes: Record<ArtId, () => React.JSX.Element> = {
  percent: Percent,
  terms: Terms,
  semesters: Semesters,
  gpa: Gpa,
  versus: Versus,
};

export function GuideArt({ art }: { art: ArtId }) {
  const Scene = scenes[art];
  return (
    <svg
      viewBox="0 0 480 320"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      focusable="false"
      className="absolute inset-0 h-full w-full"
      style={{ fontFamily: "var(--font-display), ui-sans-serif, system-ui, sans-serif" }}
    >
      <Scene />
    </svg>
  );
}
