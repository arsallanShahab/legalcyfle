import connectToDatabase from "@/lib/mongoose";
import Article from "@/models/Article";
import Comment from "@/models/Comment";
import ViewLog from "@/models/ViewLog";
import crypto from "crypto";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const slug = "jobs-metrics";
  const headersList = headers();
  const ip = (headersList.get("ip") as string) || "127.0.0.1";
  const ipHash = crypto.createHash("sha256").update(ip).digest("hex");

  // Get deviceId from query params if available
  const { searchParams } = new URL(req.url);
  const deviceId = searchParams.get("deviceId");

  try {
    const db = await connectToDatabase();

    let article = await Article.findOne({ slug });
    if (!article) {
      article = await Article.create({ slug });
    }

    // Track view with IP hash (no user authentication required)
    const existingView = await ViewLog.findOne({
      articleId: slug,
      ipHash,
    });

    if (!existingView) {
      await ViewLog.create({ articleId: slug, ipHash });
      await Article.updateOne({ slug }, { $inc: { views: 1 } });
      // Refresh article to get updated views
      article = await Article.findOne({ slug });
    }

    const responseData = {
      article,
      view: article.views,
      comment: article.comments.length,
    };

    return NextResponse.json({
      success: true,
      message: "Job metrics retrieved successfully!",
      data: responseData,
    });
  } catch (error) {
    console.error("Error fetching job metrics:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
