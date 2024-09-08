import connectToDatabase from "@/lib/mongoose";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function POST(req: Request, res: Response) {
  const { firstName, lastName, email, password, confirmPassword } =
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
      password,
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
