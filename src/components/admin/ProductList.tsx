// src/components/admin/ProductList.tsx
"use client";

import React from "react";
import { ProductType } from "@/types/product";
import ProductRow from "./ProductRow";

interface Props {
  products: ProductType[];
  selected: Record<string, boolean>;
  setSelected: (s: Record<string, boolean>) => void;
  onDelete: (slug: string) => void;
  onQuickEdit: (p: ProductType) => void;
  onQuickUpdate: (slug: string, payload: Partial<ProductType>) => void;
}

export default function ProductList({
  products,
  selected,
  setSelected,
  onDelete,
  onQuickEdit,
  onQuickUpdate,
}: Props) {
  const toggleAll = (v: boolean) => {
    const next: Record<string, boolean> = {};
    products.forEach((p) => {
      next[p.slug] = v;
    });
    setSelected(next);
  };

  return (
    <div className="bg-white rounded shadow overflow-x-auto">
      <table className="min-w-full">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3 w-12 text-left">
              <input
                type="checkbox"
                onChange={(e) => toggleAll(e.target.checked)}
                checked={
                  products.length > 0 && products.every((p) => selected[p.slug])
                }
              />
            </th>
            <th className="p-3 text-left">Name</th>
            <th className="p-3 text-left">Slug</th>
            <th className="p-3 text-left">Category</th>
            <th className="p-3 text-left">Price</th>
            <th className="p-3 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <ProductRow
              key={p.slug}
              product={p}
              checked={!!selected[p.slug]}
              onToggle={(checked) =>
                setSelected({ ...selected, [p.slug]: checked })
              }
              onDelete={() => onDelete(p.slug)}
              onEdit={() => onQuickEdit(p)}
              onQuickSave={(payload) => onQuickUpdate(p.slug, payload)}
            />
          ))}
          {products.length === 0 && (
            <tr>
              <td colSpan={6} className="p-6 text-center text-gray-500">
                No products
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
