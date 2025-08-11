// src/app/api/products/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import Product from "@/models/Product";
import { requireAdminFromRequest } from "@/lib/requireAdmin";
import type { ProductType } from "@/types/product";

/** Helper: convert mongoose doc/lean result -> ProductType */
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

export async function GET() {
  await connectDB();
  const docs = await Product.find({}).lean();
  const products = docs.map(formatProduct);
  return NextResponse.json(products);
}

export async function POST(req: Request) {
  await connectDB();

  try {
    requireAdminFromRequest(req);
  } catch (err) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  if (!body?.name || !body?.slug || !body?.categoryId) {
    return NextResponse.json(
      { error: "Missing required fields: name, slug, categoryId" },
      { status: 400 }
    );
  }

  const exists = await Product.findOne({ slug: body.slug }).lean();
  if (exists) {
    return NextResponse.json({ error: "slug already exists" }, { status: 409 });
  }

  const created = await Product.create(body);
  return NextResponse.json(formatProduct(created.toObject()), { status: 201 });
}
