import type { Metadata } from "next";
// import { Open_Sans } from "next/font/google";
import "./globals.css"; // Assuming you have a global CSS file
import AuthProvider from "../component/AuthProvider";

// const openSans = Open_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Creativepreneur Store",
  description: "Dashboard for managing products",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}