"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import Alert from "@/components/shared/Alert";

interface Toast {
  message: string;
  type: "success" | "error";
  key: number;
}

export const ToastContext = React.createContext<{
  setToast: (toast: Omit<Toast, "key">) => void;
}>({ setToast: () => {} });

export default function AdminLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [toast, setToast] = useState<Toast>({
    message: "",
    type: "success",
    key: 0,
  });

  const handleSetToast = (toastConfig: Omit<Toast, "key">) => {
    setToast({ ...toastConfig, key: Date.now() });
  };

  const handleCloseToast = () => {
    setToast((prev) => ({ ...prev, message: "" }));
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  useEffect(() => {
    if (toast.message) {
      const timer = setTimeout(() => {
        handleCloseToast();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [toast.key]);

  const NavLink = ({ href, label }: { href: string; label: string }) => (
    <Link
      href={href}
      onClick={closeSidebar}
      className={`w-full text-left px-4 py-2.5 rounded-lg transition ${
        pathname === href
          ? "bg-blue-600 text-white shadow"
          : "text-gray-600 hover:bg-gray-200"
      }`}
    >
      {label}
    </Link>
  );

  return (
    <ToastContext.Provider value={{ setToast: handleSetToast }}>
      <div className="flex h-screen bg-gray-100 font-sans mt-20">
        {/* Mobile Menu Button */}
        <button
          onClick={toggleSidebar}
          className="fixed top-24 left-4 z-50 md:hidden bg-blue-600 text-white p-2 rounded-lg shadow-lg hover:bg-blue-700 transition"
        >
          {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        {/* Overlay for mobile */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
            onClick={closeSidebar}
          />
        )}

        {/* Sidebar */}
        <aside
          className={`
            fixed md:relative md:translate-x-0
            w-64 bg-white p-4 border-r border-gray-200 flex-shrink-0
            h-full z-40 transition-transform duration-300 ease-in-out
            ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
            md:block
          `}
        >
          <h2 className="text-2xl font-bold text-blue-700 mb-8 px-2">
            Admin Panel
          </h2>
          <nav className="space-y-2 flex flex-col">
            <NavLink href="/admin/products" label="Products" />
            <NavLink href="/admin/categories" label="Categories" />
          </nav>
        </aside>

        <main className="flex-1 p-3 sm:p-6 md:p-10 overflow-y-auto ml-0 md:ml-0">
          {children}
        </main>

        <div className="fixed top-5 right-5 z-50 w-full max-w-sm">
          <Alert
            message={toast.message}
            type={toast.type}
            onClose={handleCloseToast}
          />
        </div>
      </div>
    </ToastContext.Provider>
  );
}
