import { CategoryType } from "@/types/category";
import axiosInstance from "../axios";

export const categoryService = {
  getCategories: (): Promise<CategoryType[]> =>
    axiosInstance.get("/categories"),
  createCategory: (data: Partial<CategoryType>) =>
    axiosInstance.post("/categories", data),
  updateCategory: (id: string, data: Partial<CategoryType>) =>
    axiosInstance.put(`/categories/${id}`, data),
  deleteCategory: (id: string) => axiosInstance.delete(`/categories/${id}`),
};
