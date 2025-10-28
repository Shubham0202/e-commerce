import products from "@/data/products.json";
import ProductBuy from "@/components/ProductBuy";

export default async function ProductPage({ params }) {
  // params may be a Promise in newer Next.js versions; await to get the real object
  const resolvedParams = await params;
  // normalize helper to compare slugs consistently (handles spaces, case, unsafe chars)
  const normalize = (s) =>
    (s || "")
      .toString()
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-_]/g, "");

  // params.slug can sometimes be an array (catch-all) or undefined; handle both
  const rawParam = resolvedParams && resolvedParams.slug;
  const rawSlug = Array.isArray(rawParam) ? rawParam.join("/") : (rawParam || "");
  const incoming = normalize(decodeURIComponent(rawSlug));

  const product = products.find(
    (p) => normalize(p.slug) === incoming || p.id === resolvedParams.slug || p.id === incoming
  );
  if (!product) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Product not found</h1>
        <p className="mb-2">Requested slug: <strong>{rawSlug}</strong></p>
        <p className="mb-2">Available products:</p>
        <ul className="list-disc pl-6">
          {products.map((p) => (
            <li key={p.id} className="mb-1">{p.slug} — {p.name}</li>
          ))}
        </ul>
      </div>
    );
  }

  return <ProductBuy product={product} />;
}
