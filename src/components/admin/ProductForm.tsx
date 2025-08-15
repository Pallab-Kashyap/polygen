'use client';
import { useState, useEffect } from 'react';
import { Loader2, Trash2 } from 'lucide-react';
import { ProductType } from '@/types/product';
import { CategoryType } from '@/types/category';

interface ProductFormProps {
    product?: ProductType | null;
    onSave: (data: Partial<ProductType>) => void;
    onCancel: () => void;
    loading: boolean;
    categories: CategoryType[];
}

const ProductForm = ({ product, onSave, onCancel, loading, categories }: ProductFormProps) => {
    const [formData, setFormData] = useState<Partial<ProductType>>({
        name: '', slug: '', about: '', categoryId: '', price: null,
        parameters: [], applications: [], description: [], images: []
    });

    useEffect(() => {
        if (product) {
            setFormData({
                name: product.name || '',
                slug: product.slug || '',
                about: product.about || '',
                categoryId: product.categoryId || '',
                price: product.price ?? null,
                parameters: product.parameters || [],
                applications: product.applications || [],
                description: product.description || [],
                images: product.images || [],
            });
        } else {
            setFormData({
                name: '', slug: '', about: '', categoryId: '', price: null,
                parameters: [], applications: [], description: [], images: []
            });
        }
    }, [product]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        let newSlug = formData.slug;
        if (name === 'name' && !product) {
            newSlug = value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
        }
        setFormData(prev => ({ ...prev, [name]: value, slug: name === 'name' ? newSlug : prev.slug }));
    };

    const handleArrayChange = (field: 'parameters' | 'applications', index: number, subField: string | null, value: any) => {
        const newArray = [...(formData[field] || [])];
        if (subField) {
            (newArray[index] as any)[subField] = value;
        } else {
            newArray[index] = value;
        }
        setFormData(prev => ({ ...prev, [field]: newArray }));
    };

    const addArrayItem = (field: 'parameters' | 'applications', newItem: any) => {
        setFormData(prev => ({ ...prev, [field]: [...(prev[field] || []), newItem] }));
    };

    const removeArrayItem = (field: 'parameters' | 'applications', index: number) => {
        setFormData(prev => ({ ...prev, [field]: (prev[field] || []).filter((_, i) => i !== index) }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const dataToSave = {
            ...formData,
            // price: formData.price === '' || formData.price === null ? null : Number(formData.price),
            price: formData.price,
        };
        onSave(dataToSave);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 text-black">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Product Name</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
                </div>
                <div>
                    <label htmlFor="slug" className="block text-sm font-medium text-gray-700">Slug</label>
                    <input type="text" name="slug" value={formData.slug} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
                </div>
                <div>
                    <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700">Category</label>
                    <select name="categoryId" value={formData.categoryId} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                        <option value="">Select a category</option>
                        {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                    </select>
                </div>
                <div>
                    <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price</label>
                    <input type="number" name="price" value={formData.price ?? ''} onChange={handleChange} placeholder="e.g., 29.99" step="0.01" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
                </div>
            </div>
            <div>
                <label htmlFor="about" className="block text-sm font-medium text-gray-700">About Product</label>
                <textarea name="about" value={formData.about} onChange={handleChange} rows={4} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"></textarea>
            </div>

            {/* Dynamic Fields: Parameters */}
            <div className="space-y-2 p-4 border rounded-lg">
                <h4 className="font-medium text-gray-800">Parameters</h4>
                {formData.parameters?.map((param, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                        <input type="text" placeholder="Label (e.g., Color)" value={param.label} onChange={(e) => handleArrayChange('parameters', index, 'label', e.target.value)} className="flex-1 block w-full rounded-md border-gray-300 shadow-sm" />
                        <input type="text" placeholder="Values (comma separated)" value={param.values.join(',')} onChange={(e) => handleArrayChange('parameters', index, 'values', e.target.value.split(','))} className="flex-1 block w-full rounded-md border-gray-300 shadow-sm" />
                        <button type="button" onClick={() => removeArrayItem('parameters', index)} className="p-2 text-red-500 hover:bg-red-100 rounded-full"><Trash2 size={16} /></button>
                    </div>
                ))}
                <button type="button" onClick={() => addArrayItem('parameters', { label: '', values: [] })} className="text-sm text-blue-600 hover:underline">Add Parameter</button>
            </div>

            {/* Dynamic Fields: Applications */}
            <div className="space-y-2 p-4 border rounded-lg">
                <h4 className="font-medium text-gray-800">Applications</h4>
                {formData.applications?.map((app, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                        <input type="text" placeholder="Application" value={app} onChange={(e) => handleArrayChange('applications', index, null, e.target.value)} className="flex-1 block w-full rounded-md border-gray-300 shadow-sm" />
                        <button type="button" onClick={() => removeArrayItem('applications', index)} className="p-2 text-red-500 hover:bg-red-100 rounded-full"><Trash2 size={16} /></button>
                    </div>
                ))}
                <button type="button" onClick={() => addArrayItem('applications', '')} className="text-sm text-blue-600 hover:underline">Add Application</button>
            </div>

            <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition">Cancel</button>
                <button type="submit" disabled={loading} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2 disabled:bg-blue-400">
                    {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                    Save Product
                </button>
            </div>
        </form>
    );
};

export default ProductForm;
