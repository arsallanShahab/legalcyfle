import connectToDatabase from "@/lib/mongoose";
import { sendToken } from "@/lib/send-mail";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { email } = await req.json();
  if (!email) {
    return NextResponse.json({
      success: false,
      message: "Please provide email address",
    });
  }

  try {
    await connectToDatabase();
    const exitsingUser = await User.findOne({ email: email.toLowerCase() });
    if (!exitsingUser) {
      return NextResponse.json({
        success: false,
        message: "User not found",
      });
    }
    const token = exitsingUser.generateEmailVerificationToken();
    await exitsingUser.save();
    const verificationUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/verify-email?token=${token}`;
    const message = `Please verify your email by clicking the following link: ${verificationUrl}`;

    await sendToken({
      to: exitsingUser.email,
      subject: "Email Verification",
      text: message,
    });
    return NextResponse.json({
      success: true,
      message: "Verification email sent",
    });
  } catch (error) {
    console.log(error, "error from generate-verify-token route");
    return NextResponse.json({
      success: false,
      message: "Something went wrong",
    });
  }
}
