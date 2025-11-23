import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'avatar.maplestory.nexon.com',
      },
      {
        protocol: 'https',
        hostname: 'open.api.nexon.com',
      },
    ],
  },
  allowedDevOrigins: ['maplebook.site'],
};

export default nextConfig;
