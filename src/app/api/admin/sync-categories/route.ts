import { NextRequest } from "next/server";
import { asyncWrapper } from "@/lib/asyncWrapper";
import { syncCategoriesToFile } from "@/lib/syncCategories";
import { APIResponse, APIError } from "@/lib/ApiResponse";
import { connectDB } from "@/lib/mongoose";

export const GET = asyncWrapper(async (req: NextRequest) => {

  await connectDB();
  const success = await syncCategoriesToFile();

  if (success) {
    return APIResponse.success(null, "Categories synced to file successfully");
  } else {
    throw APIError.internal("Failed to sync categories");
  }
});
