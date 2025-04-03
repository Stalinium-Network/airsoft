import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['localhost', 'browsenchat.com', 'img.youtube.com', 'youtu.be'],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: 'https',
        hostname: 'browsenchat.com',
      },
      {
        protocol: 'https',
        hostname: 'img.youtube.com'
      },
      {
        protocol: 'https',
        hostname: 'youtu.be'
      }
    ],
  },
};



export default nextConfig;
