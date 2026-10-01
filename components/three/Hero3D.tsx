"use client";

/**
 * HERO 3D
 *
 * Decides whether the three.js hero scene should exist on the page at all -
 * and, critically, decides that *before* the ~600KB three.js/R3F chunk is
 * ever requested, not after. `next/dynamic(..., { ssr: false })` only
 * controls when a component *renders*; the import behind it still fires the
 * moment the dynamic component is reached in the tree. So the gate has to
 * live one level up, in plain React state, and the dynamic import must sit
 * behind that state - never mounted at all on a phone, a low-end device, or
 * for anyone who has asked for reduced motion.
 *
 * Checked once on mount, not on resize: someone rotating a tablet mid-visit
 * should not suddenly pay for a three.js download.
 */

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const HeroCanvas = dynamic(() => import("./HeroCanvas"), { ssr: false });

export function Hero3D({ className = "" }: { className?: string }) {
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    const isWideEnough = window.matchMedia("(min-width: 1024px)").matches;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isFinePointer = window.matchMedia("(pointer: fine)").matches;
    // navigator.hardwareConcurrency is a rough, widely-supported proxy for
    // "is this a low-end device" - undefined on browsers that don't expose
    // it, in which case we simply don't gate on it.
    const looksLowEnd =
      typeof navigator.hardwareConcurrency === "number" && navigator.hardwareConcurrency <= 2;

    if (isWideEnough && isFinePointer && !prefersReducedMotion && !looksLowEnd) {
      setShouldRender(true);
    }
  }, []);

  if (!shouldRender) return null;

  return (
    <div aria-hidden="true" className={`pointer-events-none ${className}`}>
      <HeroCanvas />
    </div>
  );
}
