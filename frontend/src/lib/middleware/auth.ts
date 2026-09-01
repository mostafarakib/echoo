import { NextRequest, NextResponse } from "next/server";

const PROTECTED_PATHS = ["/chats"];

export function authMiddleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasToken = request.cookies.has("jwt");

  const isProtected = PROTECTED_PATHS.some((path) => pathname.startsWith(path));
  const isAuthPage =
    pathname.startsWith("/login") || pathname.startsWith("/signup");

  if (isProtected && !hasToken) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (isAuthPage && hasToken) {
    return NextResponse.redirect(new URL("/chats", request.url));
  }

  return NextResponse.next();
}
