import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Allow production builds to complete even with ESLint errors
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Allow production builds to complete even with TypeScript errors
    ignoreBuildErrors: true,
  },
  experimental: {
    // Enable React 19 support
    reactCompiler: false,
  },
  images: {
    domains: [
      'images.unsplash.com',
      'via.placeholder.com',
      'cdn.example.com'
    ],
  },
};

export default nextConfig;
