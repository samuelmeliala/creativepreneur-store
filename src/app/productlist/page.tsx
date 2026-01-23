"use client";

import { useSession } from "next-auth/react";
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
  const isMahasiswa = role === "mahasiswa";

  const actionSlot =
    status === "unauthenticated" ? (
      <div className="flex items-center gap-2">
        <Button onClick={() => router.push("/login")}>Login to add/edit products</Button>
      </div>
    ) : null;

  const content = (
    <ProductListContent
      canEdit={isAdmin}
      title="Creativepreneur Store Product List"
      subtitle={isAdmin ? "Browse and manage products." : "Browse available products."}
      actionSlot={isAdmin ? undefined : actionSlot}
    />
  );

  if (isAdmin || isMahasiswa) {
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
