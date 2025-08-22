import client from "@/lib/contentful";
import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    // Fetch all articles
    const articles = await client.getEntries({
      content_type: "blogPage",
      select: ["fields.slug", "sys.updatedAt"],
      limit: 1000,
    });

    // Fetch all categories
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

    const categoryPages = categories.items.map((category: any) => ({
      url: `${baseUrl}/category/${category.fields.slug}`,
      lastModified: new Date(category.sys.updatedAt),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));

    const articlePages = articles.items.map((article: any) => ({
      url: `${baseUrl}/${article.fields.slug}`,
      lastModified: new Date(article.sys.updatedAt),
      changeFrequency: "monthly" as const,
      priority: 0.9,
    }));

    return [...staticPages, ...categoryPages, ...articlePages];
  } catch (error) {
    console.error("Error generating sitemap:", error);
    return [];
  }
}
