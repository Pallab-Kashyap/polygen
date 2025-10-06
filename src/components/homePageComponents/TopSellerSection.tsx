import React from "react";
import ProductCard from "../ProductCard"; // Import the card component
import Heading from "../shared/Heading";

// Sample data for the products. Replace imageUrls with your actual asset paths.
const topSellersData = [
  {
    name: "Polygen 6mm wire",
    category: "Wires and Cables",
    imageUrl: "/assets/motor-starter.svg", // Replace with your asset path
  },
  {
    name: "Polygen Contractor",
    category: "Starter & Spares",
    imageUrl: "/assets/motor-starter.svg", // Replace with your asset path
  },
  {
    name: "Polygen Fuse 63A",
    category: "Kitkat Fuse",
    imageUrl: "/assets/motor-starter.svg", // Replace with your asset path
  },
  {
    name: "Polygen DOL Starter",
    category: "Starter & Spares",
    imageUrl: "/assets/motor-starter.svg", // Replace with your asset path
  },
];

const TopSellers: React.FC = () => {
  return (
    <section className="bg-[#F2F1F2] py-10 sm:py-20">
      <div className="container mx-auto  px-4">
        {/* Section Heading */}

        <Heading>Our Top Sellers</Heading>

        {/* Products Grid */}
        <div className="hide-scrollbar flex overflow-x-auto gap-4 pb-3 md:grid md:grid-cols-2 lg:grid-cols-4 md:gap-8 md:overflow-visible md:pb-0">
          {topSellersData.map((product) => (
            <ProductCard key={product.name} product={product} />
          ))}
        </div>

        {/* View More Link */}
        <div className="text-right mt-12">
          <a
            href="/products" // Link to your all products page
            className="text-md underline underline-offset-4 text-[#de1448] font-medium hover:text-red-700 transition-colors"
          >
            View more products
          </a>
        </div>
      </div>
    </section>
  );
};

export default TopSellers;
