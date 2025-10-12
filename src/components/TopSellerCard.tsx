import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ProductType } from "@/types/product";

type TopSellerCardProps = {
  product: ProductType & { categoryName?: string };
};

const TopSellerCard: React.FC<TopSellerCardProps> = ({ product }) => {
  return (
    <Link href={`/products/id/${product._id}`} className="block group h-full">
      <div className="bg-white rounded-2xl border border-gray-200/80 p-1 md:p-4 pb-2 md:pb-2 shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-2 h-full flex flex-col">
        {/* Image container with fixed aspect ratio */}
        <div className="relative w-full aspect-[3/4] md:aspect-square mb-2 md:mb-3 overflow-hidden rounded-lg bg-gray-50">
          <Image
            src={product.images?.[0] ?? "/assets/product.svg"}
            alt={product.name ?? "Product image"}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
          />
        </div>

        {/* Content area */}
        <div className="px-2 md:px-0">
          {/* Product name with 2-line truncation */}
          <h3 className="text-base md:text-lg lg:text-xl font-bold text-gray-900 mb-1 line-clamp-2">
            {product.name}
          </h3>

          {/* Category name - left aligned */}
          {product.categoryName && (
            <div className="text-left">
              <span className="text-xs md:text-sm text-gray-500 group-hover:text-[#de1448] transition-colors">
                {product.categoryName}
              </span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default TopSellerCard;
