"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import Breadcrumb from "@/components/Breadcrumb";
import Container from "@/components/shared/Container";
import { useApi } from "@/hooks/useApi";
import { productService } from "@/services/productService";
import { ProductType } from "@/types/product";
import Spinner from "@/components/shared/Spinner";

// Reusable Product Card Component for this page
const ProductCard: React.FC<{ product: ProductType }> = ({ product }) => {
  return (
    <Link href={`/products/id/${product._id}`} className="block group">
      <div className="bg-white rounded-2xl border border-gray-200/80 p-2 shadow-md overflow-hidden space-y-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
        <div className="flex justify-center">
          <Image
            src={product.images?.[0] ?? "/assets/product.svg"}
            alt={product.name ?? "Product image"}
            width={350}
            height={300}
            className="h-[300px] w-[350px] object-cover rounded-lg drop-shadow-lg transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        <div className="">
          <h3 className="text-2xl font-bold text-gray-900 ">{product.name}</h3>
          <div className="text-right mt-4">
            <span className="text-sm text-gray-500 group-hover:text-[#de1448] transition-colors">
              Explore to upgrade <ChevronRight className="inline h-4 w-4" />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

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
