import Footer from "@/components/Footer";
import Header from "@/components/Header";

export default function ProductsLayout({ children }) {
  return (
    <>
      <Header />
      <main className="bg-gray-50 dark:bg-gray-900 min-h-screen">
        {children}
      </main>
      <Footer />
    </>
  );
}