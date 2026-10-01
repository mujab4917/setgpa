/**
 * Per-city colour and artwork settings.
 *
 * Each city gets its own colour and its own skyline shape, chosen from its
 * slug. Because the slug never changes, a city always looks the same on every
 * page - but adding a new city needs no design work and no image file.
 */

import { cityOrder } from "@/data/site-content";

export interface CityTheme {
  /** Gradient start (top-left). */
  from: string;
  /** Gradient end (bottom-right). */
  to: string;
  /** Tint used behind the city initial and small accents. */
  soft: string;
  /** Readable text colour on the soft tint. */
  ink: string;
}

/**
 * Ten hand-picked gradients. They are deliberately similar in depth and
 * saturation, so a grid of cities reads as one set rather than a colour clash.
 */
const PALETTE: CityTheme[] = [
  { from: "#3f7a6b", to: "#7fb5a2", soft: "#e2f0ea", ink: "#2f5d51" }, // sage
  { from: "#4f6f95", to: "#8fb0d0", soft: "#e4edf6", ink: "#3b5677" }, // mist blue
  { from: "#b0785a", to: "#dfae8f", soft: "#f8ece3", ink: "#87543a" }, // clay
  { from: "#3f7f8c", to: "#83bcc6", soft: "#e0f1f4", ink: "#2f606a" }, // lagoon
  { from: "#7a6a9a", to: "#b3a5d0", soft: "#eeeaf6", ink: "#5b4d7a" }, // lavender
  { from: "#4a8580", to: "#8ec4bd", soft: "#e2f2f0", ink: "#376560" }, // teal
  { from: "#a2687b", to: "#d6a3b3", soft: "#f6e8ed", ink: "#7d4a5c" }, // rose
  { from: "#5d6d7c", to: "#9aa9b6", soft: "#e8edf1", ink: "#465360" }, // slate
  { from: "#7b8c4f", to: "#b6c584", soft: "#eef2df", ink: "#5a6a37" }, // olive
  { from: "#a4665f", to: "#d69d95", soft: "#f6e6e3", ink: "#7d4a44" }, // brick
];

/**
 * Small, stable string hash. Same slug always gives the same number, on the
 * server and in the browser, so there is never a hydration mismatch.
 */
function hashSlug(slug: string): number {
  let hash = 0;
  for (let i = 0; i < slug.length; i += 1) {
    hash = (hash * 31 + slug.charCodeAt(i)) >>> 0;
  }
  return hash;
}

/**
 * The colours for one city.
 *
 * Cities listed in cityOrder.priority take their colour from their position in
 * that list, which guarantees the first ten cities are all different - hashing
 * alone produced duplicates, and two identical cards in one grid look like a
 * mistake. Anything not on that list falls back to the hash, so it still gets
 * a stable colour without any configuration.
 */
export function getCityTheme(slug: string): CityTheme {
  const rank = cityOrder.priority.indexOf(slug);
  const index = rank === -1 ? hashSlug(slug) : rank;
  return PALETTE[index % PALETTE.length];
}

/**
 * Heights for the twelve buildings in the skyline drawing, derived from the
 * slug so every city gets a recognisably different silhouette.
 * Values are a fraction of the artwork height.
 */
export function getSkylineHeights(slug: string, count = 12): number[] {
  const hash = hashSlug(slug);
  const heights: number[] = [];

  for (let i = 0; i < count; i += 1) {
    // Pull a different slice of the hash for each building.
    const noise = (hash >>> (i % 8)) * (i + 3);
    heights.push(0.3 + ((noise % 45) / 100));
  }

  return heights;
}
