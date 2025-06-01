import { getSessionCookie } from "better-auth/cookies";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (
    pathname.startsWith("/images/") ||
    pathname.includes(".png") ||
    pathname.includes(".jpg") ||
    pathname.includes(".webp") ||
    pathname.includes(".svg") ||
    pathname.includes(".woff2") ||
    pathname.includes(".woff") ||
    pathname.includes(".ttf") ||
    pathname.includes(".otf") ||
    pathname === "/privacypolicy" ||
    pathname === "/tos" ||
    pathname === "/datadeletion"
  ) {
    return NextResponse.next();
  }

  if (request.nextUrl.pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  const sessionCookie = getSessionCookie(request);
  const isAuthPage = pathname.startsWith("/auth");
  const isAdminPage = pathname.startsWith("/admin");

  // Allow access to auth pages without session
  if (!sessionCookie && isAuthPage) {
    return NextResponse.next();
  }

  // Redirect to login if no session and trying to access protected pages
  if (!sessionCookie && !isAuthPage) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  // If user has session, check registration status only for non-auth pages
  if (sessionCookie && !isAuthPage) {
    try {
      const response = await fetch(
        new URL("/api/auth/check.user.info", request.url),
        {
          headers: {
            cookie: request.headers.get("cookie") || "",
          },
        }
      );

      const data = await response.json();

      // If user hasn't completed registration
      if (data.status === "incomplete") {
        if (data.step === "userinfo") {
          // Add query parameter to signal client to set registrationSession
          const redirectUrl = new URL("/auth/register/userinfo", request.url);
          redirectUrl.searchParams.set("registrationSession", "true");
          return NextResponse.redirect(redirectUrl);
        } else if (data.step === "terms") {
          return NextResponse.redirect(
            new URL("/auth/register/terms", request.url)
          );
        }
      }

      // If there's an error or unauthenticated
      if (data.status === "error" || data.status === "unauthenticated") {
        return NextResponse.redirect(new URL("/auth/login", request.url));
      }

      // If status is "complete" and the current path is the check endpoint, redirect to home
      if (
        data.status === "complete" &&
        pathname === "/api/auth/check.user.info"
      ) {
        return NextResponse.redirect(new URL("/", request.url));
      }

      // If status is "complete", allow the request to proceed.
      // No explicit redirect is needed here, as the user is already on the target page (or will be allowed to proceed).
      if (data.status === "complete") {
        return NextResponse.next();
      }

      // If status is not complete and not handled above, redirect to user info as a fallback
      // This should ideally not be reached if incomplete statuses are handled.
      if (data.status !== "complete") {
        // Fallback redirect to user info without the query parameter
        return NextResponse.redirect(
          new URL("/auth/register/userinfo", request.url)
        );
      }
    } catch (err) {
      console.error("Registration check error:", err);
      // On error, redirect to user info as a fallback without the query parameter
      return NextResponse.redirect(
        new URL("/auth/register/userinfo", request.url)
      );
    }
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
