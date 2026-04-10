import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "better-flow.github.io" },
      { protocol: "https", hostname: "dsec.ifi.uzh.ch" },
    ],
  },
};

export default nextConfig;
