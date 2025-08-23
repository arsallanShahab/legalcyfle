import client from "@/lib/contentful";
import { NextApiRequest, NextApiResponse } from "next";

// Generate unique job ID
function generateJobId(): string {
  return `revalidate-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Update job status
async function updateJobStatus(
  jobId: string,
  status: any,
  req: NextApiRequest,
) {
  try {
    if (req.headers.host) {
      const protocol = req.headers["x-forwarded-proto"] || "http";
      const statusUrl = `${protocol}://${req.headers.host}/api/revalidate-status`;

      await fetch(statusUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: jobId, ...status }),
      });
    }
  } catch (error) {
    console.error("Failed to update job status:", error);
  }
}

// Background revalidation function with job tracking
async function backgroundRevalidate(
  res: NextApiResponse,
  jobId: string,
  req: NextApiRequest,
) {
  console.log(`🚀 Starting background revalidation job: ${jobId}`);

  // Update status to processing
  await updateJobStatus(jobId, { status: "processing" }, req);

  try {
    // Get all categories from Contentful to revalidate dynamically
    const getAllCategories = async () => {
      try {
        const categories = await client.getEntries({
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

    console.log(`📋 Job ${jobId}: Paths to revalidate:`, pathsToRevalidate);

    const revalidated = [];
    const errors = [];

    // Revalidate each path with delay to prevent overwhelming
    for (const path of pathsToRevalidate) {
      try {
        console.log(`🔄 Job ${jobId}: Revalidating: ${path}`);
        await res.revalidate(path);
        revalidated.push(path);
        console.log(`✅ Job ${jobId}: Successfully revalidated: ${path}`);

        // Update status with progress
        await updateJobStatus(
          jobId,
          {
            revalidated: [path],
            status: "processing",
          },
          req,
        );

        // Add small delay between revalidations to prevent rate limiting
        await new Promise((resolve) => setTimeout(resolve, 200));
      } catch (err) {
        console.error(`❌ Job ${jobId}: Failed to revalidate ${path}:`, err);
        const error = {
          path,
          error: err instanceof Error ? err.message : "Unknown error",
        };
        errors.push(error);

        // Update status with error
        await updateJobStatus(
          jobId,
          {
            errors: [error],
            status: "processing",
          },
          req,
        );
      }
    }

    // Mark job as completed
    await updateJobStatus(
      jobId,
      {
        status: revalidated.length > 0 ? "completed" : "failed",
        completed: true,
      },
      req,
    );

    console.log(`🎉 Job ${jobId}: Background revalidation completed!`);
    console.log(`✅ Revalidated: ${revalidated.length} paths`);
    console.log(`❌ Errors: ${errors.length} paths`);

    return {
      jobId,
      revalidated,
      errors,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error(`💥 Job ${jobId}: Background revalidation failed:`, error);

    // Mark job as failed
    await updateJobStatus(
      jobId,
      {
        status: "failed",
        completed: true,
        errors: [
          { error: error instanceof Error ? error.message : "Unknown error" },
        ],
      },
      req,
    );

    return {
      jobId,
      error: error instanceof Error ? error.message : "Unknown error",
      timestamp: new Date().toISOString(),
    };
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  console.log("=== REVALIDATION ENDPOINT ===");
  console.log("Method:", req.method);
  console.log("Timestamp:", new Date().toISOString());

  const jobId = generateJobId();

  try {
    // Initialize job status
    await updateJobStatus(
      jobId,
      {
        status: "pending",
        startTime: new Date().toISOString(),
        revalidated: [],
        errors: [],
      },
      req,
    );

    // Immediately respond with success and job ID
    res.status(200).json({
      message: "Revalidation started successfully",
      jobId,
      status: "processing",
      timestamp: new Date().toISOString(),
      statusUrl: `/api/revalidate-status?id=${jobId}`,
      note: "Revalidation is running in the background. Use the statusUrl to check progress.",
    });

    // Start background revalidation (fire and forget)
    backgroundRevalidate(res, jobId, req)
      .then((result) => {
        console.log(`🏁 Job ${jobId}: Background revalidation result:`, result);
      })
      .catch((error) => {
        console.error(`💥 Job ${jobId}: Background revalidation error:`, error);
      });
  } catch (error) {
    console.error("✗ Initial revalidation setup failed:", error);

    // Update job status to failed
    await updateJobStatus(
      jobId,
      {
        status: "failed",
        completed: true,
        errors: [
          { error: error instanceof Error ? error.message : "Unknown error" },
        ],
      },
      req,
    );

    return res.status(500).json({
      message: "Failed to start revalidation",
      jobId,
      error: error instanceof Error ? error.message : "Unknown error",
      timestamp: new Date().toISOString(),
    });
  }
}
