import React from 'react';

interface Category {
  name: string;
  icon: string;
}

const categories: Category[] = [
  { name: "Electronics", icon: "💻" },
  { name: "Mobiles", icon: "📱" },
  { name: "Fashion", icon: "👕" },
  { name: "Home & Kitchen", icon: "🏠" },
  { name: "Grocery", icon: "🛒" },
  { name: "Appliances", icon: "🔌" },
  { name: "Beauty", icon: "💄" },
  { name: "Toys", icon: "🧸" },
];

export default function CategoryNav() {
  return (
    <nav className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between overflow-x-auto scrollbar-hide">
        {categories.map((cat, i) => (
          <button
            key={i}
            className="flex flex-col items-center min-w-20 sm:min-w-[100px] text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-yellow-300 transition"
          >
            <span className="text-xl">{cat.icon}</span>
            <span className="mt-1">{cat.name}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}
