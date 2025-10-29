import { NextResponse } from "next/server";
import { readProducts, writeProducts, type Product } from "@/lib/products";
import { v4 as uuidv4 } from "uuid";

// Basic admin access key
const ADMIN_KEY = process.env.ADMIN_KEY || "secret-key";

// ✅ GET: Fetch all products
export async function GET() {
  const products = await readProducts();
  return NextResponse.json(products);
}

// ✅ POST: Add a new product (admin-only)
export async function POST(req: Request) {
  const url = new URL(req.url);
  const key = req.headers.get("x-admin-key") || url.searchParams.get("key");

  if (key !== ADMIN_KEY) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const products = await readProducts();

  const newProduct: Product = {
    id: uuidv4(),
    name: body.name,
    slug: body.slug,
    description: body.description || "",
    price: Number(body.price),
    category: body.category || "Others",
    inventory: Number(body.inventory) || 0,
    lastUpdated: new Date().toISOString(),
  };

  products.push(newProduct);
  await writeProducts(products);

  return NextResponse.json(newProduct, { status: 201 });
}
