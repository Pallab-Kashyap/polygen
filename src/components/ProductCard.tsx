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
    <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xl overflow-hidden group cursor-pointer">
      {/* Image container with a subtle gradient background */}
      <div className="w-[50%] md:w-[100%] p-4">
        <Image
          src={product.imageUrl}
          alt={product.name}
          width={200}
          height={200}
          className="object-cover h-full w-full  drop-shadow-lg transition-transform duration-300 ease-in-out hover:scale-105"
        />
      </div>
      {/* Text content area */}
      <div className="p-4 sm:text-left">
        <h3 className="text-xl md:text-2xl font-bold text-gray-900">{product.name}</h3>
        <p className="text-lg text-gray-500 mt-2">{product.category}</p>
      </div>
    </div>
  );
};

export default ProductCard;
