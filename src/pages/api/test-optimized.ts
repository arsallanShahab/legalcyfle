import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  console.log("=== TESTING OPTIMIZED REVALIDATION ===");

  try {
    const protocol = req.headers["x-forwarded-proto"] || "http";
    const baseUrl = `${protocol}://${req.headers.host}`;

    // Test 1: Specific article revalidation (simulating Contentful webhook)
    console.log("🧪 Test 1: Specific article revalidation");

    const articleTest = await fetch(`${baseUrl}/api/revalidate-optimized`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fields: {
          slug: {
            "en-US": "test-article-slug",
          },
        },
      }),
    });

    const articleResult = await articleTest.json();
    console.log("✅ Article test result:", articleResult);

    // Test 2: Full site revalidation (no slug)
    console.log("🧪 Test 2: Full site revalidation");

    const fullSiteTest = await fetch(`${baseUrl}/api/revalidate-optimized`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });

    const fullSiteResult = await fullSiteTest.json();
    console.log("✅ Full site test result:", fullSiteResult);

    // Test 3: Direct slug format
    console.log("🧪 Test 3: Direct slug format");

    const directSlugTest = await fetch(`${baseUrl}/api/revalidate-optimized`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        slug: "direct-slug-test",
      }),
    });

    const directSlugResult = await directSlugTest.json();
    console.log("✅ Direct slug test result:", directSlugResult);

    // Wait a moment and check status of one job
    setTimeout(async () => {
      try {
        const statusCheck = await fetch(
          `${baseUrl}/api/revalidate-status?id=${articleResult.jobId}`,
        );
        const statusResult = await statusCheck.json();
        console.log("📊 Status check result:", statusResult);
      } catch (error) {
        console.error("❌ Status check failed:", error);
      }
    }, 2000);

    return res.status(200).json({
      message: "Optimized revalidation tests completed!",
      tests: {
        articleRevalidation: {
          jobId: articleResult.jobId,
          type: articleResult.type,
          targetSlug: articleResult.targetSlug,
        },
        fullSiteRevalidation: {
          jobId: fullSiteResult.jobId,
          type: fullSiteResult.type,
        },
        directSlugRevalidation: {
          jobId: directSlugResult.jobId,
          type: directSlugResult.type,
          targetSlug: directSlugResult.targetSlug,
        },
      },
      statusUrls: [
        `${baseUrl}/api/revalidate-status?id=${articleResult.jobId}`,
        `${baseUrl}/api/revalidate-status?id=${fullSiteResult.jobId}`,
        `${baseUrl}/api/revalidate-status?id=${directSlugResult.jobId}`,
      ],
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("🚨 Optimized revalidation test failed:", error);

    return res.status(500).json({
      message: "Optimized revalidation test failed",
      error: error instanceof Error ? error.message : "Unknown error",
      timestamp: new Date().toISOString(),
    });
  }
}
