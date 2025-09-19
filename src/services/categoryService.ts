import { CategoryType } from "@/types/category";
import axiosInstance from "../lib/axios";

export const categoryService = {
  getCategories: (): Promise<CategoryType[]> =>
    axiosInstance.get("/categories"),
  getCategoryById: (id: string): Promise<CategoryType> =>
    axiosInstance.get(`/categories/${id}`),
  getCategoryBySlug: (slug: string): Promise<CategoryType> =>
    axiosInstance.get(`/categories/slug/${slug}`),
  createCategory: (data: Partial<CategoryType>) =>
    axiosInstance.post("/categories", data),
  updateCategory: (id: string, data: Partial<CategoryType>) =>
    axiosInstance.put(`/categories/${id}`, data),
  deleteCategory: (id: string) => axiosInstance.delete(`/categories/${id}`),
};
