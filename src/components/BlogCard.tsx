import React from "react";
import Image from "next/image";
import Link from "next/link";
import formatDate from "@/lib/formatDate";
import { BlogType } from "@/types/blog";

type BlogCardProps = {
  blog: BlogType;
};

const BlogCard: React.FC<BlogCardProps> = ({ blog }) => {
  return (
    <Link
      href={`/blog/${blog.slug}`}
      className="bg-white rounded-lg p-2 shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden group flex flex-col h-full"
    >
      {blog.image ? (
        <div className="relative w-full h-52 overflow-hidden flex-shrink-0 rounded-lg">
          <Image
            src={blog.image}
            alt={blog.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      ) : (
        <div className="w-full h-48 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
          <div className="text-white text-6xl font-bold opacity-20">
            {blog.title.charAt(0).toUpperCase()}
          </div>
        </div>
      )}

      <div className="p-2 mt-3 flex flex-col flex-grow">
        <div className="flex flex-wrap gap-2 mb-3">
          {blog.tags?.slice(0, 2).map((tag, index) => (
            <span
              key={index}
              className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-medium"
            >
              {tag}
            </span>
          ))}
        </div>

        <h2 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {blog.title}
        </h2>

        <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-grow">
          {blog.description}
        </p>

        <div className="flex justify-between items-center text-xs text-gray-500 mt-auto">
          <span>{formatDate(blog.createdAt)}</span>
          {blog.readTime && (
            <span className="flex items-center gap-1">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                  clipRule="evenodd"
                />
              </svg>
              {blog.readTime} min read
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default BlogCard;
