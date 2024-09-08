import { verify } from "jsonwebtoken";
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
    const decoded = verify(token, process.env.JWT_SECRET as string);
    return NextResponse.json({
      success: true,
      message: "Token verified",
      data: decoded,
    });
  } catch (error) {
    console.log(error, "error from verify route");
    return NextResponse.json({
      success: false,
      message: "Invalid token",
    });
  }
}
