import React from "react";
import Container from "@/components/shared/Container";

export default function BlogLoading() {
  return (
    <Container>
      <div className="bg-white min-h-screen mt-32 mb-12 space-y-8 md:space-y-16 animate-pulse">
        {/* Hero Section Skeleton */}
        <section>
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              {/* Title Skeleton */}
              <div className="space-y-4 mb-6">
                <div className="h-12 bg-gray-200 rounded w-3/4 mx-auto"></div>
                <div className="h-12 bg-gray-200 rounded w-2/3 mx-auto"></div>
              </div>

              {/* Image Skeleton */}
              <div className="my-8">
                <div className="w-full h-64 sm:h-96 bg-gray-200 rounded-lg"></div>
              </div>

              {/* Description Skeleton */}
              <div className="space-y-3 mb-8">
                <div className="h-6 bg-gray-200 rounded w-full mx-auto"></div>
                <div className="h-6 bg-gray-200 rounded w-5/6 mx-auto"></div>
              </div>

              {/* Meta Information Skeleton */}
              <div className="flex flex-wrap justify-center items-center gap-4">
                <div className="h-4 bg-gray-200 rounded w-32"></div>
                <div className="h-4 bg-gray-200 rounded w-4"></div>
                <div className="h-4 bg-gray-200 rounded w-24"></div>
                <div className="h-4 bg-gray-200 rounded w-4"></div>
                <div className="flex gap-2">
                  <div className="h-6 bg-gray-200 rounded w-16"></div>
                  <div className="h-6 bg-gray-200 rounded w-20"></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Content Skeleton */}
        <section className="bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto space-y-4">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-4/5"></div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Related Blogs Skeleton */}
        <section>
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              {/* Section Title Skeleton */}
              <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-8"></div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="bg-white rounded-lg shadow-sm overflow-hidden"
                  >
                    {/* Image Skeleton */}
                    <div className="w-full h-48 bg-gray-200"></div>

                    <div className="p-6 space-y-4">
                      {/* Title Skeleton */}
                      <div className="space-y-2">
                        <div className="h-5 bg-gray-200 rounded w-full"></div>
                        <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                      </div>

                      {/* Description Skeleton */}
                      <div className="space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-full"></div>
                        <div className="h-4 bg-gray-200 rounded w-full"></div>
                        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                      </div>

                      {/* Footer Skeleton */}
                      <div className="flex justify-between items-center">
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

        {/* Back Button Skeleton */}
        <section>
          <div className="container mx-auto px-4 text-center">
            <div className="h-6 bg-gray-200 rounded w-40 mx-auto"></div>
          </div>
        </section>
      </div>
    </Container>
  );
}
