import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Keep the production build strict: type errors and lint errors should fail the build.
  typescript: { ignoreBuildErrors: false },
  // Modern image formats for any logos you add later under /public.
  images: {
    remotePatterns: [{ protocol: "https", hostname: "upload.wikimedia.org", pathname: "/wikipedia/commons/**" }],
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
