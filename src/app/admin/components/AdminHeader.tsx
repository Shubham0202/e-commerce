// src/app/admin/components/AdminHeader.tsx
"use client";
import { useState } from "react";
import { Search, Plus } from "lucide-react";

export default function AdminHeader() {
  const [q, setQ] = useState("");

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-semibold">Inventory Dashboard</h1>
        <div className="hidden md:flex items-center gap-2 text-sm text-slate-500">
          <span>Manage your products and inventory</span>
        </div>
      </div>

    
    </div>
  );
}
