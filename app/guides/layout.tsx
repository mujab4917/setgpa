import { Fraunces } from "next/font/google";
import type { ReactNode } from "react";

/**
 * The guides read like a magazine, so their headlines use a warm editorial
 * serif. The font is loaded here, not in the root layout, so every other page
 * (calculators, universities) does not download it.
 */
const serif = Fraunces({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-serif-face",
  axes: ["opsz"],
});

export default function GuidesLayout({ children }: { children: ReactNode }) {
  return <div className={serif.variable}>{children}</div>;
}
