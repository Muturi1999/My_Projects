import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const section = searchParams.get("section") || "homepage";
  const redirectUrl = searchParams.get("redirect") || "/";

  const response = NextResponse.redirect(new URL(redirectUrl, request.url));
  response.cookies.set(`${section}-preview`, "true", { path: "/", maxAge: 3600 });
  return response;
}

