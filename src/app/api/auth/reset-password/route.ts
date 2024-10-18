import connectToDatabase from "@/lib/mongoose";
import User from "@/models/User";
import crypto from "crypto";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { token, password } = await req.json();
  if (!token || !password) {
    return NextResponse.json({
      success: false,
      message: "Invalid request",
    });
  }
  try {
    const db = await connectToDatabase();
    const user = await User.findOne({
      resetPasswordToken: crypto
        .createHash("sha256")
        .update(token)
        .digest("hex"),
      resetPasswordExpires: { $gt: Date.now() },
    });
    if (!user) {
      return NextResponse.json({
        success: false,
        message: "Invalid or expired token",
      });
    }
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    return NextResponse.json({
      success: true,
      message: "Password reset successful",
    });
  } catch (error) {
    console.log(error, "error from reset password route");
    return NextResponse.json({
      success: false,
      message: "Something went wrong",
    });
  }
}
