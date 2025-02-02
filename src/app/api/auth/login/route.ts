import connectToDatabase from "@/lib/mongoose";
import User from "@/models/User";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req: Request, res: Response) {
  const { email, password } = await req.json();
  const cookiesList = cookies();
  if (!email || !password) {
    return NextResponse.json({
      success: false,
      message: "Please fill all fields",
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
    if (!user.emailVerified) {
      return NextResponse.json({
        success: false,
        message: "Please verify your email before logging in",
      });
    }
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return NextResponse.json({
        success: false,
        message: "Invalid password",
      });
    }
    cookiesList.set("token", user.generateToken(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7,
      sameSite: "strict",
    });
    return NextResponse.json({
      success: true,
      message: "Login successful",
      data: user,
    });
  } catch (error) {
    console.log(error, "error from login route");
    return NextResponse.json({
      success: false,
      message: "Something went wrong",
    });
  }
}
