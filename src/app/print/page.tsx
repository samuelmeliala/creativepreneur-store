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

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-2 print:hidden">Print Product Cards</h1>
      <div className="flex justify-between items-center mb-4 print:hidden">
        <a
          href="/"
          className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition-colors"
        >
          Back
        </a>
        <button
          onClick={handlePrint}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Print
        </button>
      </div>
      <ProductPrintList products={products} />
    </div>
  );
}
