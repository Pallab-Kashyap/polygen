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
