/**
 * WRITING MASCOT
 *
 * The friendly graduate character, now genuinely alive rather than a still
 * drawing with a couple of moving parts:
 *  - It scribbles on a notepad and sends small "signal" dots drifting toward
 *    whatever sits below it - in every place this is used, that is a search
 *    box, so the character visibly points a visitor at it.
 *  - Every few seconds it waves, and once every ~10 seconds it does a little
 *    celebration hop where its mortarboard cap flies off, tumbles, and lands
 *    back on its head - a graduation cap toss.
 *  - The ground shadow shrinks and lightens while it's airborne, which is
 *    most of what sells the "hop" as a jump rather than a slide.
 *  - Hover it and it flies straight up and hovers there for as long as the
 *    cursor stays on it, then drops back into its usual loop the moment the
 *    cursor leaves (pure CSS :hover - see .mascot-root in globals.css).
 *
 * Plain inline SVG + CSS animation, same technique as CityArtwork: nothing to
 * download, nothing that can 404. All animation is CSS (see globals.css), so
 * it collapses to a still drawing under prefers-reduced-motion automatically -
 * no client-side JS needed at all, which is why this stays a Server Component.
 *
 * Purely decorative: aria-hidden, so screen readers go straight to the
 * heading and the search input next to it.
 */
export function WritingMascot({ className = "" }: { className?: string }) {
  // `absolute` lives here rather than in each caller's className: every
  // caller positions this against a search box with offsets like
  // `-top-9 -right-4`, and if a caller's className also said "absolute" it
  // would collide with a "relative" set here - Tailwind's generated
  // stylesheet order decides which position value wins, not the order
  // classes appear in this string, so that collision silently produced
  // `position: relative` instead and the mascot pushed the box down through
  // normal document flow rather than floating over it. One position value
  // declared once, here, removes the collision entirely.
  //
  // `mascot-root` + real pointer-events (not "none") is what lets the CSS
  // :hover rule below fly the character up while the cursor is over it, and
  // drop it straight back into its usual writing/waving/cap-toss loop the
  // moment the cursor leaves - a hover effect needs something to hover.
  return (
    <div className={`mascot-root absolute ${className}`} aria-hidden="true">
      <svg viewBox="0 0 200 220" className="h-full w-full overflow-visible drop-shadow-xl">
        {/* Ground shadow - shrinks and fades while the character is airborne. */}
        <ellipse cx="102" cy="206" rx="46" ry="8" className="mascot-shadow-toss fill-ink-900" />

        {/* Everything except the cap hops together as one gesture. */}
        <g className="mascot-toss-cycle">
          {/* Feet */}
          <ellipse cx="84" cy="194" rx="11" ry="7" className="fill-ink-900/80" />
          <ellipse cx="120" cy="194" rx="11" ry="7" className="fill-ink-900/80" />

          {/* Body */}
          <ellipse cx="102" cy="160" rx="40" ry="36" className="fill-brand-400" />

          {/* Left arm - waves every few seconds, a second action distinct
              from the writing hand and the cap toss. */}
          <g className="mascot-wave-arm" style={{ transformOrigin: "66px 148px" }}>
            <path
              d="M66 148c-11-2-19 4-22 14"
              fill="none"
              strokeWidth="12"
              strokeLinecap="round"
              className="stroke-brand-400"
            />
            <circle cx="42" cy="162" r="7" className="fill-brand-300" />
          </g>

          {/* Notepad, held out in front */}
          <g transform="translate(14 128) rotate(-6)">
            <rect width="46" height="34" rx="6" className="fill-cream-50 stroke-ink-900/15" strokeWidth="1.5" />
            <path
              d="M8 22c4-9 9-9 13-2s9 7 13 0s9-9 13-2"
              fill="none"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              pathLength="1"
              className="mascot-scribble stroke-terracotta-500"
            />
          </g>

          {/* Right arm + pencil, animated like it's mid-stroke */}
          <g className="mascot-pencil-arm" style={{ transformOrigin: "138px 150px" }}>
            <path
              d="M138 150c12-4 21 1 26 11"
              fill="none"
              strokeWidth="12"
              strokeLinecap="round"
              className="stroke-brand-400"
            />
            <g transform="translate(160 158) rotate(52)">
              <rect x="0" y="0" width="26" height="6" rx="3" className="fill-terracotta-400" />
              <polygon points="26,0 33,3 26,6" className="fill-ink-900/70" />
            </g>
          </g>

          {/* Head */}
          <circle cx="102" cy="102" r="46" className="fill-brand-500" />

          {/* Cheeks */}
          <circle cx="78" cy="112" r="6" className="fill-terracotta-300" opacity="0.55" />
          <circle cx="126" cy="112" r="6" className="fill-terracotta-300" opacity="0.55" />

          {/* Eyes */}
          <circle cx="88" cy="98" r="5.5" className="fill-ink-900" />
          <circle cx="116" cy="98" r="5.5" className="fill-ink-900" />
          <circle cx="90" cy="96" r="1.7" className="fill-cream-50" />
          <circle cx="118" cy="96" r="1.7" className="fill-cream-50" />

          {/* Smile */}
          <path
            d="M90 116c6 6 15 6 22 1"
            fill="none"
            strokeWidth="4.5"
            strokeLinecap="round"
            className="stroke-ink-900"
          />
        </g>

        {/* Mortarboard cap - flies off and lands back on its own timeline. */}
        <g className="mascot-cap-toss-cycle">
          <rect x="83" y="64" width="38" height="10" rx="3" className="fill-ink-900" />
          <path d="M102 42 148 64 102 80 56 64Z" className="fill-terracotta-500" />
          <circle cx="102" cy="61" r="3.5" className="fill-terracotta-200" />
          <path d="M148 64v17" strokeWidth="2.5" strokeLinecap="round" className="stroke-ink-900/70" />
          <circle cx="148" cy="85" r="4.5" className="fill-terracotta-300" />
        </g>
      </svg>

      {/* Signal dots - three small pulses drifting down-left, toward the
          search box this mascot is always placed just above/right of. */}
      <span className="mascot-dot mascot-dot-1" />
      <span className="mascot-dot mascot-dot-2" />
      <span className="mascot-dot mascot-dot-3" />
    </div>
  );
}
