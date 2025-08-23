import client from "@/lib/contentful";
import { MetadataRoute } from "next";

// Regex for validating URL-safe slugs
const SLUG_VALIDATION_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

// Helper function to safely create URLs for XML sitemap
function createSafeUrl(baseUrl: string, path: string): string {
  try {
    // Validate slug format first
    if (!SLUG_VALIDATION_REGEX.test(path)) {
      console.warn(`Invalid slug format: ${path}`);
    }

    // Don't use encodeURIComponent for sitemap URLs - just clean up the path
    // Remove any dangerous characters that could break XML
    const safePath = path
      .replace(/[&<>"']/g, (match) => {
        switch (match) {
          case "&":
            return "&amp;";
          case "<":
            return "&lt;";
          case ">":
            return "&gt;";
          case '"':
            return "&quot;";
          case "'":
            return "&apos;";
          default:
            return match;
        }
      })
      .trim();

    return `${baseUrl}/${safePath}`;
  } catch (error) {
    // Fallback: just remove unsafe chars
    const safePath = path.replace(/[&<>"']/g, "");
    return `${baseUrl}/${safePath}`;
  }
}

function createSafeCategoryUrl(baseUrl: string, slug: string): string {
  try {
    // Same logic as createSafeUrl but for category URLs
    const safeSlug = slug
      .replace(/[&<>"']/g, (match) => {
        switch (match) {
          case "&":
            return "&amp;";
          case "<":
            return "&lt;";
          case ">":
            return "&gt;";
          case '"':
            return "&quot;";
          case "'":
            return "&apos;";
          default:
            return match;
        }
      })
      .trim();

    return `${baseUrl}/category/${safeSlug}`;
  } catch (error) {
    const safeSlug = slug.replace(/[&<>"']/g, "");
    return `${baseUrl}/category/${safeSlug}`;
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    // Fetch all articles with error handling
    const articles = await client.getEntries({
      content_type: "blogPage",
      select: ["fields.slug", "sys.updatedAt"],
      limit: 1000,
    });

    // Fetch all categories with error handling
    const categories = await client.getEntries({
      content_type: "blogCategory",
      select: ["fields.slug", "sys.updatedAt"],
      limit: 100,
    });

    const baseUrl = "https://legalcyfle.in";
    const currentDate = new Date();

    const staticPages = [
      {
        url: baseUrl,
        lastModified: currentDate,
        changeFrequency: "daily" as const,
        priority: 1.0,
      },
      {
        url: `${baseUrl}/about-us`,
        lastModified: currentDate,
        changeFrequency: "monthly" as const,
        priority: 0.8,
      },
      {
        url: `${baseUrl}/contact-us`,
        lastModified: currentDate,
        changeFrequency: "monthly" as const,
        priority: 0.7,
      },
      {
        url: `${baseUrl}/privacy-policy`,
        lastModified: currentDate,
        changeFrequency: "yearly" as const,
        priority: 0.5,
      },
      {
        url: `${baseUrl}/disclaimer-and-terms`,
        lastModified: currentDate,
        changeFrequency: "yearly" as const,
        priority: 0.5,
      },
    ];

    const categoryPages = categories.items
      .filter((category: any) => {
        if (!category.fields?.slug) {
          console.warn("Category found without slug:", category.sys.id);
          return false;
        }
        return true;
      })
      .map((category: any) => ({
        url: createSafeCategoryUrl(baseUrl, category.fields.slug),
        lastModified: new Date(category.sys.updatedAt),
        changeFrequency: "weekly" as const,
        priority: 0.8,
      }));

    const articlePages = articles.items
      .filter((article: any) => {
        if (!article.fields?.slug) {
          console.warn("Article found without slug:", article.sys.id);
          return false;
        }
        return true;
      })
      .map((article: any) => ({
        url: createSafeUrl(baseUrl, article.fields.slug),
        lastModified: new Date(article.sys.updatedAt),
        changeFrequency: "monthly" as const,
        priority: 0.9,
      }));

    console.log(
      `Generated sitemap with ${staticPages.length} static pages, ${categoryPages.length} category pages, and ${articlePages.length} article pages`,
    );

    return [...staticPages, ...categoryPages, ...articlePages];
  } catch (error) {
    console.error("Error generating sitemap:", error);
    return [];
  }
}
