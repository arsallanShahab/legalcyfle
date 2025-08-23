import client from "@/lib/contentful";
import fs from "fs";
import { NextApiRequest, NextApiResponse } from "next";
import path from "path";

// File-based job storage
const getJobsDir = () => {
  const jobsDir = path.join(process.cwd(), "data", "revalidation-jobs");
  try {
    if (!fs.existsSync(jobsDir)) {
      fs.mkdirSync(jobsDir, { recursive: true });
    }
    // Test write access
    const testFile = path.join(jobsDir, "test-write.txt");
    fs.writeFileSync(testFile, "test");
    fs.unlinkSync(testFile);
    console.log(`📁 Using jobs directory: ${jobsDir}`);
    return jobsDir;
  } catch (error) {
    console.warn(
      "Failed to create/use main jobs directory, using fallback:",
      error,
    );
    const fallbackDir = path.join(process.cwd(), "jobs");
    if (!fs.existsSync(fallbackDir)) {
      fs.mkdirSync(fallbackDir, { recursive: true });
    }
    console.log(`📁 Using fallback directory: ${fallbackDir}`);
    return fallbackDir;
  }
};

const saveJobStatus = (jobId: string, status: any) => {
  try {
    const jobsDir = getJobsDir();
    const filePath = path.join(jobsDir, `${jobId}.json`);
    fs.writeFileSync(filePath, JSON.stringify(status, null, 2));
    console.log(`💾 Saved job ${jobId} status to file`);
    return true;
  } catch (error) {
    console.error(`Failed to save job ${jobId}:`, error);
    return false;
  }
};

// Generate unique job ID
function generateJobId(): string {
  return `revalidate-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  console.log("=== FILE-BASED REVALIDATION ENDPOINT ===");
  console.log("Method:", req.method);
  console.log("Timestamp:", new Date().toISOString());

  const jobId = generateJobId();

  try {
    // Create initial job status file
    const initialStatus = {
      status: "pending",
      startTime: new Date().toISOString(),
      revalidated: [],
      errors: [],
      lastUpdate: new Date().toISOString(),
    };

    saveJobStatus(jobId, initialStatus);

    // Immediately respond with success and job ID
    res.status(200).json({
      message: "Revalidation started successfully with file-based tracking",
      jobId,
      status: "processing",
      timestamp: new Date().toISOString(),
      statusUrl: `/api/revalidate-status?id=${jobId}`,
      note: "Job status is now stored in files. Check the statusUrl for progress.",
    });

    // Start background revalidation with file updates
    const processRevalidation = async () => {
      console.log(`🚀 Starting file-based revalidation job: ${jobId}`);

      // Update status to processing
      saveJobStatus(jobId, {
        ...initialStatus,
        status: "processing",
        lastUpdate: new Date().toISOString(),
      });

      try {
        // Get all categories from Contentful
        const getAllCategories = async () => {
          try {
            const categories = await client.getEntries({
              content_type: "blogCategory",
              limit: 100,
            });
            return categories.items.map(
              (category: any) => category.fields.slug,
            );
          } catch (error) {
            console.error("Failed to fetch categories:", error);
            return ["blogs-news", "opportunities", "resources"];
          }
        };

        const categorySlug = await getAllCategories();
        const pathsToRevalidate = [
          "/", // Homepage
          ...categorySlug.map((slug: string) => `/category/${slug}`),
        ];

        console.log(
          `📋 Job ${jobId}: Found ${pathsToRevalidate.length} paths to revalidate`,
        );

        const revalidated: string[] = [];
        const errors: any[] = [];

        // Revalidate each path with file updates
        for (const path of pathsToRevalidate) {
          try {
            console.log(`🔄 Job ${jobId}: Revalidating: ${path}`);
            await res.revalidate(path);
            revalidated.push(path);
            console.log(`✅ Job ${jobId}: Successfully revalidated: ${path}`);

            // Update file with progress
            saveJobStatus(jobId, {
              status: "processing",
              startTime: initialStatus.startTime,
              revalidated: [...revalidated],
              errors: [...errors],
              lastUpdate: new Date().toISOString(),
            });

            // Add delay to prevent overwhelming
            await new Promise((resolve) => setTimeout(resolve, 200));
          } catch (err) {
            console.error(
              `❌ Job ${jobId}: Failed to revalidate ${path}:`,
              err,
            );
            const error = {
              path,
              error: err instanceof Error ? err.message : "Unknown error",
            };
            errors.push(error);

            // Update file with error
            saveJobStatus(jobId, {
              status: "processing",
              startTime: initialStatus.startTime,
              revalidated: [...revalidated],
              errors: [...errors],
              lastUpdate: new Date().toISOString(),
            });
          }
        }

        // Mark job as completed
        const finalStatus = {
          status: revalidated.length > 0 ? "completed" : "failed",
          startTime: initialStatus.startTime,
          endTime: new Date().toISOString(),
          revalidated,
          errors,
          lastUpdate: new Date().toISOString(),
        };

        saveJobStatus(jobId, finalStatus);

        console.log(`🎉 Job ${jobId}: File-based revalidation completed!`);
        console.log(`✅ Revalidated: ${revalidated.length} paths`);
        console.log(`❌ Errors: ${errors.length} paths`);
      } catch (error) {
        console.error(`💥 Job ${jobId}: Fatal error:`, error);

        // Mark job as failed
        saveJobStatus(jobId, {
          status: "failed",
          startTime: initialStatus.startTime,
          endTime: new Date().toISOString(),
          revalidated: [],
          errors: [
            { error: error instanceof Error ? error.message : "Unknown error" },
          ],
          lastUpdate: new Date().toISOString(),
        });
      }
    };

    // Fire and forget
    processRevalidation().catch((error) => {
      console.error(`💥 Job ${jobId}: Background process failed:`, error);
    });
  } catch (error) {
    console.error(`✗ Job ${jobId}: Failed to start revalidation:`, error);

    // Save failed status
    saveJobStatus(jobId, {
      status: "failed",
      startTime: new Date().toISOString(),
      endTime: new Date().toISOString(),
      revalidated: [],
      errors: [
        { error: error instanceof Error ? error.message : "Unknown error" },
      ],
      lastUpdate: new Date().toISOString(),
    });

    return res.status(500).json({
      message: "Failed to start revalidation",
      jobId,
      error: error instanceof Error ? error.message : "Unknown error",
      timestamp: new Date().toISOString(),
    });
  }
}
