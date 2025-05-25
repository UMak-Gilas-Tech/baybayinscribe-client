import { getSessionCookie } from "better-auth/cookies";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (
    pathname.startsWith("/images/") ||
    pathname.includes(".png") ||
    pathname.includes(".jpg") ||
    pathname.includes(".svg")
  ) {
    return NextResponse.next();
  }

  if (request.nextUrl.pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  const sessionCookie = getSessionCookie(request);
  const isAuthPage = pathname.startsWith("/auth");
  const isAdminPage = pathname.startsWith("/admin");

  if (!sessionCookie && !isAuthPage) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  if (sessionCookie && isAuthPage && pathname === "/auth/login") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Admin route protection
  if (sessionCookie && isAdminPage) {
    try {
      const response = await fetch(
        new URL("/api/auth/verify.admin.session", request.url),
        {
          headers: {
            cookie: request.headers.get("cookie") || "",
          },
        }
      );

      if (!response.ok) {
        return NextResponse.redirect(new URL("/auth/login", request.url));
      }

      const data = await response.json();
      if (!data.isAdmin) {
        return NextResponse.redirect(new URL("/", request.url));
      }
    } catch (err) {
      console.error("Session error:", err);
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api/).*)"],
};
