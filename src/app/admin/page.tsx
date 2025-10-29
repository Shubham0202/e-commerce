import AdminSidebar from "./components/AdminSidebar";
import AdminHeader from "./components/AdminHeader";
import StatsCards from "./components/StatsCards";
import ProductsTable from "./components/ProductsTable";
import { ProductsProvider } from "@/context/ProductsContext";
import { readProducts } from "@/lib/products"; // ✅ Direct import, no API call

export default async function AdminPage() {
  // ✅ Direct data access instead of API call
  const products = await readProducts();

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