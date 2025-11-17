import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import "./globals.css"; // Assuming you have a global CSS file
import Sidebar from "../component/sidebar";

const openSans = Open_Sans({ subsets: ["latin"] });

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
      <body className={openSans.className}>
        <div className="min-h-screen flex bg-[#F7FAFC]">
          <Sidebar />
          <main className="flex-1 md:ml-52">
            {/* The 'children' prop is where your page.tsx content will be rendered */}
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}