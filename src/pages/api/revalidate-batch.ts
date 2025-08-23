import client from "@/lib/contentful";
import { NextApiRequest, NextApiResponse } from "next";

// Batch size for revalidation (smaller batches to stay under timeout)
const BATCH_SIZE = 3;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  console.log("=== BATCH REVALIDATION ENDPOINT ===");

  const { batch = "0" } = req.query;
  const batchNumber = parseInt(batch as string, 10);

  try {
    // Get all categories from Contentful
    const getAllCategories = async () => {
      try {
        const categories = await client.getEntries({
          content_type: "blogCategory",
          limit: 100,
        });
        return categories.items.map((category: any) => category.fields.slug);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
        return ["blogs-news", "opportunities", "resources"];
      }
    };

    const categorySlug = await getAllCategories();
    const allPaths = [
      "/", // Homepage
      ...categorySlug.map((slug: string) => `/category/${slug}`),
    ];

    // Calculate batch
    const startIndex = batchNumber * BATCH_SIZE;
    const endIndex = startIndex + BATCH_SIZE;
    const pathsToRevalidate = allPaths.slice(startIndex, endIndex);
    const hasMoreBatches = endIndex < allPaths.length;
    const nextBatch = hasMoreBatches ? batchNumber + 1 : null;

    console.log(
      `📋 Processing batch ${batchNumber}: ${pathsToRevalidate.length} paths`,
    );
    console.log(`🔄 Paths: ${pathsToRevalidate.join(", ")}`);

    const revalidated = [];
    const errors = [];

    // Revalidate paths in current batch
    for (const path of pathsToRevalidate) {
      try {
        console.log(`🔄 Revalidating: ${path}`);
        await res.revalidate(path);
        revalidated.push(path);
        console.log(`✅ Successfully revalidated: ${path}`);
      } catch (err) {
        console.error(`❌ Failed to revalidate ${path}:`, err);
        errors.push({
          path,
          error: err instanceof Error ? err.message : "Unknown error",
        });
      }
    }

    const response = {
      message: `Batch ${batchNumber} completed`,
      batch: batchNumber,
      revalidated,
      errors: errors.length > 0 ? errors : undefined,
      totalPaths: allPaths.length,
      processedPaths: endIndex,
      hasMoreBatches,
      nextBatch,
      timestamp: new Date().toISOString(),
    };

    // If there are more batches, trigger the next one
    if (hasMoreBatches && req.headers.host) {
      const protocol = req.headers["x-forwarded-proto"] || "http";
      const nextBatchUrl = `${protocol}://${req.headers.host}/api/revalidate-batch?batch=${nextBatch}`;

      console.log(`🚀 Triggering next batch: ${nextBatchUrl}`);

      // Fire and forget - trigger next batch
      fetch(nextBatchUrl).catch((error) => {
        console.error(`❌ Failed to trigger next batch:`, error);
      });
    }

    return res.status(200).json(response);
  } catch (error) {
    console.error("💥 Batch revalidation failed:", error);
    return res.status(500).json({
      message: `Batch ${batchNumber} failed`,
      batch: batchNumber,
      error: error instanceof Error ? error.message : "Unknown error",
      timestamp: new Date().toISOString(),
    });
  }
}
