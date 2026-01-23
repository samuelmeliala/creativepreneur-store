"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import ProductListContent from "../../component/productlist-content";
import Sidebar from "../../component/sidebar";
import { Button } from "../../component/ui/button";

type Role = "admin" | "mahasiswa";

export default function ProductListPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const role = (session?.user as any)?.role as Role | undefined;
  const isAdmin = role === "admin";

  const actionSlot = (
    <div className="flex items-center gap-2">
      {status === "authenticated" ? (
        <Button
          variant="outline"
          onClick={() => signOut({ callbackUrl: "/productlist" })}
        >
          Logout
        </Button>
      ) : (
        <Button onClick={() => router.push("/login")}>Login</Button>
      )}
    </div>
  );

  const content = (
    <ProductListContent
      canEdit={isAdmin}
      title="Product List"
      subtitle={isAdmin ? "Browse and manage products." : "Browse available products."}
      actionSlot={isAdmin ? undefined : actionSlot}
    />
  );

  if (isAdmin) {
    return (
      <div className="min-h-screen bg-[#DBE2EF] flex flex-col md:flex-row">
        <Sidebar />
        <main className="flex-1 p-4 md:p-6">{content}</main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#DBE2EF] font-sans p-4 sm:p-6 lg:p-8">
      {content}
    </div>
  );
}
