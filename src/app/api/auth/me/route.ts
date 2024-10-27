import User from "@/models/User";
import { DecodeOptions, JwtPayload, verify } from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const cookiesList = cookies();
  try {
    const token = cookiesList.get("token")?.value || "";
    if (!token) {
      return NextResponse.json({
        success: false,
        message: "No token found",
      });
    }
    const decoded: JwtPayload = verify(
      token,
      process.env.JWT_SECRET as string,
    ) as JwtPayload;
    const { email, username, _id, exp, iat } = decoded;

    if (exp && iat) {
      const tokenDuration = exp - iat;
      if (tokenDuration < 0) {
        cookiesList.delete("token");
        return NextResponse.json({
          success: false,
          message: "Token expired",
        });
      }
    }

    const user = await User.findOne({ email }).select(
      "-comments -likedArticles -disLikedArticles -hearts",
    );
    if (!user) {
      return NextResponse.json({
        success: false,
        message: "Unauthorized",
      });
    }

    return NextResponse.json({
      success: true,
      message: "Token verified",
      data: user,
    });
  } catch (error) {
    console.log(error, "error from verify route");
    return NextResponse.json({
      success: false,
      message: "Invalid token",
    });
  }
}
