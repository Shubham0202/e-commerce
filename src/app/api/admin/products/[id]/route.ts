// src/app/api/admin/products/[id]/route.ts
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import "@/lib/db"; // ensures MongoDB connection
import { Product } from "@/lib/models/Product";

export const dynamic = "force-dynamic";

const ADMIN_KEY = process.env.ADMIN_KEY || "secret-key";

// DELETE Product
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const key = req.headers.get("x-admin-key");
    if (key !== ADMIN_KEY) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;

    // In production, simulate delete
    if (process.env.NODE_ENV === "production") {
      return NextResponse.json({
        success: true,
        message: "Delete simulated in production",
      });
    }

    const deleted = await Product.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    try {
      revalidatePath("/");
      revalidatePath(`/products/${deleted.slug}`);
    } catch {}

    return NextResponse.json({ success: true, deleted });
  } catch (error) {
    console.error("DELETE API error:", error);
    return NextResponse.json(
      { error: "Delete operation failed" },
      { status: 500 }
    );
  }
}

// UPDATE Product
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const key = req.headers.get("x-admin-key");
    if (key !== ADMIN_KEY) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    const updates = await req.json();

    // In production, simulate success
    if (process.env.NODE_ENV === "production") {
      return NextResponse.json({
        ...updates,
        _id: id,
        updatedAt: new Date().toISOString(),
        message: "Update simulated in production",
      });
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!updatedProduct) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    try {
      revalidatePath(`/products/${updatedProduct.slug}`);
      revalidatePath("/");
    } catch {}

    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error("PUT API error:", error);
    return NextResponse.json(
      { error: "Update operation failed" },
      { status: 500 }
    );
  }
}
