import { NextRequest } from "next/server";
import { requireAdminFromRequest } from "@/lib/requireAdmin";
import { getAllProductsAdmin } from "@/controllers/product.controller";

export async function GET(req: NextRequest) {
  try {
    await requireAdminFromRequest(req);
    return getAllProductsAdmin(req);
  } catch (error: any) {
    return error.toResponse();
  }
}
