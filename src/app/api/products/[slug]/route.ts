import { NextRequest, NextResponse } from "next/server";
import { readProducts } from "@/lib/products";

export const dynamic = "force-static";

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  const { slug } = await context.params; // ⬅️ Must await params here!

  const products = await readProducts();
  const product = products.find((p) => p.slug === slug);

  if (!product) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(product);
}
