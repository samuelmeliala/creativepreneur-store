"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { ref, onValue } from "firebase/database";
import { db } from "../lib/firebase";
import SearchInput from "../component/search";
import { Product, Categories } from "../lib/data";
import ProductTable from "../component/product_table";

type FirebaseProduct = Record<string, unknown>;
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

export default function ProductDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortKey, setSortKey] = useState<keyof Product>("nama_produk");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  useEffect(() => {
    const productsRef = ref(db, "/");
    const unsubscribe = onValue(productsRef, (snapshot) => {
      const data = snapshot.val() as
        | Record<string, FirebaseProduct>
        | FirebaseProduct[]
        | null;
      console.log("🔥 Raw Firebase data:", data);

      if (data) {
        const arrayData: FirebaseProduct[] = Array.isArray(data)
          ? (data.filter(Boolean) as FirebaseProduct[])
          : (Object.values(data) as FirebaseProduct[]);

        const mapped: Product[] = arrayData.map((item) => ({
          nama: toString(item["Nama"]),
          nim: toString(item["NIM"]),
          no_hp: toString(item["Nomor Telepon"]),
          nama_bisnis: toString(item["Nama Bisnis"]),
          tanggal_berdiri: toString(item["Tanggal Berdiri"]),
          kategori_bisnis: normalizeCategory(item["Kategori Bisnis"]),
          nama_produk: toString(item["Nama Produk"]),
          harga_produk: toString(item["Harga Produk"]),
          tanggal_diserahkan: toString(item["Tanggal Diserahkan"]),
          foto_produk: toString(item["Foto Produk"]),
        }));

        console.log("✅ Mapped products:", mapped);
        setProducts(mapped);
      } else {
        setProducts([]);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleSort = (key: keyof Product) => {
    if (key === sortKey) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  const filteredAndSortedProducts = useMemo(() => {
    if (!Array.isArray(products)) return [];

    const normalizedTerm = searchTerm.trim().toLowerCase();

    const result = products.filter((product) => {
      if (!normalizedTerm) return true;

      const haystacks = [product.nama_produk, product.nama, product.nama_bisnis];

      return haystacks.some((value) =>
        (value ?? "").toLowerCase().includes(normalizedTerm)
      );
    });

    result.sort((a, b) => {
      const valA = a[sortKey];
      const valB = b[sortKey];

      if (typeof valA === "number" && typeof valB === "number") {
        return sortOrder === "asc" ? valA - valB : valB - valA;
      }

      if (String(valA) < String(valB)) return sortOrder === "asc" ? -1 : 1;
      if (String(valA) > String(valB)) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    return result;
  }, [products, searchTerm, sortKey, sortOrder]);

  return (
    <div className="min-h-screen bg-gray-100 font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-full mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800">Creativepreneur Store Dashboard</h1>
          <p className="text-lg text-gray-600 mt-1">
            Product Inventory Management.
          </p>
        </header>

        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="w-full sm:flex-1 sm:max-w-3xl">
              <SearchInput
                value={searchTerm}
                onChange={setSearchTerm}
                onClear={() => setSearchTerm("")}
              />
            </div>
            <Link
              href="/newproduct"
              className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 font-medium text-white shadow transition-colors hover:bg-blue-700"
            >
              Add Product
            </Link>
          </div>
        </div>

        <ProductTable
          products={filteredAndSortedProducts}
          sortKey={sortKey}
          sortOrder={sortOrder}
          onSort={handleSort}
        />

        <footer className="text-center mt-8 text-gray-500 text-sm">
          <p>
            Showing {filteredAndSortedProducts.length} of {products.length} products.
          </p>
        </footer>
      </div>
    </div>
  );
}
