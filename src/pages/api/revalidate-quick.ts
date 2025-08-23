import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  console.log("=== QUICK REVALIDATION ENDPOINT ===");

  const { paths } = req.body || {};
  const pathsToRevalidate = paths || ["/"];

  try {
    // Immediately respond
    res.status(200).json({
      message: "Quick revalidation completed",
      revalidated: pathsToRevalidate,
      timestamp: new Date().toISOString(),
    });

    // Fire and forget revalidation
    Promise.all(
      pathsToRevalidate.map(async (path: string) => {
        try {
          await res.revalidate(path);
          console.log(`✅ Quick revalidated: ${path}`);
        } catch (error) {
          console.error(`❌ Quick revalidation failed for ${path}:`, error);
        }
      }),
    );
  } catch (error) {
    console.error("✗ Quick revalidation failed:", error);
    return res.status(500).json({
      message: "Quick revalidation failed",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
