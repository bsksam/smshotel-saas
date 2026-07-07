import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const session = await auth();
  const path = request.nextUrl.pathname;

  // Protect all internal routes, except the login page
  const isPublicPath = path === "/login" || path === "/api/auth";

  if (!session && !isPublicPath) {
    // Redirect unauthenticated users to login page
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (session && path === "/login") {
    // Redirect authenticated users away from login page
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // RBAC checks
  if (session) {
    // @ts-ignore
    const role = session.user?.role;
    
    // Super Admins should be in /admin
    if (path.startsWith("/admin") && role !== "SUPER_ADMIN") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    
    // Hotel Staff should not be in /admin
    if (path.startsWith("/dashboard") && role === "SUPER_ADMIN") {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Apply middleware to all routes except api, _next/static, _next/image, and favicon
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
