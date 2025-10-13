import { NextRequest, NextResponse } from "next/server";
import { verifyAdminToken } from "@/lib/auth";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;


  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    const token = req.cookies.get("admin_token")?.value;
    if (!token) {

      const url = req.nextUrl.clone();
      url.pathname = "/admin/login";
      return NextResponse.redirect(url);
    }
    try {
      await verifyAdminToken(token);
      return NextResponse.next();
    } catch (err) {
      console.error("Token verification failed:", err);

      const response = NextResponse.redirect(new URL("/admin/login", req.url));
      response.cookies.set("admin_token", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 0,
      });
      return response;
    }
  }

  
  if (
    pathname.startsWith("/api/products") ||
    pathname.startsWith("/api/categories")
  ) {
    const method = req.method.toUpperCase();
    if (method !== "GET") {
      const token = req.cookies.get("admin_token")?.value;
      if (!token) {
        return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
          status: 401,
        });
      }
      try {
        await verifyAdminToken(token);
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
  matcher: ["/admin/:path*", "/api/products/:path*", "/api/categories/:path*"],
};
