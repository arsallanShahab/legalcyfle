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

export async function GET(
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

  const db = await connectToDatabase();
  let user: IUser | null = null;

  try {
    const cookiesList = cookies();
    const token = cookiesList.get("token")?.value!;
    const decodedToken = verify(
      token,
      process.env.JWT_SECRET as string,
    ) as JwtPayload;

    user = await User.findById(decodedToken._id);
  } catch (error) {
    console.log(error, "error");
  }

  try {
    let article = await Article.findOne({ slug });
    if (!article) {
      article = await Article.create({ slug });
    }

    //populate users only name and email omit everything else
    const comments = await Comment.find({ article: article._id })
      .populate({
        path: "author",
        select: "firstName lastName email",
      })
      .exec();
    const userId = user?._id;

    const existingView = await ViewLog.findOne({
      articleId: slug,
      $or: [{ ipHash }, { userId }],
    });

    if (!existingView) {
      await ViewLog.create({ articleId: slug, ipHash, userId });
      await Article.updateOne({ slug }, { $inc: { views: 1 } });
    }

    const responseData = {
      article,
      comments,
      like: article.likes.length,
      view: article.views,
      comment: article.comments.length,
      dislikes: article.dislikes.length,
      hearts: article.hearts.length,
      isLiked: user ? user.hasLikedArticle(article._id) : false,
      isDisliked: user ? user.hasDislikedArticle(article._id) : false,
      isHearted: user ? user.hasHeartedArticle(article._id) : false,
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
