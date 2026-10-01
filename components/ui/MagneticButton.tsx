"use client";

/**
 * MAGNETIC BUTTON
 *
 * Wraps a button/link so it nudges a few pixels toward the cursor while
 * hovered, then springs back on leave - the small, tactile detail that
 * separates a "designed" primary action from a plain CSS hover state.
 *
 * Skipped entirely (children render with no wrapper behaviour) on touch
 * devices, where there's no persistent pointer to react to, and under
 * prefers-reduced-motion.
 */

import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { type PointerEvent, type ReactNode } from "react";

export function MagneticButton({
  children,
  className = "",
  strength = 0.35,
}: {
  children: ReactNode;
  className?: string;
  /** 0-1: how much of the pointer offset the button follows. */
  strength?: number;
}) {
  const prefersReducedMotion = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 300, damping: 20, mass: 0.5 });
  const springY = useSpring(y, { stiffness: 300, damping: 20, mass: 0.5 });

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    if (prefersReducedMotion || event.pointerType === "touch") return;
    const bounds = event.currentTarget.getBoundingClientRect();
    x.set((event.clientX - bounds.left - bounds.width / 2) * strength);
    y.set((event.clientY - bounds.top - bounds.height / 2) * strength);
  }

  function handlePointerLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      style={{ x: springX, y: springY }}
      className={`inline-block ${className}`}
    >
      {children}
    </motion.div>
  );
}
