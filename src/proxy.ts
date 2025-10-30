// src/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { parseSessionValue, COOKIE_NAME } from "@/lib/auth";

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const cookieValue = req.cookies.get(COOKIE_NAME)?.value;
  const session = parseSessionValue(cookieValue);

  // Redirect logged-in user away from /login
  if (pathname === "/login" && session) {
    const url = req.nextUrl.clone();
    url.pathname = session.role === "admin" ? "/admin" : "/dashboard";
    return NextResponse.redirect(url);
  }

  // Protect /admin
  if (pathname.startsWith("/admin")) {
    if (!session || session.role !== "admin") {
      const url = req.nextUrl.clone();
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }
  }

  // Protect /dashboard
  if (pathname.startsWith("/dashboard")) {
    if (!session) {
      const url = req.nextUrl.clone();
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*", "/login"],
};
