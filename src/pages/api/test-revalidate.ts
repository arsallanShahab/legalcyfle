import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  console.log("=== TEST REVALIDATION ENDPOINT ===");
  console.log("Method:", req.method);
  console.log("Body:", req.body);
  console.log("Environment REVALIDATION_SECRET:", process.env.REVALIDATION_SECRET ? "SET" : "NOT SET");

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    console.log("Attempting to revalidate homepage...");
    await res.revalidate("/");
    console.log("✓ Homepage revalidation successful");

    return res.status(200).json({
      message: "Test revalidation completed successfully",
      revalidated: ["/"],
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
