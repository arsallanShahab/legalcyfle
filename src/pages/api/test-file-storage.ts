import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  console.log("=== TESTING FILE-BASED REVALIDATION ===");

  const testJobId = `test-${Date.now()}`;

  try {
    // Test the file-based status system
    const protocol = req.headers["x-forwarded-proto"] || "http";
    const baseUrl = `${protocol}://${req.headers.host}`;

    // 1. Create a test job
    console.log(`🧪 Creating test job: ${testJobId}`);

    const createResponse = await fetch(`${baseUrl}/api/revalidate-status`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: testJobId,
        status: "pending",
        revalidated: [],
        errors: [],
      }),
    });

    if (!createResponse.ok) {
      throw new Error(
        `Failed to create test job: ${createResponse.statusText}`,
      );
    }

    const createResult = await createResponse.json();
    console.log(`✅ Created test job:`, createResult);

    // 2. Update the job
    console.log(`🔄 Updating test job: ${testJobId}`);

    const updateResponse = await fetch(`${baseUrl}/api/revalidate-status`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: testJobId,
        status: "processing",
        revalidated: ["/test-page"],
        errors: [],
      }),
    });

    const updateResult = await updateResponse.json();
    console.log(`🔄 Updated test job:`, updateResult);

    // 3. Retrieve the job
    console.log(`📖 Retrieving test job: ${testJobId}`);

    const getResponse = await fetch(
      `${baseUrl}/api/revalidate-status?id=${testJobId}`,
    );

    if (getResponse.ok) {
      const getResult = await getResponse.json();
      console.log(`📄 Retrieved test job:`, getResult);

      // 4. Mark as completed
      await fetch(`${baseUrl}/api/revalidate-status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: testJobId,
          status: "completed",
          completed: true,
        }),
      });

      return res.status(200).json({
        message: "File-based storage test successful!",
        testJobId,
        testResults: {
          created: createResult.success !== false,
          updated: updateResult.success !== false,
          retrieved: getResult.id === testJobId,
        },
        jobData: getResult,
        timestamp: new Date().toISOString(),
      });
    } else {
      throw new Error(`Failed to retrieve test job: ${getResponse.statusText}`);
    }
  } catch (error) {
    console.error("🚨 File-based storage test failed:", error);

    return res.status(500).json({
      message: "File-based storage test failed",
      testJobId,
      error: error instanceof Error ? error.message : "Unknown error",
      timestamp: new Date().toISOString(),
    });
  }
}
