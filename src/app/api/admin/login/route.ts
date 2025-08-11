import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { connectDB } from "@/lib/mongoose";
import Admin from "@/models/Admin";
import { createAdminToken, setAuthCookie } from "@/lib/auth";

export async function POST(req: Request) {
  await connectDB();
  const body = await req.json();
  const { username, password } = body || {};

  if (!username || !password) {
    return NextResponse.json(
      { error: "username and password required" },
      { status: 400 }
    );
  }

  const admin = await Admin.findOne({ username }).lean();
  if (!admin) {
    return NextResponse.json({ error: "invalid credentials" }, { status: 401 });
  }

  const match = await bcrypt.compare(password, admin.passwordHash);
  if (!match) {
    return NextResponse.json({ error: "invalid credentials" }, { status: 401 });
  }

  const token = createAdminToken({ adminId: admin._id.toString() });
  const cookie = setAuthCookie(token);

  return new NextResponse(JSON.stringify({ ok: true }), {
    status: 200,
    headers: {
      "Set-Cookie": cookie,
      "Content-Type": "application/json",
    },
  });
}
