'use client';
import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { CategoryType } from '@/types/category';

interface CategoryFormProps {
    category?: CategoryType | null;
    onSave: (data: Partial<CategoryType>) => void;
    onCancel: () => void;
    loading: boolean;
    categories: CategoryType[];
}

const CategoryForm = ({ category, onSave, onCancel, loading, categories }: CategoryFormProps) => {
    const [formData, setFormData] = useState({ name: '', slug: '', description: '', parentId: '' });

    useEffect(() => {
        if (category) {
            setFormData({
                name: category.name || '',
                slug: category.slug || '',
                description: category.description || '',
                parentId: category.parentId || '',
            });
        } else {
            setFormData({ name: '', slug: '', description: '', parentId: '' });
        }
    }, [category]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        let newSlug = formData.slug;
        if (name === 'name' && !category) {
            newSlug = value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
        }
        setFormData(prev => ({ ...prev, [name]: value, slug: name === 'name' ? newSlug : formData.slug }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" />
            </div>
            <div>
                <label htmlFor="slug" className="block text-sm font-medium text-gray-700">Slug</label>
                <input type="text" name="slug" id="slug" value={formData.slug} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" />
            </div>
            <div>
                <label htmlFor="parentId" className="block text-sm font-medium text-gray-700">Parent Category</label>
                <select name="parentId" id="parentId" value={formData.parentId} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm">
                    <option value="">None</option>
                    {categories.filter(c => c._id !== category?._id).map(c => (
                        <option key={c._id} value={c._id}>{c.name}</option>
                    ))}
                </select>
            </div>
             <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                <textarea name="description" id="description" value={formData.description} onChange={handleChange} rows={3} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"></textarea>
            </div>
            <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition">Cancel</button>
                <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2 disabled:bg-blue-400">
                    {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                    Save Category
                </button>
            </div>
        </form>
    );
};

export default CategoryForm;
