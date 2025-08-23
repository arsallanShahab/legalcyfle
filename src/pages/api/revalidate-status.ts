import { NextApiRequest, NextApiResponse } from "next";

// In-memory store for revalidation status (in production, use Redis/database)
const revalidationStatus = new Map<
  string,
  {
    status: "pending" | "processing" | "completed" | "failed";
    startTime: string;
    endTime?: string;
    revalidated: string[];
    errors: any[];
    lastUpdate: string;
  }
>();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { method } = req;

  if (method === "GET") {
    // Get status of all or specific revalidation jobs
    const { id } = req.query;

    if (id) {
      const status = revalidationStatus.get(id as string);
      if (!status) {
        return res.status(404).json({ message: "Revalidation job not found" });
      }
      return res.status(200).json({ id, ...status });
    }

    // Return all jobs
    const allJobs = Array.from(revalidationStatus.entries()).map(
      ([id, status]) => ({
        id,
        ...status,
      }),
    );

    return res.status(200).json({
      jobs: allJobs,
      total: allJobs.length,
    });
  }

  if (method === "POST") {
    // Update revalidation status (called by revalidation process)
    const { id, status, revalidated, errors, completed } = req.body;

    if (!id) {
      return res.status(400).json({ message: "Job ID is required" });
    }

    const existingStatus = revalidationStatus.get(id) || {
      status: "pending",
      startTime: new Date().toISOString(),
      revalidated: [],
      errors: [],
      lastUpdate: new Date().toISOString(),
    };

    const updatedStatus = {
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

    revalidationStatus.set(id, updatedStatus);

    return res.status(200).json({
      message: "Status updated",
      id,
      ...updatedStatus,
    });
  }

  return res.status(405).json({ message: "Method not allowed" });
}
