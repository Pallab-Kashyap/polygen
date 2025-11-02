import Blog, { IBlog } from "@/models/Blog";
import { connectDB } from "@/lib/mongoose";

export class BlogService {
  static async getAllBlogs(published: boolean = true): Promise<any[]> {
    await connectDB();
    const query = published ? { isPublished: true } : {};
    return Blog.find(query).sort({ createdAt: -1 }).lean();
  }

  static async getBlogById(
    id: string,
    published: boolean = true
  ): Promise<any | null> {
    await connectDB();
    const query = published ? { _id: id, isPublished: true } : { _id: id };
    return Blog.findOne(query).lean();
  }

  static async getBlogBySlug(
    slug: string,
    published: boolean = true
  ): Promise<any | null> {
    await connectDB();
    const query = published ? { slug, isPublished: true } : { slug };
    return Blog.findOne(query).lean();
  }

  static async createBlog(blogData: Partial<IBlog>): Promise<IBlog> {
    await connectDB();
    const blog = new Blog(blogData);
    return blog.save();
  }

  static async updateBlog(
    id: string,
    blogData: Partial<IBlog>
  ): Promise<any | null> {
    await connectDB();
    return Blog.findByIdAndUpdate(id, blogData, { new: true }).lean();
  }

  static async deleteBlog(id: string): Promise<boolean> {
    await connectDB();
    const result = await Blog.findByIdAndDelete(id);
    return !!result;
  }

  static async searchBlogs(
    query: string,
    published: boolean = true
  ): Promise<any[]> {
    await connectDB();
    const searchQuery = {
      $and: [
        published ? { isPublished: true } : {},
        {
          $or: [
            { title: { $regex: query, $options: "i" } },
            { description: { $regex: query, $options: "i" } },
            { content: { $regex: query, $options: "i" } },
            { tags: { $in: [new RegExp(query, "i")] } },
          ],
        },
      ],
    };
    return Blog.find(searchQuery).sort({ createdAt: -1 }).lean();
  }

  static async getBlogsByTag(
    tag: string,
    published: boolean = true
  ): Promise<any[]> {
    await connectDB();
    const query = published ? { tags: tag, isPublished: true } : { tags: tag };
    return Blog.find(query).sort({ createdAt: -1 }).lean();
  }

  static generateSlug(title: string): string {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }
}
