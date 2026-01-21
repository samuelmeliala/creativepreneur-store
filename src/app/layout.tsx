import type { Metadata } from "next";
import "./globals.css";
import AuthProvider from "../component/AuthProvider";

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
        <AuthProvider>
          <div className="min-h-screen flex flex-col">
            <div className="flex-1 flex flex-col">{children}</div>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}