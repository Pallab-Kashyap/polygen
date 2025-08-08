"use client";

import Link from "next/link";
import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import clsx from "clsx";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex mt-20">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white h-screen p-4">
        <nav>
          <Link
            href="/admin"
            className={clsx("block p-2", {
              "bg-gray-700": pathname === "/admin",
            })}
          >
            Dashboard
          </Link>
          <Link
            href="/admin/products"
            className={clsx("block p-2", {
              "bg-gray-700": pathname.startsWith("/admin/products"),
            })}
          >
            Products
          </Link>
          <Link
            href="/admin/categories"
            className={clsx("block p-2", {
              "bg-gray-700": pathname.startsWith("/admin/categories"),
            })}
          >
            Categories
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
