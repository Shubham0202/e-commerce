"use client";

import { useEffect, useState } from "react";
import { Package, Boxes, AlertTriangle, LogOut } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface Product {
  id: string;
  name: string;
  inventory: number;
}

export default function DashboardPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/logout", { method: "POST" });

      if (!res.ok) {
        toast.error("Logout failed!");
        return;
      }

      toast.success("Logged out successfully!");
      router.push("/admin/login");
    } catch (err) {
      toast.error("Something went wrong!");
    }
  };

  useEffect(() => {
    async function loadProducts() {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "";
        const res = await fetch(`${baseUrl}/api/products`, {
          cache: "no-store",
        });

        if (!res.ok) {
          toast.error("Failed to load products!");
          throw new Error("Failed to load products");
        }

        const data = await res.json();
        setProducts(data);
      } catch {
        toast.error("Something went wrong while fetching products!");
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

  const totalProducts = products.length;
  const totalInventory = products.reduce((sum, p) => sum + p.inventory, 0);
  const lowStock = products.filter((p) => p.inventory <= 5);

  if (loading) {
    return (
      <main className="p-6 max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-black text-gray-900 dark:text-white">
            Inventory Dashboard
          </h1>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm rounded-lg"
          >
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>

        <p className="text-gray-600 dark:text-gray-300">Loading products...</p>
      </main>
    );
  }

  return (
    <main className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-black text-gray-900 dark:text-white">
          Inventory Dashboard
        </h1>

        {/* ✅ Logout Button */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm rounded-lg"
        >
          <LogOut className="w-4 h-4" /> Logout
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        <DashboardCard
          title="Total Products"
          value={totalProducts}
          icon={<Package className="w-8 h-8 text-blue-500" />}
        />
        <DashboardCard
          title="Total Inventory"
          value={totalInventory}
          icon={<Boxes className="w-8 h-8 text-green-600" />}
        />
        <DashboardCard
          title="Low Stock Items"
          value={lowStock.length}
          icon={<AlertTriangle className="w-8 h-8 text-orange-600" />}
        />
      </div>

      {/* Low Stock Table */}
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
        Low Inventory Alerts
      </h2>
      <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
        <table className="w-full">
          <thead className="bg-gray-100 dark:bg-gray-800">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-600 dark:text-gray-300 tracking-wide">
                Product Name
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase text-gray-600 dark:text-gray-300 tracking-wide">
                Stock
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {lowStock.map((p) => (
              <tr
                key={p.id}
                className="hover:bg-gray-50 dark:hover:bg-gray-800/50"
              >
                <td className="px-6 py-4 text-sm text-gray-900 dark:text-white font-medium">
                  {p.name}
                </td>
                <td className="px-6 py-4 text-sm font-bold text-red-600 dark:text-red-400">
                  {p.inventory}
                </td>
              </tr>
            ))}

            {lowStock.length === 0 && (
              <tr>
                <td className="p-4 text-sm text-center" colSpan={2}>
                  ✅ All products are well stocked!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}

function DashboardCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl px-6 py-6 shadow-sm">
      <div className="flex justify-between items-center">
        <p className="text-gray-600 dark:text-gray-300 font-medium">{title}</p>
        {icon}
      </div>
      <p className="text-3xl font-bold text-gray-900 dark:text-white">
        {value}
      </p>
    </div>
  );
}
