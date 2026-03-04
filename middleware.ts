import { NextRequest, NextResponse } from "next/server";

const SESSION_COOKIE = "fb_session";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 認証不要パス
  if (
    pathname === "/login" ||
    pathname === "/signup" ||
    pathname === "/admin/login" ||
    pathname.startsWith("/api/session") ||
    pathname.startsWith("/api/auth")
  ) {
    return NextResponse.next();
  }

  const session = request.cookies.get(SESSION_COOKIE);

  // /member/* の保護
  if (pathname.startsWith("/member")) {
    if (!session) {
      return NextResponse.redirect(new URL("/login?callbackUrl=" + encodeURIComponent(pathname), request.url));
    }
  }

  // /admin/* の保護（旧 next-auth cookie も残存対応）
  if (pathname.startsWith("/admin")) {
    const oldSession =
      request.cookies.get("next-auth.session-token") ||
      request.cookies.get("__Secure-next-auth.session-token");
    if (!session && !oldSession) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/member/:path*", "/admin/:path*"],
};
