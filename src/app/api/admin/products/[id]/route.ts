// src/app/api/admin/products/[id]/route.ts
import { NextResponse } from "next/server";
import { readProducts } from "@/lib/products"; // Remove writeProducts import
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

const ADMIN_KEY = process.env.ADMIN_KEY || "secret-key";

// Helper function for development only
async function updateProducts(updatedProducts: any[]) {
  if (process.env.NODE_ENV !== 'development') {
    console.warn('Write operations disabled in production');
    return;
  }
  
  // Dynamic import for development only
  const { writeProducts } = await import('@/lib/products');
  await writeProducts(updatedProducts);
}

export async function DELETE(req: Request, context: { params: Promise<{ id: string }> }) {
  const { params } = context;
  const resolved = await params;
  const productId = resolved.id;

  const key = req.headers.get("x-admin-key");
  if (key !== ADMIN_KEY) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const products = await readProducts();
  const index = products.findIndex((p) => p.id === productId);

  if (index === -1) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const removed = products.splice(index, 1)[0];
  
  // Use the helper function instead of direct writeProducts
  await updateProducts(products);

  try {
    revalidatePath("/");
    revalidatePath(`/products/${removed.slug}`);
  } catch {}

  return NextResponse.json({ success: true, removed });
}

export async function PUT(req: Request, context: { params: Promise<{ id: string }> }) {
  const { params } = context;
  const resolved = await params;
  const productId = resolved.id;

  const key = req.headers.get("x-admin-key");
  if (key !== ADMIN_KEY) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const updates = await req.json();
  const products = await readProducts();
  const index = products.findIndex((p) => p.id === productId);

  if (index === -1) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  products[index] = {
    ...products[index],
    ...updates,
    lastUpdated: new Date().toISOString(),
  };

  // Use the helper function instead of direct writeProducts
  await updateProducts(products);

  try {
    revalidatePath(`/products/${products[index].slug}`);
    revalidatePath("/");
  } catch {}

  return NextResponse.json(products[index]);
}