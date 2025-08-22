import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  console.log("=== REVALIDATION ENDPOINT ===");
  console.log("Method:", req.method);

  try {
    // Get all categories from Contentful to revalidate dynamically
    const getAllCategories = async () => {
      try {
        const contentful = require("@/lib/contentful").default;
        const categories = await contentful.getEntries({
          content_type: "blogCategory",
          limit: 100,
        });

        return categories.items.map((category: any) => category.fields.slug);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
        // Fallback to known static categories
        return ["blogs-news", "opportunities", "resources"];
      }
    };

    const categorySlug = await getAllCategories();
    const pathsToRevalidate = [
      "/", // Homepage
      ...categorySlug.map((slug: string) => `/category/${slug}`), // All category pages
    ];

    console.log("Paths to revalidate:", pathsToRevalidate);

    const revalidated = [];
    const errors = [];

    // Revalidate each path
    for (const path of pathsToRevalidate) {
      try {
        console.log(`Revalidating: ${path}`);
        await res.revalidate(path);
        revalidated.push(path);
        console.log(`✓ Successfully revalidated: ${path}`);
      } catch (err) {
        console.error(`✗ Failed to revalidate ${path}:`, err);
        errors.push({
          path,
          error: err instanceof Error ? err.message : "Unknown error",
        });
      }
    }

    return res.status(200).json({
      message: "Revalidation completed",
      revalidated,
      errors: errors.length > 0 ? errors : undefined,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("✗ Revalidation failed:", error);
    return res.status(500).json({
      message: "Revalidation failed",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
