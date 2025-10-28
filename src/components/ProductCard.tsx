"use client";
import React from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import useCartStore from "@/lib/cartState";

interface Product {
  id?: string;
  name: string;
  price: number;
  image?: string;
  category?: string;
  description?: string;
  inventory?: number;
  slug?: string;
}

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  const addItem = useCartStore((s) => s.addItem);

  const safeSlug = (product.slug || product.name || "")
    .toString()
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-_]/g, "");

  return (
    <Link href={`/products/${encodeURIComponent(safeSlug)}`} className="block">
      <div
        className="group relative flex flex-col border rounded-xl bg-white dark:bg-gray-800 shadow-lg overflow-hidden transition-transform hover:-translate-y-1 hover:shadow-2xl"
      >
        <div className="bg-gray-100 dark:bg-gray-700 flex items-center justify-center h-40 mb-4">
          <img
            src={product.image || 'https://via.placeholder.com/120x120?text=Product'}
            alt={product.name}
            className="h-24 w-24 object-contain rounded-lg drop-shadow"
          />
        </div>
        <div className="px-4 pb-4 flex-1 flex flex-col">
          <h3 className="text-lg font-bold mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{product.name}</h3>
          {product.category && (
            <span className="inline-block bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs font-semibold px-2 py-1 rounded mb-2 self-start">{product.category}</span>
          )}
          <p className="text-gray-600 dark:text-gray-300 text-sm mb-2 line-clamp-2">{product.description}</p>
          <div className="flex items-center justify-between mt-auto">
            <span className="font-bold text-lg text-blue-600 dark:text-blue-400">₹{product.price.toLocaleString()}</span>
            <span className="text-xs text-gray-400">{(product.inventory || 0) > 0 ? `In stock: ${product.inventory}` : 'Out of stock'}</span>
          </div>
        </div>
        <div className="absolute top-2 right-2">
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              try {
                addItem({ id: String(product.id ?? safeSlug), name: product.name, price: product.price, image: product.image ?? '' });
                toast.success(`${product.name} added to cart`);
              } catch (err) {
                console.error("Buy button error", err);
                toast.error(`Could not add ${product.name} to cart`);
              }
            }}
            className="bg-blue-600 text-white text-xs px-3 py-1 rounded shadow hover:bg-blue-700 transition-opacity opacity-0 group-hover:opacity-100"
          >
            Buy
          </button>
        </div>
      </div>
    </Link>
  );
}
