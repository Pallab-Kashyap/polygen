"use client";
import React from "react";
import { BlogType } from "@/types/blog";
import { Edit, Trash2, Eye, EyeOff } from "lucide-react";

interface BlogItemProps {
  blog: BlogType;
  onEdit: (blog: BlogType) => void;
  onDelete: (id: string) => void;
}

const BlogItem: React.FC<BlogItemProps> = ({ blog, onEdit, onDelete }) => {
  const handleDelete = () => {
    if (
      window.confirm(
        `Are you sure you want to delete "${blog.title}"? This action cannot be undone.`
      )
    ) {
      onDelete(blog._id);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-lg font-semibold text-gray-800 line-clamp-2">
              {blog.title}
            </h3>
            <div className="flex items-center gap-1">
              {blog.isPublished ? (
                <Eye size={16} className="text-green-600" />
              ) : (
                <EyeOff size={16} className="text-gray-400" />
              )}
              <span
                className={`text-xs px-2 py-1 rounded-full ${
                  blog.isPublished
                    ? "bg-green-100 text-green-800"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {blog.isPublished ? "Published" : "Draft"}
              </span>
            </div>
          </div>

          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {blog.description}
          </p>

          <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
            <span>Slug: {blog.slug}</span>
            {blog.readTime && <span>Read time: {blog.readTime} min</span>}
            <span>Created: {formatDate(blog.createdAt)}</span>
          </div>

          {blog.tags && blog.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-3">
              {blog.tags.map((tag, index) => (
                <span
                  key={index}
                  className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {blog.image && (
          <div className="hidden md:block ml-4 flex-shrink-0">
            <img
              src={blog.image}
              alt={blog.title}
              className="w-20 h-20 object-cover rounded-lg"
            />
          </div>
        )}
      </div>

      <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
        <button
          onClick={() => onEdit(blog)}
          className="flex items-center gap-1 px-3 py-1.5 text-blue-600 hover:bg-blue-50 rounded-md text-sm transition-colors"
        >
          <Edit size={14} />
          Edit
        </button>
        <button
          onClick={handleDelete}
          className="flex items-center gap-1 px-3 py-1.5 text-red-600 hover:bg-red-50 rounded-md text-sm transition-colors"
        >
          <Trash2 size={14} />
          Delete
        </button>
      </div>
    </div>
  );
};

export default BlogItem;
