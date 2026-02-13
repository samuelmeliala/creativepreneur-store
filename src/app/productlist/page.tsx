"use client";

import { Suspense, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import ProductListContent from "../../component/productlist-content";
import Sidebar from "../../component/sidebar";
import { Button } from "../../component/ui/button";

type Role = "admin" | "mahasiswa";

function ProductListPageContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const role = (session?.user as any)?.role as Role | undefined;
  const isAdmin = role === "admin";
  const isMahasiswa = role === "mahasiswa";
  const [showSuccess, setShowSuccess] = useState(false);
  const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);
  const addedParam = searchParams.get("added");
  const deletedParam = searchParams.get("deleted");

  useEffect(() => {
    if (addedParam !== "1") return;

    setShowSuccess(true);
    const timer = setTimeout(() => setShowSuccess(false), 4000);
    router.replace("/productlist");

    return () => clearTimeout(timer);
  }, [addedParam, router]);

  useEffect(() => {
    if (deletedParam !== "1") return;

    setShowDeleteSuccess(true);
    const timer = setTimeout(() => setShowDeleteSuccess(false), 4000);
    router.replace("/productlist");

    return () => clearTimeout(timer);
  }, [deletedParam, router]);

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

  const successPopup = showSuccess ? (
    <div className="fixed inset-0 z-50 flex items-start justify-center sm:justify-end px-4 pt-6 pointer-events-none">
      <div
        role="status"
        aria-live="polite"
        className="pointer-events-auto w-full sm:max-w-sm rounded-xl border border-green-200 bg-white shadow-lg shadow-green-100"
      >
        <div className="flex items-start gap-3 p-4">
          <div className="mt-1 h-3 w-3 rounded-full bg-green-500" aria-hidden="true" />
          <div className="flex-1 text-sm text-gray-800">
            <p className="font-semibold text-[#112D4E]">Product added</p>
            <p>Produk berhasil ditambahkan ke daftar.</p>
          </div>
          <button
            type="button"
            className="text-sm text-gray-400 hover:text-gray-600"
            onClick={() => setShowSuccess(false)}
          >
            Close
          </button>
        </div>
        <div className="h-1 rounded-b-xl bg-gradient-to-r from-green-400 to-emerald-500" />
      </div>
    </div>
  ) : null;

  const deleteSuccessPopup = showDeleteSuccess ? (
    <div className="fixed inset-0 z-50 flex items-start justify-center sm:justify-end px-4 pt-6 pointer-events-none">
      <div
        role="status"
        aria-live="polite"
        className="pointer-events-auto w-full sm:max-w-sm rounded-xl border border-red-200 bg-white shadow-lg shadow-red-100"
      >
        <div className="flex items-start gap-3 p-4">
          <div className="mt-1 h-3 w-3 rounded-full bg-red-500" aria-hidden="true" />
          <div className="flex-1 text-sm text-gray-800">
            <p className="font-semibold text-[#112D4E]">Product deleted</p>
            <p>Produk berhasil dihapus dari daftar.</p>
          </div>
          <button
            type="button"
            className="text-sm text-gray-400 hover:text-gray-600"
            onClick={() => setShowDeleteSuccess(false)}
          >
            Close
          </button>
        </div>
        <div className="h-1 rounded-b-xl bg-gradient-to-r from-red-400 to-rose-500" />
      </div>
    </div>
  ) : null;

  if (isAdmin || isMahasiswa) {
    return (
      <>
        <div className="min-h-screen bg-[#DBE2EF] flex flex-col md:flex-row">
          <Sidebar />
          <main className="flex-1 p-4 md:p-6">{content}</main>
        </div>
        {successPopup}
        {deleteSuccessPopup}
      </>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-[#DBE2EF] font-sans p-4 sm:p-6 lg:p-8">
        {content}
      </div>
      {successPopup}
      {deleteSuccessPopup}
    </>
  );
}

export default function ProductListPage() {
  return (
    <Suspense fallback={<div className="p-4 text-[#112D4E]">Loading products…</div>}>
      <ProductListPageContent />
    </Suspense>
  );
}
