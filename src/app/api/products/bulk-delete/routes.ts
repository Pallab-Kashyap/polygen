// src/app/api/products/bulk-delete/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import Product from "@/models/Product";
import { requireAdminFromRequest } from "@/lib/requireAdmin";

export async function POST(req: Request) {
  await connectDB();

  try {
    requireAdminFromRequest(req);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const slugs = Array.isArray(body?.slugs) ? body.slugs.map(String) : [];

  if (slugs.length === 0) {
    return NextResponse.json({ error: "slugs required" }, { status: 400 });
  }

  const result = await Product.deleteMany({ slug: { $in: slugs } });
  return NextResponse.json({ deletedCount: result.deletedCount ?? 0 });
}
