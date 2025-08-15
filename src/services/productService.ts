import api from "@/lib/axios";
import { ProductType } from "@/types/product";

export const getProducts = async () => {
  const res = await api.get<ProductType[]>('/products');
  return res;
};

export const createProduct = async (data: Partial<ProductType>) => {
  const res = await api.post<ProductType>('/products', data);
  return res;
};

export const updateProduct = async (id: string, data: Partial<ProductType>) => {
  const res = await api.put<ProductType>(`/products/${id}`, data);
  return res;
};

export const deleteProduct = async (id: string) => {
  const res = await api.delete(`/products/${id}`);
  return res;
};

export const bulkCreateProducts = async (formData: FormData) => {
  const res = await api.post('/products/bulk', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
  return res;
};
