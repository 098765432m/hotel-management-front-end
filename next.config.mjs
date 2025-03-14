/** @type {import('next').NextConfig} */
import NextBundleAnalyzer from "@next/bundle-analyzer";
const withBundleAnalyzer = NextBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

const nextConfig = withBundleAnalyzer({
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cf.bstatic.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "sthotelsmalta.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "imgproxy.valpas.io",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
    ],
  },

  experimental: {
    optimizePackageImports: ["@mantine/core", "@mantine/hooks"], //Enables tree shaking
  },
  typescript: {
    ignoreBuildErrors: true,
  },

  reactStrictMode: true, // Recommended for catching common issues
  swcMinify: true, // Faster minification
});

export default withBundleAnalyzer(nextConfig);
