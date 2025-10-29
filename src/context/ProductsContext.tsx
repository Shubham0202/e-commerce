// src/context/ProductsContext.tsx
"use client";

import React, { createContext, useContext, useState } from "react";

export type Product = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  price?: number;
  category?: string;
  inventory?: number;
  lastUpdated?: string;
};

type ProductsContextType = {
  products: Product[];
  isSyncing: boolean; // any optimistic/background sync in progress
  refresh: () => Promise<void>;
  optimisticAdd: (p: Partial<Product>) => Promise<void>;
  optimisticUpdate: (id: string, updates: Partial<Product>) => Promise<void>;
  optimisticDelete: (id: string) => Promise<void>;
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
};

const ProductsContext = createContext<ProductsContextType | null>(null);

export function ProductsProvider({ children, initialProducts }: { children: React.ReactNode; initialProducts?: Product[] }) {
  const [products, setProducts] = useState<Product[]>(initialProducts || []);
  const [isSyncing, setIsSyncing] = useState(false);

  async function refresh() {
    setIsSyncing(true);
    try {
      const res = await fetch("/api/products", { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to refresh");
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error("refresh error", err);
    } finally {
      setIsSyncing(false);
    }
  }

  // Optimistic add
  async function optimisticAdd(payload: Partial<Product>) {
    // basic slug guard
    const slug = (payload.slug || "").trim();
    if (!slug) throw new Error("Slug required");

    const exists = products.find((p) => p.slug === slug);
    if (exists) throw new Error("Slug already exists");

    // create a temporary product with a client id
    const tempId = crypto?.randomUUID?.() ?? `temp-${Date.now()}`;
    const tempProduct: Product = {
      id: tempId,
      name: payload.name || "Untitled",
      slug,
      description: payload.description || "",
      price: payload.price ?? 0,
      category: payload.category || "",
      inventory: payload.inventory ?? 0,
      lastUpdated: new Date().toISOString(),
    };

    const previous = products;
    setProducts((p) => [...p, tempProduct]);
    setIsSyncing(true);

    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-admin-key": process.env.NEXT_PUBLIC_ADMIN_KEY || "secret-key" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error || "Create failed");
      }
      const created: Product = await res.json();

      // Replace temp item with server item (match by tempId)
      setProducts((list) => list.map((it) => (it.id === tempId ? created : it)));
    } catch (err) {
      console.error("optimisticAdd failed", err);
      setProducts(previous); // rollback
      throw err;
    } finally {
      setIsSyncing(false);
    }
  }

  // Optimistic update
  async function optimisticUpdate(id: string, updates: Partial<Product>) {
    const previous = products;
    const idx = products.findIndex((p) => p.id === id);
    if (idx === -1) throw new Error("Not found");

    // If slug is changing ensure uniqueness (excluding current product)
    if (updates.slug) {
      const newSlug = updates.slug.trim();
      const conflict = products.find((p) => p.slug === newSlug && p.id !== id);
      if (conflict) throw new Error("Slug already exists");
    }

    const updatedLocal = { ...products[idx], ...updates, lastUpdated: new Date().toISOString() };
    setProducts((list) => list.map((p) => (p.id === id ? updatedLocal : p)));

    setIsSyncing(true);
    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", "x-admin-key": process.env.NEXT_PUBLIC_ADMIN_KEY || "secret-key" },
        body: JSON.stringify(updates),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error || "Update failed");
      }
      const serverProduct: Product = await res.json();

      // replace with server canonical
      setProducts((list) => list.map((p) => (p.id === id ? serverProduct : p)));
    } catch (err) {
      console.error("optimisticUpdate failed", err);
      setProducts(previous); // rollback
      throw err;
    } finally {
      setIsSyncing(false);
    }
  }

  // Optimistic delete
  async function optimisticDelete(id: string) {
    const previous = products;
    const exists = products.find((p) => p.id === id);
    if (!exists) throw new Error("Not found");

    // immediate remove
    setProducts((list) => list.filter((p) => p.id !== id));
    setIsSyncing(true);

    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: "DELETE",
        headers: { "x-admin-key": process.env.NEXT_PUBLIC_ADMIN_KEY || "secret-key" },
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error || "Delete failed");
      }
      // Server returns success — nothing else to do
    } catch (err) {
      console.error("optimisticDelete failed", err);
      setProducts(previous); // rollback
      throw err;
    } finally {
      setIsSyncing(false);
    }
  }

  return (
    <ProductsContext.Provider value={{ products, isSyncing, refresh, optimisticAdd, optimisticUpdate, optimisticDelete, setProducts } as any}>
      {children}
    </ProductsContext.Provider>
  );
}

export function useProducts() {
  const ctx = useContext(ProductsContext);
  if (!ctx) throw new Error("useProducts must be used inside <ProductsProvider>");
  return ctx;
}
