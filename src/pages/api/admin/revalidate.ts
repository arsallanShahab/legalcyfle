import { NextApiRequest, NextApiResponse } from "next";

interface RevalidationRequest {
  type: "homepage" | "jobs" | "specific" | "categories" | "custom" | "fullsite";
  specificUrl?: string;
  customPaths?: string[];
  paths?: string[];
}

async function performRevalidation(
  res: NextApiResponse,
  paths: string[],
): Promise<{
  success: boolean;
  message: string;
  paths?: string[];
  error?: string;
}> {
  const revalidatedPaths: string[] = [];
  const errors: string[] = [];

  // Process paths in batches to avoid timeout
  const batchSize = 5;
  for (let i = 0; i < paths.length; i += batchSize) {
    const batch = paths.slice(i, i + batchSize);

    await Promise.allSettled(
      batch.map(async (path) => {
        try {
          // Clean the path - ensure it starts with /
          let cleanPath = path.trim();
          if (!cleanPath.startsWith("/")) {
            // If it's a full URL, extract the path
            if (cleanPath.startsWith("http")) {
              const url = new URL(cleanPath);
              cleanPath = url.pathname;
            } else {
              cleanPath = `/${cleanPath}`;
            }
          }

          await res.revalidate(cleanPath);
          revalidatedPaths.push(cleanPath);
          console.log(`✅ Revalidated: ${cleanPath}`);
        } catch (error) {
          const errorMessage = `Failed to revalidate ${path}: ${error instanceof Error ? error.message : "Unknown error"}`;
          errors.push(errorMessage);
          console.error(`❌ ${errorMessage}`);
        }
      }),
    );

    // Small delay between batches to prevent overwhelming the system
    if (i + batchSize < paths.length) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  }

  if (errors.length === 0) {
    return {
      success: true,
      message: `Successfully revalidated ${revalidatedPaths.length} path(s)`,
      paths: revalidatedPaths,
    };
  } else if (revalidatedPaths.length > 0) {
    return {
      success: true,
      message: `Partially successful: ${revalidatedPaths.length} succeeded, ${errors.length} failed`,
      paths: revalidatedPaths,
      error: errors.join("; "),
    };
  } else {
    return {
      success: false,
      message: "All revalidations failed",
      error: errors.join("; "),
    };
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  console.log("=== ADMIN REVALIDATION REQUEST ===");
  console.log("Timestamp:", new Date().toISOString());

  try {
    const { type, specificUrl, customPaths, paths }: RevalidationRequest =
      req.body;

    if (!type) {
      return res.status(400).json({
        success: false,
        message: "Revalidation type is required",
      });
    }

    let pathsToRevalidate: string[] = [];

    switch (type) {
      case "homepage":
        pathsToRevalidate = ["/"];
        break;

      case "jobs":
        pathsToRevalidate = ["/jobs"];
        break;

      case "specific":
        if (!specificUrl) {
          return res.status(400).json({
            success: false,
            message: "Specific URL is required for specific revalidation",
          });
        }
        pathsToRevalidate = [specificUrl];
        break;

      case "categories":
        pathsToRevalidate = paths || [
          "/category/blogs-news",
          "/category/opportunities",
          "/category/resources",
        ];
        break;

      case "custom":
        if (!customPaths || customPaths.length === 0) {
          return res.status(400).json({
            success: false,
            message: "Custom paths are required for custom revalidation",
          });
        }
        pathsToRevalidate = customPaths;
        break;

      case "fullsite":
        pathsToRevalidate = [
          "/",
          "/internships",
          "/jobs",
          "/category/blogs-news",
          "/category/opportunities",
          "/category/resources",
        ];
        break;

      default:
        return res.status(400).json({
          success: false,
          message: "Invalid revalidation type",
        });
    }

    console.log(`🎯 Revalidation type: ${type}`);
    console.log(`📄 Paths to revalidate: ${pathsToRevalidate.join(", ")}`);

    const result = await performRevalidation(res, pathsToRevalidate);

    console.log(
      `${result.success ? "✅" : "❌"} Revalidation result:`,
      result.message,
    );

    return res.status(result.success ? 200 : 500).json(result);
  } catch (error) {
    console.error("❌ Admin revalidation error:", error);
    return res.status(500).json({
      success: false,
      message: "Revalidation failed",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
