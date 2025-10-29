import CategoryNav from "@/components/CategoryNav";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ImageSlider from "@/components/ImageSlider";
import ProductCard from "@/components/ProductCard";

export const revalidate = 60; //  ISR enabled

async function getProducts() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/products`, {
    next: { revalidate: 60 },
  });
  return res.json();
}

export default async function Home() {
  const products = await getProducts(); //  SSG API fetch

  return (
    <>
      <Header />
      <CategoryNav />
      <main className="bg-gray-50 dark:bg-gray-900 min-h-screen">
        <ImageSlider />

        <section className="max-w-4xl mx-auto py-8">
          <h2 className="text-2xl font-bold mb-4">Products</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {products.map((product: any) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
