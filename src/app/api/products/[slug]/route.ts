// src/app/api/products/[slug]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { readProducts } from "@/lib/products";

export async function GET(
  _req: NextRequest,
  context: { params: { slug: string } }
) {
  const { slug } = context.params;
  const products = await readProducts();
  const product = products.find((p) => p.slug === slug);

  if (!product) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(product);
}