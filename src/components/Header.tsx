"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronDown, Menu, X } from "lucide-react";
import CategoriesDropdown from "./CategoriesDropdown";
import Container from "./shared/Container";
import React, { useEffect, useState } from "react";
import { categoryService } from "@/services/categoryService";
import { usePathname } from "next/navigation";
import cachedCategories from "@/data/categories.json";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [categories, setCategories] = useState<any[]>(cachedCategories);
  const [catsOpen, setCatsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isBlackHeader, setIsBlackHeader] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (!menuOpen) return;

    if (categories.length === 0) {
      setCategories(cachedCategories);
    }

    (async () => {
      try {
        const data = await categoryService.getCategories();
        setCategories(data || []);
      } catch (e) {
        console.error("Failed to load categories for mobile menu", e);
      }
    })();
  }, [menuOpen]);

  useEffect(() => {
    if (pathname !== "/") {
      setIsScrolled(true);
      setIsBlackHeader(false);
      return;
    }

    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;

      if (scrollPosition > 50) {
        setIsBlackHeader(true);
      } else {
        setIsBlackHeader(false);
      }

      const aboutSection =
        document.querySelector("#about") ||
        document.querySelector('[id*="about"]') ||
        document.querySelector("section:nth-child(2)");

      if (aboutSection instanceof HTMLElement) {
        const aboutTop = aboutSection.offsetTop;
        setIsScrolled(scrollPosition >= aboutTop - 100);
      } else {
        setIsScrolled(scrollPosition >= windowHeight);
      }
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]);

  const handleNavigate = () => {
    setMenuOpen(false);
  };

  const renderCategoryTree = (cat: any, level = 0) => {
    return (
      <div
        key={cat.slug}
        className="py-2"
        style={{ paddingLeft: `${level * 12}px` }}
      >
        <Link
          href={`/products/${cat.slug}`}
          onClick={handleNavigate}
          className={`block ${
            level === 0 ? "font-bold text-[#de1448]" : "text-gray-700"
          } py-1`}
        >
          {cat.name}
        </Link>
        {cat.children && cat.children.length > 0 && (
          <div>
            {cat.children.map((child: any) =>
              renderCategoryTree(child, level + 1)
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <header
      className={`fixed top-0 w-full z-40 transition-all duration-300 shadow-md ${
        isScrolled
          ? "bg-white text-black bg-opacity-100"
          : isBlackHeader
          ? "bg-black text-white bg-opacity-95"
          : "bg-transparent text-white bg-opacity-95"
      }`}
    >
      <Container className="flex items-center justify-between py-4">
        <Link href="/" onClick={() => setMenuOpen(false)}>
          <Image
            src={
              isScrolled
                ? "/assets/logo.svg"
                : isBlackHeader
                ? "/assets/logo-white.svg"
                : "/assets/logo-white.svg"
            }
            alt="Polygen Logo"
            width={150}
            height={40}
          />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-10 text-lg font-semibold">
          <div className="group relative">
            <Link href="/" className="hover:text-[#de1448] transition-colors">
              Home
            </Link>
            <span className="absolute left-0 -bottom-1 h-[2px] w-0 group-hover:w-full bg-[#de1448] transition-all duration-300"></span>
          </div>
          <div className="group relative">
            <a
              href="/#about"
              className="hover:text-[#de1448] transition-colors cursor-pointer"
            >
              About Us
            </a>
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
            <a
              href="/#blogs"
              className="hover:text-[#de1448] transition-colors flex items-center cursor-pointer"
            >
              Blogs
            </a>
            <span className="absolute left-0 -bottom-1 h-[2px] w-0 group-hover:w-full bg-[#de1448] transition-all duration-300"></span>
          </div>
        </nav>

        <a
          href="/#contact-us"
          className="hidden md:inline-block bg-[#de1448] text-white px-6 py-2.5 rounded-lg hover:bg-red-700 transition-colors text-lg font-semibold"
        >
          Contact us
        </a>

        {/* Mobile menu button */}
        <button
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((s) => !s)}
          className={`md:hidden ml-4 p-2 rounded-md transition-colors ${
            isScrolled ? "text-black" : "text-white"
          }`}
        >
          {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </Container>

      {/* Mobile menu overlay */}
      <div
        className={`fixed inset-0 z-50 md:hidden pointer-events-auto transition-transform duration-300 ease-in-out ${
          menuOpen ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
        }`}
        aria-hidden={!menuOpen}
      >
        <div
          className="absolute inset-0 bg-black/30"
          onClick={() => setMenuOpen(false)}
        />
        <nav className="relative bg-white text-black w-full max-w-md h-full shadow-xl overflow-auto">
          <div className="flex items-center justify-between px-6 py-4 border-b">
            <Link href="/" onClick={handleNavigate}>
              <Image
                src="/assets/logo.svg"
                alt="Polygen Logo"
                width={140}
                height={36}
              />
            </Link>
            <button
              aria-label="Close menu"
              onClick={() => setMenuOpen(false)}
              className="p-2 rounded-md"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <ul className="flex flex-col gap-1 p-6">
            <li>
              <Link
                href="/"
                onClick={handleNavigate}
                className="block py-3 text-lg font-semibold hover:text-[#de1448]"
              >
                Home
              </Link>
            </li>
            <li>
              <a
                href="/#about"
                onClick={handleNavigate}
                className="block py-3 text-lg font-semibold hover:text-[#de1448] w-full text-left"
              >
                About Us
              </a>
            </li>

            {/* Products - accordion with categories loaded dynamically */}
            <li>
              <button
                onClick={() => setCatsOpen((s) => !s)}
                className="w-full flex items-center justify-between py-3 text-lg font-semibold hover:text-[#de1448]"
                aria-expanded={catsOpen}
              >
                <span>Products</span>
                <ChevronDown
                  className={`ml-2 h-5 w-5 transition-transform ${
                    catsOpen ? "rotate-180" : "rotate-0"
                  }`}
                />
              </button>

              <div
                className={`overflow-hidden transition-max-h duration-300 ${
                  catsOpen ? "h-fit" : "max-h-0"
                }`}
              >
                <div className="pt-2">
                  {categories.length === 0 ? (
                    <div className="text-sm text-gray-500 px-2">
                      No categories available
                    </div>
                  ) : (
                    categories.map((cat) => (
                      <div key={cat.name}>{renderCategoryTree(cat, 0)}</div>
                    ))
                  )}
                </div>
              </div>
            </li>

            <li>
              <a
                href="/#blogs"
                onClick={handleNavigate}
                className="block py-3 text-lg font-semibold hover:text-[#de1448] w-full text-left"
              >
                Blogs
              </a>
            </li>

            <li>
              <a
                href="/#contact-us"
                onClick={handleNavigate}
                className="block text-lg font-semibold text-white bg-[#de1448] px-4 py-3 rounded-lg mt-4 w-full text-center"
              >
                Contact us
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
