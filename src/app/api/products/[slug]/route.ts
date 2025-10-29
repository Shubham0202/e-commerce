export const dynamic = "force-static";

import { NextRequest, NextResponse } from "next/server";
import { readProducts } from "@/lib/products";

export async function GET(
  _req: NextRequest,
  { params }: { params: { slug: string } }
) {
  const products = await readProducts();
  const product = products.find((p) => p.slug === params.slug);

  if (!product) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(product);
}
