import React from "react";
import Image from "next/image";
import Link from "next/link";
import formatDate from "@/lib/formatDate";

type BlogPost = {
  id: number;
  title: string;
  date: string;
  readTime: number; // in minutes
  excerpt: string;
  imageUrl: string;
  tags: string[];
  slug: string;
};

type BlogPostCardProps = {
  post: BlogPost;
};

const BlogPostCard: React.FC<BlogPostCardProps> = ({ post }) => {
  return (
    <Link href={`/blog/${post.slug}`} className="block h-full group">
      <div className="bg-white shadow-xl overflow-hidden flex flex-col h-full rounded-2xl transition-all duration-300 ease-in-out hover:shadow-2xl hover:-translate-y-1">
        <div className="p-2">
          <div className="relative w-full h-56 rounded-xl overflow-hidden">
            <Image
              src={post.imageUrl}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
            />
          </div>
        </div>

        {/* The flex-grow class makes this div fill available space, pushing tags to the bottom */}
        <div className="p-4  pt-0 flex-grow flex flex-col">
          <h3 className="text-xl font-bold text-black transition-colors group-hover:text-blue-600 mt-2 line-clamp-2">
            {post.title}
          </h3>

          {/* The flex-grow class on the excerpt pushes tags down */}
          <p className="text-gray-600 mt-3 flex-grow line-clamp-3">
            {post.excerpt}
          </p>

          <div className="flex justify-between items-center text-xs text-gray-500 mt-3">
            <span>{formatDate(post.date)}</span>
            {post.readTime && (
              <span className="flex items-center gap-1">
                <svg
                  className="w-3 h-3"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                    clipRule="evenodd"
                  />
                </svg>
                {post.readTime} min read
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default BlogPostCard;
