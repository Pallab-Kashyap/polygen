import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { connectDB } from "@/lib/mongoose";
import Admin from "@/models/Admin";
import { createAdminToken, setAuthCookie } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    console.log("Admin login attempt started");

    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET not found in environment variables");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    if (!process.env.MONGODB_URI) {
      console.error("MONGODB_URI not found in environment variables");
      return NextResponse.json(
        { error: "Database configuration error" },
        { status: 500 }
      );
    }

    console.log("Connecting to database...");
    await connectDB();
    console.log("Database connected successfully");

    let body;
    try {
      body = await req.json();
    } catch (parseError) {
      console.error("Failed to parse request body:", parseError);
      return NextResponse.json(
        { error: "Invalid request format" },
        { status: 400 }
      );
    }

    const { username, password } = body || {};

    if (!username || !password) {
      console.log("Missing username or password");
      return NextResponse.json(
        { error: "username and password required" },
        { status: 400 }
      );
    }

    console.log("Looking for admin with username:", username);
    const admin = await Admin.findOne({ username }).lean();
    if (!admin) {
      console.log("Admin not found");
      return NextResponse.json(
        { error: "invalid credentials" },
        { status: 401 }
      );
    }

    console.log("Admin found, verifying password...");
    const match = await bcrypt.compare(password, admin.passwordHash);
    if (!match) {
      console.log("Password verification failed");
      return NextResponse.json(
        { error: "invalid credentials" },
        { status: 401 }
      );
    }

    console.log("Password verified, creating token...");
    const token = createAdminToken({ adminId: admin._id.toString() });
    const cookie = setAuthCookie(token);

    console.log("Login successful, setting cookie");
    return new NextResponse(JSON.stringify({ ok: true }), {
      status: 200,
      headers: {
        "Set-Cookie": cookie,
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Admin login error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
