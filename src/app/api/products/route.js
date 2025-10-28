import { NextResponse } from "next/server";
import products from "@/data/products.json";

export async function GET() {
  return NextResponse.json(products);
}

export async function POST(req) {
  const body = await req.json();
  const newProduct = { ...body, id: Date.now().toString() };
  products.push(newProduct);
  return NextResponse.json(newProduct, { status: 201 });
}
