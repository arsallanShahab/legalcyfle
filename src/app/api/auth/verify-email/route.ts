import connectToDatabase from "@/lib/mongoose";
import User from "@/models/User";
import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const token = searchParams.get("token");
  if (!token) {
    return NextResponse.json({
      success: false,
      message: "Invalid request",
    });
  }
  try {
    const db = await connectToDatabase();
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const user = await User.findOne({
      emailVerificationToken: hashedToken,
      emailVerificationExpires: { $gt: Date.now() },
    });
    if (!user) {
      return NextResponse.json({
        success: false,
        message: "Invalid or expired token",
      });
    }
    user.emailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();

    return NextResponse.json({
      success: true,
      message: "Email verified successfully",
    });
  } catch (error) {
    console.log(error, "error from verify email route");
    return NextResponse.json({
      success: false,
      message: "Something went wrong",
    });
  }
}
