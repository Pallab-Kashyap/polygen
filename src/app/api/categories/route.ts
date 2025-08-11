import { requireAdminFromRequest } from "@/lib/requireAdmin";
import Category from "@/models/Category";
import { CategoryType } from "@/types/category";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  return await Category.find();
}

export async function POST(req: NextRequest) {
  try {
    requireAdminFromRequest(req);
  } catch (err) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    return await Category.create(req.json());
  } catch (error) {
    return NextResponse.json({});
  }
}

export async function DELETE(req: NextRequest) {
  try {
    requireAdminFromRequest(req);
    const body = await req.json();
    const idsToDelete: string[] = body;

    if (
      !Array.isArray(idsToDelete) ||
      !idsToDelete.every((id) => typeof id === "string")
    ) {
      return NextResponse.json(
        { error: "Invalid input: expected an array of strings" },
        { status: 400 }
      );
    }

    const objectIds = idsToDelete.map((id) => new mongoose.Types.ObjectId(id));

    const result = await Category.deleteMany({ _id: { $in: objectIds } });

    return NextResponse.json({
      message: "Categories deleted successfully",
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error("Error deleting categories:", error);
    return NextResponse.json(
      { error: "Failed to delete categories" },
      { status: 500 }
    );
  }
}
