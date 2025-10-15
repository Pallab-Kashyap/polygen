import { BlogController } from "@/controllers/blog.controller";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  return BlogController.getBlogBySlug(req as any, { params });
}
