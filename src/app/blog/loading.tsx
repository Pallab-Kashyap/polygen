import React from "react";
import Heading from "@/components/shared/Heading";

export default function BlogsLoading() {
  return (
    <div className="min-h-screen mt-16 space-y-12 sm:space-y-16 py-16">
      {/* Hero Section Skeleton */}
      <section className="bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Heading>Our Blog</Heading>
            <div className="h-6 bg-gray-200 rounded w-3/4 mx-auto animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Blogs Grid Skeleton */}
      <section>
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="bg-white rounded-lg p-2 shadow-sm animate-pulse"
                >
                  {/* Image Skeleton */}
                  <div className="w-full h-52 bg-gray-200 rounded-lg"></div>

                  <div className="p-2 mt-3 space-y-3">
                    {/* Tags Skeleton */}
                    <div className="flex gap-2">
                      <div className="h-6 bg-gray-200 rounded w-16"></div>
                      <div className="h-6 bg-gray-200 rounded w-20"></div>
                    </div>

                    {/* Title Skeleton */}
                    <div className="space-y-2">
                      <div className="h-6 bg-gray-200 rounded w-full"></div>
                      <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                    </div>

                    {/* Description Skeleton */}
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-full"></div>
                      <div className="h-4 bg-gray-200 rounded w-full"></div>
                      <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                    </div>

                    {/* Footer Skeleton */}
                    <div className="flex justify-between items-center pt-2">
                      <div className="h-3 bg-gray-200 rounded w-24"></div>
                      <div className="h-3 bg-gray-200 rounded w-20"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
