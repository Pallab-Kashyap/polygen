#!/bin/bash

# This script sets up the folder structure and files for the admin dashboard.
# Run it from the root of your Next.js project.

echo "🚀 Starting Admin Dashboard setup..."

# --- Create Directories ---
echo "Creating directories..."
mkdir -p src/app/admin/products
mkdir -p src/app/admin/categories
mkdir -p src/components/admin
mkdir -p src/components/shared
mkdir -p src/lib/hooks
mkdir -p src/lib/services
mkdir -p src/types

# --- Create Type Files ---
echo "Creating type definitions..."

# src/types/product.ts
cat <<'EOF' > src/types/product.ts
export interface ProductParameter {
  label: string;
  values: string[];
}

export interface DescriptionBullet {
  highlight?: string;
  text?: string;
}

export interface ProductDescriptionBlock {
  heading?: string;
  bulletPoints?: DescriptionBullet[];
  text?: string;
}

export interface ProductType {
  id?: string;
  slug: string;
  name: string;
  about?: string;
  categoryId: string;
  parameters?: ProductParameter[];
  applications?: string[];
  description?: ProductDescriptionBlock[];
  images?: string[];
  price?: number | null;
  metadata?: Record<string, any>;
  createdAt?: string;
  updatedAt?: string;
}
EOF

# src/types/category.ts
cat <<'EOF' > src/types/category.ts
export interface CategoryType {
  _id?: string;
  slug: string;
  name: string;
  description?: string;
  parentId?: string
  createdAt?: Date;
  updatedAt?: Date;
  children?: CategoryType[];
}
EOF

# --- Create Lib Files ---
echo "Creating library files (services, hooks)..."

# src/lib/hooks/useApi.ts
cat <<'EOF' > src/lib/hooks/useApi.ts
import { useState, useCallback } from "react";

export function useApi<T, Args extends any[]>(apiFunction: (...args: Args) => Promise<T>) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async (...args: Args): Promise<T | null> => {
    try {
      setLoading(true);
      setError(null);
      const response: any = await apiFunction(...args);
      // Assuming the actual data is in a `data` property
      return response.data;
    } catch (err: any) {
      const message = err?.response?.data?.message || err?.message || "Something went wrong";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiFunction]);

  return { execute, loading, error } as const;
}
EOF

# src/lib/services/productService.ts
cat <<'EOF' > src/lib/services/productService.ts
import { ProductType } from "@/types/product";

// --- MOCK API ---
// Replace with your actual API client (e.g., Axios)
let mockProducts: ProductType[] = [
  { id: 'prod_1', slug: 'galaxy-s24', name: 'Galaxy S24', about: 'The latest flagship.', categoryId: 'cat_2', price: 799, images: [], parameters: [{label: "Storage", values: ["256GB", "512GB"]}], applications: ["Personal", "Business"], description: [{heading: "AI Features", text: "Powered by Galaxy AI."}]},
  { id: 'prod_2', slug: 'macbook-pro-14', name: 'MacBook Pro 14"', about: 'Powerhouse for professionals.', categoryId: 'cat_3', price: 1999, images: [], parameters: [], applications: [], description: []},
  { id: 'prod_3', slug: 'atomic-habits', name: 'Atomic Habits', about: 'A book on building good habits.', categoryId: 'cat_4', price: 27, images: [], parameters: [], applications: [], description: []},
];

const mockApi = {
  get: async (url: string) => { console.log(`Mock GET: ${url}`); await new Promise(res => setTimeout(res, 300)); return { data: mockProducts }; },
  post: async (url: string, data: any) => {
    console.log(`Mock POST: ${url}`, data);
    await new Promise(res => setTimeout(res, 500));
    if (url.includes('/products/bulk')) { return { data: { inserted: 3, errors: [] } }; }
    const newProduct = { ...data, id: `prod_${Date.now()}`, createdAt: new Date().toISOString() };
    mockProducts.push(newProduct);
    return { data: newProduct };
  },
  put: async (url: string, data: any) => {
    console.log(`Mock PUT: ${url}`, data);
    await new Promise(res => setTimeout(res, 500));
    const id = url.split('/').pop();
    mockProducts = mockProducts.map(p => p.id === id ? { ...p, ...data, updatedAt: new Date().toISOString() } : p);
    return { data: mockProducts.find(p => p.id === id) };
  },
  delete: async (url: string) => {
    console.log(`Mock DELETE: ${url}`);
    await new Promise(res => setTimeout(res, 500));
    const id = url.split('/').pop();
    mockProducts = mockProducts.filter(p => p.id !== id);
    return { data: { message: 'Deleted successfully' } };
  }
};
// --- END MOCK API ---

export const productService = {
  getProducts: () => mockApi.get('/products'),
  createProduct: (data: Partial<ProductType>) => mockApi.post('/products', data),
  updateProduct: (id: string, data: Partial<ProductType>) => mockApi.put(`/products/${id}`, data),
  deleteProduct: (id: string) => mockApi.delete(`/products/${id}`),
  bulkCreateProducts: (formData: FormData) => mockApi.post('/products/bulk', formData),
};
EOF

# src/lib/services/categoryService.ts
cat <<'EOF' > src/lib/services/categoryService.ts
import { CategoryType } from "@/types/category";

// --- MOCK API ---
// Replace with your actual API client (e.g., Axios)
let mockCategories: CategoryType[] = [
  { _id: 'cat_1', slug: 'electronics', name: 'Electronics', description: 'Gadgets and devices' },
  { _id: 'cat_2', slug: 'smartphones', name: 'Smartphones', parentId: 'cat_1' },
  { _id: 'cat_3', slug: 'laptops', name: 'Laptops', parentId: 'cat_1' },
  { _id: 'cat_4', slug: 'books', name: 'Books', description: 'Printed and digital books' },
];

const mockApi = {
  get: async (url: string) => { console.log(`Mock GET: ${url}`); await new Promise(res => setTimeout(res, 300)); return { data: mockCategories }; },
  post: async (url: string, data: any) => {
    console.log(`Mock POST: ${url}`, data);
    await new Promise(res => setTimeout(res, 500));
    const newCategory = { ...data, _id: `cat_${Date.now()}`, createdAt: new Date() };
    mockCategories.push(newCategory);
    return { data: newCategory };
  },
  put: async (url: string, data: any) => {
    console.log(`Mock PUT: ${url}`, data);
    await new Promise(res => setTimeout(res, 500));
    const id = url.split('/').pop();
    mockCategories = mockCategories.map(c => c._id === id ? { ...c, ...data, updatedAt: new Date() } : c);
    return { data: mockCategories.find(c => c._id === id) };
  },
  delete: async (url: string) => {
    console.log(`Mock DELETE: ${url}`);
    await new Promise(res => setTimeout(res, 500));
    const id = url.split('/').pop();
    mockCategories = mockCategories.filter(c => c._id !== id);
    return { data: { message: 'Deleted successfully' } };
  }
};
// --- END MOCK API ---

export const categoryService = {
  getCategories: () => mockApi.get('/categories'),
  createCategory: (data: Partial<CategoryType>) => mockApi.post('/categories', data),
  updateCategory: (id: string, data: Partial<CategoryType>) => mockApi.put(`/categories/${id}`, data),
  deleteCategory: (id: string) => mockApi.delete(`/categories/${id}`),
};
EOF

# --- Create Shared UI Components ---
echo "Creating shared UI components..."

# src/components/shared/Spinner.tsx
cat <<'EOF' > src/components/shared/Spinner.tsx
import { Loader2 } from 'lucide-react';

const Spinner = () => (
  <div className="flex justify-center items-center p-4">
    <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
  </div>
);

export default Spinner;
EOF

# src/components/shared/Alert.tsx
cat <<'EOF' > src/components/shared/Alert.tsx
import { X } from 'lucide-react';

interface AlertProps {
  message: string;
  type?: 'success' | 'error';
  onClose: () => void;
}

const Alert = ({ message, type = 'error', onClose }: AlertProps) => {
  if (!message) return null;
  const colors = {
    error: 'bg-red-100 border-red-400 text-red-700',
    success: 'bg-green-100 border-green-400 text-green-700',
  };
  return (
    <div className={`border rounded-lg p-4 my-4 relative ${colors[type]}`} role="alert">
      <span className="block sm:inline">{message}</span>
      <button onClick={onClose} className="absolute top-0 bottom-0 right-0 px-4 py-3">
        <X className="h-5 w-5" />
      </button>
    </div>
  );
};

export default Alert;
EOF

# src/components/shared/Modal.tsx
cat <<'EOF' > src/components/shared/Modal.tsx
import { X } from 'lucide-react';
import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const Modal = ({ isOpen, onClose, title, children }: ModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-6 w-6" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
EOF

# src/components/shared/ConfirmationModal.tsx
cat <<'EOF' > src/components/shared/ConfirmationModal.tsx
import Modal from './Modal';
import { Loader2 } from 'lucide-react';

interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    loading: boolean;
}

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message, loading }: ConfirmationModalProps) => (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
        <p className="text-gray-600 mb-6">{message}</p>
        <div className="flex justify-end gap-3">
            <button onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition">
                Cancel
            </button>
            <button 
                onClick={onConfirm} 
                disabled={loading}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition flex items-center gap-2 disabled:bg-red-400"
            >
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                Confirm
            </button>
        </div>
    </Modal>
);

export default ConfirmationModal;
EOF

# --- Create Admin-Specific Components ---
echo "Creating admin-specific components..."

# src/components/admin/FileUploadModal.tsx
cat <<'EOF' > src/components/admin/FileUploadModal.tsx
'use client';
import { useState, useRef } from 'react';
import { FileUp, Loader2 } from 'lucide-react';
import Modal from '../shared/Modal';

interface FileUploadModalProps {
    isOpen: boolean;
    onClose: () => void;
    onUpload: (formData: FormData) => void;
    loading: boolean;
}

const FileUploadModal = ({ isOpen, onClose, onUpload, loading }: FileUploadModalProps) => {
    const [file, setFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFile(e.target.files[0]);
        }
    };

    const handleUpload = () => {
        if (file) {
            const formData = new FormData();
            formData.append('file', file);
            onUpload(formData);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Bulk Upload Products">
            <div 
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 transition"
                onClick={() => fileInputRef.current?.click()}
            >
                <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" />
                <FileUp className="mx-auto h-12 w-12 text-gray-400" />
                {file ? (
                    <p className="mt-2 text-gray-700">{file.name}</p>
                ) : (
                    <p className="mt-2 text-gray-500">Click to select a CSV or Excel file</p>
                )}
            </div>
            <div className="flex justify-end gap-3 mt-6">
                <button onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition">
                    Cancel
                </button>
                <button 
                    onClick={handleUpload} 
                    disabled={!file || loading}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2 disabled:bg-blue-400"
                >
                    {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                    Upload
                </button>
            </div>
        </Modal>
    );
};

export default FileUploadModal;
EOF

# src/components/admin/CategoryForm.tsx
cat <<'EOF' > src/components/admin/CategoryForm.tsx
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
EOF

# src/components/admin/CategoryItem.tsx
cat <<'EOF' > src/components/admin/CategoryItem.tsx
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
EOF

# src/components/admin/ProductForm.tsx
cat <<'EOF' > src/components/admin/ProductForm.tsx
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
            price: formData.price === '' || formData.price === null ? null : Number(formData.price),
        };
        onSave(dataToSave);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
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
EOF


# --- Create Page and Layout Files ---
echo "Creating page and layout files..."

# src/app/admin/layout.tsx
cat <<'EOF' > src/app/admin/layout.tsx
'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Alert from '@/components/shared/Alert';

interface Toast {
    message: string;
    type: 'success' | 'error';
    key: number;
}

export const ToastContext = React.createContext<{
    setToast: (toast: Omit<Toast, 'key'>) => void;
}>({ setToast: () => {} });

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname();
  const [toast, setToast] = useState<Toast>({ message: '', type: 'success', key: 0 });

  const handleSetToast = (toastConfig: Omit<Toast, 'key'>) => {
    setToast({ ...toastConfig, key: Date.now() });
  };
  
  const handleCloseToast = () => {
    setToast(prev => ({ ...prev, message: '' }));
  };

  useEffect(() => {
    if (toast.message) {
      const timer = setTimeout(() => {
        handleCloseToast();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [toast.key]);

  const NavLink = ({ href, label }: { href: string, label: string }) => (
    <Link href={href} className={`w-full text-left px-4 py-2.5 rounded-lg transition ${pathname === href ? 'bg-blue-600 text-white shadow' : 'text-gray-600 hover:bg-gray-200'}`}>
        {label}
    </Link>
  );

  return (
    <ToastContext.Provider value={{ setToast: handleSetToast }}>
        <div className="flex h-screen bg-gray-100 font-sans">
            <aside className="w-64 bg-white p-4 border-r border-gray-200 flex-shrink-0">
                <h2 className="text-2xl font-bold text-blue-700 mb-8 px-2">Admin Panel</h2>
                <nav className="space-y-2">
                    <NavLink href="/admin/products" label="Products" />
                    <NavLink href="/admin/categories" label="Categories" />
                </nav>
            </aside>

            <main className="flex-1 p-6 md:p-10 overflow-y-auto">
                {children}
            </main>
            
            <div className="fixed top-5 right-5 z-50 w-full max-w-sm">
                <Alert message={toast.message} type={toast.type} onClose={handleCloseToast} />
            </div>
        </div>
    </ToastContext.Provider>
  );
}
EOF

# src/app/admin/products/page.tsx
cat <<'EOF' > src/app/admin/products/page.tsx
'use client';
import { useState, useEffect, useCallback, useMemo, useContext } from 'react';
import { Plus, Edit, Trash2, Upload, Search } from 'lucide-react';
import { ProductType } from '@/types/product';
import { CategoryType } from '@/types/category';
import { useApi } from '@/lib/hooks/useApi';
import { productService } from '@/lib/services/productService';
import { categoryService } from '@/lib/services/categoryService';
import Spinner from '@/components/shared/Spinner';
import Modal from '@/components/shared/Modal';
import ConfirmationModal from '@/components/shared/ConfirmationModal';
import ProductForm from '@/components/admin/ProductForm';
import FileUploadModal from '@/components/admin/FileUploadModal';
import { ToastContext } from '../layout';

export default function ProductsPage() {
    const [products, setProducts] = useState<ProductType[]>([]);
    const [categories, setCategories] = useState<CategoryType[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<ProductType | null>(null);
    const [deletingProduct, setDeletingProduct] = useState<ProductType | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const { setToast } = useContext(ToastContext);

    const { execute: fetchProducts, loading: fetchLoading } = useApi(productService.getProducts);
    const { execute: fetchCategories } = useApi(categoryService.getCategories);
    const { execute: saveProductApi, loading: saveLoading } = useApi(async (data: Partial<ProductType>) => {
        return editingProduct ? productService.updateProduct(editingProduct.id!, data) : productService.createProduct(data);
    });
    const { execute: deleteProductApi, loading: deleteLoading } = useApi(productService.deleteProduct);
    const { execute: bulkUploadApi, loading: uploadLoading } = useApi(productService.bulkCreateProducts);

    const categoryMap = useMemo(() => {
        return categories.reduce((acc, cat) => {
            acc[cat._id!] = cat.name;
            return acc;
        }, {} as Record<string, string>);
    }, [categories]);

    const loadData = useCallback(() => {
        fetchProducts().then(data => setProducts(data || [])).catch(() => setToast({ message: 'Failed to load products.', type: 'error' }));
        fetchCategories().then(data => setCategories(data || [])).catch(() => setToast({ message: 'Failed to load categories.', type: 'error' }));
    }, [fetchProducts, fetchCategories, setToast]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const handleOpenModal = (product: ProductType | null = null) => {
        setEditingProduct(product);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingProduct(null);
    };

    const handleSaveProduct = async (data: Partial<ProductType>) => {
        try {
            await saveProductApi(data);
            setToast({ message: `Product successfully ${editingProduct ? 'updated' : 'created'}!`, type: 'success' });
            handleCloseModal();
            loadData();
        } catch (e: any) {
            setToast({ message: `Error saving product: ${e.message}`, type: 'error' });
        }
    };
    
    const handleDeleteClick = (product: ProductType) => {
        setDeletingProduct(product);
    };

    const handleConfirmDelete = async () => {
        if (!deletingProduct) return;
        try {
            await deleteProductApi(deletingProduct.id!);
            setToast({ message: 'Product deleted successfully!', type: 'success' });
            setDeletingProduct(null);
            loadData();
        } catch(e: any) {
            setToast({ message: `Error deleting product: ${e.message}`, type: 'error' });
        }
    };
    
    const handleBulkUpload = async (formData: FormData) => {
        try {
            const result = await bulkUploadApi(formData);
            setToast({ message: `${result.inserted} products uploaded successfully!`, type: 'success' });
            setIsUploadModalOpen(false);
            loadData();
        } catch (e: any) {
            setToast({ message: `Upload failed: ${e.message}`, type: 'error' });
        }
    };

    const filteredProducts = products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div>
            <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Products</h1>
                <div className="flex items-center gap-3">
                    <button onClick={() => setIsUploadModalOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition">
                        <Upload size={20} /> Bulk Upload
                    </button>
                    <button onClick={() => handleOpenModal()} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition">
                        <Plus size={20} /> Add Product
                    </button>
                </div>
            </div>

            <div className="mb-4 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input 
                    type="text" 
                    placeholder="Search products by name..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
            </div>

            {fetchLoading ? <Spinner /> : (
                <div className="bg-white shadow-md rounded-lg overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3">Name</th>
                                <th scope="col" className="px-6 py-3">Category</th>
                                <th scope="col" className="px-6 py-3">Price</th>
                                <th scope="col" className="px-6 py-3">Slug</th>
                                <th scope="col" className="px-6 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredProducts.map(product => (
                                <tr key={product.id} className="bg-white border-b hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{product.name}</td>
                                    <td className="px-6 py-4">{categoryMap[product.categoryId] || 'N/A'}</td>
                                    <td className="px-6 py-4">${product.price?.toFixed(2) ?? 'N/A'}</td>
                                    <td className="px-6 py-4">{product.slug}</td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button onClick={() => handleOpenModal(product)} className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-100 rounded-full transition"><Edit size={16} /></button>
                                            <button onClick={() => handleDeleteClick(product)} className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-100 rounded-full transition"><Trash2 size={16} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingProduct ? 'Edit Product' : 'Add New Product'}>
                <ProductForm 
                    product={editingProduct}
                    onSave={handleSaveProduct}
                    onCancel={handleCloseModal}
                    loading={saveLoading}
                    categories={categories}
                />
            </Modal>
            
            <FileUploadModal
                isOpen={isUploadModalOpen}
                onClose={() => setIsUploadModalOpen(false)}
                onUpload={handleBulkUpload}
                loading={uploadLoading}
            />

            <ConfirmationModal
                isOpen={!!deletingProduct}
                onClose={() => setDeletingProduct(null)}
                onConfirm={handleConfirmDelete}
                loading={deleteLoading}
                title="Confirm Deletion"
                message={`Are you sure you want to delete the product "${deletingProduct?.name}"? This action cannot be undone.`}
            />
        </div>
    );
};
EOF

# src/app/admin/categories/page.tsx
cat <<'EOF' > src/app/admin/categories/page.tsx
'use client';
import { useState, useEffect, useCallback, useContext } from 'react';
import { Plus } from 'lucide-react';
import { CategoryType } from '@/types/category';
import { useApi } from '@/lib/hooks/useApi';
import { categoryService } from '@/lib/services/categoryService';
import Spinner from '@/components/shared/Spinner';
import Modal from '@/components/shared/Modal';
import ConfirmationModal from '@/components/shared/ConfirmationModal';
import CategoryForm from '@/components/admin/CategoryForm';
import CategoryItem from '@/components/admin/CategoryItem';
import { ToastContext } from '../layout';

export default function CategoriesPage() {
    const [categories, setCategories] = useState<CategoryType[]>([]);
    const [flatCategories, setFlatCategories] = useState<CategoryType[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<CategoryType | null>(null);
    const [deletingCategory, setDeletingCategory] = useState<CategoryType | null>(null);
    const { setToast } = useContext(ToastContext);

    const { execute: fetchCategories, loading: fetchLoading } = useApi(categoryService.getCategories);
    const { execute: saveCategoryApi, loading: saveLoading } = useApi(async (data: Partial<CategoryType>) => {
        return editingCategory ? categoryService.updateCategory(editingCategory._id!, data) : categoryService.createCategory(data);
    });
    const { execute: deleteCategoryApi, loading: deleteLoading } = useApi(categoryService.deleteCategory);

    const loadCategories = useCallback(() => {
        fetchCategories().then(data => {
            const allCategories = data || [];
            setFlatCategories(allCategories);
            const buildHierarchy = (items: CategoryType[], parentId: string | null = null): CategoryType[] => {
                return items
                    .filter(item => (item.parentId || null) === parentId)
                    .map(item => ({ ...item, children: buildHierarchy(items, item._id!) }));
            };
            const isHierarchical = allCategories.some(c => c.children);
            setCategories(isHierarchical ? allCategories : buildHierarchy(allCategories));
        }).catch(() => setToast({ message: 'Failed to load categories.', type: 'error' }));
    }, [fetchCategories, setToast]);

    useEffect(() => {
        loadCategories();
    }, [loadCategories]);

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
            setToast({ message: `Category successfully ${editingCategory ? 'updated' : 'created'}!`, type: 'success' });
            handleCloseModal();
            loadCategories();
        } catch (e: any) {
            setToast({ message: `Error saving category: ${e.message}`, type: 'error' });
        }
    };

    const handleDeleteClick = (category: CategoryType) => {
        setDeletingCategory(category);
    };
    
    const handleConfirmDelete = async () => {
        if (!deletingCategory) return;
        try {
            await deleteCategoryApi(deletingCategory._id!);
            setToast({ message: 'Category deleted successfully!', type: 'success' });
            setDeletingCategory(null);
            loadCategories();
        } catch(e: any) {
            setToast({ message: `Error deleting category: ${e.message}`, type: 'error' });
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Categories</h1>
                <button onClick={() => handleOpenModal()} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition">
                    <Plus size={20} /> Add Category
                </button>
            </div>

            {fetchLoading ? <Spinner /> : (
                <div className="bg-gray-100 p-4 rounded-lg">
                    {categories.map(cat => (
                        <CategoryItem key={cat._id} category={cat} onEdit={handleOpenModal} onDelete={handleDeleteClick} />
                    ))}
                </div>
            )}

            <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingCategory ? 'Edit Category' : 'Add New Category'}>
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
};
EOF

# Optional: Create a default admin page
# src/app/admin/page.tsx
cat <<'EOF' > src/app/admin/page.tsx
import Link from 'next/link';

export default function AdminHomePage() {
  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">Welcome to the Admin Dashboard</h1>
      <p className="text-lg text-gray-600 mb-8">Select a section from the sidebar to manage your store.</p>
      <div className="flex justify-center gap-4">
        <Link href="/admin/products" className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition">
            Manage Products
        </Link>
        <Link href="/admin/categories" className="px-6 py-3 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition">
            Manage Categories
        </Link>
      </div>
    </div>
  );
}
EOF

echo "✅ Setup complete! All files created successfully."

