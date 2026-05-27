import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Required to allow react-webcam and other client-only libraries
  experimental: {},
};

export default nextConfig;
