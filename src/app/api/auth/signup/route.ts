import connectToDatabase from "@/lib/mongoose";
import { sendToken } from "@/lib/send-mail";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function POST(req: Request, res: Response) {
  const { firstName, lastName, email, gender, password, confirmPassword } =
    await req.json();
  if (!firstName || !email || !password || !confirmPassword) {
    return NextResponse.json({
      success: false,
      message: "Please fill all fields",
    });
  }
  if (password !== confirmPassword) {
    return NextResponse.json({
      success: false,
      message: "Passwords do not match",
    });
  }
  try {
    const db = await connectToDatabase();
    const isUserExist = await User.findOne({
      email,
    });
    if (isUserExist) {
      return NextResponse.json({
        success: false,
        message: "User already exists",
      });
    }
    const user = await User.create({
      firstName,
      lastName,
      email,
      gender,
      password,
    });
    const verificationToken = user.generateEmailVerificationToken();
    await user.save();

    const verificationUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/verify-email?token=${verificationToken}`;
    const message = `Please verify your email by clicking the following link: ${verificationUrl}`;

    await sendToken({
      to: user.email,
      subject: "Email Verification",
      text: message,
    });
    return NextResponse.json({
      success: true,
      message: "User created successfully",
      data: user,
    });
  } catch (error) {
    console.log(error, "error from sign up route");
    return NextResponse.json({
      success: false,
      message: "Something went wrong",
    });
  }
}
