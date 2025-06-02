import { getSessionCookie } from "better-auth/cookies";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  console.log('Middleware triggered for path:', request.nextUrl.pathname);
  const pathname = request.nextUrl.pathname;
  console.log('Middleware - Pathname:', pathname);

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
  console.log('Middleware - Session cookie found:', !!sessionCookie);
  const isAuthPage = pathname.startsWith("/auth");
  const isAdminPage = pathname.startsWith("/admin");
  console.log('Middleware - Is auth page:', isAuthPage);
  console.log('Middleware - Is admin page:', isAdminPage);

  // Redirect to login if no session and trying to access protected pages
  if (!sessionCookie && !isAuthPage) {
    console.log('Middleware - No session, redirecting to login.');
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  // Admin route protection - Check if it's an admin page AND there is a session
  if (sessionCookie && isAdminPage) {
    try {
      console.log('Middleware - Checking admin session...');
      const response = await fetch(
        new URL("/api/auth/verify.admin.session", request.url),
        {
          headers: {
            cookie: request.headers.get("cookie") || "",
          },
        }
      );

      if (!response.ok) {
        console.log('Middleware - Admin session verification failed, redirecting to login.');
        return NextResponse.redirect(new URL("/", request.url));
      }

      const data = await response.json();
      console.log('Middleware - Admin session verification response data:', data);
      if (!data.isAdmin) {
        console.log('Middleware - User is not admin, redirecting to home.');
        return NextResponse.redirect(new URL("/", request.url));
      }

      console.log('Middleware - User is admin, allowing access to admin page.');
      return NextResponse.next();

    } catch (err) {
      console.error("Middleware - Session error during admin check:", err);
      console.log('Middleware - Session error during admin check, redirecting to login.');
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }
  }

  
  if (isAuthPage) {
    console.log('Middleware - On auth page, allowing access.');
    return NextResponse.next();
  }

  if (sessionCookie && !isAuthPage && !isAdminPage) {
    try {
      console.log('Middleware - Checking user info...');
      const response = await fetch(
        new URL("/api/auth/check.user.info", request.url),
        {
          headers: {
            cookie: request.headers.get("cookie") || "",
          },
        }
      );

      const data = await response.json();
      console.log('Middleware - User info check response data:', data);

      // If user hasn't completed registration
      if (data.status === "incomplete") {
        console.log('Middleware - User registration incomplete, step:', data.step);
        if (data.step === "userinfo") {
          const redirectUrl = new URL("/auth/register/userinfo", request.url);
          redirectUrl.searchParams.set("registrationSession", "true");
          console.log('Middleware - Redirecting to userinfo page:', redirectUrl.toString());
          return NextResponse.redirect(redirectUrl);
        } else if (data.step === "terms") {
          console.log('Middleware - Redirecting to terms page.');
          return NextResponse.redirect(
            new URL("/auth/register/terms", request.url)
          );
        }
      }

      if (data.status === "error" || data.status === "unauthenticated") {
        console.log('Middleware - User status error or unauthenticated during registration check, redirecting to login.');
        return NextResponse.redirect(new URL("/auth/login", request.url));
      }

      if (
        data.status === "complete" &&
        pathname === "/api/auth/check.user.info"
      ) {
        console.log('Middleware - User registration complete and on check endpoint, redirecting to home.');
        return NextResponse.redirect(new URL("/", request.url));
      }

      if (data.status === "complete") {
        console.log('Middleware - User registration complete, allowing access to non-auth, non-admin page.');
        return NextResponse.next();
      }

      if (data.status !== "complete") {
        console.log('Middleware - User status not complete, fallback redirect to userinfo.');
        return NextResponse.redirect(new URL("/auth/register/userinfo", request.url));
      }

    } catch (err) {
      console.error("Middleware - Registration check error:", err);
      console.log('Middleware - Registration check error, fallback redirect to userinfo.');
      return NextResponse.redirect(
        new URL("/auth/register/userinfo", request.url)
      );
    }
  }

  // If none of the above conditions are met, proceed (e.g., static files already handled)
  console.log('Middleware - No specific handling condition met, proceeding.');
  return NextResponse.next();
}

export const config = {
  // Match all routes except the ones explicitly excluded
  matcher: [
    '/',
    '/(api|trpc)(.*)',
    '/((?!_next/static|_next/image|favicon.ico).*)'
  ],
};
