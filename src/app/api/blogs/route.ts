import { BlogController } from "@/controllers/blog.controller";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(req: Request) {
  return BlogController.getAllBlogs(req as any);
}

export async function POST(req: Request) {
  return BlogController.createBlog(req as any);
}
