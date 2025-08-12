import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Completely disable ESLint during builds for Vercel deployment
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
