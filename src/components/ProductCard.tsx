import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ProductType } from "@/types/product";

type ProductCardProps = {
  product: ProductType;
};

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <Link href={`/products/id/${product._id}`} className="block group h-full">
      <div className="md:bg-white md:rounded-2xl md:border md:border-gray-200/80 md:p-4 md:shadow-md overflow-hidden md:transition-all md:duration-300 md:hover:shadow-xl md:hover:-translate-y-2 h-full flex flex-col">
        {/* Image container with fixed aspect ratio */}
        <div className="relative w-full aspect-[3/4] md:aspect-square mb-2 md:mb-4 overflow-hidden md:rounded-lg bg-gray-50">
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
          {/* Product name with single line truncation */}
          <h3 className="text-sm md:text-lg lg:text-xl font-bold text-gray-900 mb-1 md:mb-2 truncate overflow-hidden whitespace-nowrap">
            {product.name}
          </h3>

          {/* About text with single line truncation */}
          {product.about && (
            <p className="text-xs md:text-sm text-gray-600 truncate overflow-hidden whitespace-nowrap">
              {product.about}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
