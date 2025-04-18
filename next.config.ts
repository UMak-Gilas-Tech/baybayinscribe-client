import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  // Remove the static export to allow dynamic API routes
  // output: "export",
};

export default nextConfig;
