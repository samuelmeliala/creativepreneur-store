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
        <main>
          {/* The 'children' prop is where your page.tsx content will be rendered */}
          {children}
        </main>
      </body>
    </html>
  );
}