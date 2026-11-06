import { GuideArt } from "@/components/guides/GuideArt";
import type { CoverTone, GuideCover as Cover } from "@/data/articles/types";

/**
 * A guide's picture: its illustration on a tinted panel. Pass a height or
 * aspect class (default is a card-sized strip). The panel colour keeps the
 * hub varied: each guide has its own tone.
 */
const tones: Record<CoverTone, string> = {
  brand: "bg-brand-300",
  marker: "bg-marker-300",
  cream: "bg-cream-200",
  terracotta: "bg-terracotta-200",
};

export function GuideCover({ cover, className = "h-44" }: { cover: Cover; className?: string }) {
  return (
    <div className={`relative overflow-hidden ${tones[cover.tone]} ${className}`}>
      <GuideArt art={cover.art} />
    </div>
  );
}
