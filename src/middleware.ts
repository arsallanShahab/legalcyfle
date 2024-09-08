import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);
  const userIp =
    requestHeaders.get("x-real-ip") ||
    requestHeaders.get("x-forwarded-for") ||
    requestHeaders.get("x-client-ip") ||
    requestHeaders.get("x-remote-ip") ||
    requestHeaders.get("x-cluster-client-ip") ||
    requestHeaders.get("x-forwarded") ||
    requestHeaders.get("forwarded-for") ||
    requestHeaders.get("forwarded") ||
    requestHeaders.get("via");
  const ip = userIp ?? "null"; // Default IP address if not found
  const response = NextResponse.next({
    headers: {
      ip: ip,
    },
  });
  return response;
}
