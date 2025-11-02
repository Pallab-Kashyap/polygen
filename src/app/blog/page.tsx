import React from "react";
import Image from "next/image";
import { BlogType } from "@/types/blog";
import formatDate from "@/lib/formatDate";
import Heading from "@/components/shared/Heading";
import BlogCard from "@/components/BlogCard";
import { BlogService } from "@/services/blogService";

// Revalidate on-demand only (when admin makes changes)
export const revalidate = 0;

async function getAllBlogs(): Promise<BlogType[]> {
  try {
    const blogs = await BlogService.getAllBlogs(true);
    return JSON.parse(JSON.stringify(blogs)) as BlogType[];
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return [];
  }
}

export default async function BlogsPage() {
  const blogs = await getAllBlogs();

  return (
    <div className="min-h-screen mt-16 space-y-12 sm:space-y-16 py-16">
      {/* Hero Section */}
      <section className="bg-white ">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Heading>Our Blog</Heading>
            {/* </h1> */}
            <p className="text-lg sm:text-xl text-gray-600 mb-">
              Stay updated with the latest insights, tips, and innovations in
              electronics, smart devices, and sustainable energy technologies.
            </p>
          </div>
        </div>
      </section>

      {/* Blogs Grid */}
      <section className="">
        <div className="container mx-auto px-4">
          {blogs.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-500 text-lg mb-2">
                No blogs available yet
              </div>
              <div className="text-gray-400 text-sm">
                Check back soon for the latest articles and insights.
              </div>
            </div>
          ) : (
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {blogs.map((blog) => (
                  <BlogCard key={blog._id} blog={blog} />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
