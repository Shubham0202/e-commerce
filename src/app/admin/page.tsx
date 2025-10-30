// src/app/admin/page.tsx
import AdminSidebar from "./components/AdminSidebar";
import AdminHeader from "./components/AdminHeader";
import StatsCards from "./components/StatsCards";
import ProductsTable from "./components/ProductsTable";
import { ProductsProvider } from "@/context/ProductsContext";
import { getProducts, type ProductType } from "@/lib/products";

// Convert MongoDB documents to plain objects
function serializeProducts(products: ProductType[]) {
  return products.map(product => ({
    _id: product._id.toString(), // Convert ObjectId to string
    name: product.name,
    slug: product.slug,
    description: product.description,
    price: product.price,
    category: product.category,
    inventory: product.inventory,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt
  }));
}

export default async function AdminPage() {
  // ✅ Direct data access using MongoDB function
  const products = await getProducts();
  
  // ✅ Convert MongoDB objects to plain serializable objects
  const serializedProducts = serializeProducts(products);

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
        <ProductsProvider initialProducts={serializedProducts}>
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