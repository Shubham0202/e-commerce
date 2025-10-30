// src/app/products/[slug]/page.tsx
import ProductCard from "@/components/ProductCard";
import { notFound } from "next/navigation";
import { getProducts, getProductBySlug } from "@/lib/products";

export const revalidate = 60;

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((product) => ({
    slug: product.slug,
  }));
}

async function getProduct(slug: string) {
  const product = await getProductBySlug(slug);
  return product;
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    notFound();
  }

  return (
    <div className="p-6">
      <ProductCard product={product} />
    </div>
  );
}