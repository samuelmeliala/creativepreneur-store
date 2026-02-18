"use client";

import React, { useEffect, useState } from "react";
import SearchInput from "../../../component/search";
import { ref, onValue } from "firebase/database";
import { db } from "../../../lib/firebase";
import { Product, Categories } from "../../../lib/data";
import ProductPrintList from "../../../component/ProductPrintList";

const categoryList: Categories[] = [
  "Advertising, Printing, & Media",
  "Ceramics, Glass & Porcelain",
  "Food & Beverages",
  "Automotive & Components",
  "Computer & Services",
  "Wood Industry",
  "Fashion",
  "Perdagangan",
  "Craft / Kriya",
  "Sports",
  "Cosmetics & Household",
  "Others",
];
const toString = (value: unknown): string => (typeof value === "string" ? value : "");
const normalizeCategory = (value: unknown): Categories => {
  if (typeof value !== "string") {
    return "Others";
  }
  return categoryList.includes(value as Categories)
    ? (value as Categories)
    : "Others";
};


export default function PrintProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [printMode, setPrintMode] = useState<'selected' | 'all' | null>(null);

  // Debounce only the filtering, not the input value
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 200);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  useEffect(() => {
    const productsRef = ref(db, "/");
    const unsubscribe = onValue(productsRef, (snapshot) => {
      const data = snapshot.val() as Record<string, any> | any[] | null;
      if (data) {
        const arrayData: any[] = Array.isArray(data)
          ? (data.filter(Boolean) as any[])
          : (Object.values(data) as any[]);
        const mapped: Product[] = arrayData.map((item) => ({
          nama: toString(item["Nama"]),
          nim: toString(item["NIM"]),
          no_hp: toString(item["Nomor Telepon"]),
          nama_bisnis: toString(item["Nama Bisnis"]),
          tanggal_berdiri: toString(item["Tanggal Berdiri"]),
          kategori_bisnis: normalizeCategory(item["Kategori Bisnis"]),
          nama_produk: toString(item["Nama Produk"]),
          id: toString(item["id"] ?? item["NIM"] ?? item["Nama Produk"] ?? ""),
          nomer_induk_barang: toString(item["Nomer Induk Barang"] ?? ""),
          lokasi_barang: toString(item["Lokasi Barang"] ?? ""),
          stok_barang: toString(item["Stok Barang"] ?? ""),
          harga_produk: toString(item["Harga Produk"]),
          tanggal_diserahkan: toString(item["Tanggal Diserahkan"]),
          foto_produk: toString(item["Foto Produk"]),
        }));
        setProducts(mapped);
      } else {
        setProducts([]);
      }
    });
    return () => unsubscribe();
  }, []);

  const handlePrintSelected = () => {
    setPrintMode('selected');
    setTimeout(() => window.print(), 100);
  };

  const handlePrintAll = () => {
    setPrintMode('all');
    setTimeout(() => window.print(), 100);
  };

  // Filter products by debounced search (nama_bisnis or nama_produk only)
  const filteredProducts = products.filter((p) => {
    const searchLower = debouncedSearch.toLowerCase();
    return (
      p.nama_bisnis.toLowerCase().includes(searchLower) ||
      p.nama_produk.toLowerCase().includes(searchLower)
    );
  });

  // Only show selected products for printing, or all if none selected
  const productsToPrint = selectedIds.length > 0
    ? filteredProducts.filter((p) => selectedIds.includes(p.id))
    : [];

  // Handler for selection toggle
  const handleSelect = (id: string, checked: boolean) => {
    setSelectedIds((prev) =>
      checked ? [...prev, id] : prev.filter((x) => x !== id)
    );
  };

  return (
    <div className="min-h-screen bg-[#DBE2EF] p-4">
      <div className="bg-[#DBE2EF] p-0">
        <h1 className="text-3xl font-bold mb-1 text-[#112D4E] print:hidden">Product Cards</h1>
        <p className="text-[#112D4E] mb-4 print:hidden">Print QR Cards for Products.</p>
        <div className="bg-[#3F72AF] rounded-xl px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 shadow print:hidden">
          <div className="w-full sm:flex-1 sm:max-w-3xl">
            <SearchInput
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              clearSearch={() => setSearchTerm("")}
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={handlePrintSelected}
              className="px-4 py-2 bg-[#112D4E] text-white font-semibold rounded hover:bg-blue-900 transition-colors shadow"
              disabled={selectedIds.length === 0}
              title={selectedIds.length === 0 ? 'Select at least one card to print' : 'Print selected cards'}
            >
              Print Selected
            </button>
            <button
              onClick={handlePrintAll}
              className="px-4 py-2 bg-[#3F72AF] border border-[#112D4E] text-[#112D4E] font-semibold rounded hover:bg-blue-100 transition-colors shadow"
              title="Print all products"
            >
              Print All
            </button>
          </div>
        </div>
      </div>
      {/* Show all cards for selection, but hide in print mode if printing selected or all */}
      <div className={printMode ? 'print:hidden' : ''}>
        <ProductPrintList
          products={filteredProducts}
          selectedIds={selectedIds}
          onSelect={handleSelect}
        />
      </div>
      {/* Print area for selected or all cards */}
      {printMode === 'selected' && selectedIds.length > 0 && (
        <div className="print:block hidden">
          <ProductPrintList products={productsToPrint} />
        </div>
      )}
      {printMode === 'all' && (
        <div className="print:block hidden">
          <ProductPrintList products={filteredProducts} />
        </div>
      )}
      <footer className="text-center mt-8 text-gray-500 text-sm">
        <div className="mt-2 text-xs text-gray-500">
          Creativepreneurship Department Binus Bandung © 2025
        </div>
      </footer>
      {/* Reset printMode after printing */}
      <style>{`
        @media print {
          body:after { content: ''; display: none !important; }
        }
      `}</style>
      {printMode && (
        <script
          dangerouslySetInnerHTML={{
            __html: `window.onafterprint = function(){window.setTimeout(function(){window.onafterprint=null;document.querySelector('[data-print-mode-reset]')?.click();}, 100);}`
          }}
        />
      )}
      <button
        type="button"
        data-print-mode-reset
        style={{ display: 'none' }}
        onClick={() => setPrintMode(null)}
      />
    </div>
  );
}
