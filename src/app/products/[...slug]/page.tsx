"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumb";
import Container from "@/components/shared/Container";
import ProductCard from "@/components/ProductCard";
import { useApi } from "@/hooks/useApi";
import { productService } from "@/services/productService";
import { categoryService } from "@/services/categoryService";
import { ProductType } from "@/types/product";
import { CategoryType } from "@/types/category";
import Spinner from "@/components/shared/Spinner";
import Heading from "@/components/shared/Heading";

function Banner({ category }: { category: CategoryType }) {
  return (
    <>
      <section className="relative pt-32 w-full h-fit bg-gray-900 text-white overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0">
          {/* Mobile image */}
          <img
            src="/assets/Mobile/product-banner.png"
            alt="Background"
            className="md:hidden "
          />
          {/* Desktop image */}
          <img
            src="/assets/Product/banner.jpeg"
            alt="Background"
            className="hidden md:block w-full h-full object-cover"
          />
          <div className="absolute inset-0 hidden md:block bg-gradient-to-r from-[#5c1c2e]/80 to-transparent"></div>
        </div>

        {/* Foreground (all visible content) */}
        <div className="relative z-10">
          {/* Main content */}
          <Container className="relative flex flex-col md:flex-row items-center justify-between pt-32 md:py-20">
            {/* Left text */}
            <div className="max-w-xl text-center md:text-left mt-auto md:mt-0 bg-black/50 md:bg-transparent p-4 md:p-0 rounded-lg md:rounded-none w-full md:w-auto">
              <h1 className="text-3xl md:text-5xl font-bold text-white">
                {category.name}
              </h1>
              <p className="hidden md:block mt-4 text-lg md:text-xl text-gray-200">
                {category.description &&
                  category.description.split("/")[0].trim()}
                {category.description?.includes("/") && (
                  <span className="font-semibold text-red-500">
                    {" "}
                    {category.description.split("/")[1].trim().toUpperCase()}
                  </span>
                )}
              </p>
            </div>

            {/* Red Seal Badge */}
            <div className="absolute hidden md:block md:top-20 right-0 h-[80px] w-[80px] md:h-[120px] md:w-[120px] transform -translate-y-1/2 z-20">
              <Image
                src="/assets/redseal.svg"
                alt="Red Seal"
                fill
                className="object-contain"
              />
            </div>
          </Container>
        </div>
      </section>
      {/* Bottom strip - Full width background with constrained text */}
      <div className="bg-red-600 py-3">
        <Container>
          <p className="text-sm md:text-base font-medium text-white md:text-cente">
            <span className="font-semibold">RED SEAL QUALITY</span>: Every
            product is tested, certified, and stamped with our Red Seal Quality
            promise — built to last through seasons, fields, and every
            challenge.
          </p>
        </Container>
      </div>
    </>
  );
}

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
    return (
      <div className="h-screen w-screen tex-9xl text-black">NOT FOUND</div>
    );
    // notFound();
    // return null;
  }

  const breadcrumbs = buildBreadcrumbs();

  return (
    <main className="bg-gray-50 pb-20 mt-20">
      <Banner category={category} />
      <Container className="pt-4">
        <Breadcrumb items={breadcrumbs} />

        <div className="text-center mb-16">
          <Heading>{category.name}</Heading>
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
      </Container>
    </main>
  );
}
