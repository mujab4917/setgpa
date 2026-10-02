"use client";

/**
 * PARALLAX BAND
 *
 * A full-bleed photo section that moves slower than the page scrolls, so the
 * image appears to sit "behind" the page rather than scrolling with it - the
 * classic parallax trick, done with framer-motion's scroll progress instead
 * of a background-attachment: fixed hack (which iOS Safari never supported).
 *
 * The photo stays bright and fully visible - the headline sits in a solid
 * white "spotlight" card instead of a dark scrim over the whole image, so a
 * nice photo doesn't get smothered just to keep the text readable.
 *
 * Falls back to a perfectly still image under prefers-reduced-motion: the
 * photo and headline are always fully visible either way, motion is the only
 * thing that changes.
 */

import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef, type ReactNode } from "react";

import { photoUrl, type PlacePhoto } from "@/data/place-photos";

export function ParallaxBand({
  photo,
  eyebrow,
  heading,
  children,
}: {
  photo: PlacePhoto;
  eyebrow: string;
  heading: string;
  children?: ReactNode;
}) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], ["-12%", "12%"]);
  const cardY = useTransform(scrollYProgress, [0, 1], ["8%", "-8%"]);

  return (
    <section
      ref={sectionRef}
      className="scene-3d relative isolate overflow-hidden bg-cream-100 pb-16 pt-10 sm:py-36"
    >
      <motion.div
        aria-hidden="true"
        style={prefersReducedMotion ? undefined : { y: imageY }}
        className="absolute inset-0 -z-20 scale-125"
      >
        <Image
          src={photoUrl(photo)}
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
        />
      </motion.div>
      {/* Just enough of a warm wash at the edges to keep the card and caption
          readable - the middle of the photo stays clear and bright. */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-ink-900/35 via-transparent to-ink-900/10" />

      <motion.div
        style={prefersReducedMotion ? undefined : { y: cardY }}
        className="preserve-3d mx-auto w-full max-w-2xl px-4 sm:px-6"
      >
        <div
          className="relative mx-auto rounded-3xl border border-ink-900/10 bg-white p-5 text-left shadow-2xl sm:p-12"
          style={{ transform: "translateZ(20px)" }}
        >
          <h2 className="text-xl font-bold text-ink-900 sm:text-5xl sm:leading-[1.05]">
            {heading}
          </h2>
          {children && (
            <div className="mt-5 text-sm leading-relaxed text-ink-700 sm:text-base">
              {children}
            </div>
          )}
        </div>
      </motion.div>

      <p className="absolute bottom-4 right-4 z-10 rounded-full bg-ink-900/40 px-2.5 py-1 text-[11px] text-white sm:right-6">
        {photo.caption} · Photo: {photo.author} · CC BY-SA {photo.version}
      </p>
    </section>
  );
}
