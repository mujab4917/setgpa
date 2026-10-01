"use client";

/**
 * Thin bar across the very top that fills as you scroll down a page.
 *
 * The scroll handler is deliberately tiny and wrapped in requestAnimationFrame,
 * so it runs at most once per frame rather than on every scroll event - that
 * matters on long university pages on a phone.
 */

import { useEffect, useState } from "react";

export function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frame = 0;

    const update = () => {
      frame = 0;
      const scrollable =
        document.documentElement.scrollHeight - window.innerHeight;

      // Short pages have nothing to scroll; showing a full bar would be a lie.
      if (scrollable <= 0) {
        setProgress(0);
        return;
      }

      setProgress(Math.min(100, (window.scrollY / scrollable) * 100));
    };

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="fixed inset-x-0 top-0 z-50 h-0.5 bg-transparent"
    >
      <div
        className="h-full bg-gradient-to-r from-brand-500 to-sky-400 transition-[width] duration-150 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
