"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ProductType } from "@/types/product";
import { notFound } from "next/navigation";
import { useApi } from "@/hooks/useApi";
import { productService } from "@/lib/services/productService";

async function ProductView({ params }: { params: Promise<{id: string}> }) {
  const { id } = await params;

    const {execute: getProduct, loading: isLoading} = useApi(productService.getProductById)

    const [product, setProduct] = useState<ProductType>()

       const loadData = useCallback(() => {
            getProduct(id)
              .then((data) => {
                if(data){
                  setProduct(data.data)
                }
              })

        }, []);

      useEffect(() => {
        loadData()
      }, [])

  if (!product) {
    notFound();
  }

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  // Pre-select the second size as shown in the image, or default to the first
  const [selectedSize, setSelectedSize] = useState(
    product.parameters?.[0]?.values[1] ||
      product.parameters?.[0]?.values[0] ||
      ""
  );

  const images = product.images || [];

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex(
      (prevIndex) => (prevIndex - 1 + images.length) % images.length
    );
  };

  return (
    <div className="font-sans">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div className="relative">
            <div className="aspect-square relative w-full overflow-hidden rounded-lg">
              {images.length > 0 && (
                <Image
                  src={images[currentImageIndex]}
                  alt={`${product.name} image ${currentImageIndex + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
              )}
            </div>
            {images.length > 1 && (
              <>
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
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white text-xs font-semibold px-2 py-1 rounded-full">
                  {currentImageIndex + 1} / {images.length}
                </div>
              </>
            )}
          </div>

          {/* Product Info */}
          <div className="relative flex flex-col space-y-6">
            {/* {product.brandLogo && ( */}
              <div className="absolute top-0 right-0">
                <Image
                  src='/assets/readseal.svg'
                  alt="Brand Logo"
                  width={80}
                  height={80}
                />
              </div>
            {/* )} */}

            {/* <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">
                {product.name}
              </h1>
              {product.subheading && (
                <p className="text-md text-gray-500 mt-1">
                  {product.subheading}
                </p>
              )}
            </div> */}

            {product.about && (
              <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-2">
                  About Product
                </h2>
                <p className="text-gray-600 leading-relaxed">{product.about}</p>
              </div>
            )}

            {product.parameters?.map((param) => (
              <div key={param.label}>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                  {param.label}
                </h3>
                <div className="flex flex-wrap gap-3">
                  {param.values.map((value) => (
                    <button
                      key={value}
                      onClick={() => setSelectedSize(value)}
                      className={`px-5 py-2 text-sm font-medium border rounded-md transition-colors ${
                        selectedSize === value
                          ? "bg-red-50 border-red-500 text-red-600 ring-2 ring-red-200"
                          : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {value}
                    </button>
                  ))}
                </div>
              </div>
            ))}

            {product.applications && (
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Applications
                </h3>
                <ul className="list-disc list-inside space-y-1 text-gray-600">
                  {product.applications.map((app, index) => (
                    <li key={index}>{app}</li>
                  ))}
                </ul>
              </div>
            )}

            <button className="w-full bg-red-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">
              Request pricing & details
            </button>
          </div>
        </div>

        {/* Description Section */}
        <div className="mt-16 pt-10 border-t border-gray-200">
          {product.description?.map((block, index) => (
            <div key={index} className="mb-8">
              {block.heading && (
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  {block.heading}
                </h2>
              )}
              {block.text && (
                <p className="text-gray-600 leading-relaxed mb-4">
                  {block.text}
                </p>
              )}
              {block.bulletPoints && (
                <ul className="space-y-3">
                  {block.bulletPoints.map((point, pointIndex) => (
                    <li
                      key={pointIndex}
                      className="text-gray-600 leading-relaxed"
                    >
                      {point.highlight && (
                        <strong className="font-semibold text-gray-800">
                          {point.highlight}
                        </strong>
                      )}{" "}
                      {point.text}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default ProductView
