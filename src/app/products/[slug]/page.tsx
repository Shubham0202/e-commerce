// src/app/products/[slug]/page.tsx
import ProductCard from "@/components/ProductCard";
import { notFound } from "next/navigation";
export const revalidate = 60; // ✅ ISR enabled

// ✅ Pre-render all product pages
export async function generateStaticParams() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/products`);
  const products = await res.json();

  return products.map((p: any) => ({
    slug: p.slug,
  }));
}

async function getProduct(slug: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/products/${slug}`,
    { next: { revalidate: 60 } }
  );

  if (!res.ok) return null;
  return res.json();
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
