// src/app/products/[slug]/page.tsx
import ProductCard from "@/components/ProductCard";
import { notFound } from "next/navigation";
import { readProducts } from "@/lib/products";

export const revalidate = 60; // ✅ ISR enabled

// ✅ Pre-render all product pages using direct data access
export async function generateStaticParams() {
  const products = await readProducts(); // Direct access, no API call

  return products.map((product) => ({
    slug: product.slug,
  }));
}

// ✅ Direct data access instead of API call
async function getProduct(slug: string) {
  const products = await readProducts();
  return products.find((p) => p.slug === slug) || null;
}

export default async function ProductPage({
  params,
}: {
  params: { slug: string };
}) {
  const product = await getProduct(params.slug);

  if (!product) {
    notFound();
  }

  return (
    <div className="p-6">
      <ProductCard product={product} />
    </div>
  );
}