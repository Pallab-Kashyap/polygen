"use client";

import { useEffect, useState } from "react";
import ProductList from "./ProductList";
import ProductForm from "./ProductForm";
import { ProductType } from "@/types/product";
import {
  fetchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  bulkDeleteProducts,
} from "@/lib/adminApi";

export default function AdminDashboard() {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [showForm, setShowForm] = useState(false);
  const [editProduct, setEditProduct] = useState<ProductType | null>(null);
  const [query, setQuery] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const data = await fetchProducts();
      setProducts(data);
    } catch (err) {
      console.error(err);
      alert("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  // bulk delete handler
  const handleBulkDelete = async () => {
    const slugs = Object.keys(selected).filter((s) => selected[s]);
    if (slugs.length === 0) return alert("No items selected");
    if (!confirm(`Delete ${slugs.length} products? This cannot be undone.`))
      return;
    try {
      await bulkDeleteProducts(slugs);
      // remove locally
      setProducts((prev) => prev.filter((p) => !slugs.includes(p.slug)));
      setSelected({});
    } catch (err) {
      console.error(err);
      alert("Bulk delete failed");
    }
  };

  const handleDeleteOne = async (slug: string) => {
    if (!confirm("Delete this product?")) return;
    try {
      await deleteProduct(slug);
      setProducts((prev) => prev.filter((p) => p.slug !== slug));
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  const handleQuickUpdate = async (
    slug: string,
    payload: Partial<ProductType>
  ) => {
    try {
      const updated = await updateProduct(slug, payload);
      setProducts((prev) => prev.map((p) => (p.slug === slug ? updated : p)));
    } catch (err) {
      console.error(err);
      alert("Update failed");
    }
  };

  const handleAdd = async (form: Partial<ProductType>) => {
    try {
      const created = await createProduct(form);
      setProducts((prev) => [created, ...prev]);
      setShowForm(false);
    } catch (err) {
      console.error(err);
      alert("Create failed");
    }
  };

  const filtered = products.filter((p) => {
    if (!query) return true;
    return (
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.slug.toLowerCase().includes(query.toLowerCase())
    );
  });

  return (
    <div className="min-h-screen p-6 bg-gray-50 text-black mt-20">
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Admin — Products</h1>
        <div className="flex items-center gap-3">
          <input
            placeholder="Search by name or slug"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="px-3 py-2 border rounded w-64"
          />
          <button
            onClick={() => {
              setEditProduct(null);
              setShowForm(true);
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            + Add Product
          </button>
          <button
            onClick={handleBulkDelete}
            className="bg-red-600 text-white px-4 py-2 rounded"
          >
            Delete Selected
          </button>
        </div>
      </header>

      <main>
        {loading ? (
          <div className="text-center py-20">Loading…</div>
        ) : (
          <ProductList
            products={filtered}
            selected={selected}
            setSelected={setSelected}
            onDelete={handleDeleteOne}
            onQuickEdit={(p) => {
              setEditProduct(p);
              setShowForm(true);
            }}
            onQuickUpdate={handleQuickUpdate}
          />
        )}
      </main>

      {showForm && (
        <ProductForm
          initial={editProduct ?? undefined}
          onClose={() => setShowForm(false)}
          onSave={async (payload) => {
            if (editProduct) {
              await handleQuickUpdate(editProduct.slug, payload);
              setShowForm(false);
            } else {
              await handleAdd(payload);
            }
          }}
        />
      )}
    </div>
  );
}
