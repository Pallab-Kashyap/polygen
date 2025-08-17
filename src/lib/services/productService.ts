import { ProductType } from "@/types/product";
import axiosInstance from "../axios";

export const productService = {
  getAllProducts: (): Promise<ProductType[]> => axiosInstance.get("/products"),
  getProductById: (id: string) =>
    axiosInstance.get<ProductType>(`/products/${id}`),
  createProduct: (data: Partial<ProductType>) =>
    axiosInstance.post("/products", data),
  updateProduct: (id: string, data: Partial<ProductType>) =>
    axiosInstance.put(`/products/${id}`, data),
  deleteProduct: (id: string) => axiosInstance.delete(`/products/${id}`),
  bulkCreateProducts: (formData: FormData) =>
    axiosInstance.post("/products/bulk", formData),
};
