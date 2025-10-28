"use client";
import React, { useState } from "react";
import { Star, StarHalf, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { toast } from "react-toastify";
import useCartStore from "@/lib/cartState";

interface Specs {
  [key: string]: string;
}

interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  image?: string;
  inventory?: number;
  seller?: string;
  specs?: Specs;
  related?: Array<{
    name: string;
    price: number;
    image?: string;
    tagline?: string;
  }>;
}

interface ProductBuyProps {
  product: Product;
}

export default function ProductBuy({ product }: ProductBuyProps) {
  const [qty, setQty] = useState(1);
  const { addItem } = useCartStore();

  const inc = () => setQty((q) => Math.min(q + 1, product.inventory || 99));
  const dec = () => setQty((q) => Math.max(1, q - 1));

  const addToCart = () => {
    const itemToAdd = {
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image || 'https://via.placeholder.com/400x300',
      seller: product.seller || "Default Seller",
      specs: typeof product.specs === 'object' 
        ? Object.entries(product.specs)
            .map(([key, value]) => `${key}: ${value}`)
            .join(", ")
        : undefined,
      quantity: qty
    };
    
    addItem(itemToAdd);
    toast.success(`${product.name} (x${qty}) added to cart`);
    setQty(1); // Reset quantity after adding to cart
  };

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col group/design-root overflow-x-hidden">
      <div className="layout-container flex h-full grow flex-col">
        <div className="px-4 md:px-10 lg:px-20 xl:px-40 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col max-w-7xl flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex flex-col gap-4">
                <div
                  className="w-full bg-center bg-no-repeat bg-cover flex flex-col justify-end overflow-hidden rounded-xl min-h-[400px] bg-gray-100 dark:bg-gray-800"
                  style={{ backgroundImage: `url(${product.image || 'https://via.placeholder.com/900x600?text=Product'})` }}
                  aria-hidden
                />

                <div className="grid grid-cols-4 gap-4">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div
                      key={i}
                      className="w-full h-24 bg-center bg-no-repeat bg-cover rounded-lg bg-gray-100 dark:bg-gray-800"
                      style={{ backgroundImage: `url(${product.image || 'https://via.placeholder.com/300x200?text=Thumb'})` }}
                    />
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-6 p-4">
                <div className="flex flex-col gap-3">
                  <p className="text-gray-900 dark:text-white text-4xl font-black leading-tight tracking-[-0.033em]">{product.name}</p>
                  <p className="text-gray-600 dark:text-gray-300 text-base font-normal leading-normal">{product.description}</p>
                </div>

                <h1 className="text-gray-900 dark:text-white tracking-light text-[32px] font-bold leading-tight">₹{product.price.toLocaleString()}</h1>

                <div className="border-y border-gray-200 dark:border-gray-700 py-4 flex flex-col gap-4">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary">local_shipping</span>
                    <h3 className="text-base font-semibold text-gray-900 dark:text-white">Delivery</h3>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Get it by Mon, 28th</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Standard Delivery</p>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-green-600 dark:text-green-400">Free Shipping</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">on orders over ₹500</p>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Get it by Sat, 26th</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Express Delivery</p>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">₹100</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Shipping cost</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 bg-transparent min-h-14 justify-between">
                  <div className="flex items-center gap-4">
                    <div className="text-gray-900 dark:text-white flex items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-700 shrink-0 size-10">
                      <ShoppingCart size={22} strokeWidth={2.2} />
                    </div>
                    <p className="text-gray-900 dark:text-white text-base font-medium leading-normal flex-1 truncate">Quantity</p>
                  </div>
                  <div className="shrink-0">
                    <div className="flex items-center gap-2 text-gray-900 dark:text-white">
                      <button onClick={dec} className="text-base font-medium leading-normal flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700">-</button>
                      <input
                        className="text-base font-medium leading-normal w-12 p-0 text-center bg-transparent focus:outline-none focus:ring-0 border-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                        type="number"
                        value={qty}
                        min={1}
                        max={product.inventory || 99}
                        onChange={(e) => {
                          const value = parseInt(e.target.value);
                          if (!isNaN(value)) {
                            setQty(Math.max(1, Math.min(product.inventory || 99, value)));
                          }
                        }}
                        onBlur={() => {
                          if (isNaN(qty) || qty < 1) {
                            setQty(1);
                          }
                        }}
                      />
                      <button onClick={inc} className="text-base font-medium leading-normal flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700">+</button>
                    </div>
                  </div>
                </div>

                <div className="flex justify-center">
                  <button onClick={addToCart} className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-14 px-5 flex-1 bg-blue-600 text-white text-lg font-bold leading-normal tracking-[0.015em] gap-2 transition-colors duration-200 hover:bg-blue-700 hover:text-yellow-300">
                    <ShoppingCart size={20} strokeWidth={2.2} />
                    <span className="truncate">Add to Cart</span>
                  </button>
                </div>
              </div>

              <div className="mt-8 md:mt-12 col-span-1 md:col-span-2">
                <div className="p-6 rounded-xl shadow-sm" style={{ backgroundColor: 'var(--background)', color: 'var(--foreground)' }}>
                  <h2 className="text-2xl font-bold leading-tight mb-6">Product Specifications</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                    {product.specs ? (
                      Object.entries(product.specs).map(([k, v]) => (
                        <div key={k} className="flex justify-between border-b border-gray-200 dark:border-gray-700 py-2">
                          <span className="font-medium">{k}</span>
                          <span>{v}</span>
                        </div>
                      ))
                    ) : (
                      <>
                        <div className="flex justify-between border-b border-gray-200 dark:border-gray-700 py-2">
                          <span className="font-medium">Display</span>
                          <span>6.7-inch Super Retina XDR display</span>
                        </div>
                        <div className="flex justify-between border-b border-gray-200 dark:border-gray-700 py-2">
                          <span className="font-medium">Processor</span>
                          <span>A16 Bionic chip</span>
                        </div>
                        <div className="flex justify-between border-b border-gray-200 dark:border-gray-700 py-2">
                          <span className="font-medium">RAM</span>
                          <span>8GB</span>
                        </div>
                        <div className="flex justify-between border-b border-gray-200 dark:border-gray-700 py-2">
                          <span className="font-medium">Storage</span>
                          <span>256GB</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-12 col-span-1 md:col-span-2">
                <h2 className="text-gray-900 dark:text-white text-2xl font-bold leading-tight px-4 pb-4">Customer Reviews</h2>
                <div className="p-6 rounded-xl shadow-sm" style={{ backgroundColor: 'var(--background)', color: 'var(--foreground)' }}>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center text-yellow-500">
                      <Star size={20} fill="#eab308" stroke="#eab308" />
                      <Star size={20} fill="#eab308" stroke="#eab308" />
                      <Star size={20} fill="#eab308" stroke="#eab308" />
                      <Star size={20} fill="#eab308" stroke="#eab308" />
                      <StarHalf size={20} fill="#eab308" stroke="#eab308" />
                    </div>
                    <p className="text-gray-900 dark:text-gray-300 font-semibold">4.5 out of 5</p>
                    <p className="text-gray-600 dark:text-gray-400">based on 1,234 reviews</p>
                  </div>
                  <div className="space-y-6">
                    <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                      <div className="flex items-center mb-2">
                        <p className="font-bold text-gray-900 dark:text-white">Alex Johnson</p>
                        <div className="flex items-center text-yellow-500 ml-auto">
                          <Star size={16} fill="#eab308" stroke="#eab308" />
                          <Star size={16} fill="#eab308" stroke="#eab308" />
                          <Star size={16} fill="#eab308" stroke="#eab308" />
                          <Star size={16} fill="#eab308" stroke="#eab308" />
                          <Star size={16} fill="#eab308" stroke="#eab308" />
                        </div>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300">"Absolutely love this phone! The camera is phenomenal, and it's incredibly fast. Best purchase I've made all year."</p>
                    </div>
                    <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                      <div className="flex items-center mb-2">
                        <p className="font-bold text-gray-900 dark:text-white">Maria Garcia</p>
                        <div className="flex items-center text-yellow-500 ml-auto">
                          <Star size={16} fill="#eab308" stroke="#eab308" />
                          <Star size={16} fill="#eab308" stroke="#eab308" />
                          <Star size={16} fill="#eab308" stroke="#eab308" />
                          <Star size={16} fill="#eab308" stroke="#eab308" />
                          <Star size={16} fill="#d1d5db" stroke="#d1d5db" />
                        </div>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300">"Great phone for the price. The battery life could be a little better, but it's not a dealbreaker. The screen is gorgeous."</p>
                    </div>
                    <div>
                      <div className="flex items-center mb-2">
                        <p className="font-bold text-gray-900 dark:text-white">David Chen</p>
                        <div className="flex items-center text-yellow-500 ml-auto">
                          <Star size={16} fill="#eab308" stroke="#eab308" />
                          <Star size={16} fill="#eab308" stroke="#eab308" />
                          <Star size={16} fill="#eab308" stroke="#eab308" />
                          <Star size={16} fill="#eab308" stroke="#eab308" />
                          <StarHalf size={16} fill="#eab308" stroke="#eab308" />
                        </div>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300">"Performance is top-notch. I can run all my favorite games without any lag. Highly recommended for gamers."</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-12 col-span-1 md:col-span-2">
                <h2 className="text-gray-900 dark:text-white text-2xl font-bold leading-tight px-4 pb-4">Related Products</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {(product.related || []).map((r, idx) => (
                    <div key={idx} className="flex flex-col rounded-xl overflow-hidden shadow-sm" style={{ backgroundColor: 'var(--background)', color: 'var(--foreground)' }}>
                      <div className="h-48 bg-center bg-cover" style={{ backgroundImage: `url(${r.image || 'https://via.placeholder.com/400x300'})` }} />
                      <div className="p-4 flex flex-col flex-1">
                        <h3 className="font-bold">{r.name}</h3>
                        <p className="text-sm mt-1">{r.tagline || ''}</p>
                        <p className="font-bold mt-auto pt-2">₹{r.price}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}