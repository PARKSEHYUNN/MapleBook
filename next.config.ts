import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "open.api.nexon.com",
        port: "",
        pathname: "/static/maplestory/character/look/**",
      },
      {
        protocol: "https",
        hostname: "ssl.nexon.com",
        port: "",
        pathname: "/s2/game/maplestory/renewal/common/world_icon/**",
      },
    ],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
