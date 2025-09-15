"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { ChevronRight } from "lucide-react";
import Breadcrumb from "@/components/Breadcrumb";
import { useApi } from "@/hooks/useApi";
import { productService } from "@/services/productService";
import { categoryService } from "@/services/categoryService";
import { ProductType } from "@/types/product";
import { CategoryType } from "@/types/category";
import Spinner from "@/components/shared/Spinner";

// Reusable Product Card Component
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
          <h3 className="text-2xl font-bold text-gray-900">{product.name}</h3>
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

// Main page component for category-specific products
export default function CategoryProductsPage() {
  const { slug } = useParams<{ slug: string[] }>();

  const [products, setProducts] = useState<ProductType[]>([]);
  const [category, setCategory] = useState<CategoryType | null>(null);
  const [categories, setCategories] = useState<CategoryType[]>([]);

  const { execute: fetchProducts, loading: productsLoading } = useApi(
    productService.getProductsByCategorySlug
  );

  const { execute: fetchCategory, loading: categoryLoading } = useApi(
    categoryService.getCategoryBySlug
  );

  const { execute: fetchCategories, loading: categoriesLoading } = useApi(
    categoryService.getCategories
  );

  useEffect(() => {

    if (!slug || slug.length === 0) {
      console.log("No slug found, calling notFound");
      notFound();
      return;
    }

    const categorySlug = slug[0];
    console.log("categorySlug:", categorySlug);

    // Fetch category info and products simultaneously
    Promise.all([
      fetchCategory(categorySlug),
      fetchProducts(categorySlug),
      fetchCategories(),
    ])
      .then(([categoryData, productsData, categoriesData]) => {
        if (categoryData) {
          setCategory(categoryData);
        }
        if (productsData) {
          setProducts(productsData);
        }
        if (categoriesData) {
          setCategories(categoriesData);
        }
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
        notFound();
      });
  }, [slug]);

  // Build breadcrumb items
  const buildBreadcrumbs = () => {
    if (!category || !categories) return [];

    const breadcrumbs = [{ name: "All Products", link: "/products" }];

    // Find parent hierarchy
    const findParentChain = (cat: CategoryType): CategoryType[] => {
      if (!cat.parentId) return [cat];

      const parent = categories.find((c) => c._id === cat.parentId);
      if (parent) {
        return [...findParentChain(parent), cat];
      }
      return [cat];
    };

    const hierarchy = findParentChain(category);

    hierarchy.forEach((cat) => {
      breadcrumbs.push({
        name: cat.name,
        link: `/products/${cat.slug}`,
      });
    });

    return breadcrumbs;
  };

  const isLoading = productsLoading || categoryLoading || categoriesLoading;

  if (isLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (!category) {
    return <div className="h-screen w-screen tex-9xl text-black">NOT FOUND</div>
    // notFound();
    // return null;
  }

  const breadcrumbs = buildBreadcrumbs();

  return (
    <main className="bg-gray-50 pt-32 pb-20">
      <div className="container mx-auto px-4">
        <Breadcrumb items={breadcrumbs} />

        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
            {category.name}
          </h1>
          {category.description && (
            <p className="text-lg text-gray-600 mt-4 max-w-2xl mx-auto">
              {category.description}
            </p>
          )}
          <div className="w-24 h-1 bg-[#de1448] mt-4 mx-auto rounded-full" />
        </div>

        {!products || products.length === 0 ? (
          <div className="text-center text-gray-600 text-lg py-20">
            <p>No products available in this category at the moment.</p>
            <Link
              href="/products"
              className="text-[#de1448] hover:underline mt-4 inline-block"
            >
              Browse all products →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
