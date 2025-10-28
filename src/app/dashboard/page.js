export const dynamic = "force-dynamic";

export default async function Dashboard() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/products`, { cache: "no-store" });
  const products = await res.json();
  const lowStock = products.filter(p => p.inventory < 5);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Inventory Dashboard</h1>
      <p>Total Products: {products.length}</p>
      <p>Low Stock Items: {lowStock.length}</p>
    </div>
  );
}
