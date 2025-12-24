"use client";

import React, { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { db } from "../../lib/firebase";
import { Product, Categories } from "../../lib/data"; 
import ProductPrintList from "../../component/ProductPrintList";

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
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Debounce only the filtering, not the input value
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 200);
    return () => clearTimeout(handler);
  }, [search]);

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

  const handlePrint = () => {
    window.print();
  };

  // Filter products by debounced search (nama_bisnis or kategori_bisnis)
  const filteredProducts = products.filter((p) => {
    const searchLower = debouncedSearch.toLowerCase();
    return (
      p.nama_bisnis.toLowerCase().includes(searchLower) ||
      p.kategori_bisnis.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="min-h-screen bg-[#DBE2EF] p-4">
      <div className="bg-[#DBE2EF] p-0">
        <h1 className="text-3xl font-bold mb-1 text-[#112D4E] print:hidden">Creativepreneur Store Print</h1>
        <p className="text-[#112D4E] mb-4 print:hidden">Print QR Cards for Products.</p>
        <div className="bg-[#3F72AF] rounded-xl px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 shadow print:hidden">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by business name or category..."
            className="w-full sm:w-96 px-4 py-2 rounded bg-white text-[#112D4E] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-200 shadow"
            style={{ minWidth: 0 }}
          />
          <div className="flex gap-2">          
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-[#112D4E] text-white font-semibold rounded hover:bg-blue-900 transition-colors shadow"
            >
              Print
            </button>
          </div>
        </div>
      </div>
      <ProductPrintList products={filteredProducts} />
    </div>
  );
}
