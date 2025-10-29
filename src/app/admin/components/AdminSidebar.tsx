// src/app/admin/components/AdminSidebar.tsx
"use client";
import Link from "next/link";
import { Home, Box, BarChart2, Settings } from "lucide-react";

export default function AdminSidebar() {
  return (
    <div className="flex flex-col h-full">
      <div className="mb-8">
        <div className="text-xl font-semibold text-indigo-600">InventoryApp</div>
        <p className="text-sm text-slate-500 dark:text-slate-400">Admin Panel</p>
      </div>

      <nav className="flex-1">
        <ul className="space-y-1">
          <li>
            <Link href="/admin" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800">
              <Home className="w-5 h-5 text-slate-600 dark:text-slate-300" />
              <span className="text-sm font-medium">Dashboard</span>
            </Link>
          </li>
          <li>
            <Link href="/admin" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800">
              <Box className="w-5 h-5 text-slate-600 dark:text-slate-300" />
              <span className="text-sm font-medium">Products</span>
            </Link>
          </li>
          <li>
            <Link href="#" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800">
              <BarChart2 className="w-5 h-5 text-slate-600 dark:text-slate-300" />
              <span className="text-sm font-medium">Reports</span>
            </Link>
          </li>
          <li>
            <Link href="#" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800">
              <Settings className="w-5 h-5 text-slate-600 dark:text-slate-300" />
              <span className="text-sm font-medium">Settings</span>
            </Link>
          </li>
        </ul>
      </nav>

      <div className="mt-6 text-sm text-slate-500 dark:text-slate-400">
        <div>Logged in as <strong>admin</strong></div>
      </div>
    </div>
  );
}
