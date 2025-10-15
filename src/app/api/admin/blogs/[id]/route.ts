import { NextRequest } from "next/server";
import { requireAdminFromRequest } from "@/lib/requireAdmin";
import { BlogController } from "@/controllers/blog.controller";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdminFromRequest(req);
    return BlogController.getBlogById(req, { params });
  } catch (error: any) {
    return error.toResponse();
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdminFromRequest(req);
    return BlogController.updateBlog(req, { params });
  } catch (error: any) {
    return error.toResponse();
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdminFromRequest(req);
    return BlogController.deleteBlog(req, { params });
  } catch (error: any) {
    return error.toResponse();
  }
}
