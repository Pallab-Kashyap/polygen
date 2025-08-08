// src/lib/auth.ts
import jwt from "jsonwebtoken";
import { serialize, parse } from "cookie";
import { jwtVerify } from "jose";

// Ensure JWT_SECRET is always a string at runtime
const JWT_SECRET = process.env.NEXT_PUBLIC_JWT_SECRET as string;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET must be set in env");
}

export function createAdminToken(payload: { adminId: string }) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "10m" });
}

export async function verifyAdminToken(token: string) {
  const secret = new TextEncoder().encode(process.env.JWT_SECRET);
  const { payload } = await jwtVerify(token, secret);
  return payload as {
    adminId: string;
    iat: number;
    exp: number;
  };
}

export function setAuthCookie(token: string) {
  return serialize("admin_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 10 * 60,
  });
}

export function clearAuthCookie() {
  return serialize("admin_token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}

export function parseCookies(cookieHeader: string | null | undefined) {
  return cookieHeader ? parse(cookieHeader) : {};
}
