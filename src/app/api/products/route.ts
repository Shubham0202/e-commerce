// src/app/api/products/route.ts
import { NextResponse } from "next/server";
import { 
  getProducts, 
  addProduct, 
  type ProductType 
} from "@/lib/products";

const ADMIN_KEY = process.env.ADMIN_KEY || "secret-key";

// ✅ GET: Fetch all products
export async function GET() {
  try {
    const products = await getProducts();
    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to load products" }, { status: 500 });
  }
}

// ✅ POST: Add a new product (Admin Only)
export async function POST(req: Request) {
  try {
    const url = new URL(req.url);
    const key = req.headers.get("x-admin-key") || url.searchParams.get("key");

    if (key !== ADMIN_KEY) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    // ❗ Validation
    if (!body.name || !body.slug || !body.price) {
      return NextResponse.json(
        { error: "name, slug & price are required" },
        { status: 400 }
      );
    }

    // Create product data matching ProductType interface
    const newProductData: Omit<ProductType, '_id' | 'createdAt' | 'updatedAt'> & {
      _id?: string;
      createdAt?: string;
      updatedAt?: string;
    } = {
      name: body.name,
      slug: body.slug,
      description: body.description || "",
      price: Number(body.price),
      category: body.category || "Others",
      inventory: Number(body.inventory) || 0,
    };

    // MongoDB will automatically generate _id, createdAt, and updatedAt
    const newProduct = await addProduct(newProductData as ProductType);

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.error("Failed to add product:", error);
    return NextResponse.json({ error: "Failed to add product" }, { status: 500 });
  }
}