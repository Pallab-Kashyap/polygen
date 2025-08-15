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
