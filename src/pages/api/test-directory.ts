import fs from "fs";
import { NextApiRequest, NextApiResponse } from "next";
import path from "path";

// Same directory logic as other files
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

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    console.log("=== TESTING DIRECTORY OPERATIONS ===");

    const jobsDir = getJobsDir();
    console.log(`Using directory: ${jobsDir}`);

    // Test 1: Create a test job file
    const testJobId = `test-${Date.now()}`;
    const testJob = {
      status: "test",
      message: "This is a test job",
      timestamp: new Date().toISOString(),
      directory: jobsDir,
    };

    const filePath = path.join(jobsDir, `${testJobId}.json`);
    fs.writeFileSync(filePath, JSON.stringify(testJob, null, 2));
    console.log(`✅ Created test file: ${filePath}`);

    // Test 2: Read the test job file back
    const readData = fs.readFileSync(filePath, "utf8");
    const parsedData = JSON.parse(readData);
    console.log(`✅ Read test file back:`, parsedData);

    // Test 3: List all files in directory
    const files = fs.readdirSync(jobsDir);
    console.log(`✅ Files in directory:`, files);

    // Test 4: Clean up test file
    fs.unlinkSync(filePath);
    console.log(`✅ Cleaned up test file: ${filePath}`);

    // Test 5: Check directory after cleanup
    const filesAfter = fs.readdirSync(jobsDir);
    console.log(`✅ Files after cleanup:`, filesAfter);

    res.status(200).json({
      success: true,
      message: "Directory operations test completed successfully",
      results: {
        directory: jobsDir,
        testJobId,
        testCompleted: true,
        filesFound: files.length,
        filesAfterCleanup: filesAfter.length,
      },
    });
  } catch (error) {
    console.error("❌ Directory test failed:", error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : String(error),
      message: "Directory operations test failed",
    });
  }
}
