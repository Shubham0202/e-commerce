import { NextResponse } from "next/server";
import products from "@/data/products.json";

export async function GET(req, { params }) {
  const product = products.find(p => p.slug === params.slug);
  return product
    ? NextResponse.json(product)
    : NextResponse.json({ error: "Not found" }, { status: 404 });
}

export async function PUT(req, { params }) {
  const updates = await req.json();
  const index = products.findIndex(p => p.id === params.slug);
  if (index === -1) return NextResponse.json({ error: "Not found" }, { status: 404 });

  products[index] = { ...products[index], ...updates, lastUpdated: new Date().toISOString() };
  return NextResponse.json(products[index]);
}
