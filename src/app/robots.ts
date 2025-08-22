import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/admin/",
          "/_next/",
          "/ignore/",
          "/author/", // Block all author pages from crawling
          "/verify-email",
          "/reset-password",
          "/request-reset",
          "/login",
          "/signup",
          "/*?utm_*", // Block URLs with UTM parameters
          "/*?fbclid=*", // Block Facebook click IDs
          "/*?gclid=*", // Block Google click IDs
        ],
        crawlDelay: 1,
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: [
          "/author/", // Specifically block author pages for Google
          "/verify-email",
          "/reset-password",
          "/request-reset",
          "/login",
          "/signup",
        ],
      },
      {
        userAgent: "Bingbot",
        allow: "/",
        disallow: [
          "/author/", // Block author pages for Bing too
          "/verify-email",
          "/reset-password",
          "/request-reset",
          "/login",
          "/signup",
        ],
      },
      // Block AI crawlers and scrapers
      {
        userAgent: "GPTBot",
        disallow: "/",
      },
      {
        userAgent: "ChatGPT-User",
        disallow: "/",
      },
      {
        userAgent: "CCBot",
        disallow: "/",
      },
      {
        userAgent: "anthropic-ai",
        disallow: "/",
      },
      {
        userAgent: "Claude-Web",
        disallow: "/",
      },
      {
        userAgent: "PerplexityBot",
        disallow: "/",
      },
      {
        userAgent: "YouBot",
        disallow: "/",
      },
    ],
    sitemap: "https://legalcyfle.in/sitemap.xml",
    host: "https://legalcyfle.in",
  };
}
