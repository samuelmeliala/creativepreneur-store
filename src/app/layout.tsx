import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "CP Store",
  description: "Aplikasi CP Store dengan Firebase Realtime Database",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 text-gray-900 antialiased flex flex-col">
        {/* NAVBAR */}
        <header className="bg-white shadow-md sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-orange-600"> CP Store</h1>
            <nav className="hidden md:flex gap-6 text-sm font-medium">
              <Link href="/" className="hover:text-orange-600 transition">
                Home
              </Link>
              <Link href="/products" className="hover:text-orange-600 transition">
                Products
              </Link>
              <Link href="/about" className="hover:text-orange-600 transition">
                About
              </Link>
            </nav>
          </div>
        </header>

        {/* MAIN CONTENT */}
        <div className="flex flex-1 max-w-6xl mx-auto w-full">
          {/* SIDEBAR */}
          <aside className="hidden md:block w-64 bg-white border-r p-6">
            <h2 className="font-bold mb-4">Menu</h2>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/" className="hover:text-orange-600">
                  🏠 Dashboard
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-orange-600">
                  📦 Produk
                </Link>
              </li>
              <li>
                <Link href="/orders" className="hover:text-orange-600">
                  🛒 Pesanan
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-orange-600">
                  ℹ️ Tentang
                </Link>
              </li>
            </ul>
          </aside>

          {/* MAIN AREA */}
          <main className="flex-1 p-6">{children}</main>
        </div>

        {/* FOOTER */}
        <footer className="bg-white border-t mt-6 p-4 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} CP Store. All rights reserved.
        </footer>
      </body>
    </html>
  );
}
