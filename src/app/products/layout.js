import CategoryNav from "@/components/CategoryNav";
import Footer from "@/components/Footer";
import Header from "@/components/Header";

export default function ProductsLayout({ children }) {
  return (
    <>
      <Header />
      <CategoryNav />
      <main className="bg-gray-50 dark:bg-gray-900 min-h-screen">
        {children}
      </main>
      <Footer />
    </>
  );
}