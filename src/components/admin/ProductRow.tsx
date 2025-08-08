// src/components/admin/ProductRow.tsx
"use client";

import { useState } from "react";
import { ProductType } from "@/types/product";

interface Props {
  product: ProductType;
  checked: boolean;
  onToggle: (v: boolean) => void;
  onDelete: () => void;
  onEdit: () => void; // open full edit form
  onQuickSave: (payload: Partial<ProductType>) => void;
}

export default function ProductRow({
  product,
  checked,
  onToggle,
  onDelete,
  onEdit,
  onQuickSave,
}: Props) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(product.name);
  const [price, setPrice] = useState(product.price ?? 0);
  const [categoryId, setCategoryId] = useState(product.categoryId);

  const save = async () => {
    setEditing(false);
    onQuickSave({ name, price: Number(price), categoryId });
  };

  return (
    <tr className="border-t">
      <td className="p-3">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onToggle(e.target.checked)}
        />
      </td>

      <td className="p-3">
        {editing ? (
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border px-2 py-1 w-64"
          />
        ) : (
          <div className="font-medium">{product.name}</div>
        )}
      </td>

      <td className="p-3 text-sm text-gray-600">{product.slug}</td>

      <td className="p-3">
        {editing ? (
          <input
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="border px-2 py-1 w-48"
          />
        ) : (
          <div className="text-sm text-gray-600">{product.categoryId}</div>
        )}
      </td>

      <td className="p-3">
        {editing ? (
          <input
            value={String(price)}
            onChange={(e) => setPrice(Number(e.target.value))}
            className="border px-2 py-1 w-24"
          />
        ) : (
          <div className="text-sm text-gray-800">{product.price ?? "-"}</div>
        )}
      </td>

      <td className="p-3 flex gap-2">
        {editing ? (
          <>
            <button
              onClick={save}
              className="bg-green-600 text-white px-3 py-1 rounded"
            >
              Save
            </button>
            <button
              onClick={() => setEditing(false)}
              className="px-3 py-1 border rounded"
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => setEditing(true)}
              className="px-3 py-1 border rounded"
            >
              Quick Edit
            </button>
            <button onClick={onEdit} className="px-3 py-1 border rounded">
              Full Edit
            </button>
            <button
              onClick={onDelete}
              className="px-3 py-1 bg-red-600 text-white rounded"
            >
              Delete
            </button>
          </>
        )}
      </td>
    </tr>
  );
}
