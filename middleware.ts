import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Routes that require authentication
const protectedRoutes = ["/admin"];
const publicRoutes = ["/login", "/api/auth"];

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isOnProtectedRoute = protectedRoutes.some((route) =>
    req.nextUrl.pathname.startsWith(route)
  );
  const isOnPublicRoute = publicRoutes.some((route) =>
    req.nextUrl.pathname.startsWith(route)
  );

  // Redirect to login if accessing protected route while logged out
  if (isOnProtectedRoute && !isOnPublicRoute && !isLoggedIn) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  // Redirect to admin dashboard if accessing login while logged in
  if (isOnPublicRoute && req.nextUrl.pathname === "/login" && isLoggedIn) {
    return NextResponse.redirect(new URL("/admin", req.nextUrl));
  }

  return NextResponse.next();
});

// Configure which routes middleware runs on
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - api routes that don't need auth
     */
    "/((?!_next/static|_next/image|favicon.ico|public|api/auth).*)",
  ],
};
