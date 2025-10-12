import React from "react";
import Image from "next/image"; // Using Next.js Image component for optimization

// Define the type for the product props
type ProductCardProps = {
  product: {
    name: string;
    category: string;
    imageUrl: string;
  };
};

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    // Card container with hover effects
    <div className="bg-white shrink-0 rounded-2xl border border-gray-200/80 shadow-md md:shadow-xl overflow-hidden cursor-pointer">
      {/* Image container with a subtle gradient background */}
      <div className="w-[100%] p-4">
        <Image
          src={product.imageUrl}
          alt={product.name}
          width={200}
          height={200}
          className="md:object-cover md:h-full md:w-full  drop-shadow-lg transition-transform duration-300 ease-in-out hover:scale-105"
        />
      </div>
      {/* Text content area */}
      <div className="p-4 sm:text-left">
        <h3 className="text-lg md:text-2xl font-bold text-gray-900">{product.name}</h3>
        <p className="text-md text-gray-500 mt-2">{product.category}</p>
      </div>
    </div>
  );
};

export default ProductCard;
