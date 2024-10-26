import connectToDatabase from "@/lib/mongoose";
import Article from "@/models/Article";
import Comment from "@/models/Comment";
import User from "@/models/User";
import IUser from "@/types/global/user";
import { JwtPayload, verify } from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { content, articleId } = await req.json();

  if (!content || !articleId) {
    return NextResponse.json({
      success: false,
      message: "Please provide all required fields",
    });
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
    return NextResponse.json({
      success: false,
      message: "Unauthorized",
    });
  }

  try {
    const article = await Article.findById(articleId);
    if (!article) {
      return NextResponse.json({
        success: false,
        message: "User or Article not found",
      });
    }

    const comment = await Comment.create({
      content,
      author: user?._id,
      article: article._id,
    });

    user?.comments.push(comment._id);
    await user?.save();

    article.comments.push(comment._id);
    await article.save();

    return NextResponse.json({
      success: true,
      message: "Comment added successfully",
      data: comment,
    });
  } catch (error) {
    console.log(error, "error from add comment route");
    return NextResponse.json({
      success: false,
      message: "Something went wrong",
    });
  }
}

export async function DELETE(req: Request) {
  const { commentId } = await req.json();

  if (!commentId) {
    return NextResponse.json({
      success: false,
      message: "Please provide all required fields",
    });
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
    return NextResponse.json({
      success: false,
      message: "Unauthorized",
    });
  }

  try {
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return NextResponse.json({
        success: false,
        message: "Comment not found",
      });
    }

    if (comment.author.toString() !== user?._id.toString()) {
      return NextResponse.json({
        success: false,
        message: "You are not authorized to delete this comment",
      });
    }

    await Comment.deleteOne({ _id: comment._id });

    return NextResponse.json({
      success: true,
      message: "Comment deleted successfully",
    });
  } catch (error) {
    console.log(error, "error from delete comment route");
    return NextResponse.json({
      success: false,
      message: "Something went wrong",
    });
  }
}
