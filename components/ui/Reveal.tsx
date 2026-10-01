"use client";

/**
 * SCROLL REVEAL
 *
 * Wraps any content and fades it upward the first time it scrolls into view.
 *
 * Why IntersectionObserver rather than a scroll listener: the browser does the
 * work off the main thread and only tells us when the element actually crosses
 * the threshold, instead of running our code on every single scroll frame. On
 * a mid-range phone that is the difference between smooth and janky.
 *
 * The animation itself is CSS (see .reveal in globals.css), so anyone with
 * "reduce motion" switched on simply sees the content, already visible.
 */

import { useEffect, useRef, useState, type ReactNode } from "react";

interface RevealProps {
  children: ReactNode;
  /** Milliseconds to wait before this element animates - used for staggering. */
  delay?: number;
  className?: string;
  /** Render as something other than a div, e.g. "li" inside a list. */
  as?: "div" | "li" | "section";
}

export function Reveal({
  children,
  delay = 0,
  className = "",
  as: Tag = "div",
}: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    // If the browser is too old for IntersectionObserver, show the content
    // immediately rather than leaving it invisible forever.
    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            // Reveal once, then stop watching - this never plays in reverse.
            observer.disconnect();
          }
        }
      },
      // Start slightly before the element reaches the bottom of the screen,
      // so it has finished animating by the time it is properly in view.
      { rootMargin: "0px 0px -8% 0px", threshold: 0.05 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      // One ref type covers div, li and section.
      ref={ref as React.RefObject<HTMLDivElement & HTMLLIElement>}
      className={`reveal ${visible ? "is-visible" : ""} ${className}`}
      style={delay ? { ["--reveal-delay" as string]: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  );
}
