"use client";

import { Lock, ArrowRight, Trash2, Minus, Plus } from "lucide-react";
import Link from "next/link";
import useCartStore from "@/lib/cartState";
import { useEffect, useState } from "react";
import { CartItem as CartItemType } from "@/types/cart";

interface CartItemProps {
  item: CartItemType;
  onRemove: () => void;
  onUpdateQuantity: (quantity: number) => void;
}

function CartItem({ item, onRemove, onUpdateQuantity }: CartItemProps) {
  const handleQuantityChange = (qty: number) => {
    if (qty >= 1) onUpdateQuantity(qty);
  };

  const increment = () => handleQuantityChange(item.quantity + 1);
  const decrement = () => handleQuantityChange(Math.max(1, item.quantity - 1));

  return (
    <div className="flex flex-col sm:flex-row gap-4 px-6 py-5 justify-between items-start">
      <div className="flex items-start gap-4 flex-1">
        <div 
          className="bg-center bg-no-repeat aspect-square bg-cover rounded-lg size-24 shrink-0" 
          style={{ backgroundImage: `url("${item.image}")` }}
        />
        <div className="flex flex-1 flex-col justify-center gap-1">
          <p className="text-text-primary-light dark:text-text-primary-dark text-base font-semibold leading-normal">{item.name}</p>
          {item.seller && (
            <p className="text-text-secondary-light dark:text-text-secondary-dark text-sm font-normal leading-normal">Seller: {item.seller}</p>
          )}
          {item.specs && (
            <p className="text-text-secondary-light dark:text-text-secondary-dark text-sm font-normal leading-normal">{item.specs}</p>
          )}
          <p className="text-sm text-green-600 dark:text-green-400 font-medium">
            Delivery by {new Date(Date.now() + 3*24*60*60*1000).toLocaleDateString('en-US', { weekday: 'long' })}
          </p>
        </div>
      </div>
      <div className="flex flex-col items-end gap-3 w-full sm:w-auto">
        <p className="text-text-primary-light dark:text-text-primary-dark text-lg font-bold leading-normal">
          ${(item.price * item.quantity).toFixed(2)}
        </p>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-text-primary-light dark:text-text-primary-dark">
            <button 
              onClick={decrement}
              className="text-lg font-medium leading-normal flex h-8 w-8 items-center justify-center rounded-full bg-background-light dark:bg-background-dark hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer"
            >
              <Minus size={16} />
            </button>
            <input
              type="number"
              value={item.quantity}
              onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
              className="text-base font-medium leading-normal w-6 p-0 text-center bg-transparent focus:outline-0 focus:ring-0 focus:border-none border-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            />
            <button 
              onClick={increment}
              className="text-lg font-medium leading-normal flex h-8 w-8 items-center justify-center rounded-full bg-background-light dark:bg-background-dark hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer"
            >
              <Plus size={16} />
            </button>
          </div>
          <button 
            onClick={onRemove}
            className="text-text-secondary-light dark:text-text-secondary-dark hover:text-red-500 dark:hover:text-red-400"
          >
            <Trash2 size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Cart() {
  const { items, removeItem, updateQuantity, getTotal } = useCartStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-wrap gap-2 pb-6">
        <Link
          href="/"
          className="text-text-secondary-light dark:text-text-secondary-dark hover:text-text-primary-light dark:hover:text-text-primary-dark"
        >
          Home
        </Link>
        <span className="text-text-secondary-light dark:text-text-secondary-dark">/</span>
        <span className="text-text-primary-light dark:text-text-primary-dark">Cart</span>
      </div>
      
      <div className="flex flex-wrap justify-between gap-4 pb-8 items-center">
        <p className="text-text-primary-light dark:text-text-primary-dark text-4xl font-black leading-tight tracking-[-0.033em] min-w-72">
          My Cart ({items.length} items)
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 items-start">
        {/* Cart Items Section */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {items.length === 0 ? (
            <div className="text-center py-12 bg-surface-light dark:bg-surface-dark rounded-xl">
              <p className="text-xl font-medium text-gray-600 dark:text-gray-400">Your cart is empty</p>
              <Link href="/" className="text-primary hover:text-primary/90 mt-2 inline-block">
                Continue Shopping
              </Link>
            </div>
          ) : (
            <div className="flex flex-col divide-y divide-gray-200 dark:divide-gray-800 bg-surface-light dark:bg-surface-dark rounded-xl shadow-sm">
              {items.map((item) => (
                <CartItem 
                  key={item.id}
                  item={item}
                  onRemove={() => removeItem(item.id)}
                  onUpdateQuantity={(qty) => updateQuantity(item.id, qty)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Order Summary Section */}
        <div className="lg:sticky lg:top-8">
          <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-sm p-6">
            <p className="text-text-primary-light dark:text-text-primary-dark text-lg font-bold leading-normal pb-4">
              Order Summary
            </p>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-3">
                <div className="flex justify-between items-center text-text-secondary-light dark:text-text-secondary-dark">
                  <span>Subtotal ({items.length} items)</span>
                  <span className="font-medium text-text-primary-light dark:text-text-primary-dark">${getTotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-text-secondary-light dark:text-text-secondary-dark">
                  <span>Shipping Fee</span>
                  <span className="font-medium text-text-primary-light dark:text-text-primary-dark">$0.00</span>
                </div>
              </div>
              <div className="h-px bg-gray-200 dark:bg-gray-800" />
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold">Total Amount</span>
                <span className="text-2xl font-black text-primary">${getTotal().toFixed(2)}</span>
              </div>
              <button 
                className="w-full flex items-center justify-center gap-2 rounded-lg bg-primary text-white font-bold h-12 text-base hover:bg-primary/90 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={items.length === 0}
              >
                <span>Checkout</span>
                <Lock size={18} className="text-white" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}