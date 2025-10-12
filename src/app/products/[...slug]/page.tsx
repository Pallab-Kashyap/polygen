"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { ChevronRight } from "lucide-react";
import Breadcrumb from "@/components/Breadcrumb";
import Container from "@/components/shared/Container";
import { useApi } from "@/hooks/useApi";
import { productService } from "@/services/productService";
import { categoryService } from "@/services/categoryService";
import { ProductType } from "@/types/product";
import { CategoryType } from "@/types/category";
import Spinner from "@/components/shared/Spinner";
import Heading from "@/components/shared/Heading";

// Reusable Product Card Component
const ProductCard: React.FC<{ product: ProductType }> = ({ product }) => {
  return (
    <Link href={`/products/id/${product._id}`} className="block group h-full">
      <div className="bg-white rounded-2xl border border-gray-200/80 p-4 shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-2 h-full flex flex-col">
        {/* Image container with fixed aspect ratio */}
        <div className="relative w-full aspect-square mb-4 overflow-hidden rounded-lg bg-gray-50">
          <Image
            src={product.images?.[0] ?? "/assets/product.svg"}
            alt={product.name ?? "Product image"}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
          />
        </div>

        {/* Content area - grows to fill space */}
        <div className="flex flex-col flex-1">
          {/* Product name with 2-line truncation */}
          <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-3 line-clamp-2 min-h-[3.5rem]">
            {product.name}
          </h3>

          {/* Spacer to push button to bottom */}
          <div className="flex-1"></div>

          {/* Explore link at bottom */}
          <div className="text-right">
            <span className="text-sm text-gray-500 group-hover:text-[#de1448] transition-colors inline-flex items-center">
              Explore to upgrade <ChevronRight className="ml-1 h-4 w-4" />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </Container>
    </main>
  );
}
