// src/app/admin/page.tsx
import AdminSidebar from "./components/AdminSidebar";
import AdminHeader from "./components/AdminHeader";
import StatsCards from "./components/StatsCards";
import ProductsTable from "./components/ProductsTable";
import { ProductsProvider } from "@/context/ProductsContext";

type Product = {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  category: string;
  inventory: number;
  lastUpdated: string;
};

async function fetchProducts(): Promise<Product[]> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/api/products`,
    { cache: "no-store" }
  );
  if (!res.ok) return [];
  return res.json();
}

export default async function AdminPage() {
  const products = await fetchProducts();

  return (
    <div className="flex w-full">
      {/* Sidebar */}
      <aside className="w-72 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-6">
        <AdminSidebar />
      </aside>

      {/* Main */}
      <div className="flex-1 min-h-screen">
        <header className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <AdminHeader />
          </div>
        </header>

        {/* ✅ Wrap everything inside ProductsProvider */}
        <ProductsProvider initialProducts={products}>
          <main className="max-w-7xl mx-auto px-6 py-6">
            
            {/* ✅ StatsCards now auto-updates because it reads from context */}
            <StatsCards />

            <div className="mt-6">
              {/* ❌ Remove initialProducts prop */}
              <ProductsTable />
            </div>
          </main>
        </ProductsProvider>
      </div>
    </div>
  );
}
