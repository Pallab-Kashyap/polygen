import { ProductType } from "@/types/product";
import axiosInstance from "../lib/axios";

export const productService = {
  getAllProducts: (): Promise<ProductType[]> => axiosInstance.get("/products"),
  getTopSellerProducts: (): Promise<ProductType[]> =>
    axiosInstance.get("/products/top-sellers"),
  getProductById: (id: string): Promise<ProductType> =>
    axiosInstance.get(`/products/${id}`),
  getProductsByCategorySlug: (slug: string): Promise<ProductType[]> =>
    axiosInstance.get(`/products/category/slug/${slug}`),
  createProduct: (data: Partial<ProductType>) =>
    axiosInstance.post("/products", data),
  updateProduct: (id: string, data: Partial<ProductType>) =>
    axiosInstance.put(`/products/${id}`, data),
  deleteProduct: (id: string) => axiosInstance.delete(`/products/${id}`),
  bulkCreateProducts: (formData: FormData) =>
    axiosInstance.post("/products/bulk-create", formData),
};
