import { NextRequest, NextResponse } from "next/server";

const SESSION_COOKIE = "fb_session";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const session = request.cookies.get(SESSION_COOKIE);

  // /member/* の保護（admin は (protected)/layout.tsx の NextAuth auth() で保護）
  if (pathname.startsWith("/member") && !session) {
    return NextResponse.redirect(new URL("/login?callbackUrl=" + encodeURIComponent(pathname), request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/member/:path*"],
};
