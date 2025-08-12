import api from "@/lib/axios";
import { CategoryType } from "@/types/category";

export const getCategories = () => api.get<CategoryType[]>("/categories");

export const createCategory = (data: { name: string; parentId?: string }) =>
  api.post<CategoryType>("/categories", data);

export const updateCategory = (
  id: string,
  data: { name?: string; parentId?: string }
) => api.put<CategoryType>(`/categories/${id}`, data);

export const deleteCategory = (id: string) => api.delete(`/categories/${id}`);
