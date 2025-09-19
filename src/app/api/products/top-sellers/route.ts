import { getTopSellerProducts } from "@/controllers/product.controller";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  return getTopSellerProducts(req);
}
