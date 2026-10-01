import { getCityTheme, getSkylineHeights } from "@/lib/city-theme";

/**
 * The banner drawing on a city card.
 *
 * It is an inline SVG rather than a photograph on purpose:
 *  - no image file to download, so the grid renders instantly
 *  - nothing can 404, and no copyright question over university photos
 *  - a new city gets artwork automatically, with no design work
 *
 * The silhouette is a skyline with a dome and minaret. Building heights and
 * colours come from the city slug, so each city looks different but they all
 * belong to the same set.
 *
 * Purely decorative: aria-hidden, so screen readers skip it and read the
 * city name instead.
 */
export function CityArtwork({
  slug,
  className = "",
}: {
  slug: string;
  className?: string;
}) {
  const theme = getCityTheme(slug);
  const heights = getSkylineHeights(slug);

  // Gradient ids must be unique on the page, otherwise every card would reuse
  // whichever gradient was defined first.
  const skyId = `sky-${slug}`;
  const glowId = `glow-${slug}`;

  const width = 400;
  const height = 150;
  const baseline = height;
  const buildingWidth = width / heights.length;

  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="xMidYMid slice"
      className={className}
      role="presentation"
    >
      <defs>
        <linearGradient id={skyId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={theme.from} />
          <stop offset="100%" stopColor={theme.to} />
        </linearGradient>
        <radialGradient id={glowId} cx="0.8" cy="0.25" r="0.6">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect width={width} height={height} fill={`url(#${skyId})`} />
      <rect width={width} height={height} fill={`url(#${glowId})`} />

      <g stroke="white" opacity="0.1">
        {[40, 80, 120, 160, 200, 240, 280, 320, 360].map(x => <path key={x} d={`M${x} 0V150`} />)}
        {[30, 60, 90, 120].map(y => <path key={y} d={`M0 ${y}H400`} />)}
      </g>
      {/* Moon */}
      <circle cx="332" cy="40" r="15" fill="#ffffff" opacity="0.5" />
      <circle cx="326" cy="36" r="13" fill={theme.from} opacity="0.45" />

      {/* Skyline. One group so the whole silhouette shares an opacity. */}
      <g fill="#1f2e29" opacity="0.32">
        {heights.map((ratio, index) => {
          const barHeight = ratio * height;
          return (
            <rect
              key={index}
              x={index * buildingWidth}
              y={baseline - barHeight}
              width={buildingWidth + 0.5}
              height={barHeight}
            />
          );
        })}
      </g>

      {/* Dome and minarets, drawn in front of the skyline. */}
      <g fill="#1f2e29" opacity="0.5">
        {/* Left minaret */}
        <rect x="86" y="52" width="9" height="98" />
        <path d="M86 54 a4.5 5 0 0 1 9 0 z" />
        <rect x="88.5" y="42" width="4" height="12" />

        {/* Main dome and hall */}
        <path d="M110 150 V92 a34 30 0 0 1 68 0 V150 z" />
        <path d="M144 56 a3 3 0 0 1 0 8 z" />
        <rect x="142.5" y="50" width="3" height="12" />

        {/* Right minaret */}
        <rect x="193" y="52" width="9" height="98" />
        <path d="M193 54 a4.5 5 0 0 1 9 0 z" />
        <rect x="195.5" y="42" width="4" height="12" />
      </g>

      {/* Ground line, to sit the skyline on something. */}
      <rect y={height - 5} width={width} height="5" fill="#1f2e29" opacity="0.4" />
      {/* Original study collage, layered over the city skyline. */}
      <g transform="translate(235 28) rotate(10 50 50)">
        <rect x="5" y="6" width="81" height="98" rx="7" fill="#1f2e29" opacity="0.3" />
        <rect width="81" height="98" rx="7" fill="#f8fafc" />
        <rect width="12" height="98" rx="5" fill="#b6d9c7" />
        <path d="M24 55h41M24 68h32M24 81h37" stroke="#94a3b8" strokeWidth="3" strokeLinecap="round" />
        <path d="m19 28 29-15 28 15-28 15Z" fill={theme.from} />
        <path d="M31 37v9q17 12 33 0v-9" fill={theme.from} />
        <path d="M75 29v19" stroke="#e8b96a" strokeWidth="3" />
      </g>
      <g fill="none" stroke="#fef3c7" strokeWidth="2" strokeLinecap="round">
        <path d="M218 22v12m-6-6h12M355 92v14m-7-7h14M206 74l6 6 13-18" />
      </g>
      {slug === "islamabad" && <g fill="#e2e8f0" transform="translate(103 60)">
        <path d="M0 71 49 0 98 71Z" /><path d="m49 0 13 71h36Z" fill="#94a3b8" />
        <path d="M-8 75V-18M106 75V-18" stroke="#e2e8f0" strokeWidth="4" />
      </g>}
      {slug === "lahore" && <g fill="#e2e8f0">
        <path d="M139 136 152 35 165 136Z" /><path d="M146 78h13M143 100h19M140 124h24" stroke={theme.from} strokeWidth="3" />
      </g>}
    </svg>
  );
}
