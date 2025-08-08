// src/app/api/products/[slug]/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import Product from "@/models/Product";
import { requireAdminFromRequest } from "@/lib/requireAdmin";
import type { ProductType } from "@/types/product";

function formatProduct(doc: any): ProductType {
  return {
    id: doc._id?.toString(),
    slug: doc.slug,
    name: doc.name,
    about: doc.about,
    categoryId: doc.categoryId ? doc.categoryId.toString() : "",
    subCategoryId: doc.subCategoryId ? doc.subCategoryId.toString() : undefined,
    parameters: doc.parameters ?? [],
    applications: doc.applications ?? [],
    description: doc.description ?? [],
    images: doc.images ?? [],
    price: typeof doc.price === "number" ? doc.price : null,
    metadata: doc.metadata ?? {},
    createdAt: doc.createdAt
      ? new Date(doc.createdAt).toISOString()
      : undefined,
    updatedAt: doc.updatedAt
      ? new Date(doc.updatedAt).toISOString()
      : undefined,
  };
}

/**
 * GET /api/products/:slug
 * Public: returns single product by slug
 */
export async function GET(
  req: Request,
  { params }: { params: { slug: string } }
) {
  await connectDB();
  const { slug } = params;
  const doc = await Product.findOne({ slug }).lean();
  if (!doc) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(formatProduct(doc));
}

/**
 * PUT /api/products/:slug
 * Protected: update product (admin)
 */
export async function PUT(
  req: Request,
  { params }: { params: { slug: string } }
) {
  await connectDB();
  try {
    await requireAdminFromRequest(req);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const updates = await req.json();

  // don't allow changing slug to an existing slug (basic check)
  if (updates.slug) {
    const current = await Product.findOne({ slug: params.slug }).lean();
    if (!current) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const other = await Product.findOne({
      slug: updates.slug,
      _id: { $ne: current._id },
    }).lean();

    if (other) {
      return NextResponse.json({ error: "slug already used" }, { status: 409 });
    }
  }

  const updated = await Product.findOneAndUpdate(
    { slug: params.slug },
    updates,
    { new: true }
  ).lean();

  if (!updated) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(formatProduct(updated));
}

/**
 * DELETE /api/products/:slug
 * Protected: delete product (admin)
 */
export async function DELETE(
  req: Request,
  { params }: { params: { slug: string } }
) {
  await connectDB();
  try {
    await requireAdminFromRequest(req);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { slug } = params;
  const deleted = await Product.findOneAndDelete({ slug }).lean();
  if (!deleted) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
