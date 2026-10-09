import type { NextConfig } from "next";

// Static export for GitHub Pages. The site lives at
// https://leslylou0457.github.io/louvre-before-you-go/, so every path is
// prefixed with the repo name.
export const basePath = "/louvre-before-you-go";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  trailingSlash: true,
  images: { unoptimized: true },
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
};

export default nextConfig;
