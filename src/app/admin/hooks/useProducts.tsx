"use client";

import { useCallback, useEffect, useRef, useState } from "react";

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

export default function useProducts(initial: Product[] = []) {
  const [products, setProducts] = useState<Product[]>(initial);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const fetchProducts = useCallback(async (opts?: { showSkeleton?: boolean }) => {
    // Cancel previous
    if (abortRef.current) {
      abortRef.current.abort();
    }
    const ctrl = new AbortController();
    abortRef.current = ctrl;

    try {
      if (opts?.showSkeleton) setIsRefreshing(true);

      // ✅ Use relative path, not absolute URL
      const res = await fetch("/api/products", {
        signal: ctrl.signal,
        cache: "no-store",
      });
      
      if (!res.ok) throw new Error("Failed to load products");

      const data = await res.json();
      setProducts(data);
    } catch (err) {
      if ((err as any)?.name === "AbortError") {
        // aborted - ignore
      } else {
        console.error("fetchProducts error:", err);
      }
    } finally {
      if (opts?.showSkeleton) {
        await new Promise((r) => setTimeout(r, 400));
        setIsRefreshing(false);
      }
    }
  }, []);

  // initial hydration: we keep initial passed products; but refresh if empty
  useEffect(() => {
    if (!initial || initial.length === 0) {
      fetchProducts({ showSkeleton: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // exposed refresh method to show skeleton explicitly
  const refresh = useCallback(async () => {
    await fetchProducts({ showSkeleton: true });
  }, [fetchProducts]);

  return {
    products,
    setProducts,
    fetchProducts,
    refresh,
    isRefreshing,
  };
}