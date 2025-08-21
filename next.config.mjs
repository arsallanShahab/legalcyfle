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
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: `
              default-src 'self' 'unsafe-inline' 'unsafe-eval';
              script-src 'self' 'unsafe-inline' 'unsafe-eval' 
                https://pagead2.googlesyndication.com 
                https://googleads.g.doubleclick.net 
                https://www.googletagmanager.com 
                https://www.google-analytics.com
                https://partner.googleadservices.com
                https://tpc.googlesyndication.com
                https://securepubads.g.doubleclick.net;
              style-src 'self' 'unsafe-inline' 
                https://fonts.googleapis.com
                https://pagead2.googlesyndication.com;
              img-src 'self' data: blob: 
                https://images.ctfassets.net 
                https://images.unsplash.com 
                https://picsum.photos 
                https://via.placeholder.com
                https://pagead2.googlesyndication.com
                https://googleads.g.doubleclick.net
                https://www.google-analytics.com
                https://www.googletagmanager.com;
              font-src 'self' 
                https://fonts.gstatic.com;
              connect-src 'self' 
                https://pagead2.googlesyndication.com
                https://googleads.g.doubleclick.net
                https://www.google-analytics.com
                https://www.googletagmanager.com
                https://partner.googleadservices.com;
              frame-src 'self' 
                https://googleads.g.doubleclick.net
                https://tpc.googlesyndication.com
                https://pagead2.googlesyndication.com;
              object-src 'none';
              base-uri 'self';
            `
              .replace(/\s+/g, " ")
              .trim(),
          },
        ],
      },
    ];
  },
  webpack: (config) => {
    config.resolve.alias["@"] = path.resolve(__dirname, "src");
    return config;
  },
};

export default nextConfig;
