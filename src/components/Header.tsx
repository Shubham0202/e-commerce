"use client";

import React, { useState, FormEvent } from "react";
import { Search, ShoppingCart, User } from "lucide-react";
import Link from "next/link";

export default function Header() {
  const [query, setQuery] = useState<string>("");

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Replace with app-specific search/navigation logic
    // Keeping alert for parity with original implementation
    // In production, use router.push or a search context
    alert(`Searching for: ${query}`);
  };

  return (
    <header className="sticky top-0 z-50 bg-blue-600 text-white shadow-md">
      <div className="flex items-center justify-between px-4 py-3 md:px-8">
        {/* Logo */}
        <div className="flex items-center gap-2 cursor-pointer">
          <img
            src="/logo.png"
            alt="Flipkart Clone"
            className="h-8 w-8 object-contain"
          />
          <span className="text-xl font-semibold">Flipkart Clone</span>
        </div>

        {/* Search Bar */}
        <form
          onSubmit={handleSearch}
          className="hidden md:flex items-center bg-white rounded-lg overflow-hidden w-1/2"
        >
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for products, brands and more"
            className="w-full px-4 py-2 text-gray-800 outline-none"
          />
          <button
            type="submit"
            className="bg-yellow-400 text-gray-800 px-3 py-2 hover:bg-yellow-500 transition"
          >
            <Search />
          </button>
        </form>

        {/* Right-side icons */}
        <div className="flex items-center gap-5">
          <button className="flex items-center gap-1 hover:text-yellow-300 transition">
            <User className="w-5 h-5" />
            <span className="hidden md:inline">Login</span>
          </button>

          <Link href="/cart" className="flex items-center gap-1 hover:text-yellow-300 transition">
            <ShoppingCart className="w-5 h-5" />
            <span className="hidden md:inline">Cart</span>
          </Link>
        </div>
      </div>

      {/* Mobile Search */}
      <div className="md:hidden px-4 pb-3">
        <form
          onSubmit={handleSearch}
          className="flex items-center bg-white rounded-lg overflow-hidden"
        >
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for products"
            className="w-full px-4 py-2 text-gray-800 outline-none"
          />
          <button
            type="submit"
            className="bg-yellow-400 text-gray-800 px-3 py-2 hover:bg-yellow-500 transition"
          >
            <Search />
          </button>
        </form>
      </div>
    </header>
  );
}
