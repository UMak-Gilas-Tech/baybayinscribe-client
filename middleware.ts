import { getSessionCookie } from "better-auth/cookies";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  if (pathname.startsWith('/images/') || 
      pathname.includes('.png') || 
      pathname.includes('.jpg') || 
      pathname.includes('.svg')) {
    return NextResponse.next();
  }
  
  const sessionCookie = getSessionCookie(request);
  const isAuthPage = pathname.startsWith("/auth");

  if (!sessionCookie && !isAuthPage) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  if (sessionCookie && isAuthPage && pathname === "/auth/login") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api/).*)"],
};
