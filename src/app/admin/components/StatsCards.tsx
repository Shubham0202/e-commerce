// src/app/admin/components/StatsCards.tsx
"use client";

import React from "react";
import { Package, Boxes, AlertTriangle, RefreshCw  } from "lucide-react";
import { useProducts } from "@/context/ProductsContext";

export default function StatsCards() {
  const { products, isSyncing } = useProducts();

  const totalProducts = products.length;
  const totalInventory = products.reduce((s, p) => s + (p.inventory ?? 0), 0);
  const lowStock = products.filter((p) => (p.inventory ?? 0) <= 5).length;

  return (
    <div className="flex items-center justify-between gap-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 flex-1">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-slate-500">Total Products</div>
              <div className="text-2xl font-bold mt-2">{totalProducts}</div>
            </div>
            <Package className="w-9 h-9 text-indigo-600" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-slate-500">Total Inventory</div>
              <div className="text-2xl font-bold mt-2">{totalInventory}</div>
            </div>
            <Boxes className="w-9 h-9 text-green-600" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-orange-600">Low Stock Items</div>
              <div className="text-2xl font-bold mt-2 text-orange-600">{lowStock}</div>
            </div>
            <AlertTriangle className="w-9 h-9 text-orange-500" />
          </div>
        </div>
      </div>

      {/* syncing badge area */}
      <div className="flex items-center gap-3">
        {isSyncing ? (
          <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 text-yellow-700">
            <RefreshCw  className="w-4 h-4 animate-spin" />
            <span className="text-sm">Syncing…</span>
          </div>
        ) : null}
      </div>
    </div>
  );
}
