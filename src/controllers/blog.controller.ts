import { NextRequest, NextResponse } from "next/server";
import { BlogService } from "@/services/blogService";
import { APIError } from "@/lib/ApiResponse";

export class BlogController {
  static async getAllBlogs(req: NextRequest) {
    try {
      const { searchParams } = new URL(req.url);
      const published = searchParams.get("published") !== "false";
      const search = searchParams.get("search");
      const tag = searchParams.get("tag");

      let blogs;
      if (search) {
        blogs = await BlogService.searchBlogs(search, published);
      } else if (tag) {
        blogs = await BlogService.getBlogsByTag(tag, published);
      } else {
        blogs = await BlogService.getAllBlogs(published);
      }

      return NextResponse.json({
        success: true,
        message: "Blogs retrieved successfully",
        data: blogs,
      });
    } catch (error) {
      console.error("Error retrieving blogs:", error);
      return NextResponse.json(
        { success: false, message: "Failed to retrieve blogs" },
        { status: 500 }
      );
    }
  }

  static async getBlogById(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
  ) {
    try {
      const { id } = await params;
      const blog = await BlogService.getBlogById(id);

      if (!blog) {
        return NextResponse.json(
          { success: false, message: "Blog not found" },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        message: "Blog retrieved successfully",
        data: blog,
      });
    } catch (error) {
      console.error("Error retrieving blog:", error);
      return NextResponse.json(
        { success: false, message: "Failed to retrieve blog" },
        { status: 500 }
      );
    }
  }

  static async getBlogBySlug(
    req: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
  ) {
    try {
      const { slug } = await params;
      const blog = await BlogService.getBlogBySlug(slug);

      if (!blog) {
        return NextResponse.json(
          { success: false, message: "Blog not found" },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        message: "Blog retrieved successfully",
        data: blog,
      });
    } catch (error) {
      console.error("Error retrieving blog:", error);
      return NextResponse.json(
        { success: false, message: "Failed to retrieve blog" },
        { status: 500 }
      );
    }
  }

  static async createBlog(req: NextRequest) {
    try {
      const blogData = await req.json();

      // Generate slug if not provided
      if (!blogData.slug && blogData.title) {
        blogData.slug = BlogService.generateSlug(blogData.title);
      }

      const blog = await BlogService.createBlog(blogData);

      return NextResponse.json(
        {
          success: true,
          message: "Blog created successfully",
          data: blog,
        },
        { status: 201 }
      );
    } catch (error: any) {
      console.error("Error creating blog:", error);

      // Handle duplicate key error (slug already exists)
      if (error.code === 11000) {
        return NextResponse.json(
          { success: false, message: "Blog with this slug already exists" },
          { status: 400 }
        );
      }

      // Handle validation errors
      if (error.name === "ValidationError") {
        const validationErrors = Object.values(error.errors).map(
          (err: any) => err.message
        );
        return NextResponse.json(
          {
            success: false,
            message: "Validation failed",
            errors: validationErrors,
            details: validationErrors.join(", "),
          },
          { status: 400 }
        );
      }

      return NextResponse.json(
        { success: false, message: "Failed to create blog" },
        { status: 500 }
      );
    }
  }

  static async updateBlog(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
  ) {
    try {
      const { id } = await params;
      const blogData = await req.json();

      // Generate slug if title changed and slug not provided
      if (blogData.title && !blogData.slug) {
        blogData.slug = BlogService.generateSlug(blogData.title);
      }

      const blog = await BlogService.updateBlog(id, blogData);

      if (!blog) {
        return NextResponse.json(
          { success: false, message: "Blog not found" },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        message: "Blog updated successfully",
        data: blog,
      });
    } catch (error: any) {
      console.error("Error updating blog:", error);

      // Handle duplicate key error (slug already exists)
      if (error.code === 11000) {
        return NextResponse.json(
          { success: false, message: "Blog with this slug already exists" },
          { status: 400 }
        );
      }

      // Handle validation errors
      if (error.name === "ValidationError") {
        const validationErrors = Object.values(error.errors).map(
          (err: any) => err.message
        );
        return NextResponse.json(
          {
            success: false,
            message: "Validation failed",
            errors: validationErrors,
            details: validationErrors.join(", "),
          },
          { status: 400 }
        );
      }

      return NextResponse.json(
        { success: false, message: "Failed to update blog" },
        { status: 500 }
      );
    }
  }

  static async deleteBlog(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
  ) {
    try {
      const { id } = await params;
      const deleted = await BlogService.deleteBlog(id);

      if (!deleted) {
        return NextResponse.json(
          { success: false, message: "Blog not found" },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        message: "Blog deleted successfully",
        data: null,
      });
    } catch (error) {
      console.error("Error deleting blog:", error);
      return NextResponse.json(
        { success: false, message: "Failed to delete blog" },
        { status: 500 }
      );
    }
  }
}
