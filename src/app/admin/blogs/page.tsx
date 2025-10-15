"use client";
import React, { useState, useEffect, useContext } from "react";
import { BlogType } from "@/types/blog";
import BlogForm from "@/components/admin/BlogForm";
import BlogItem from "@/components/admin/BlogItem";
import { ToastContext } from "@/components/admin/AdminLayoutClient";
import { ChevronDown, Plus, Search } from "lucide-react";
import Modal from "@/components/shared/Modal";

const BlogsAdminPage: React.FC = () => {
  const [blogs, setBlogs] = useState<BlogType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<BlogType | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showPublished, setShowPublished] = useState("all");

  const { setToast } = useContext(ToastContext);

  const fetchBlogs = async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams();
      params.append("published", "false"); // Get all blogs for admin

      if (searchTerm) {
        params.append("search", searchTerm);
      }

      const response = await fetch(`/api/admin/blogs?${params.toString()}`);
      const data = await response.json();

      if (data.success) {
        setBlogs(data.data);
      } else {
        setToast({ message: data.message, type: "error" });
      }
    } catch (error) {
      setToast({ message: "Failed to fetch blogs", type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, [searchTerm]);

  const handleCreateBlog = () => {
    setEditingBlog(null);
    setIsFormOpen(true);
  };

  const handleEditBlog = (blog: BlogType) => {
    setEditingBlog(blog);
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (blogData: Partial<BlogType>) => {
    try {
      setIsSubmitting(true);
      const url = editingBlog
        ? `/api/admin/blogs/${editingBlog._id}`
        : "/api/admin/blogs";
      const method = editingBlog ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(blogData),
      });

      const data = await response.json();

      if (data.success) {
        setToast({
          message: editingBlog
            ? "Blog updated successfully"
            : "Blog created successfully",
          type: "success",
        });
        setIsFormOpen(false);
        setEditingBlog(null);
        fetchBlogs();
      } else {
        // Use specific error details if available, otherwise fall back to generic message
        const errorMessage = data.details || data.message || "Operation failed";
        setToast({ message: errorMessage, type: "error" });
      }
    } catch (error) {
      setToast({
        message: editingBlog
          ? "Failed to update blog"
          : "Failed to create blog",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteBlog = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/blogs/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (data.success) {
        setToast({ message: "Blog deleted successfully", type: "success" });
        fetchBlogs();
      } else {
        setToast({ message: data.message, type: "error" });
      }
    } catch (error) {
      setToast({ message: "Failed to delete blog", type: "error" });
    }
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingBlog(null);
  };

  const filteredBlogs = blogs.filter((blog) => {
    if (showPublished === "published") return blog.isPublished;
    if (showPublished === "draft") return !blog.isPublished;
    return true;
  });

  return (
    <div className="px-2 sm:px-4 space-y-5">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Blogs</h1>
        <button
          onClick={handleCreateBlog}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition text-sm sm:text-base w-full sm:w-auto"
        >
          <Plus size={18} className="sm:w-5 sm:h-5" />
          <span className="hidden sm:inline">Create Blog</span>
          <span className="sm:hidden">Create</span>
        </button>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search
                size={20}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search blogs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full text-black pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="flex items-center justify-around border text-black border-gray-300 rounded-lg cursor-pointer">
            <select
              value={showPublished}
              onChange={(e) => setShowPublished(e.target.value)}
              className="px-3 py-2 outline-none appearance-none cursor-pointer"
            >
              <option value="all">All Blogs</option>
              <option value="published">Published</option>
              <option value="draft">Drafts</option>
            </select>
            <ChevronDown className=""></ChevronDown>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="text-2xl font-bold text-blue-600">{blogs.length}</div>
          <div className="text-sm text-gray-600">Total Blogs</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="text-2xl font-bold text-green-600">
            {blogs.filter((b) => b.isPublished).length}
          </div>
          <div className="text-sm text-gray-600">Published</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="text-2xl font-bold text-orange-600">
            {blogs.filter((b) => !b.isPublished).length}
          </div>
          <div className="text-sm text-gray-600">Drafts</div>
        </div>
      </div>

      {/* Blogs List */}
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : filteredBlogs.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="text-gray-500 text-lg mb-2">
            {searchTerm
              ? "No blogs found matching your search"
              : "No blogs yet"}
          </div>
          <div className="text-gray-400 text-sm">
            {searchTerm
              ? "Try adjusting your search terms"
              : "Create your first blog post to get started"}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredBlogs.map((blog) => (
            <BlogItem
              key={blog._id}
              blog={blog}
              onEdit={handleEditBlog}
              onDelete={handleDeleteBlog}
            />
          ))}
        </div>
      )}

      {/* Blog Form Modal */}
      <Modal
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        title={editingBlog ? "Edit Blog" : "Create New Blog"}
      >
        <BlogForm
          blog={editingBlog}
          onSubmit={handleFormSubmit}
          onCancel={handleCloseForm}
          isLoading={isSubmitting}
        />
      </Modal>
    </div>
  );
};

export default BlogsAdminPage;
