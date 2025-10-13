import { ProductType } from "@/types/product";

const JSON_HEADERS = { "Content-Type": "application/json" };

export async function fetchProducts(): Promise<ProductType[]> {
  const res = await fetch("/api/products", { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch products");
  return res.json();
}

export async function createProduct(payload: Partial<ProductType>) {
  const res = await fetch("/api/products", {
    method: "POST",
    headers: JSON_HEADERS,
    body: JSON.stringify(payload),
    credentials: "same-origin",
  });
  if (!res.ok) throw new Error("Create failed");
  return res.json();
}

export async function updateProduct(
  slug: string,
  payload: Partial<ProductType>
) {
  const res = await fetch(`/api/products/${encodeURIComponent(slug)}`, {
    method: "PUT",
    headers: JSON_HEADERS,
    body: JSON.stringify(payload),
    credentials: "same-origin",
  });
  if (!res.ok) throw new Error("Update failed");
  return res.json();
}

export async function deleteProduct(slug: string) {
  const res = await fetch(`/api/products/${encodeURIComponent(slug)}`, {
    method: "DELETE",
    credentials: "same-origin",
  });
  if (!res.ok) throw new Error("Delete failed");
  return res.json();
}


export async function bulkDeleteProducts(slugs: string[]) {
  const res = await fetch("/api/products/bulk-delete", {
    method: "POST",
    headers: JSON_HEADERS,
    body: JSON.stringify({ slugs }),
    credentials: "same-origin",
  });

  if (res.ok) return res.json();

  for (const s of slugs) {
    await deleteProduct(s);
  }
  return { ok: true };
}
