import connectToDatabase from "@/lib/mongoose";
import Article from "@/models/Article";
import ViewLog from "@/models/ViewLog";
import crypto from "crypto";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest & { user: { _id: string } },
  { params }: { params: { slug: string } },
) {
  const { slug } = params;
  const headersList = headers();
  const ip = headersList.get("ip") as string;
  console.log(req.user, "req.user");
  const userId = req?.user?._id ?? null;
  const ipHash = crypto.createHash("sha256").update(ip).digest("hex");

  if (!slug) {
    return NextResponse.json(
      { success: false, message: "Slug is required" },
      { status: 400 },
    );
  }

  try {
    const db = await connectToDatabase();

    let article = await Article.findOne({ slug });
    if (!article) {
      article = await Article.create({ slug });
    }

    const existingView = await ViewLog.findOne({
      articleId: slug,
      $or: [{ ipHash }, { userId }],
    });

    if (!existingView) {
      await ViewLog.create({ articleId: slug, ipHash, userId });
      await Article.updateOne({ slug }, { $inc: { views: 1 } });
    }

    const responseData = {
      like: article.likes.length,
      view: article.views,
      comment: article.comments.length,
      dislikes: article.dislikes.length,
      hearts: article.hearts.length,
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
