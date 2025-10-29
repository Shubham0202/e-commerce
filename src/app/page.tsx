"use client";
import { useState } from "react";
import Header from "@/components/Header";;
import productsData from "@/data/products.json";
import ProductCard from "@/components/ProductCard";
import SearchBar from "@/components/SearchBar";

export default function Home() {
  const [query, setQuery] = useState("");

  const filteredProducts = productsData.filter((p) =>
    p.name.toLowerCase().includes(query.toLowerCase()) ||
    p.category.toLowerCase().includes(query.toLowerCase())
  );

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
              filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
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
