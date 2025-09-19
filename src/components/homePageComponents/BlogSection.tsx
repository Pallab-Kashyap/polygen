import React from "react";
import BlogPostCard from "./BlogPostCard";
import Heading from "../shared/Heading";

// Sample data for the blog posts. Replace with your actual data from a CMS or API.
const blogPostsData = [
  {
    id: 1,
    title: "The Future of Farming: How Smart Irrigation is Changing the Game",
    date: "August 6, 2025",
    readTime: 5,
    excerpt:
      "Discover how smart irrigation systems are leveraging technology to conserve water and increase crop yields. Simple maintenance tips that can help you extend the life of your Direct-On-Line motor starters and prevent downtime.",
    imageUrl: "/assets/blog.svg", // Replace with your image path
    tags: ["Irrigation", "Technology", "Farming"],
    slug: "/blog/future-of-farming",
  },
  {
    id: 2,
    title: "Choosing the Right Electrical Wires for Your Agricultural Needs",
    date: "July 28, 2025",
    readTime: 4,
    excerpt:
      "A comprehensive guide to selecting the most durable and efficient wires and cables for your farm equipment. Simple maintenance tips that can help you extend the life of your Direct-On-Line motor starters and prevent downtime.",
    imageUrl: "/assets/blog.svg", // Replace with your image path
    tags: ["Electrical", "Safety", "Wires"],
    slug: "/blog/choosing-wires",
  },
  {
    id: 3,
    title: "Maintaining Your DOL Starter for a Longer Lifespan",
    date: "July 15, 2025",
    readTime: 6,
    excerpt:
      "Simple maintenance tips that can help you extend the life of your Direct-On-Line motor starters and prevent downtime. Simple maintenance tips that can help you extend the life of your Direct-On-Line motor starters and prevent downtime.",
    imageUrl: "/assets/blog.svg", // Replace with your image path
    tags: ["Maintenance", "Starters", "Tips"],
    slug: "/blog/maintaining-starter",
  },
];

const BlogSection: React.FC = () => {
  return (
    <section className="bg-gray-50 py-20 sm:py-24">
      <div className="container mx-auto  px-4">
        {/* Section Heading */}
          <Heading>Blogs</Heading>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPostsData.map((post) => (
            <BlogPostCard key={post.id} post={post} />
          ))}
        </div>

        {/* View All Posts Button */}
        {/* <div className="text-center mt-16">
          <button
            className="bg-[#de1448] text-white font-bold py-4 px-10 rounded-lg text-lg
                       hover:bg-red-700 transition-colors shadow-lg hover:shadow-xl"
          >
            View all posts
          </button>
        </div> */}
      </div>
    </section>
  );
};

export default BlogSection;
