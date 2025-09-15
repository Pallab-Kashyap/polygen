"use client"

import { categoryService } from "@/services/categoryService";
import { CategoryType } from "@/types/category";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const CategoriesDropdown = () => {
  const [categories, setCategories] = useState<CategoryType[]>([]);
  useEffect(() => {
    (async () => {
      console.log('cat')
      const categories = await categoryService.getCategories();
      console.log(categories)
      setCategories(categories);
    })();
  }, []);

  return (
    <div
      className="absolute top-full left-1/2 -translate-x-1/2 pt-6 w-screen max-w-4xl
                       opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300"
    >
      <div className="bg-white rounded-lg shadow-2xl p-8">
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

              <ul className="flex flex-col gap-y-2.5">
                {category.children &&
                  category.children.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={`/products/${category.slug}/${item.slug}`}
                        className={`text-base whitespace-nowrap text-gray-700 hover:text-black transition-colors`}
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoriesDropdown;
