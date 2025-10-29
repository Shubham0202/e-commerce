import { NextResponse } from "next/server";
import { readProducts, writeProducts } from "@/lib/products";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

const ADMIN_KEY = process.env.ADMIN_KEY || "secret-key";

export async function DELETE(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { params } = context;
    const resolved = await params;
    const productId = resolved.id;

    const key = req.headers.get("x-admin-key");
    if (key !== ADMIN_KEY) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // In production, return success but don't actually write
    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json({ 
        success: true, 
        message: "Delete simulated in production" 
      });
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
  } catch (error) {
    console.error('DELETE API error:', error);
    return NextResponse.json(
      { error: "Delete operation failed" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { params } = context;
    const resolved = await params;
    const productId = resolved.id;

    const key = req.headers.get("x-admin-key");
    if (key !== ADMIN_KEY) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // In production, return success but don't actually write
    if (process.env.NODE_ENV === 'production') {
      const updates = await req.json();
      return NextResponse.json({
        ...updates,
        id: productId,
        lastUpdated: new Date().toISOString(),
        message: "Update simulated in production"
      });
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
  } catch (error) {
    console.error('PUT API error:', error);
    return NextResponse.json(
      { error: "Update operation failed" },
      { status: 500 }
    );
  }
}