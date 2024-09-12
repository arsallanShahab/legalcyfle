import { sendMail } from "@/lib/send-mail";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { name, email, phone, subject, message } = await req.json();
  if (!name || !email || !phone || !subject || !message) {
    return NextResponse.json({
      success: false,
      message: "Please fill all fields",
    });
  }
  // send mail
  try {
    const res = await sendMail({ name, email, phone, subject, message });
    console.log(res, "res from send mail");
    return NextResponse.json({
      success: true,
      message: "Mail sent successfully",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      success: false,
      message: "Failed to send mail",
    });
  }
}
