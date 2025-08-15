import api from "@/lib/axios";
import { CategoryType } from "@/types/category";

export const getCategories = async () => {
  const res = await api.get<CategoryType[]>('/categories');
  return res;
};

export const createCategory = async (data: Partial<CategoryType>) => {
  const res = await api.post<CategoryType>('/categories', data);
  return res;
};

export const updateCategory = async (id: string, data: Partial<CategoryType>) => {
  const res = await api.put<CategoryType>(`/categories/${id}`, data);
  return res;
};

export const deleteCategory = async (id: string) => {
  const res = await api.delete(`/categories/${id}`);
  return res;
};
