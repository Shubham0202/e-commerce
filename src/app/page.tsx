"use client";
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import ProductCard from "@/components/ProductCard";
import SearchBar from "@/components/SearchBar";

type Product = {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  category: string;
  inventory: number;
  lastUpdated: string;
};

export default function Home() {
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Load products from API on client side
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const res = await fetch("/api/products");
        if (res.ok) {
          const productsData = await res.json();
          setProducts(productsData);
        }
      } catch (error) {
        console.error("Error loading products:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadProducts();
  }, []);

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(query.toLowerCase()) ||
    p.category.toLowerCase().includes(query.toLowerCase())
  );

  if (loading) {
    return (
      <>
        <Header />
        <main className="bg-gray-50 dark:bg-gray-900 min-h-screen pb-10">
          <div className="max-w-5xl mx-auto pt-24 px-4">
            <div className="text-center">
              <p className="text-gray-500">Loading products...</p>
            </div>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Header />

      <main className="bg-gray-50 dark:bg-gray-900 min-h-screen pb-10">
        {/* SearchBar for Home */}
        <SearchBar onSearch={(q) => setQuery(q)} />

        <section className="max-w-5xl mx-auto py-8">
          <h2 className="text-2xl font-bold mb-4">Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product,i) => (
                <ProductCard key={product.id+i} product={product} />
              ))
            ) : (
              <p className="text-gray-500 dark:text-gray-300">No products found.</p>
            )}
          </div>
        </section>
      </main>
    </>
  );
}