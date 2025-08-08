// /app/products/[...slug]/page.tsx
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  productsByCategory,
  productCategories,
  ProductItem,
} from "@/app/data/products";
import { ChevronRight } from "lucide-react";

// Reusable Product Card Component for this page
const ProductCard: React.FC<{ item: ProductItem; categorySlug: string }> = ({
  item,
  categorySlug,
}) => {
  return (
    <Link
      href={`/products/${categorySlug}/${item.slug}`}
      className="block group"
    >
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
        <div className="bg-gradient-to-b from-gray-900 via-gray-800 to-black p-6 flex justify-center items-center h-60">
          <Image
            src={item.imageUrl}
            alt={item.name}
            width={200}
            height={200}
            className="object-contain h-full w-auto drop-shadow-lg transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        <div className="p-6">
          <h3 className="text-xl font-bold text-gray-900 text-center">
            {item.name}
          </h3>
          <div className="text-center mt-4">
            <span className="text-sm text-gray-500 group-hover:text-[#de1448] transition-colors">
              Explore to upgrade <ChevronRight className="inline h-4 w-4" />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

// The main page component - now handles both all products and specific categories
export default function ProductPage({
  params,
}: {
  params: { slug?: string[] };
}) {
  const isAllProductsPage = !params.slug || params.slug.length === 0;

  // --- RENDER ALL PRODUCTS ---
  if (isAllProductsPage) {
    const allItems = productCategories.flatMap((category) =>
      category.items
        .filter((item) => !item.disabled)
        .map((item) => ({ ...item, categorySlug: category.slug }))
    );

    return (
      <main className="bg-gray-50 pt-32 pb-20">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-8">
            <span className="font-semibold text-black">All Products</span>
          </div>
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
              Our Entire Product Range
            </h1>
            <div className="w-24 h-1 bg-[#de1448] mt-4 mx-auto rounded-full" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
            {allItems.map((item) => (
              <ProductCard
                key={`${item.categorySlug}-${item.slug}`}
                item={item}
                categorySlug={item.categorySlug}
              />
            ))}
          </div>
        </div>
      </main>
    );
  }

  // --- RENDER A SPECIFIC CATEGORY ---
  const categorySlug = params.slug![0];
  const category = productsByCategory.get(categorySlug);

  if (!category) {
    notFound();
  }

  return (
    <main className="bg-gray-50 pt-32 pb-20">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-8">
          <Link href="/products" className="hover:text-black">
            All Products
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="font-semibold text-black">{category.title}</span>
        </div>
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
            Our {category.title} Range
          </h1>
          <div className="w-24 h-1 bg-[#de1448] mt-4 mx-auto rounded-full" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
          {category.items.map((item) => (
            <ProductCard
              key={item.slug}
              item={item}
              categorySlug={category.slug}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
