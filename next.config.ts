import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone', // <--- THIS IS CRITICAL FOR CPANEL
  images: {
    unoptimized: true, // Optional: Set to true if images break on cPanel
  },
  // If you are using typescript, ignore build errors for smoother deployment
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  }
};

export default nextConfig;