import connectToDatabase from "@/lib/mongoose";
import Article from "@/models/Article";
import User from "@/models/User";
import { JwtPayload, verify } from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
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
    const cookiesList = cookies();
    const token = cookiesList.get("token")?.value;
    if (!token) {
      return NextResponse.json({
        success: false,
        message: "Unauthorized Access",
      });
    }
    const decodedToken = verify(
      token,
      process.env.JWT_SECRET as string,
    ) as JwtPayload;
    console.log(decodedToken, "decodedToken");
    const db = await connectToDatabase();
    const user = await User.findById(decodedToken._id);
    if (!user) {
      return NextResponse.json({
        success: false,
        message: "Token Malformed or Expired",
      });
    }
    const article = await Article.findOne({ slug: params.slug });
    if (!article) {
      return NextResponse.json({
        success: false,
        message: "Article not found",
      });
    }
    const dislikeToggle = await user.toggleArticleDislike(article._id);
    const isDisliked = user.hasDislikedArticle(article._id);
    const updatedArticleDislikes = isDisliked
      ? article.dislikes.length + 1
      : article.dislikes.length - 1;

    return NextResponse.json({
      success: true,
      message: `Article ${isDisliked ? "disliked" : "undisliked"} successfully`,
      data: {
        isDisliked,
        dislikes: updatedArticleDislikes,
      },
    });
  } catch (error) {
    console.log(error, "error from dislike route");
    return NextResponse.json({
      success: false,
      message: "Error disliking article",
    });
  }
}
