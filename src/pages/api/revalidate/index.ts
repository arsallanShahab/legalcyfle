import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { secret, path } = req.body;

    // Check for secret to confirm this is a valid request
    if (secret !== process.env.REVALIDATION_SECRET) {
      return res.status(401).json({ message: "Invalid revalidation secret" });
    }

    const pathToRevalidate = path || "/";

    console.log(`Revalidating path: ${pathToRevalidate}`);

    // Revalidate the specified path
    await res.revalidate(pathToRevalidate);

    console.log(`Successfully revalidated: ${pathToRevalidate}`);

    return res.json({
      revalidated: true,
      path: pathToRevalidate,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Revalidation error:", error);
    return res.status(500).json({
      error: "Error revalidating",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
