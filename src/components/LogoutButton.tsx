// src/components/LogoutButton.tsx
"use client";

import React from "react";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();
  async function handleLogout() {
    await fetch("/api/logout", { method: "POST" });
    router.push("/login");
  }
  return (
    <button onClick={handleLogout} className="px-3 py-1 rounded-md border">
      Logout
    </button>
  );
}
