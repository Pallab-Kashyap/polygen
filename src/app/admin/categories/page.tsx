"use client";
import { useState, useEffect, useCallback, useContext } from "react";
import { Plus } from "lucide-react";
import { CategoryType } from "@/types/category";
import { useApi } from "@/hooks/useApi";
import { categoryService } from "@/services/categoryService";
import Spinner from "@/components/shared/Spinner";
import Modal from "@/components/shared/Modal";
import ConfirmationModal from "@/components/shared/ConfirmationModal";
import CategoryForm from "@/components/admin/CategoryForm";
import CategoryItem from "@/components/admin/CategoryItem";
import { ToastContext } from "@/components/admin/AdminLayoutClient";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [flatCategories, setFlatCategories] = useState<CategoryType[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryType | null>(
    null
  );
  const [deletingCategory, setDeletingCategory] = useState<CategoryType | null>(
    null
  );
  const { setToast } = useContext(ToastContext);

  const { execute: fetchCategories, loading: fetchLoading } = useApi(
    categoryService.getCategories
  );
  const { execute: saveCategoryApi, loading: saveLoading } = useApi(
    async (data: Partial<CategoryType>) => {
      return editingCategory
        ? categoryService.updateCategory(editingCategory._id!, data)
        : categoryService.createCategory(data);
    }
  );
  const { execute: deleteCategoryApi, loading: deleteLoading } = useApi(
    categoryService.deleteCategory
  );

  const loadCategories = useCallback(() => {
    fetchCategories()
      .then((data) => {
        if (!data) return;

        const allCategories = data || [];
        setFlatCategories(allCategories);
        const buildHierarchy = (
          items: CategoryType[],
          parentId: string | null = null
        ): CategoryType[] => {
          return items
            .filter((item) => (item.parentId || null) === parentId)
            .map((item) => ({
              ...item,
              children: buildHierarchy(items, item._id!),
            }));
        };
        const isHierarchical = allCategories.some(
          (c: CategoryType) => c.children
        );
        setCategories(
          isHierarchical ? allCategories : buildHierarchy(allCategories)
        );
        // setCategories(data);
      })
      .catch((err) => setToast({ message: `err`, type: "error" }));
  }, [fetchCategories, setToast]);

  useEffect(() => {
    loadCategories();
  }, []);

  const handleOpenModal = (category: CategoryType | null = null) => {
    setEditingCategory(category);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
  };

  const handleSaveCategory = async (data: Partial<CategoryType>) => {
    try {
      await saveCategoryApi(data);
      setToast({
        message: `Category successfully ${
          editingCategory ? "updated" : "created"
        }!`,
        type: "success",
      });
      handleCloseModal();
      loadCategories();
    } catch (e: any) {
      setToast({
        message: `Error saving category: ${e.message}`,
        type: "error",
      });
    }
  };

  const handleDeleteClick = (category: CategoryType) => {
    setDeletingCategory(category);
  };

  const handleConfirmDelete = async () => {
    if (!deletingCategory) return;
    try {
      await deleteCategoryApi(deletingCategory._id!);
      setToast({ message: "Category deleted successfully!", type: "success" });
      setDeletingCategory(null);
      loadCategories();
    } catch (e: any) {
      setToast({
        message: `Error deleting category: ${e.message}`,
        type: "error",
      });
    }
  };

  return (
    <div className="text-black px-2 sm:px-4">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
          Categories
        </h1>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition text-sm sm:text-base w-full sm:w-auto"
        >
          <Plus size={18} className="sm:w-5 sm:h-5" />
          <span className="hidden sm:inline">Add Category</span>
          <span className="sm:hidden">Add</span>
        </button>
      </div>

      {fetchLoading ? (
        <Spinner />
      ) : !categories ? (
        // categories is null/undefined — show error
        <div className="text-red-600">err</div>
      ) : (
        <div className="bg-gray-100 p-4 rounded-lg">
          {Array.isArray(categories) && categories.length === 0 ? (
            <p>No categories found.</p>
          ) : (
            categories.map((cat) => (
              <CategoryItem
                key={cat._id}
                category={cat}
                onEdit={handleOpenModal}
                onDelete={handleDeleteClick}
              />
            ))
          )}
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingCategory ? "Edit Category" : "Add New Category"}
      >
        <CategoryForm
          category={editingCategory}
          onSave={handleSaveCategory}
          onCancel={handleCloseModal}
          loading={saveLoading}
          categories={flatCategories}
        />
      </Modal>

      <ConfirmationModal
        isOpen={!!deletingCategory}
        onClose={() => setDeletingCategory(null)}
        onConfirm={handleConfirmDelete}
        loading={deleteLoading}
        title="Confirm Deletion"
        message={`Are you sure you want to delete the category "${deletingCategory?.name}"? This action cannot be undone.`}
      />
    </div>
  );
}
