import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  /* config options here */
  async redirects() {
    return [
      {
        source: "/",
        destination: "/explore",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
