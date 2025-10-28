"use client";

import dynamic from 'next/dynamic';
import { ComponentType } from 'react';

const CartContent = dynamic(() => import('@/components/Cart'), {
  ssr: false,
  loading: () => (
    <div className="container mx-auto px-4 py-8">
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-48 mb-8"></div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-gray-200 h-48 rounded-xl mb-4"></div>
            <div className="bg-gray-200 h-48 rounded-xl"></div>
          </div>
          <div className="bg-gray-200 h-96 rounded-xl"></div>
        </div>
      </div>
    </div>
  )
}) as ComponentType;

export default function CartClient() {
  return <CartContent />;
}