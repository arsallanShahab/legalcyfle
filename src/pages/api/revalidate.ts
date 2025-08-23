import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  console.log("=== REVALIDATION ENDPOINT ===");
  console.log("Method:", req.method);
  console.log("Timestamp:", new Date().toISOString());

  try {
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

    if (isSpecificArticle) {
      await res.revalidate(`/${specificSlug}`);
    }

    await res.revalidate("/");

    res.status(200).json({
      message: "Revalidation done successfully",
      timestamp: new Date().toISOString(),
      note: "Revalidation triggered. Note that it may take some time for changes to appear due to caching.",
    });
  } catch (error) {
    console.error("✗ Initial revalidation setup failed:", error);

    return res.status(500).json({
      message: "Failed to start revalidation",
      error: error instanceof Error ? error.message : "Unknown error",
      timestamp: new Date().toISOString(),
    });
  }
}
