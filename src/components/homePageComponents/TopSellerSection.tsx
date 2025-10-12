import React from "react";
import TopSellerCard from "../TopSellerCard";
import Heading from "../shared/Heading";
import Container from "../shared/Container";
import { ProductType } from "@/types/product";
import { connectDB } from "@/lib/mongoose";
import Product from "@/models/Product";
import Category from "@/models/Category";

async function getTopSellerProducts(): Promise<
  (ProductType & { categoryName?: string })[]
> {
  try {
    await connectDB();
    const products = await Product.find({ isTopSeller: true }).lean();

    // Fetch category names for all products
    const productsWithCategory = await Promise.all(
      products.map(async (product) => {
        if (product.categoryId) {
          const category = await Category.findById(product.categoryId).lean();
          return {
            ...JSON.parse(JSON.stringify(product)),
            categoryName: category ? (category as any).name : undefined,
          };
        }
        return JSON.parse(JSON.stringify(product));
      })
    );

    return productsWithCategory;
  } catch (error) {
    console.error("Error fetching top seller products:", error);
    return [];
  }
}

const TopSellers: React.FC = async () => {
  const topSellersData = await getTopSellerProducts();

  // If no top sellers found, don't render the section
  if (!topSellersData || topSellersData.length === 0) {
    return null;
  }

  return (
    <section className="bg-[#F2F1F2] py-10 sm:py-20">
      <Container>
        {/* Section Heading */}
        <Heading>Our Top Sellers</Heading>

        {/* Products Grid */}
        <div className="hide-scrollbar flex overflow-x-auto gap-4 pb-3 md:gap-8 md:overflow-visible md:pb-0 md:flex-wrap md:justify-center">
          {topSellersData.map((product) => (
            <div
              key={product._id || product.slug}
              className="min-w-[280px] max-w-[280px] h-[350px] flex-shrink-0 md:min-w-0 md:max-w-[400px] md:w-[calc(50%-1rem)] md:h-[380px] lg:w-[calc(25%-1.5rem)] lg:max-w-none"
            >
              <TopSellerCard product={product} />
            </div>
          ))}
        </div>

        {/* View More Link */}
        <div className="text-right mt-12">
          <a
            href="/products"
            className="text-md underline underline-offset-4 text-[#de1448] font-medium hover:text-red-700 transition-colors"
          >
            View more products
          </a>
        </div>
      </Container>
    </section>
  );
};

export default TopSellers;
