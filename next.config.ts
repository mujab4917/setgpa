import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Keep the production build strict: type errors and lint errors should fail the build.
  typescript: { ignoreBuildErrors: false },
  // The guides moved under /guides. Permanent (308) redirects keep old links,
  // bookmarks and any search results for the old addresses working.
  async redirects() {
    return [
      { source: "/how-to-calculate-gpa", destination: "/guides/how-to-calculate-gpa", permanent: true },
      { source: "/gpa-vs-cgpa", destination: "/guides/gpa-vs-cgpa", permanent: true },
    ];
  },
  // Modern image formats for any logos you add later under /public.
  images: {
    remotePatterns: [{ protocol: "https", hostname: "upload.wikimedia.org", pathname: "/wikipedia/commons/**" }],
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
