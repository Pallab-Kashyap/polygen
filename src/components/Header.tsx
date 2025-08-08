// /components/Header.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { productCategories } from "@/app/data/products";

export default function Header() {
  return (
    <header className="fixed top-0 w-full flex items-center justify-between px-6 py-4 z-40 bg-white text-black bg-opacity-95 shadow-md">
      <div className="flex items-center gap-2">
        <Link href="/">
          <Image
            src="/assets/logo.svg"
            alt="Polygen Logo"
            width={150}
            height={40}
          />
        </Link>
      </div>
      <nav className="hidden md:flex items-center gap-10 text-lg font-semibold">
        <div className="group relative">
          <Link href="/" className="hover:text-[#de1448] transition-colors">
            Home
          </Link>
          <span className="absolute left-0 -bottom-1 h-[2px] w-0 group-hover:w-full bg-[#de1448] transition-all duration-300"></span>
        </div>
        <div className="group relative">
          <Link
            href="/about"
            className="hover:text-[#de1448] transition-colors"
          >
            About Us
          </Link>
          <span className="absolute left-0 -bottom-1 h-[2px] w-0 group-hover:w-full bg-[#de1448] transition-all duration-300"></span>
        </div>

        {/* Products Dropdown */}
        <div className="group relative">
          {/* Main "Products" link now points to the all-products page */}
          <Link
            href="/products"
            className="hover:text-[#de1448] transition-colors flex items-center"
          >
            Products <ChevronDown className="inline ml-1 h-5 w-5" />
          </Link>
          <span className="absolute left-0 -bottom-1 h-[2px] w-0 group-hover:w-full bg-[#de1448] transition-all duration-300"></span>

          {/* Dropdown Panel - Updated for multi-column flow */}
          <div
            className="absolute top-full left-1/2 -translate-x-1/2 pt-6 w-screen max-w-5xl
                       opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300"
          >
            <div className="bg-white rounded-lg shadow-2xl p-8">
              {/* This container uses flexbox to create the flowing columns */}
              <div className="flex flex-col flex-wrap h-[260px] gap-x-12">
                {productCategories.map((category) => (
                  <div key={category.title} className="mb-6 break-inside-avoid">
                    {/* Category titles are now links */}
                    <Link
                      href={`/products/${category.slug}`}
                      className="inline-block"
                    >
                      <h3 className="text-lg font-bold text-[#de1448] mb-4 hover:underline">
                        {category.title}
                      </h3>
                    </Link>
                    <ul className="flex flex-col gap-y-2.5">
                      {category.items.map((item) => (
                        <li key={item.name}>
                          <Link
                            href={
                              item.disabled
                                ? "#"
                                : `/products/${category.slug}/${item.slug}`
                            }
                            className={`
                              text-base whitespace-nowrap text-gray-700 hover:text-black transition-colors
                              ${
                                item.disabled
                                  ? "text-gray-400 cursor-not-allowed"
                                  : ""
                              }
                            `}
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
        </div>

        <div className="group relative">
          <button className="hover:text-[#de1448] transition-colors flex items-center">
            Brands <ChevronDown className="inline ml-1 h-5 w-5" />
          </button>
          <span className="absolute left-0 -bottom-1 h-[2px] w-0 group-hover:w-full bg-[#de1448] transition-all duration-300"></span>
        </div>
      </nav>
      <Link
        href="/contact"
        className="bg-[#de1448] text-white px-6 py-2.5 rounded-lg hover:bg-red-700 transition-colors text-lg font-semibold"
      >
        Contact us
      </Link>
    </header>
  );
}
