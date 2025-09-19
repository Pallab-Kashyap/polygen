"use client";
import { useState } from "react";
import { ChevronDown, ChevronRight, Edit, Trash2 } from "lucide-react";
import { CategoryType } from "@/types/category";

interface CategoryItemProps {
  category: CategoryType;
  level?: number;
  onEdit: (category: CategoryType) => void;
  onDelete: (category: CategoryType) => void;
}

const CategoryItem = ({
  category,
  level = 0,
  onEdit,
  onDelete,
}: CategoryItemProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const hasChildren = category.children && category.children.length > 0;

  return (
    <div className="my-1">
      <div className="flex items-center bg-white p-2 sm:p-3 rounded-lg shadow-sm hover:bg-gray-50">
        <div
          style={{ paddingLeft: `${level * 16}px` }}
          className="flex-grow flex items-center min-w-0"
        >
          {hasChildren && (
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="mr-2 p-1 rounded-full hover:bg-gray-200 flex-shrink-0"
            >
              {isOpen ? (
                <ChevronDown size={14} className="sm:w-4 sm:h-4" />
              ) : (
                <ChevronRight size={14} className="sm:w-4 sm:h-4" />
              )}
            </button>
          )}
          {!hasChildren && (
            <div className="w-4 sm:w-6 mr-2 flex-shrink-0"></div>
          )}
          <div className="min-w-0 flex-1">
            <span className="font-medium text-gray-800 text-sm sm:text-base block truncate">
              {category.name}
            </span>
            <span className="text-xs sm:text-sm text-gray-500 block sm:inline sm:ml-3">
              ({category.slug})
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0 ml-2">
          <button
            onClick={() => onEdit(category)}
            className="p-1.5 sm:p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-100 rounded-full transition"
          >
            <Edit size={14} className="sm:w-4 sm:h-4" />
          </button>
          <button
            onClick={() => onDelete(category)}
            className="p-1.5 sm:p-2 text-gray-500 hover:text-red-600 hover:bg-red-100 rounded-full transition"
          >
            <Trash2 size={14} className="sm:w-4 sm:h-4" />
          </button>
        </div>
      </div>
      {hasChildren && isOpen && (
        <div className="mt-1">
          {category.children?.map((child) => (
            <CategoryItem
              key={child._id}
              category={child}
              level={level + 1}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryItem;
