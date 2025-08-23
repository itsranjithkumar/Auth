import type { NextConfig } from "next";

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // 👈 disables ESLint in build
  },
  typescript: {
    ignoreBuildErrors: true, // 👈 disables TypeScript type errors in build
  },
};

module.exports = nextConfig;
