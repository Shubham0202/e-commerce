"use client";
import { useState, useEffect } from "react";

export default function AdminPage() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name: "", slug: "", price: "", description: "" });

  useEffect(() => {
    fetch("/api/products").then(res => res.json()).then(setProducts);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    alert("Product added!");
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Admin Panel</h1>
      <form onSubmit={handleSubmit} className="space-y-2 mb-6">
        <input placeholder="Name" onChange={e => setForm({ ...form, name: e.target.value })} className="border p-2 w-full"/>
        <input placeholder="Slug" onChange={e => setForm({ ...form, slug: e.target.value })} className="border p-2 w-full"/>
        <input placeholder="Price" type="number" onChange={e => setForm({ ...form, price: e.target.value })} className="border p-2 w-full"/>
        <textarea placeholder="Description" onChange={e => setForm({ ...form, description: e.target.value })} className="border p-2 w-full"/>
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">Add Product</button>
      </form>

      <h2 className="text-xl mb-2">All Products</h2>
      <ul>
        {products.map(p => <li key={p.id}>{p.name} - ₹{p.price}</li>)}
      </ul>
    </div>
  );
}
