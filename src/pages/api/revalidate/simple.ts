import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  if (req.body.secret !== process.env.REVALIDATION_SECRET) {
    return res.status(401).json({ message: "Invalid revalidation secret" });
  }

  try {
    const { paths } = req.body;

    if (!paths || !Array.isArray(paths)) {
      return res.status(400).json({ message: "Paths array is required" });
    }

    console.log(`Simple revalidation for paths: ${paths.join(", ")}`);

    const revalidatedPaths = [];
    const errors = [];

    // Revalidate each requested path
    for (const path of paths) {
      try {
        console.log(`Revalidating: ${path}`);
        await res.revalidate(path);
        revalidatedPaths.push(path);
        console.log(`✓ Successfully revalidated: ${path}`);
      } catch (err) {
        console.error(`✗ Failed to revalidate ${path}:`, err);
        errors.push({
          path,
          error: err instanceof Error ? err.message : "Unknown error",
        });
      }
    }

    // Return success even if some paths failed
    return res.status(200).json({
      message: "Simple revalidation completed",
      revalidated: revalidatedPaths,
      errors: errors.length > 0 ? errors : undefined,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Simple revalidation error:", error);
    return res.status(500).json({
      message: "Simple revalidation failed",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
