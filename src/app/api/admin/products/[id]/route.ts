// src/app/api/admin/products/[id]/route.ts
import { NextResponse } from "next/server";
import { readProducts, writeProducts } from "@/lib/products";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic"; // ✅ Ensure dynamic for admin routes

const ADMIN_KEY = process.env.ADMIN_KEY || "secret-key";

export async function DELETE(req: Request, context: { params: Promise<{ id: string }> }) {
  const { params } = context;
  const resolved = await params; // ✅ FIX: params must be awaited
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
  await writeProducts(products);

  try {
    revalidatePath("/");
    revalidatePath(`/products/${removed.slug}`);
  } catch {}

  return NextResponse.json({ success: true, removed });
}

export async function PUT(req: Request, context: { params: Promise<{ id: string }> }) {
  const { params } = context;
  const resolved = await params; // ✅ FIX: params must be awaited
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

  await writeProducts(products);

  try {
    revalidatePath(`/products/${products[index].slug}`);
    revalidatePath("/");
  } catch {}

  return NextResponse.json(products[index]);
}
