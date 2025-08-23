import fs from "fs";
import { NextApiRequest, NextApiResponse } from "next";
import path from "path";

// EXACT SAME LOGIC AS OTHER FILES
const getJobsDir = () => {
  const tempDir = path.join("/tmp", "revalidation-jobs");
  try {
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }
    console.log(`📁 Using temp directory: ${tempDir}`);
    return tempDir;
  } catch (error) {
    console.warn("Failed to create tmp directory, using fallback directory");
    const fallbackDir = path.join(
      process.cwd(),
      ".vercel",
      "output",
      "revalidation-jobs",
    );
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
  console.log("🔧 DEBUG: Revalidation File System Check");

  try {
    const jobsDir = getJobsDir();
    const testJobId = `test-${Date.now()}`;
    const testFilePath = path.join(jobsDir, `${testJobId}.json`);

    // Test file operations
    const testData = {
      status: "test",
      timestamp: new Date().toISOString(),
      message: "This is a test file to verify file operations work correctly",
    };

    // Write test file
    fs.writeFileSync(testFilePath, JSON.stringify(testData, null, 2));
    console.log(`✅ Successfully wrote test file: ${testFilePath}`);

    // Read test file back
    const readData = JSON.parse(fs.readFileSync(testFilePath, "utf8"));
    console.log(`✅ Successfully read test file back`);

    // List all files in directory
    const allFiles = fs.readdirSync(jobsDir);
    console.log(`📂 Files in directory (${allFiles.length}):`, allFiles);

    // Clean up test file
    fs.unlinkSync(testFilePath);
    console.log(`🗑️ Cleaned up test file`);

    return res.status(200).json({
      message: "Revalidation file system working correctly",
      directory: jobsDir,
      testPassed: true,
      filesFound: allFiles.length,
      allFiles: allFiles,
      testData: readData,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("❌ File system test failed:", error);

    return res.status(500).json({
      message: "File system test failed",
      error: error instanceof Error ? error.message : "Unknown error",
      directory: getJobsDir(),
      timestamp: new Date().toISOString(),
    });
  }
}
