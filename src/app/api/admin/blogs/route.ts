import { NextRequest } from "next/server";
import { requireAdminFromRequest } from "@/lib/requireAdmin";
import { BlogController } from "@/controllers/blog.controller";

export async function GET(req: NextRequest) {
  try {
    await requireAdminFromRequest(req);
    return BlogController.getAllBlogs(req);
  } catch (error: any) {
    return error.toResponse();
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAdminFromRequest(req);
    return BlogController.createBlog(req);
  } catch (error: any) {
    return error.toResponse();
  }
}
