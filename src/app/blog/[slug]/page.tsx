import Image from "next/image";
import React from "react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { BlogType } from "@/types/blog";
import remarkGfm from "remark-gfm";
import { notFound } from "next/navigation";
import { ArrowBigLeft, ArrowLeft } from "lucide-react";
import Container from "@/components/shared/Container";
import { BlogService } from "@/services/blogService";

async function getBlog(slug: string): Promise<BlogType | null> {
  try {
    const blog = await BlogService.getBlogBySlug(slug, true);
    return blog ? JSON.parse(JSON.stringify(blog)) : null;
  } catch (error) {
    console.error("Error fetching blog:", error);
    return null;
  }
}

async function getAllBlogs(): Promise<BlogType[]> {
  try {
    const blogs = await BlogService.getAllBlogs(true);
    return JSON.parse(JSON.stringify(blogs)) as BlogType[];
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return [];
  }
}

export default async function BlogPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const blog = await getBlog(slug);

  if (!blog) {
    notFound();
  }

  const allBlogs = await getAllBlogs();
  const relatedBlogs = allBlogs.filter((b) => b._id !== blog._id).slice(0, 3);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <Container>
      <div className="bg-whtie min-h-screen mt-32 mb-12 space-y-8 md:space-y-16">
        {/* Hero Section */}
        <section className="">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                {blog.title}
              </h1>

              {/* Blog Image - Right after title */}
              {blog.image && (
                <div className="my-8">
                  <div className="relative w-full h-64 sm:h-96 rounded-lg overflow-hidden">
                    <Image
                      src={blog.image}
                      alt={blog.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              )}

              <p className="text-lg sm:text-xl text-gray-600 mb-8">
                {blog.description}
              </p>
              <div className="flex flex-wrap justify-center items-center gap-4 text-sm text-gray-500">
                <span>Published: {formatDate(blog.createdAt)}</span>
                {blog.readTime && <span>•</span>}
                {blog.readTime && <span>{blog.readTime} min read</span>}
                {blog.tags && blog.tags.length > 0 && (
                  <>
                    <span>•</span>
                    <div className="flex flex-wrap gap-2">
                      {blog.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Blog Content */}
        <section className="bg-white text-black">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <article className="prose prose-lg max-w-none w-full px-2 sm:px-4">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {blog.content}
                </ReactMarkdown>
              </article>
            </div>
          </div>
        </section>

        {/* Related Blogs */}
        {relatedBlogs.length > 0 && (
          <section className="">
            <div className="container mx-auto px-4">
              <div className="max-w-6xl mx-auto">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8 text-center">
                  Related Articles
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {relatedBlogs.map((relatedBlog) => (
                    <Link
                      key={relatedBlog._id}
                      href={`/blog/${relatedBlog.slug}`}
                      className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden"
                    >
                      {relatedBlog.image && (
                        <div className="relative w-full h-48">
                          <Image
                            src={relatedBlog.image}
                            alt={relatedBlog.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      <div className="p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                          {relatedBlog.title}
                        </h3>
                        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                          {relatedBlog.description}
                        </p>
                        <div className="flex justify-between items-center text-xs text-gray-500">
                          <span>{formatDate(relatedBlog.createdAt)}</span>
                          {relatedBlog.readTime && (
                            <span>{relatedBlog.readTime} min read</span>
                          )}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Back to Blogs */}
        <section className="">
          <div className="container mx-auto px-4 text-center">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
            >
              <ArrowLeft /> Back to All Blogs
            </Link>
          </div>
        </section>
      </div>
    </Container>
  );
}
