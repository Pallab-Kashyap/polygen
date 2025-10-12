"use client";
import React, { useEffect, useState } from "react";
import Breadcrumb from "@/components/Breadcrumb";
import Container from "@/components/shared/Container";
import ProductCard from "@/components/ProductCard";
import { useApi } from "@/hooks/useApi";
import { productService } from "@/services/productService";
import { ProductType } from "@/types/product";
import Spinner from "@/components/shared/Spinner";

export default function AllProductsPage() {
  const { execute: fetchProducts, loading: isLoading } = useApi(
    productService.getAllProducts
  );

  const [products, setProducts] = useState<ProductType[]>([]);

  useEffect(() => {
    fetchProducts()
      .then((data) => {
        if (data) {
          setProducts(data);
        }
      })
      .catch((err) => console.log(err));
  }, [fetchProducts]);

  if (isLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <main className="bg-gray-50 pt-32 pb-20">
      <Container>
        <Breadcrumb items={[{ name: "All Products", link: "/products" }]} />

        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
            Our Entire Product Range
          </h1>
          <div className="w-24 h-1 bg-[#de1448] mt-4 mx-auto rounded-full" />
        </div>

        {!products || products.length === 0 ? (
          <div className="text-center text-gray-600 text-lg py-20">
            <p>No products available at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </Container>
    </main>
  );
}
