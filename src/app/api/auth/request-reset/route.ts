import connectToDatabase from "@/lib/mongoose";
import { sendToken } from "@/lib/send-mail";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { email } = await req.json();
  if (!email) {
    return NextResponse.json({
      success: false,
      message: "Please provide an email",
    });
  }
  try {
    const db = await connectToDatabase();
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({
        success: false,
        message: "User does not exist",
      });
    }
    const resetToken = user.generatePasswordResetToken();
    await user.save();

    const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/reset-password?token=${resetToken}`;
    const message = `You are receiving this email because you (or someone else) have requested the reset of a password. Please click on the following link, or paste this into your browser to complete the process:\n\n${resetUrl}\n\nIf you did not request this, please ignore this email and your password will remain unchanged.`;

    await sendToken({
      to: user.email,
      subject: "Password Reset Request",
      text: message,
    });

    return NextResponse.json({
      success: true,
      message: "Password reset email sent",
    });
  } catch (error) {
    console.log(error, "error from request reset route");
    return NextResponse.json({
      success: false,
      message: "Something went wrong",
    });
  }
}
