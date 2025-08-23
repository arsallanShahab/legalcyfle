import fs from "fs";
import { NextApiRequest, NextApiResponse } from "next";
import path from "path";

// File-based storage for revalidation status - MUST MATCH revalidate-optimized.ts
// Use multiple directory options for different environments
const getJobsDir = () => {
  const dirOptions = [
    path.join(process.cwd(), "data", "revalidation-jobs"), // Local development
    path.join("/tmp", "revalidation-jobs"), // Vercel serverless
    path.join(process.cwd(), ".next", "revalidation-jobs"), // Next.js build directory
  ];

  for (const jobsDir of dirOptions) {
    try {
      if (!fs.existsSync(jobsDir)) {
        fs.mkdirSync(jobsDir, { recursive: true });
      }
      // Test write access
      const testFile = path.join(jobsDir, "test-write.txt");
      fs.writeFileSync(testFile, "test");
      fs.unlinkSync(testFile);
      console.log(`📁 Successfully using jobs directory: ${jobsDir}`);
      return jobsDir;
    } catch (error) {
      console.warn(`Failed to use directory ${jobsDir}:`, error instanceof Error ? error.message : String(error));
      continue;
    }
  }
  
  // If all fail, throw an error with debugging info
  throw new Error(`Failed to create writable directory. Tried: ${dirOptions.join(', ')}. Current working directory: ${process.cwd()}`);
};

interface JobStatus {
  status: "pending" | "processing" | "completed" | "failed";
  startTime: string;
  endTime?: string;
  revalidated: string[];
  errors: any[];
  lastUpdate: string;
}

// Read job status from file
const readJobStatus = (jobId: string): JobStatus | null => {
  try {
    const jobsDir = getJobsDir();
    const filePath = path.join(jobsDir, `${jobId}.json`);

    console.log(`🔍 Looking for job file: ${filePath}`);

    if (!fs.existsSync(filePath)) {
      console.log(`❌ Job file not found: ${filePath}`);
      return null;
    }

    const data = fs.readFileSync(filePath, "utf8");
    console.log(`✅ Found job file: ${filePath}`);
    return JSON.parse(data);
  } catch (error) {
    console.error(`Failed to read job ${jobId}:`, error);
    return null;
  }
};

// Write job status to file
const writeJobStatus = (jobId: string, status: JobStatus): boolean => {
  try {
    const jobsDir = getJobsDir();
    const filePath = path.join(jobsDir, `${jobId}.json`);

    fs.writeFileSync(filePath, JSON.stringify(status, null, 2));
    console.log(`💾 Saved job ${jobId} to file: ${filePath}`);
    return true;
  } catch (error) {
    console.error(`Failed to write job ${jobId}:`, error);
    return false;
  }
};

// Get all job IDs from files
const getAllJobIds = (): string[] => {
  try {
    const jobsDir = getJobsDir();
    console.log(`📂 Scanning directory for jobs: ${jobsDir}`);

    if (!fs.existsSync(jobsDir)) {
      console.log(`❌ Jobs directory does not exist: ${jobsDir}`);
      return [];
    }

    const files = fs.readdirSync(jobsDir);
    console.log(`📋 Found ${files.length} files in jobs directory:`, files);

    const jobIds = files
      .filter((file) => file.endsWith(".json"))
      .map((file) => file.replace(".json", ""))
      .sort((a, b) => b.localeCompare(a)); // Sort by newest first

    console.log(`🎯 Filtered to ${jobIds.length} job files:`, jobIds);
    return jobIds;
  } catch (error) {
    console.error("Failed to read job directory:", error);
    return [];
  }
};

// Clean up old job files (optional)
const cleanupOldJobs = () => {
  try {
    const jobsDir = getJobsDir();
    const files = fs.readdirSync(jobsDir);
    const now = Date.now();
    const maxAge = 24 * 60 * 60 * 1000; // 24 hours

    files.forEach((file) => {
      const filePath = path.join(jobsDir, file);
      const stats = fs.statSync(filePath);

      if (now - stats.mtime.getTime() > maxAge) {
        fs.unlinkSync(filePath);
        console.log(`🗑️ Cleaned up old job file: ${file}`);
      }
    });
  } catch (error) {
    console.error("Failed to cleanup old jobs:", error);
  }
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { method } = req;

  // Clean up old jobs periodically
  if (Math.random() < 0.1) {
    // 10% chance to run cleanup
    cleanupOldJobs();
  }

  if (method === "GET") {
    // Get status of all or specific revalidation jobs
    const { id } = req.query;

    console.log(`📊 Checking status for job: ${id}`);
    console.log(`📁 Jobs directory being used: ${getJobsDir()}`);

    if (id) {
      const status = readJobStatus(id as string);

      if (!status) {
        const allJobIds = getAllJobIds();
        console.log(`❌ Job ${id} not found in file system`);
        console.log(`💡 Available jobs (${allJobIds.length}):`, allJobIds);

        // Return a helpful response instead of just "not found"
        return res.status(404).json({
          message: "Revalidation job not found",
          jobId: id,
          availableJobs: allJobIds.slice(0, 10), // Show only recent 10 jobs
          note: "Job may have completed or been cleaned up. Files are stored temporarily.",
          directory: getJobsDir(),
          timestamp: new Date().toISOString(),
        });
      }

      console.log(`✅ Found job ${id}:`, status);
      return res.status(200).json({ id, ...status });
    }

    // Return all jobs
    const allJobIds = getAllJobIds();
    console.log(`📋 Total jobs in file system: ${allJobIds.length}`);
    console.log(`🔍 Job IDs:`, allJobIds.slice(0, 5)); // Log first 5

    const allJobs = allJobIds
      .map((jobId) => {
        const status = readJobStatus(jobId);
        return status ? { id: jobId, ...status } : null;
      })
      .filter(Boolean);

    return res.status(200).json({
      jobs: allJobs,
      total: allJobs.length,
      timestamp: new Date().toISOString(),
    });
  }

  if (method === "POST") {
    // Update revalidation status (called by revalidation process)
    const { id, status, revalidated, errors, completed } = req.body;

    console.log(`📝 Updating job status for: ${id}`);
    console.log(`📊 Update data:`, { status, revalidated, errors, completed });

    if (!id) {
      return res.status(400).json({ message: "Job ID is required" });
    }

    const existingStatus = readJobStatus(id) || {
      status: "pending" as const,
      startTime: new Date().toISOString(),
      revalidated: [],
      errors: [],
      lastUpdate: new Date().toISOString(),
    };

    const updatedStatus: JobStatus = {
      ...existingStatus,
      status: status || existingStatus.status,
      revalidated: revalidated
        ? [...existingStatus.revalidated, ...revalidated]
        : existingStatus.revalidated,
      errors: errors
        ? [...existingStatus.errors, ...errors]
        : existingStatus.errors,
      lastUpdate: new Date().toISOString(),
      ...(completed && { endTime: new Date().toISOString() }),
    };

    const success = writeJobStatus(id, updatedStatus);
    console.log(
      `${success ? "✅" : "❌"} Job ${id} status ${success ? "updated" : "failed to update"}`,
    );

    return res.status(200).json({
      message: success ? "Status updated" : "Failed to update status",
      id,
      success,
      ...updatedStatus,
    });
  }

  return res.status(405).json({ message: "Method not allowed" });
}
