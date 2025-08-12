import axios from "@/lib/axios";
import { ProductType } from "@/types/product";

export const getProducts = () => axios.get<ProductType[]>("/products");

export const getProductById = (id: string) =>
  axios.get<ProductType>(`/products/${id}`);

export const getProductsByCategory = (categoryId: string) =>
  axios.get<ProductType[]>(`/products/category/${categoryId}`);

export const createProduct = (data: Partial<ProductType>) =>
  axios.post<ProductType>("/products", data);

export const bulkCreateProducts = (products: Partial<ProductType>[]) =>
  axios.post<ProductType[]>("/products/bulk-create", { products });

export const bulkDeleteProducts = (productIds: string[]) =>
  axios.delete<ProductType[]>("/products/bulk-delete", { ids: productIds });

export const updateProduct = (data: Partial<ProductType>, id: string) =>
    axios.put<ProductType>(`/products/${id}`, {data})
