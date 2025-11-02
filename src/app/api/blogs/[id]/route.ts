import { BlogController } from "@/controllers/blog.controller";

export const dynamic = "force-dynamic";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  return BlogController.getBlogById(req as any, { params });
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  return BlogController.updateBlog(req as any, { params });
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  return BlogController.deleteBlog(req as any, { params });
}
