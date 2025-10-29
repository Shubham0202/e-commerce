// src/app/admin/layout.tsx
import React from "react";

export const metadata = {
  title: "Admin - InventoryApp",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100">
      <div className="flex min-h-screen">
        {children}
      </div>
    </div>
  );
}
