'use client';
import { useState } from 'react';
import { ChevronDown, ChevronRight, Edit, Trash2 } from 'lucide-react';
import { CategoryType } from '@/types/category';

interface CategoryItemProps {
    category: CategoryType;
    level?: number;
    onEdit: (category: CategoryType) => void;
    onDelete: (category: CategoryType) => void;
}

const CategoryItem = ({ category, level = 0, onEdit, onDelete }: CategoryItemProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const hasChildren = category.children && category.children.length > 0;

    return (
        <div className="my-1">
            <div className="flex items-center bg-white p-2 rounded-lg shadow-sm hover:bg-gray-50">
                <div style={{ paddingLeft: `${level * 24}px` }} className="flex-grow flex items-center">
                    {hasChildren && (
                        <button onClick={() => setIsOpen(!isOpen)} className="mr-2 p-1 rounded-full hover:bg-gray-200">
                            {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                        </button>
                    )}
                    {!hasChildren && <div className="w-6 mr-2"></div>}
                    <span className="font-medium text-gray-800">{category.name}</span>
                    <span className="ml-3 text-sm text-gray-500">({category.slug})</span>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={() => onEdit(category)} className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-100 rounded-full transition"><Edit size={16} /></button>
                    <button onClick={() => onDelete(category)} className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-100 rounded-full transition"><Trash2 size={16} /></button>
                </div>
            </div>
            {hasChildren && isOpen && (
                <div className="mt-1">
                    {category.children?.map(child => (
                        <CategoryItem key={child._id} category={child} level={level + 1} onEdit={onEdit} onDelete={onDelete} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default CategoryItem;
