// src/components/admin/ProductForm.tsx
"use client";

import { useEffect, useState } from "react";
import { ProductType } from "@/types/product";

interface Props {
  initial?: ProductType;
  onClose: () => void;
  onSave: (payload: Partial<ProductType>) => Promise<void> | void;
}

export default function ProductForm({ initial, onClose, onSave }: Props) {
  const [name, setName] = useState(initial?.name ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [categoryId, setCategoryId] = useState(initial?.categoryId ?? "");
  const [price, setPrice] = useState(initial?.price ?? 0);
  const [about, setAbout] = useState(initial?.about ?? "");

  useEffect(() => {
    if (!slug && name) {
      setSlug(
        name
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^a-z0-9-_]/g, "")
      );
    }
  }, [name]);

  const submit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    await onSave({ name, slug, categoryId, price, about });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start md:items-center justify-center p-6 bg-black bg-opacity-40">
      <form
        onSubmit={submit}
        className="bg-white w-full max-w-2xl p-6 rounded shadow-lg"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">
            {initial ? "Edit Product" : "Add Product"}
          </h2>
          <button type="button" onClick={onClose} className="text-gray-500">
            Close
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
            className="border p-2"
          />
          <input
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="Slug (unique)"
            className="border p-2"
          />
          <input
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            placeholder="CategoryId or slug"
            className="border p-2"
          />
          <input
            value={String(price)}
            onChange={(e) => setPrice(Number(e.target.value))}
            placeholder="Price"
            type="number"
            className="border p-2"
          />
          <textarea
            value={about}
            onChange={(e) => setAbout(e.target.value)}
            placeholder="Short about text"
            className="border p-2 md:col-span-2"
          />
        </div>

        <div className="mt-4 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border rounded"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            {initial ? "Save" : "Create"}
          </button>
        </div>
      </form>
    </div>
  );
}
