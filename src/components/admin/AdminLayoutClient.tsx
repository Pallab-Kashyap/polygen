"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
        <aside className="w-64 bg-white p-4 border-r border-gray-200 flex-shrink-0">
          <h2 className="text-2xl font-bold text-blue-700 mb-8 px-2">
            Admin Panel
          </h2>
          <nav className="space-y-2">
            <NavLink href="/admin/products" label="Products" />
            <NavLink href="/admin/categories" label="Categories" />
          </nav>
        </aside>

        <main className="flex-1 p-6 md:p-10 overflow-y-auto">{children}</main>

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
