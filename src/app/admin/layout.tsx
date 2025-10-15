"use client";
import React from "react";
import AdminLayoutClient from "@/components/admin/AdminLayoutClient";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <style jsx global>{`
        header {
          display: none !important;
        }
      `}</style>
      <AdminLayoutClient>{children}</AdminLayoutClient>
    </>
  );
}
