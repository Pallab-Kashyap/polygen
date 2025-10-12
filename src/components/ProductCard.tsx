import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { ProductType } from "@/types/product";

type ProductCardProps = {
  product: ProductType;
};

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
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

export default ProductCard;
