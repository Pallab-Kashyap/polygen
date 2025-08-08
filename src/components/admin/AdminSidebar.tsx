"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
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
  );
}
