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

const filterChildren = (categories: CategoryType[], parentId: string) =>
  categories.filter((cat) => String(cat.parentId) === String(parentId));

function buildHierarchy(categories: CategoryType[]): CategoryType[] {
  const newCatList: CategoryType[] = []
  categories.forEach((cat) => {
    if (!cat.parentId) {
      cat.children = filterChildren(categories, String(cat._id));
      newCatList.push(cat)
    }
  });

  return newCatList;
}


export const getCategories = async () => {
  try {
    await connectDB();
    const categories = await Category.find().lean();;
    if (categories.length === 0) {
      return APIResponse.success([]);
    }
    const hierarchy = buildHierarchy(categories);
    return APIResponse.success(hierarchy);
  } catch (error) {
    return errorHandler(error);
  }
};

export const getCategoryById = async (
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    await connectDB();

    const { id } = await params;
    const category = await Category.findById(id);
    if (!category) throw APIError.badRequest("Category not found");

    return APIResponse.success(category);
  } catch (error) {
    return errorHandler(error);
  }
};

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
  return APIResponse.success(category, "Category created successfully");
});

export const updateCategory = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    requireAdminFromRequest(req);
    await connectDB();
    const body = await req.json();
    const parsed = categorySchema.partial().parse(body);

    const { id } = await params;

    const updated = await Category.findByIdAndUpdate(id, parsed, {
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
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    requireAdminFromRequest(req);
    await connectDB();
    const { id } = await params;

    const deleted = await Category.findByIdAndDelete(id);
    if (!deleted) throw APIError.badRequest("Category not found");

    return APIResponse.success(null, "Category deleted successfully");
  } catch (error) {
    return errorHandler(error);
  }
};
