import client from "@/lib/contentful";
import fs from "fs";
import { NextApiRequest, NextApiResponse } from "next";
import path from "path";

// File-based job storage - MUST MATCH revalidate-status.ts
const getJobsDir = () => {
  const dirOptions = [
    path.join(process.cwd(), "data", "revalidation-jobs"), // Local development
    path.join("/tmp", "revalidation-jobs"), // Vercel serverless
    path.join(process.cwd(), ".next", "revalidation-jobs"), // Next.js build directory
  ];

  for (const jobsDir of dirOptions) {
    try {
      if (!fs.existsSync(jobsDir)) {
        fs.mkdirSync(jobsDir, { recursive: true });
      }
      // Test write access
      const testFile = path.join(jobsDir, "test-write.txt");
      fs.writeFileSync(testFile, "test");
      fs.unlinkSync(testFile);
      console.log(`📁 Successfully using jobs directory: ${jobsDir}`);
      return jobsDir;
    } catch (error) {
      console.warn(`Failed to use directory ${jobsDir}:`, error instanceof Error ? error.message : String(error));
      continue;
    }
  }
  
  // If all fail, throw an error with debugging info
  throw new Error(`Failed to create writable directory. Tried: ${dirOptions.join(', ')}. Current working directory: ${process.cwd()}`);
};

const saveJobStatus = (jobId: string, status: any) => {
  try {
    const jobsDir = getJobsDir();
    const filePath = path.join(jobsDir, `${jobId}.json`);
    fs.writeFileSync(filePath, JSON.stringify(status, null, 2));
    console.log(`💾 Saved job ${jobId} status to: ${filePath}`);
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

// Separate function for background processing
async function processRevalidation(
  jobId: string,
  initialStatus: any,
  specificSlug: string | null,
  res: NextApiResponse,
) {
  console.log(`🚀 Starting revalidation job: ${jobId}`);

  // Update status to processing
  saveJobStatus(jobId, {
    ...initialStatus,
    status: "processing",
    lastUpdate: new Date().toISOString(),
  });

  try {
    let pathsToRevalidate: string[] = [];

    if (specificSlug) {
      // SPECIFIC ARTICLE MODE - Fast and efficient
      console.log(`🎯 Specific article mode for slug: ${specificSlug}`);

      pathsToRevalidate = [
        "/", // Homepage (always revalidate for new articles)
        `/${specificSlug}`, // The specific article
      ];

      // Also revalidate related category pages
      try {
        const article = await client.getEntries({
          content_type: "blogPage",
          "fields.slug": specificSlug,
          limit: 1,
        });

        if (article.items.length > 0) {
          const articleData = article.items[0] as any;
          const categories = articleData.fields.category || [];

          // Add category pages
          categories.forEach((cat: any) => {
            if (cat.fields?.slug) {
              pathsToRevalidate.push(`/category/${cat.fields.slug}`);
            }
          });

          console.log(`📚 Found ${categories.length} categories for article`);
        }
      } catch (error) {
        console.warn(
          `⚠️ Could not fetch article categories for ${specificSlug}:`,
          error,
        );
      }
    } else {
      // FULL SITE MODE - For major updates (optimized for large sites)
      console.log(`🌐 Full site revalidation mode`);

      // Get categories (limited for performance)
      const getAllCategories = async () => {
        try {
          const categories = await client.getEntries({
            content_type: "blogCategory",
            limit: 20, // Reduced from 50 for even better performance
          });
          return categories.items.map((category: any) => category.fields.slug);
        } catch (error) {
          console.error("Failed to fetch categories:", error);
          return ["blogs-news", "opportunities", "resources"];
        }
      };

      const categorySlug = await getAllCategories();
      pathsToRevalidate = [
        "/", // Homepage
        ...categorySlug.map((slug: string) => `/category/${slug}`),
        // Add only the most important static pages
        "/about-us",
      ];
    }

    console.log(
      `📋 Job ${jobId}: Found ${pathsToRevalidate.length} paths to revalidate`,
    );
    console.log(`📄 Paths:`, pathsToRevalidate);

    const revalidated: string[] = [];
    const errors: any[] = [];

    // Revalidate each path with optimized timing
    for (let i = 0; i < pathsToRevalidate.length; i++) {
      const path = pathsToRevalidate[i];

      try {
        console.log(
          `🔄 Job ${jobId}: Revalidating ${i + 1}/${pathsToRevalidate.length}: ${path}`,
        );
        await res.revalidate(path);
        revalidated.push(path);
        console.log(`✅ Job ${jobId}: Successfully revalidated: ${path}`);

        // Update file with progress more frequently for specific articles
        const updateFrequency = specificSlug ? 1 : 5; // Update every 1 for articles, every 5 for full site

        if (
          (i + 1) % updateFrequency === 0 ||
          i === pathsToRevalidate.length - 1
        ) {
          saveJobStatus(jobId, {
            ...initialStatus,
            status: "processing",
            revalidated: [...revalidated],
            errors: [...errors],
            lastUpdate: new Date().toISOString(),
            progress: `${i + 1}/${pathsToRevalidate.length}`,
          });
        }

        // Optimized delays based on type
        if (specificSlug) {
          // Faster for specific articles
          await new Promise((resolve) => setTimeout(resolve, 50));
        } else {
          // Slower for full site to prevent overwhelming
          await new Promise((resolve) => setTimeout(resolve, 200));
        }
      } catch (err) {
        console.error(`❌ Job ${jobId}: Failed to revalidate ${path}:`, err);
        const error = {
          path,
          error: err instanceof Error ? err.message : "Unknown error",
          timestamp: new Date().toISOString(),
        };
        errors.push(error);
      }
    }

    // Mark job as completed
    const finalStatus = {
      ...initialStatus,
      status: revalidated.length > 0 ? "completed" : "failed",
      endTime: new Date().toISOString(),
      revalidated,
      errors,
      lastUpdate: new Date().toISOString(),
      summary: {
        total: pathsToRevalidate.length,
        successful: revalidated.length,
        failed: errors.length,
        successRate: `${Math.round((revalidated.length / pathsToRevalidate.length) * 100)}%`,
        duration: `${((Date.now() - new Date(initialStatus.startTime).getTime()) / 1000).toFixed(1)}s`,
      },
    };

    saveJobStatus(jobId, finalStatus);

    console.log(`🎉 Job ${jobId}: Revalidation completed!`);
    console.log(
      `✅ Successfully revalidated: ${revalidated.length}/${pathsToRevalidate.length} paths`,
    );
    console.log(`❌ Errors: ${errors.length} paths`);
    console.log(`⏱️ Duration: ${finalStatus.summary.duration}`);
  } catch (error) {
    console.error(`💥 Job ${jobId}: Fatal error:`, error);

    // Mark job as failed
    saveJobStatus(jobId, {
      ...initialStatus,
      status: "failed",
      endTime: new Date().toISOString(),
      errors: [
        {
          error: error instanceof Error ? error.message : "Unknown error",
          timestamp: new Date().toISOString(),
        },
      ],
      lastUpdate: new Date().toISOString(),
    });
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  console.log("=== SMART REVALIDATION ENDPOINT ===");
  console.log("Method:", req.method);
  console.log("Timestamp:", new Date().toISOString());
  console.log("Request body:", req.body);

  const jobId = generateJobId();

  // Parse webhook data if present
  // Parse body if it's a string
  let parsedBody;
  if (typeof req.body === "string") {
    try {
      parsedBody = JSON.parse(req.body);
    } catch (parseError) {
      return res
        .status(400)
        .json({ message: "Invalid JSON in webhook payload" });
    }
  } else {
    parsedBody = req.body;
  }
  const webhookData = parsedBody;
  const specificSlug = webhookData?.fields?.slug?.["en-US"] || null;
  const isSpecificArticle = !!specificSlug;

  console.log(
    `🎯 Revalidation type: ${isSpecificArticle ? `Specific article (${specificSlug})` : "Full site"}`,
  );

  try {
    // Create initial job status file
    const initialStatus = {
      status: "pending",
      startTime: new Date().toISOString(),
      revalidated: [],
      errors: [],
      lastUpdate: new Date().toISOString(),
      type: isSpecificArticle ? "article" : "full",
      targetSlug: specificSlug || null,
    };

    saveJobStatus(jobId, initialStatus);

    // Immediately respond with success and job ID
    res.status(200).json({
      message: `Revalidation started successfully ${isSpecificArticle ? `for article: ${specificSlug}` : "for full site"}`,
      jobId,
      status: "processing",
      type: initialStatus.type,
      targetSlug: specificSlug,
      timestamp: new Date().toISOString(),
      statusUrl: `/api/revalidate-status?id=${jobId}`,
      note: "Job status is stored in files. Check the statusUrl for progress.",
      estimatedDuration: isSpecificArticle ? "5-10 seconds" : "30-60 seconds",
    });

    // Start background revalidation immediately using setImmediate
    setImmediate(() => {
      processRevalidation(jobId, initialStatus, specificSlug, res).catch(
        (error) => {
          console.error(`💥 Job ${jobId}: Background process failed:`, error);
          saveJobStatus(jobId, {
            ...initialStatus,
            status: "failed",
            endTime: new Date().toISOString(),
            errors: [
              {
                error: error instanceof Error ? error.message : "Unknown error",
                timestamp: new Date().toISOString(),
              },
            ],
            lastUpdate: new Date().toISOString(),
          });
        },
      );
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
        {
          error: error instanceof Error ? error.message : "Unknown error",
          timestamp: new Date().toISOString(),
        },
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
