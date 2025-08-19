"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ProductType } from "@/types/product";
import { notFound, useParams } from "next/navigation";
import { useApi } from "@/hooks/useApi";
import { productService } from "@/lib/services/productService";
import Spinner from "@/components/shared/Spinner";

function ProductView() {
  const { id } = useParams<{ id: string }>();

  const { execute: getProduct, loading: isLoading } = useApi(
    productService.getProductById
  );

  const [product, setProduct] = useState<ProductType>();
  const [l, setL] = useState<boolean>(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  // const [selectedSize, setSelectedSize] = useState("");

  useEffect(() => {
    getProduct(id)
      .then((data) => {
        if (data) {
          setProduct(data);
          // Set initial selected size safely
          // const initialSize = data.parameters?.[0]?.values?.[0] || "";
          // setSelectedSize(initialSize);
        }
      })
      .catch((err) => console.log("ERR", err))
      .finally(() => {
        setL(false);
      });
  }, [id, getProduct]);

  if (l)
    return (
      <div className="h-screen w-screen">
        <Spinner />;
      </div>
    );

  if (!product) {
    notFound();
  }

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
    <div className="font-sans bg-white text-gray-800 mt-20">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumbs */}
        <div className="text-sm text-gray-500 mb-6">
          <Link href="/products" className="hover:text-red-600">
            Products
          </Link>
          <span className="mx-2">/</span>
          {/* You can make these dynamic based on product category */}
          <Link href="/products/wires-cables" className="hover:text-red-600">
            Wires & Cables
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-800 font-medium">{product.name}</span>
        </div>

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
            <div className="absolute top-0 right-0">
              <Image
                src="/assets/redseal.svg"
                alt="Brand Logo"
                width={80}
                height={80}
              />
            </div>

            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">
                {product.name}
              </h1>
              {/* You can add a subheading here if it exists in your data */}
            </div>

            {product.about && (
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
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
                      // onClick={() => setSelectedSize(value)}
                      className={`px-4 py-2 text-sm font-medium border rounded-md transition-colors ${
                        // selectedSize === value
                        " border-red-500  ring-1 ring-red-300"
                        // : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {value}
                    </button>
                  ))}
                </div>
              </div>
            ))}

            {product.applications && product.applications.length > 0 && (
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

            <button className="w-full bg-red-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 mt-4">
              Request pricing & details
            </button>
          </div>
        </div>

        {/* Description Section */}
        <div className="mt-16 pt-10 border-t border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Description</h2>
          {product.description?.map((block, index) => (
            <div key={index} className="mb-8">
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
              {block.bulletPoints && (
                <ul className="space-y-4">
                  {block.bulletPoints.map((point, pointIndex) => (
                    <li
                      key={pointIndex}
                      className="text-gray-600 leading-relaxed flex items-start"
                    >
                      <span className="text-red-500 mr-2 mt-1">&#8226;</span>
                      <span>
                        {point.highlight && (
                          <strong className="font-semibold text-gray-800">
                            {point.highlight}:
                          </strong>
                        )}{" "}
                        {point.text}
                      </span>
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

export default ProductView;

// Your interfaces (no changes needed)
export interface ProductParameter {
  label: string;
  values: string[];
}
// ... rest of your interfaces
