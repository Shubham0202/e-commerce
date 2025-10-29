  // src/lib/products.ts  
  import fs from "fs/promises";
  import path from "path";

  export interface Product {
    id: string;
    name: string;
    slug: string;
    description: string;
    price: number;
    category: string;
    inventory: number;
    lastUpdated: string; // ISO datetime
  }

  const PRODUCTS_PATH = path.join(process.cwd(), "src", "data", "products.json");

  export async function readProducts(): Promise<Product[]> {
    const raw = await fs.readFile(PRODUCTS_PATH, "utf-8");
    const products = JSON.parse(raw) as Product[];
    return products;
  }

  export async function writeProducts(products: Product[]) {
    await fs.writeFile(PRODUCTS_PATH, JSON.stringify(products, null, 2), "utf-8");
  }
