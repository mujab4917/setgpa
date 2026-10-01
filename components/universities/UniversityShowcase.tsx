"use client";

/**
 * UNIVERSITY SHOWCASE - a bright, multi-card carousel of real campus photos.
 *
 * Deliberately different from CityCard: cities get generated illustration
 * (see CityArtwork), but a university is a real place, so this uses actual
 * campus photographs (curated, licensed Commons images - see
 * data/place-photos.ts). Each slide is a plain card, never a link: this
 * section is a "look at real campuses" showcase, not a navigation grid.
 *
 * Shows several full-brightness cards side by side (one on a phone, three on
 * a laptop) rather than a single spotlighted slide - the point is to prove
 * there is real campus photography behind more than one or two universities,
 * so hiding most of them behind a dimmed, receding stack works against that.
 */

import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useEffect, useState } from "react";

import { photoUrl, type PlacePhoto } from "@/data/place-photos";

export interface ShowcaseItem {
  key: string;
  name: string;
  cityName: string;
  photo: PlacePhoto;
}

export function UniversityShowcase({ items }: { items: ShowcaseItem[] }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    loop: true,
    skipSnaps: false,
    slidesToScroll: 1,
  });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  if (items.length === 0) return null;

  return (
    <div>
      <div className="relative">
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="-ml-5 flex touch-pan-y">
            {items.map((item) => (
              <div
                key={item.key}
                className="min-w-0 shrink-0 grow-0 basis-[85%] pl-5 sm:basis-1/2 lg:basis-1/3"
              >
                <figure className="group flex h-full flex-col overflow-hidden rounded-3xl border border-ink-900/10 bg-white shadow-sm transition-shadow duration-300 hover:shadow-xl">
                  <div className="relative aspect-[4/3] w-full overflow-hidden">
                    <Image
                      src={photoUrl(item.photo)}
                      alt={item.photo.caption}
                      fill
                      sizes="(max-width: 640px) 85vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-xs font-semibold text-brand-700 shadow-sm">
                      {item.cityName}
                    </span>
                  </div>

                  <figcaption className="flex flex-1 flex-col p-4">
                    <p className="font-semibold text-ink-900">{item.name}</p>
                    <p className="mt-1 text-xs leading-relaxed text-ink-700">
                      {item.photo.caption} · Photo: {item.photo.author} · CC
                      BY-SA {item.photo.version}
                    </p>
                  </figcaption>
                </figure>
              </div>
            ))}
          </div>
        </div>

        {/* Arrow controls, tucked just outside the card edge on desktop. */}
        <button
          type="button"
          onClick={() => emblaApi?.scrollPrev()}
          aria-label="Show previous campus"
          className="absolute left-0 top-1/2 hidden -translate-x-4 -translate-y-1/2 items-center justify-center rounded-full border border-ink-900/10 bg-white p-2.5 text-ink-700 shadow-lg transition-transform hover:scale-105 hover:text-brand-700 sm:flex"
        >
          <ArrowIcon className="rotate-180" />
        </button>
        <button
          type="button"
          onClick={() => emblaApi?.scrollNext()}
          aria-label="Show next campus"
          className="absolute right-0 top-1/2 hidden -translate-y-1/2 translate-x-4 items-center justify-center rounded-full border border-ink-900/10 bg-white p-2.5 text-ink-700 shadow-lg transition-transform hover:scale-105 hover:text-brand-700 sm:flex"
        >
          <ArrowIcon />
        </button>
      </div>

      {/* Dot controls - the primary navigation on a phone, where the arrows
          are hidden to leave more room for the cards. */}
      <div className="mt-6 flex items-center justify-center gap-2">
        {items.map((item, index) => (
          <button
            key={item.key}
            type="button"
            onClick={() => emblaApi?.scrollTo(index)}
            aria-label={`Show ${item.name}`}
            aria-current={index === selectedIndex}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === selectedIndex
                ? "w-7 bg-brand-500"
                : "w-2 bg-slate-300 hover:bg-slate-400"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

function ArrowIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={`h-4 w-4 ${className}`}
    >
      <path d="M9 6l6 6-6 6" />
    </svg>
  );
}
