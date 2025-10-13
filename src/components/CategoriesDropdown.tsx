"use client";

import { categoryService } from "@/services/categoryService";
import { CategoryType } from "@/types/category";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import cachedCategories from "@/data/categories.json";

const CategoriesDropdown = () => {
  const [categories, setCategories] = useState<CategoryType[]>(
    cachedCategories as any as CategoryType[]
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const categories = await categoryService.getCategories();
        setCategories(categories || []);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <div
        className="absolute top-full left-1/2 -translate-x-1/2 pt-6 w-screen max-w-4xl
                       opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300"
      >
        <div className="bg-white rounded-lg shadow-2xl p-8">
          <div className="text-center text-gray-500">Loading categories...</div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="absolute top-full left-1/2 -translate-x-1/2 pt-6 w-screen max-w-4xl
                       opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300"
    >
      <div className="bg-white rounded-lg shadow-2xl p-8">
        {categories.length === 0 ? (
          <div className="text-center text-gray-500">
            No categories available
          </div>
        ) : (
          <div className="columns-3 gap-4">
            {categories.map((category) => (
              <div key={category.slug} className="mb-6 break-inside-avoid">
                <Link
                  href={`/products/${category.slug}`}
                  className="inline-block"
                >
                  <h3 className="text-lg font-bold text-[#de1448] mb-4 hover:underline underline-offset-4">
                    {category.name}
                  </h3>
                </Link>

                {category.children && category.children.length > 0 && (
                  <ul className="flex flex-col gap-y-2.5">
                    {category.children.map((item) => (
                      <li key={item.slug}>
                        <Link
                          href={`/products/${item.slug}`}
                          className="text-base whitespace-nowrap text-gray-700 hover:text-black transition-colors"
                        >
                          {item.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoriesDropdown;
