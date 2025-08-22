import connectToDatabase from "@/lib/mongoose";
import Article from "@/models/Article";
import Comment from "@/models/Comment";
import User from "@/models/User";
import ViewLog from "@/models/ViewLog";
import IUser from "@/types/global/user";
import crypto from "crypto";
import { JwtPayload, verify } from "jsonwebtoken";
import { cookies, headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest & { user: { _id: string } },
  { params }: { params: { slug: string } },
) {
  const { slug } = params;
  const headersList = headers();
  const ip = headersList.get("ip") as string;
  const ipHash = crypto.createHash("sha256").update(ip).digest("hex");

  if (!slug) {
    return NextResponse.json(
      { success: false, message: "Slug is required" },
      { status: 400 },
    );
  }

  try {
    const { deviceId } = await req.json();

    const db = await connectToDatabase();

    let article = await Article.findOne({ slug });
    if (!article) {
      article = await Article.create({ slug });
    }

    // Populate comments
    const comments = await Comment.find({ article: article._id })
      .populate({
        path: "author",
        select: "firstName lastName email",
      })
      .exec();

    // Track view with IP hash (no user authentication required)
    const existingView = await ViewLog.findOne({
      articleId: slug,
      ipHash,
    });

    if (!existingView) {
      await ViewLog.create({ articleId: slug, ipHash });
      await Article.updateOne({ slug }, { $inc: { views: 1 } });
    }

    // Calculate totals including both user-based and device-based interactions
    const totalLikes =
      article.likes.length + (article.deviceLikes?.length || 0);
    const totalDislikes =
      article.dislikes.length + (article.deviceDislikes?.length || 0);
    const totalHearts =
      article.hearts.length + (article.deviceHearts?.length || 0);

    // Check device preferences
    const isLiked = deviceId
      ? article.deviceLikes?.includes(deviceId) || false
      : false;
    const isDisliked = deviceId
      ? article.deviceDislikes?.includes(deviceId) || false
      : false;
    const isHearted = deviceId
      ? article.deviceHearts?.includes(deviceId) || false
      : false;

    const responseData = {
      article,
      comments,
      like: totalLikes,
      view: article.views,
      comment: article.comments.length,
      dislikes: totalDislikes,
      hearts: totalHearts,
      isLiked,
      isDisliked,
      isHearted,
    };

    return NextResponse.json({
      success: true,
      message: "Article metrics retrieved successfully!",
      data: responseData,
    });
  } catch (error) {
    console.error("Error fetching article metrics:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
