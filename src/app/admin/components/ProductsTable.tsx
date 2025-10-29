// src/app/admin/components/ProductsTable.tsx
"use client";

import React, { useMemo, useState, useEffect } from "react";
import { Pencil, Trash2, Plus, Check, X } from "lucide-react";
import { toast } from "sonner";
import { useProducts, Product } from "@/context/ProductsContext";

const PAGE_SIZE = 10;

export default function ProductsTable() {
  const { products, setProducts, isSyncing, optimisticAdd, optimisticUpdate, optimisticDelete, refresh } = useProducts();
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState<"name" | "price" | "inventory">("name");
  const [page, setPage] = useState(1);

  // modal / form states
  const [isAddOpen, setAddOpen] = useState(false);
  const [isEditOpen, setEditOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);

  // categories & form
  const [categories, setCategories] = useState<string[]>([]);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [form, setForm] = useState<Partial<Product>>({
    name: "",
    slug: "",
    price: 0,
    inventory: 0,
    category: "",
    description: "",
  });

  // initialize categories when products change
  useEffect(() => {
    setCategories(Array.from(new Set((products || []).map((p) => p.category || "").filter(Boolean))));
  }, [products]);

  useEffect(() => {
    if (editingProduct) setForm({ ...editingProduct });
  }, [editingProduct]);

  const filtered = useMemo(() => {
    let list = products || [];
    if (query) {
      const q = query.toLowerCase();
      list = list.filter(
        (p) =>
          (p.name || "").toLowerCase().includes(q) ||
          (p.category || "").toLowerCase().includes(q) ||
          (p.description || "").toLowerCase().includes(q)
      );
    }
    list = [...list].sort((a, b) => {
      if (sortKey === "name") return (a.name || "").localeCompare(b.name || "");
      if (sortKey === "price") return (Number(a.price) || 0) - (Number(b.price) || 0);
      return (Number(a.inventory) || 0) - (Number(b.inventory) || 0);
    });
    return list;
  }, [products, query, sortKey]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // slugify helper
  function slugify(s = "") {
    return s
      .toString()
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9\-]/g, "");
  }

  function handleAddCategory() {
    const name = newCategoryName.trim();
    if (!name) return;
    if (!categories.includes(name)) setCategories((c) => [...c, name]);
    setNewCategoryName("");
    toast.success(`Category "${name}" added`);
  }

  // --- Optimistic CRUD handlers ---
  async function handleAddSubmit(e?: React.FormEvent) {
    if (e) e.preventDefault();
    if (!form.name || !form.slug) {
      toast.error("Name and slug are required");
      return;
    }

    // ensure slug unique locally
    const slug = slugify(String(form.slug));
    if (products.find((p) => p.slug === slug)) {
      toast.error("Slug already exists");
      return;
    }

    const payload: Partial<Product> = {
      ...form,
      slug,
      price: Number(form.price || 0),
      inventory: Number(form.inventory || 0),
      category: form.category || "",
    };

    try {
      await optimisticAdd(payload);
      toast.success("Product added");
      setAddOpen(false);
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Add failed");
    }
  }

  async function handleEditSubmit(e?: React.FormEvent) {
    if (!editingProduct) return;
    if (e) e.preventDefault();

    const payload: Partial<Product> = {
      ...form,
      slug: slugify(String(form.slug)),
      price: Number(form.price || 0),
      inventory: Number(form.inventory || 0),
      category: form.category || "",
    };

    // prevent duplicate slug
    const conflict = products.find((p) => p.slug === payload.slug && p.id !== editingProduct.id);
    if (conflict) {
      toast.error("Slug already exists");
      return;
    }

    try {
      await optimisticUpdate(editingProduct.id, payload);
      toast.success("Product updated");
      setEditOpen(false);
      setEditingProduct(null);
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Update failed");
    }
  }

  async function handleDeleteConfirm() {
    if (!deletingProduct) return;

    try {
      await optimisticDelete(deletingProduct.id);
      toast.success("Product deleted");
      setDeletingProduct(null);
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Delete failed");
    }
  }

  // quick manual refresh
  async function handleRefresh() {
    try {
      await refresh();
      toast.success("Refreshed");
    } catch (err) {
      toast.error("Refresh failed");
    }
  }

  // UI handlers
  function openAddModal() {
    setForm({ name: "", slug: "", price: 0, inventory: 0, category: categories[0] || "", description: "" });
    setAddOpen(true);
  }

  function openEditModal(p: Product) {
    setEditingProduct(p);
    setForm({ ...p });
    setEditOpen(true);
  }

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            placeholder="Search by name, category or description..."
            className="border px-3 py-2 rounded-md text-sm w-64 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"
          />

          <select
            className="border px-3 py-2 rounded-md text-sm bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500"
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value as any)}
          >
            <option value="name">Sort: Name</option>
            <option value="price">Sort: Price</option>
            <option value="inventory">Sort: Inventory</option>
          </select>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-sm text-slate-500">Showing {filtered.length} items</div>
          <button disabled={isSyncing} onClick={openAddModal} className={`flex items-center gap-2 ${isSyncing ? "opacity-60 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"} text-white px-3 py-2 rounded-md text-sm`}>
            <Plus size={16} /> New Product
          </button>
          <button onClick={handleRefresh} disabled={isSyncing} className="px-3 py-2 rounded-md border text-sm">Refresh</button>
        </div>
      </div>

      {/* table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 dark:bg-slate-800">
            <tr>
              <th className="px-4 py-3 text-left">Product</th>
              <th className="px-4 py-3 text-left">Price</th>
              <th className="px-4 py-3 text-left">Inventory</th>
              <th className="px-4 py-3 text-left">Category</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>

          <tbody>
            {/* while syncing show skeleton rows */}
            {isSyncing ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={`skeleton-${i}`} className="animate-pulse">
                  <td className="px-4 py-3">
                    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4" />
                  </td>
                  <td className="px-4 py-3">
                    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2" />
                  </td>
                  <td className="px-4 py-3">
                    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/4" />
                  </td>
                  <td className="px-4 py-3">
                    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/3" />
                  </td>
                  <td className="px-4 py-3" />
                </tr>
              ))
            ) : (
              pageItems.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="px-4 py-3 font-medium">{p.name}</td>
                  <td className="px-4 py-3">₹{p.price}</td>
                  <td className="px-4 py-3">{p.inventory}</td>
                  <td className="px-4 py-3">{p.category}</td>
                  <td className="px-4 py-3 flex justify-end gap-2">
                    <button disabled={isSyncing} onClick={() => openEditModal(p)} className={`p-2 rounded-md ${isSyncing ? "opacity-60 cursor-not-allowed bg-emerald-500" : "bg-emerald-600"} text-white`}>
                      <Pencil size={14} />
                    </button>
                    <button disabled={isSyncing} onClick={() => setDeletingProduct(p)} className={`p-2 rounded-md ${isSyncing ? "opacity-60 cursor-not-allowed bg-rose-600" : "bg-rose-600"} text-white`}>
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* pagination */}
      <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100 dark:border-slate-800">
        <div className="text-sm text-slate-500">Page {page} of {totalPages}</div>
        <div className="flex items-center gap-2">
          <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1 || isSyncing} className="px-3 py-1 rounded-md border">Prev</button>
          <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages || isSyncing} className="px-3 py-1 rounded-md border">Next</button>
        </div>
      </div>

      {/* Add Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-40 grid place-items-center bg-black/40">
          <div className="w-[720px] max-w-full bg-white dark:bg-slate-900 rounded-2xl shadow-xl p-6 transform transition-all">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Add Product</h3>
              <button onClick={() => setAddOpen(false)} className="p-2 rounded-md bg-slate-100 dark:bg-slate-800"><X /></button>
            </div>

            <form onSubmit={(e) => handleAddSubmit(e)} className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-slate-600">Name</label>
                <input required value={form.name || ""} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className="mt-1 w-full border px-3 py-2 rounded-md bg-white dark:bg-slate-800" />
              </div>

              <div>
                <label className="text-sm text-slate-600">Slug</label>
                <div className="flex gap-2 mt-1">
                  <input required value={form.slug || ""} onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))} className="w-full border px-3 py-2 rounded-md bg-white dark:bg-slate-800" />
                  <button type="button" onClick={() => setForm((f) => ({ ...f, slug: slugify(String(f.name || "")) }))} className="px-3 py-2 rounded-md border bg-indigo-50 dark:bg-indigo-800 text-indigo-700 dark:text-indigo-200">Auto</button>
                </div>
              </div>

              <div>
                <label className="text-sm text-slate-600">Price</label>
                <input type="number" value={form.price as number} onChange={(e) => setForm((f) => ({ ...f, price: Number(e.target.value) }))} className="mt-1 w-full border px-3 py-2 rounded-md bg-white dark:bg-slate-800" />
              </div>

              <div>
                <label className="text-sm text-slate-600">Inventory</label>
                <input type="number" value={form.inventory as number} onChange={(e) => setForm((f) => ({ ...f, inventory: Number(e.target.value) }))} className="mt-1 w-full border px-3 py-2 rounded-md bg-white dark:bg-slate-800" />
              </div>

              <div>
                <label className="text-sm text-slate-600">Category</label>
                <select value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))} className="mt-1 w-full border px-3 py-2 rounded-md bg-white dark:bg-slate-800">
                  <option value="">Select category</option>
                  {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
                <div className="mt-2 flex gap-2">
                  <input placeholder="New category" value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)} className="border px-3 py-2 rounded-md bg-white dark:bg-slate-800" />
                  <button type="button" onClick={handleAddCategory} className="px-3 py-2 rounded-md bg-indigo-600 text-white"><Check size={16} /></button>
                </div>
              </div>

              <div className="col-span-2">
                <label className="text-sm text-slate-600">Description</label>
                <textarea value={form.description as string} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} className="mt-1 w-full border px-3 py-2 rounded-md bg-white dark:bg-slate-800" rows={3} />
              </div>

              <div className="col-span-2 flex justify-end gap-3 mt-2">
                <button type="button" onClick={() => setAddOpen(false)} className="px-4 py-2 rounded-md border">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded-md bg-indigo-600 text-white">Add Product</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditOpen && editingProduct && (
        <div className="fixed inset-0 z-40 grid place-items-center bg-black/40">
          <div className="w-[720px] max-w-full bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Edit Product</h3>
              <button onClick={() => { setEditOpen(false); setEditingProduct(null); }} className="p-2 rounded-md bg-slate-100 dark:bg-slate-800"><X /></button>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); handleEditSubmit(); }} className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-slate-600">Name</label>
                <input required value={form.name || ""} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className="mt-1 w-full border px-3 py-2 rounded-md bg-white dark:bg-slate-800" />
              </div>

              <div>
                <label className="text-sm text-slate-600">Slug</label>
                <input required value={form.slug || ""} onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))} className="mt-1 w-full border px-3 py-2 rounded-md bg-white dark:bg-slate-800" />
              </div>

              <div>
                <label className="text-sm text-slate-600">Price</label>
                <input type="number" value={form.price as number} onChange={(e) => setForm((f) => ({ ...f, price: Number(e.target.value) }))} className="mt-1 w-full border px-3 py-2 rounded-md bg-white dark:bg-slate-800" />
              </div>

              <div>
                <label className="text-sm text-slate-600">Inventory</label>
                <input type="number" value={form.inventory as number} onChange={(e) => setForm((f) => ({ ...f, inventory: Number(e.target.value) }))} className="mt-1 w-full border px-3 py-2 rounded-md bg-white dark:bg-slate-800" />
              </div>

              <div>
                <label className="text-sm text-slate-600">Category</label>
                <select value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))} className="mt-1 w-full border px-3 py-2 rounded-md bg-white dark:bg-slate-800">
                  <option value="">Select category</option>
                  {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
                <div className="mt-2 flex gap-2">
                  <input placeholder="New category" value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)} className="border px-3 py-2 rounded-md bg-white dark:bg-slate-800" />
                  <button type="button" onClick={handleAddCategory} className="px-3 py-2 rounded-md bg-indigo-600 text-white"><Check size={16} /></button>
                </div>
              </div>

              <div className="col-span-2">
                <label className="text-sm text-slate-600">Description</label>
                <textarea value={form.description as string} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} className="mt-1 w-full border px-3 py-2 rounded-md bg-white dark:bg-slate-800" rows={3} />
              </div>

              <div className="col-span-2 flex justify-end gap-3 mt-2">
                <button type="button" onClick={() => { setEditOpen(false); setEditingProduct(null); }} className="px-4 py-2 rounded-md border">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded-md bg-emerald-600 text-white">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deletingProduct && (
        <div className="fixed inset-0 z-40 grid place-items-center bg-black/40">
          <div className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-lg w-[420px]">
            <h3 className="text-lg font-semibold mb-2">Delete "{deletingProduct.name}"?</h3>
            <p className="text-sm text-slate-500 mb-4">This action cannot be undone.</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setDeletingProduct(null)} className="px-4 py-2 rounded-md border">Cancel</button>
              <button onClick={handleDeleteConfirm} className="px-4 py-2 rounded-md bg-rose-600 text-white">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
