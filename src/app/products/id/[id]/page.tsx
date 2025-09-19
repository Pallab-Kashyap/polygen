"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ProductType } from "@/types/product";
import { CategoryType } from "@/types/category";
import { notFound, useParams } from "next/navigation";
import { useApi } from "@/hooks/useApi";
import { productService } from "@/services/productService";
import { categoryService } from "@/services/categoryService";
import Spinner from "@/components/shared/Spinner";
import Breadcrumb, { BreadcrumbType } from "@/components/Breadcrumb";

function ProductView() {
  const { id } = useParams<{ id: string }>();

  const { execute: getProduct, loading: isLoading } = useApi(
    productService.getProductById
  );
  const { execute: getCategory, loading: categoryLoading } = useApi(
    categoryService.getCategoryById
  );
  const { execute: getCategories, loading: categoriesLoading } = useApi(
    categoryService.getCategories
  );

  const [product, setProduct] = useState<ProductType>();
  const [category, setCategory] = useState<CategoryType | null>(null);
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [l, setL] = useState<boolean>(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productData = await getProduct(id);
        if (productData) {
          setProduct(productData);

          // Fetch category and all categories for breadcrumb
          const [categoryData, categoriesData] = await Promise.all([
            getCategory(productData.categoryId),
            getCategories()
          ]);

          if (categoryData) {
            setCategory(categoryData);
          }
          if (categoriesData) {
            setCategories(categoriesData);
          }
        }
      } catch (err) {
        console.log("ERR", err);
      } finally {
        setL(false);
      }
    };

    fetchData();
  }, [id, getProduct, getCategory, getCategories]);

  if (l)
    return (
      <div className="h-screen w-screen bg-white">
        <Spinner />
      </div>
    );

  if (!product) {
    notFound();
  }

  const images = product.images || [];

  // Build breadcrumb items
  const buildBreadcrumbs = (): BreadcrumbType[] => {
    const breadcrumbs: BreadcrumbType[] = [
      { name: "All Products", link: "/products" }
    ];

    if (category && categories.length > 0) {
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
    }

    // Add current product
    breadcrumbs.push({
      name: product.name,
      link: `/products/id/${product._id}`,
    });

    return breadcrumbs;
  };

  const breadcrumbs = buildBreadcrumbs();

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex(
      (prevIndex) => (prevIndex - 1 + images.length) % images.length
    );
  };

  return (
    <div className="font-sans bg-white text-gray-800 mt-20">
      <main className="px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumbs */}
        <Breadcrumb items={breadcrumbs} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div className="relative">
            <div className="aspect-square relative w-full overflow-hidden rounded-lg border border-gray-200">
              {images.length > 0 ? (
                <Image
                  src={images[currentImageIndex]}
                  alt={`${product.name} image ${currentImageIndex + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
              ) : (
                <div className="bg-gray-100 h-full w-full flex items-center justify-center">
                  <span className="text-gray-400">No Image</span>
                </div>
              )}
            </div>
            {images.length > 1 && (
              <div className="text-center mt-5">
                <button
                  onClick={prevImage}
                  className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="h-6 w-6 text-gray-800" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
                  aria-label="Next image"
                >
                  <ChevronRight className="h-6 w-6 text-gray-800" />
                </button>
                <span className="w-fit bg-black/60 text-white text-xs font-semibold px-5 py-3 rounded-full">
                  {currentImageIndex + 1} / {images.length}
                </span>
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="relative flex flex-col rounded-2xl space-y-6 shadow-2xl p-6">
            <div className="absolute top-8 right-4">
              <Image
                src="/assets/redseal.svg"
                alt="Brand Logo"
                width={80}
                height={80}
                className="h-[60px] w-[60px] md:h-[100px] md:w-[100px]"
                // className="h-[80px] w-[80px]"
              />
            </div>

            <div>
              <h1 className="text-2xl md:text-4xl font-bold text-gray-900 max-w-[80%] break-words whitespace-normal">
                {product.name}
              </h1>
            </div>

            {/* About Product */}
            <div>
              <h2 className="text-lg md:text-2xl font-semibold text-gray-800 mb-2">
                About Product
              </h2>
              <p className="text-gray-600 text- leading-relaxed">
                {product.about ||
                  `The ${product.name} is designed for reliable performance across various applications.`}
              </p>
            </div>

            {/* Available Sizes */}
            {product.parameters && product.parameters.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                  Available Options
                </h3>
                {product.parameters.map((param, index) => (
                  <div key={index} className="mb-4">
                    <h4 className="text-md font-medium text-gray-700 mb-2">
                      {param.label}
                    </h4>
                    <div className="flex flex-wrap gap-3">
                      {param.values.map((value, valueIndex) => (
                        <div
                          key={valueIndex}
                          className={`px-4 py-2 text-sm font-medium border rounded-md transition-colors
                              border-red-500 ring-1 ring-red-300
                          `}
                        >
                          {value}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Applications */}
            {product.applications && product.applications.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Applications
                </h3>
                <ul className="list-disc list-inside space-y-1 text-gray-600">
                  {product.applications.map((application, index) => (
                    <li key={index}>{application}</li>
                  ))}
                </ul>
              </div>
            )}

            <button className="w-full justify-self-end bg-red-600 text-white font-bold py-4 px-6 rounded-lg hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 mt-auto">
              Request pricing & details
            </button>
          </div>
        </div>

        {/* Description Section */}
        {product.description && product.description.length > 0 && (
          <div className="mt-16 pt-10 border-t border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Description
            </h2>

            {product.description.map((block, blockIndex) => (
              <div key={blockIndex} className="mb-8">
                {block.heading && (
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    {block.heading}
                  </h3>
                )}

                {block.text && (
                  <p className="text-gray-600 leading-relaxed mb-4">
                    {block.text}
                  </p>
                )}

                {block.bulletPoints && block.bulletPoints.length > 0 && (
                  <ul className="space-y-4">
                    {block.bulletPoints.map((bullet, bulletIndex) => (
                      <li
                        key={bulletIndex}
                        className="text-gray-600 leading-relaxed flex items-start"
                      >
                        <span className="text-black mr-2 mt-1">&#8226;</span>
                        <span>
                          {bullet.highlight && (
                            <strong className="font-semibold text-gray-800">
                              {bullet.highlight}:
                            </strong>
                          )}
                          {bullet.highlight && bullet.text && " "}
                          {bullet.text}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default ProductView;

// Your interfaces (no changes needed)
export interface ProductParameter {
  label: string;
  values: string[];
}
