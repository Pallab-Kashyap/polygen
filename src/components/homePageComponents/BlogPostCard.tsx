import React from "react";
import Image from "next/image";
import Link from "next/link";

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
    <div className="bg-white shadow-xl overflow-hidden flex flex-col h-full rounded-2xl">
      <Link href={post.slug} className="block overflow-hidden">
        <div className="p-4">
          <Image
            src={post.imageUrl}
            alt={post.title}
            width={400}
            height={400}
            className="w-full h-full rounded-xl object-contain transition-transform duration-300 ease-in-out hover:scale-105"
          />
        </div>
      </Link>

      {/* The flex-grow class makes this div fill available space, pushing tags to the bottom */}
      <div className="p-6 pt-4 flex-grow flex flex-col">
        {/* <p className="text-sm text-gray-500">
          {post.date} &bull; {post.readTime} min read
        </p> */}

        <Link href={post.slug} className="group block mt-2">
          <h3 className="text-xl font-bold text-black transition-colors">
            {post.title}
            {/* <ArrowRight className="inline-block h-5 w-5 ml-1 opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0" /> */}
          </h3>
        </Link>

        {/* The flex-grow class on the excerpt pushes tags down */}
        <p className="text-gray-600 mt-3 flex-grow line-clamp-2">{post.excerpt}</p>

        {/* Tags container */}
        {/* <div className="mt-4 flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs font-semibold bg-red-100 text-red-800 px-3 py-1 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div> */}

        <div className="text-right mt-2">
          <a
            href="/products"
            className="text-md underline underline-offset-4 text-[#de1448] font-medium hover:text-red-700 transition-colors"
          >
            Read more
          </a>
        </div>
      </div>
    </div>
  );
};

export default BlogPostCard;
