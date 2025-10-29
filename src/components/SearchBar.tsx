"use client";

import { Search } from "lucide-react";
import React, { useState } from "react";

export default function SearchBar({ onSearch }: { onSearch: (query: string) => void }) {
  const [query, setQuery] = useState("");

  return (
    <div className="flex items-center justify-center mt-4">
      <div className="flex w-full max-w-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg overflow-hidden">
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            onSearch(e.target.value);
          }}
          placeholder="Search products..."
          className="flex-1 px-4 py-2 text-gray-700 dark:text-gray-200 outline-none bg-transparent"
        />
        <div className="px-3 py-2 bg-yellow-400 text-gray-900 flex items-center">
          <Search size={18} />
        </div>
      </div>
    </div>
  );
}
