import type { MetadataRoute } from "next";

import { siteConfig } from "@/lib/site-config";

/**
 * Web app manifest - served at /manifest.webmanifest.
 *
 * It tells phones what to call the site and which icon and colours to use when
 * a student adds SetGPA to their home screen. Icons are produced by
 * scripts/generate-brand-assets.mjs.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${siteConfig.name}: GPA and CGPA Calculator for Pakistan`,
    short_name: siteConfig.name,
    description: siteConfig.defaultMetaDescription,
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#dbe9e1",
    theme_color: "#3a7459",
    lang: "en",
    categories: ["education"],
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
