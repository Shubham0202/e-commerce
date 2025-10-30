"use client";

import { useState } from "react";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function AdminHeader() {
  const [q, setQ] = useState("");



const handleLogout = async () => {
  try {
    const res = await fetch("/api/logout", {
      method: "POST",
    });

    if (!res.ok) {
      toast.error("Logout failed. Try again.");
      return;
    }

    toast.success("Logged out successfully!");
    // If you need page refresh or redirect:
    setTimeout(() => {
      window.location.href = "/login"; 
    }, 500);
  } catch (error) {
    toast.error("Something went wrong!");
  }
};

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-semibold">Inventory Dashboard</h1>
        <div className="hidden md:flex items-center gap-2 text-sm text-slate-500">
          <span>Manage your products and inventory</span>
        </div>
      </div>

      {/* ✅ Secure Logout Button */}
      <button
        onClick={handleLogout}
        className="flex items-center gap-2 px-3 py-2 text-sm rounded-md bg-red-600 text-white hover:bg-red-700 transition"
      >
        <LogOut size={16} />
        Logout
      </button>
    </div>
  );
}
