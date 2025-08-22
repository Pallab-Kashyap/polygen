import { NextRequest, NextResponse } from "next/server";
import { verifyAdminToken } from "@/lib/auth";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Protect admin UI (everything under /admin) except /admin/login
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    const token = req.cookies.get("admin_token")?.value;
    if (!token) {
      // redirect to login (client will land on login page)
      const url = req.nextUrl.clone();
      url.pathname = "/admin/login";
      return NextResponse.redirect(url);
    }
    try {
      verifyAdminToken(token);
      return NextResponse.next();
    } catch (err) {
      const url = req.nextUrl.clone();
      url.pathname = "/admin/login";
      return NextResponse.redirect(url);
    }
  }

  // Protect mutating product APIs: POST, PUT, DELETE under /api/products
  if (pathname.startsWith("/api/products")) {
    const method = req.method.toUpperCase();
    if (method !== "GET") {
      const token = req.cookies.get("admin_token")?.value;
      if (!token) {
        return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
          status: 401,
        });
      }
      try {
        verifyAdminToken(token);
        return NextResponse.next();
      } catch {
        return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
          status: 401,
        });
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/products/:path*"],
};
