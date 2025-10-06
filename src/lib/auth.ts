// src/lib/auth.ts
import jwt from "jsonwebtoken";
import { serialize, parse } from "cookie";
import { jwtVerify } from "jose";

// Use server-side only JWT secret (no NEXT_PUBLIC_ prefix)
const JWT_SECRET = process.env.JWT_SECRET as string;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET must be set in environment variables");
}

export function createAdminToken(payload: { adminId: string }) {
  try {
    console.log("Creating JWT token for admin:", payload.adminId);
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "10d" });
    console.log("JWT token created successfully");
    return token;
  } catch (error) {
    console.error("Failed to create JWT token:", error);
    throw error;
  }
}

export async function verifyAdminToken(token: string) {
  const secret = new TextEncoder().encode(JWT_SECRET);
  const { payload } = await jwtVerify(token, secret);
  return payload as {
    adminId: string;
    iat: number;
    exp: number;
  };
}

export function setAuthCookie(token: string) {
  const isProduction = process.env.NODE_ENV === "production";
  console.log("Setting auth cookie, production mode:", isProduction);

  const cookieOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax" as const,
    path: "/",
    maxAge: 10 * 24 * 60 * 60, // 10 days in seconds
  };

  console.log("Cookie options:", cookieOptions);
  return serialize("admin_token", token, cookieOptions);
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
