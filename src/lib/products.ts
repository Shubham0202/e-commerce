// src/lib/products.ts
export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  category: string;
  inventory: number;
  lastUpdated: string;
}

export async function readProducts(): Promise<Product[]> {
  if (typeof window === 'undefined') {
    // Server-side: fetch from public directory
    const baseUrl = process.env.NODE_ENV === 'production' 
      ? process.env.NEXT_PUBLIC_BASE_URL 
      : 'http://localhost:3000';
    
    const res = await fetch(`${baseUrl}/data/products.json`, {
      cache: 'no-store'
    });
    return res.json();
  } else {
    // Client-side: fetch from public directory
    const res = await fetch('/data/products.json');
    return res.json();
  }
}

// Mock function for API routes (does nothing in production)
export async function writeProducts(products: Product[]): Promise<void> {
  if (process.env.NODE_ENV === 'development') {
    // Only works in development
    const fs = await import('fs/promises');
    const path = await import('path');
    const PRODUCTS_PATH = path.join(process.cwd(), "src", "data", "products.json");
    await fs.writeFile(PRODUCTS_PATH, JSON.stringify(products, null, 2), "utf-8");
  } else {
    // In production, log that this operation isn't supported
    console.warn('writeProducts is not supported in production');
    throw new Error('Write operations are not supported in production');
  }
}