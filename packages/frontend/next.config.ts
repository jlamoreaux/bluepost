import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: false,
  env: {
    NEXT_PUBLIC_TWITTER_CODE_CHALLENGE: process.env.NEXT_PUBLIC_TWITTER_CODE_CHALLENGE,
  }
};

export default nextConfig;
