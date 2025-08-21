/** @type {import('next').NextConfig} */

import path from "path";
const __dirname = path.resolve();

const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.ctfassets.net",
      },
      //unsplash
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      //picsum
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
      {
        protocol: "https",
        hostname: "via.placeholder.com",
      },
    ],
  },
  transpilePackages: ["geist"],
  webpack: (config) => {
    config.resolve.alias["@"] = path.resolve(__dirname, "src");
    return config;
  },
};

export default nextConfig;
