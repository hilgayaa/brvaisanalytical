import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow: login page, login API, Next.js assets
  if (
    pathname.startsWith("/admin-login") ||
    pathname.startsWith("/api/admin-login") ||
    pathname.startsWith("/_next") ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  // Protect admin pages + admin API routes
  if (
    pathname.startsWith("/admin") ||
    pathname.startsWith("/api/admin") 
  ) {
    const cookie = req.cookies.get("admin_pass")?.value;

    if (!cookie || cookie !== ADMIN_PASSWORD) {
      const url = req.nextUrl.clone();
      url.pathname = "/admin-login";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/admin",
    "/api/admin/:path*",
    "/api/product/:path*",
    "/api/products/:path*",
  ],
};
