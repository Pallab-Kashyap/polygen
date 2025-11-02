"use client";
import React, { useState, useEffect } from "react";
import Heading from "../../shared/Heading";
import Container from "../../shared/Container";
import { BlogType } from "@/types/blog";
import Link from "next/link";
import BlogCard from "@/components/BlogCard";

const BlogSection: React.FC = () => {
  const [blogs, setBlogs] = useState<BlogType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch("/api/blogs");
        const data = await response.json();

        if (data.success) {
          // Get the latest 3 blogs for the homepage
          setBlogs(data.data.slice(0, 3));
        }
      } catch (error) {
        console.error("Error fetching blogs:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  return (
    <section id="blogs" className="bg-gray-50 py-16 sm:py-24">
      <Container>
        {/* Section Heading */}
        <Heading>Our Blogs</Heading>

        {/* Blog Posts Grid */}
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : blogs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">
              No blogs available yet. Check back soon!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((blog) => (
              <BlogCard key={blog._id} blog={blog} />
            ))}
          </div>
        )}

        {/* View All Posts Button */}
        {blogs.length > 0 && (
          <div className="text-right mt-12">
            <Link
              href="/blog"
              className="text-md underline underline-offset-4 text-[#de1448] font-medium hover:text-red-700 transition-colors"
            >
              View all blogs
            </Link>
          </div>
        )}
      </Container>
    </section>
  );
};

export default BlogSection;
