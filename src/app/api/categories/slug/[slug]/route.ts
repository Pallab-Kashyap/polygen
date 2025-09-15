import { NextRequest } from "next/server";
import { connectDB } from "@/lib/mongoose";
import { APIError, APIResponse } from "@/lib/ApiResponse";
import { errorHandler } from "@/lib/errorHandler";
import Category from "@/models/Category";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await connectDB();

    const { slug } = await params;

    if (!slug) {
      throw APIError.badRequest("Category slug is required");
    }

    const category = await Category.findOne({ slug }).lean();

    if (!category) {
      throw APIError.notFound("Category not found");
    }

    return APIResponse.success(category);
  } catch (error) {
    return errorHandler(error);
  }
}
