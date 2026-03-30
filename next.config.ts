import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: process.cwd(),
  },
  // ✅ Image optimization configuration
  images: {
    formats: ["image/avif", "image/webp"],
    // ✅ Set reasonable cache time for optimized images
    minimumCacheTTL: 31536000, // 1 year
    // ✅ Device sizes for responsive images
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  // ✅ Enable compression
  compress: true,
  // ✅ Production source maps for error tracking
  productionBrowserSourceMaps: true,
};

export default nextConfig;
