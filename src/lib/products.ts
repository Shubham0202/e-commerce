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

// For client-side and server-side (no fs)
export async function readProducts(): Promise<Product[]> {
  // In production, fetch from public directory
  if (process.env.NODE_ENV === 'production') {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/data/products.json`);
    return res.json();
  }
  
  // In development, you can keep the fs version or use fetch
  const res = await fetch('http://localhost:3000/data/products.json');
  return res.json();
}