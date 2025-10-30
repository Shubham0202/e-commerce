// src/context/ProductsContext.tsx
"use client";

import { createContext, useContext, useState, ReactNode } from 'react';
import { ProductType } from '@/lib/products';

interface ProductsContextType {
  products: ProductType[];
  setProducts: (products: ProductType[]) => void;
  addProduct: (product: Omit<ProductType, '_id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateProduct: (slug: string, product: Partial<ProductType>) => Promise<void>;
  deleteProduct: (slug: string) => Promise<void>;
  isSyncing: boolean;
  setIsSyncing: (syncing: boolean) => void;
  refreshProducts: () => Promise<void>;
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

export function ProductsProvider({ 
  children, 
  initialProducts 
}: { 
  children: ReactNode; 
  initialProducts: ProductType[];
}) {
  const [products, setProducts] = useState<ProductType[]>(initialProducts);
  const [isSyncing, setIsSyncing] = useState(false);

  const refreshProducts = async () => {
    try {
      const response = await fetch('/api/products');
      if (response.ok) {
        const freshProducts = await response.json();
        setProducts(freshProducts);
      }
    } catch (error) {
      console.error('Failed to refresh products:', error);
      throw error;
    }
  };

  const addProduct = async (productData: Omit<ProductType, '_id' | 'createdAt' | 'updatedAt'>) => {
    setIsSyncing(true);
    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': 'secret-key' // Replace with your actual admin key
        },
        body: JSON.stringify(productData)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to add product');
      }

      const newProduct = await response.json();
      setProducts(prev => [...prev, newProduct]);
    } finally {
      setIsSyncing(false);
    }
  };

  const updateProduct = async (slug: string, productData: Partial<ProductType>) => {
    setIsSyncing(true);
    try {
      const response = await fetch(`/api/products/${slug}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': 'secret-key' // Replace with your actual admin key
        },
        body: JSON.stringify(productData)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update product');
      }

      const updatedProduct = await response.json();
      setProducts(prev => prev.map(p => p.slug === slug ? updatedProduct : p));
    } finally {
      setIsSyncing(false);
    }
  };

  const deleteProduct = async (slug: string) => {
    setIsSyncing(true);
    try {
      const response = await fetch(`/api/products/${slug}`, {
        method: 'DELETE',
        headers: {
          'x-admin-key': 'secret-key' // Replace with your actual admin key
        }
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete product');
      }

      setProducts(prev => prev.filter(p => p.slug !== slug));
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <ProductsContext.Provider value={{ 
      products, 
      setProducts, 
      addProduct, 
      updateProduct, 
      deleteProduct,
      isSyncing,
      setIsSyncing,
      refreshProducts
    }}>
      {children}
    </ProductsContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductsContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductsProvider');
  }
  return context;
}