// /components/Header.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { productCategories } from "@/app/data/products";
import CategoriesDropdown from "./CategoriesDropdown";

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
            href="#about"
            className="hover:text-[#de1448] transition-colors"
          >
            About Us
          </Link>
          <span className="absolute left-0 -bottom-1 h-[2px] w-0 group-hover:w-full bg-[#de1448] transition-all duration-300"></span>
        </div>

        {/* Products Dropdown */}
        <div className="group relative">
          <Link
            href="/products"
            className="hover:text-[#de1448] transition-colors flex items-center"
          >
            Products <ChevronDown className="inline ml-1 h-5 w-5" />
          </Link>
          <span className="absolute left-0 -bottom-1 h-[2px] w-0 group-hover:w-full bg-[#de1448] transition-all duration-300"></span>

          {/* Dropdown Panel */}
          <CategoriesDropdown />
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
