import Link from "next/link";

import { CityArtwork } from "@/components/cities/CityArtwork";
import { TiltCard } from "@/components/ui/TiltCard";
import { getCityTheme } from "@/lib/city-theme";
import { routes } from "@/lib/routes";
import type { CityListItem } from "@/types/domain";

/**
 * One clickable city. The whole card is a single link, so the entire tile is
 * a tap target - which matters on a phone.
 *
 * The artwork is generated SVG illustration (see CityArtwork), never a stock
 * photo - every city gets its own skyline with no image to download and no
 * copyright question. TiltCard adds the pointer-driven 3D tilt + glare; the
 * university-count pill floats above the card plane (translateZ) so it reads
 * as a separate layer once the card tilts.
 */
export function CityCard({ city }: { city: CityListItem }) {
  const theme = getCityTheme(city.slug);

  return (
    <TiltCard maxTilt={7} className="group h-full rounded-3xl">
      <Link
        href={routes.city(city.slug)}
        className="preserve-3d flex h-full flex-col overflow-hidden rounded-3xl border border-ink-900/10 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-shadow duration-300 group-hover:shadow-[0_28px_60px_-20px_rgba(15,23,42,0.35)]"
      >
        <div className="preserve-3d relative h-44 w-full overflow-hidden sm:h-48">
          {/* The artwork zooms slowly on hover, clipped by the card. */}
          <CityArtwork
            slug={city.slug}
            className="h-full w-full scale-105 transition-transform duration-[900ms] ease-out group-hover:scale-[1.18]"
          />

          {/* City name sits on the artwork, with a scrim so it stays readable
              whatever colour the gradient happens to be. */}
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent p-4 pt-10">
            <h3
              className="text-2xl font-bold tracking-tight text-white drop-shadow-sm transition-transform duration-300 group-hover:-translate-y-0.5"
              style={{ transform: "translateZ(24px)" }}
            >
              {city.name}
            </h3>
          </div>

          {/* Floating pill, lifted off the card plane so it visibly separates
              once the card tilts in 3D. */}
          <span
            className="glass-panel absolute right-3 top-3 rounded-full px-2.5 py-1 text-xs font-semibold text-white shadow-lg"
            style={{ transform: "translateZ(38px)" }}
          >
            {city.universityCount}{" "}
            {city.universityCount === 1 ? "university" : "universities"}
          </span>
        </div>

        <div className="flex flex-1 flex-col p-4" style={{ transform: "translateZ(12px)" }}>
          {city.tagline && (
            <p className="text-sm leading-relaxed text-ink-700">{city.tagline}</p>
          )}

          <div className="mt-4 flex items-center justify-between pt-1">
            <span
              className="rounded-full px-2.5 py-1 text-xs font-semibold"
              style={{ backgroundColor: theme.soft, color: theme.ink }}
            >
              Grade tables ready
            </span>
            <span
              aria-hidden="true"
              className="flex h-8 w-8 items-center justify-center rounded-full border border-ink-900/20 text-sm font-semibold text-ink-900 transition-all duration-200 group-hover:translate-x-1 group-hover:border-brand-600 group-hover:bg-brand-600 group-hover:text-white"
            >
              &rarr;
            </span>
          </div>
        </div>
      </Link>
    </TiltCard>
  );
}
