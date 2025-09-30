import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css"; // Assuming you have a global CSS file

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Creativepreneur Store",
  description: "Dashboard for managing products",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <nav className="bg-gray-800 text-white p-4">
          {/* Your main navigation would go here */}
          <p>CP Store Dashboard</p>
        </nav>
        <main>
          {/* The 'children' prop is where your page.tsx content will be rendered */}
          {children}
        </main>
        <footer className="text-center p-4 bg-gray-200 mt-8">
          {/* A shared footer */}
          <p>© 2025 Product Corp</p>
        </footer>
      </body>
    </html>
  );
}