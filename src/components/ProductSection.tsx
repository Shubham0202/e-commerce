import React from 'react';
import ProductCard from './ProductCard';

interface SimpleProduct {
  name: string;
  price: string | number;
  img?: string;
}

const products: SimpleProduct[] = [
  {
    name: "Smartwatch",
    price: "₹2,999",
    img: "/watch.jpg",
  },
  {
    name: "Wireless Earbuds",
    price: "₹1,499",
    img: "/earbuds.jpg",
  },
  {
    name: "Gaming Mouse",
    price: "₹799",
    img: "/mouse.jpg",
  },
];

export default function ProductSection() {
  return (
    <section className="p-6">
      <h2 className="text-2xl font-semibold mb-4 dark:text-white">
        Best Deals for You
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {products.map((p, i) => (
          <ProductCard key={i} product={{ id: p.name, name: p.name, price: Number(String(p.price).replace(/[^0-9]/g, '')) || 0, image: p.img }} />
        ))}
      </div>
    </section>
  );
}
