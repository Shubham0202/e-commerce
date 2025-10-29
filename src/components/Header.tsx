"use client";

import React, { useState, FormEvent } from "react";
import { Search, ShoppingCart, User } from "lucide-react";
import Link from "next/link";

export default function Header() {
  const [query, setQuery] = useState<string>("");


  return (
    <header className="sticky top-0 z-50 bg-blue-600 text-white shadow-md">
      <div className="flex items-center justify-between px-4 py-3 md:px-8">
        {/* Logo */}
        <div className="flex items-center gap-2 cursor-pointer">
          <img
            src="/logo.png"
            alt="E-Commerce"
            className="h-8 w-8 object-contain"
          />
        </div>



        {/* Right-side icons */}
        <div className="flex items-center gap-5">
          <Link href='/login' className="flex items-center gap-1 hover:text-yellow-300 transition">
            <User className="w-5 h-5" />
            <span className="hidden md:inline">Login</span>
          </Link>

          <Link href="/cart" className="flex items-center gap-1 hover:text-yellow-300 transition">
            <ShoppingCart className="w-5 h-5" />
            <span className="hidden md:inline">Cart</span>
          </Link>
        </div>
      </div>

      
    </header>
  );
}
