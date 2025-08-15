// src/app/api/categories/controller.ts
import { NextRequest } from "next/server";
import Category from "@/models/Category";
import { z } from "zod";
import { requireAdminFromRequest } from "@/lib/requireAdmin";
import { asyncWrapper } from "@/lib/asyncWrapper";

import { errorHandler } from "@/lib/errorHandler";
import { APIError, APIResponse } from "@/lib/ApiResponse";
import { CategoryType } from "@/types/category";
import { connectDB } from "@/lib/mongoose";

const categorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  description: z.string().optional(),
  parentId: z.string().optional(),
});

interface CategoryWithChildren extends CategoryType {
  children?: CategoryWithChildren[];
}

function buildHierarchy(
  categories: CategoryType[],
  parentId: string | null = null
): CategoryWithChildren[] {
  return categories
    .filter((cat) => (parentId ? cat.parentId === parentId : !cat.parentId))
    .map((cat) => ({
      ...cat,
      children: buildHierarchy(categories, cat._id?.toString() || null),
    }));
}

export const createCategory = asyncWrapper(async (req: NextRequest) => {
  await connectDB();
  requireAdminFromRequest(req);
  const body = await req.json();
  const parsed = categorySchema.parse(body);

  const exists = await Category.findOne({ slug: parsed.slug });
  if (exists) {
    throw APIError.badRequest("Category with this slug already exists");
  }

  const category = await Category.create(parsed);
  console.log("success");
  return APIResponse.success(category, "Category created successfully");
});

export const updateCategory = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    await connectDB();
    requireAdminFromRequest(req);
    const body = await req.json();
    const parsed = categorySchema.partial().parse(body);

    const updated = await Category.findByIdAndUpdate(params.id, parsed, {
      new: true,
    });
    if (!updated) throw APIError.notFound("Category not found");

    return APIResponse.success(updated, "Category updated successfully");
  } catch (error) {
    return errorHandler(error);
  }
};

export const deleteCategory = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    await connectDB();
    requireAdminFromRequest(req);
    const deleted = await Category.findByIdAndDelete(params.id);
    if (!deleted) throw APIError.badRequest("Category not found");

    return APIResponse.success(null, "Category deleted successfully");
  } catch (error) {
    return errorHandler(error);
  }
};

export const getCategories = async () => {
  try {
    await connectDB();
    const categories = await Category.find();
    if (categories.length === 0) {
      return APIResponse.success([]);
    }
    // const hierarchy = buildHierarchy(categories);
    // return APIResponse.success(hierarchy);
    return APIResponse.success(categories);
  } catch (error) {
    return errorHandler(error);
  }
};

export const getCategoryById = async (
  _req: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    await connectDB();
    const category = await Category.findById(params.id);
    if (!category) throw APIError.badRequest("Category not found");

    return APIResponse.success(category);
  } catch (error) {
    return errorHandler(error);
  }
};
