import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const cookiesList = cookies();
  try {
    const token = cookiesList.delete("token");
    // NextResponse.redirect(
    //   process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
    // );
    return NextResponse.json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.log(error, "error from verify route");
    return NextResponse.json({
      success: false,
      message: "Error logging out",
    });
  }
}
