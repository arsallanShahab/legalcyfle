import connectToDatabase from "@/lib/mongoose";
import Article from "@/models/Article";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: { slug: string } },
) {
  if (!params.slug) {
    return NextResponse.json({
      success: false,
      message: "Slug is required",
    });
  }

  try {
    const { deviceId } = await req.json();

    if (!deviceId) {
      return NextResponse.json({
        success: false,
        message: "Device ID is required",
      });
    }

    const db = await connectToDatabase();
    const article = await Article.findOne({ slug: params.slug });

    if (!article) {
      return NextResponse.json({
        success: false,
        message: "Article not found",
      });
    }

    const hasLiked = (article.deviceLikes || []).includes(deviceId);
    const hasDisliked = (article.deviceDislikes || []).includes(deviceId);
    const hasHearted = (article.deviceHearts || []).includes(deviceId);

    // Initialize arrays if they don't exist
    if (!article.deviceLikes) article.deviceLikes = [];
    if (!article.deviceDislikes) article.deviceDislikes = [];
    if (!article.deviceHearts) article.deviceHearts = [];

    if (hasLiked) {
      // Remove like
      article.deviceLikes = article.deviceLikes.filter(
        (id: string) => id !== deviceId,
      );
    } else {
      // Add like and remove dislike/heart if exists
      article.deviceLikes.push(deviceId);
      if (hasDisliked) {
        article.deviceDislikes = article.deviceDislikes.filter(
          (id: string) => id !== deviceId,
        );
      }
      if (hasHearted) {
        article.deviceHearts = article.deviceHearts.filter(
          (id: string) => id !== deviceId,
        );
      }
    }

    await article.save();

    const isLiked = !hasLiked;
    const totalLikes = (article.deviceLikes?.length || 0) + (article.likes?.length || 0);

    return NextResponse.json({
      success: true,
      message: `Article ${isLiked ? "liked" : "unliked"} successfully`,
      data: {
        isLiked,
        likes: totalLikes,
      },
    });
  } catch (error) {
    console.error("Error in like route:", error);
    console.error("Stack trace:", error instanceof Error ? error.stack : "No stack trace");
    return NextResponse.json({
      success: false,
      message: "Error liking article",
    });
  }
}
