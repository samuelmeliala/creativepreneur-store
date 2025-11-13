"use client";

import React, { useState, useEffect, useMemo } from "react";
import { ref, onValue } from "firebase/database";
import { db } from "../../lib/firebase";
import SearchInput from "../../component/search";
import {
  Product,
  FirebaseProduct,
  mapFirebaseProduct,
  ProductSortKey,
} from "../../lib/data";
import ProductTable from "../../component/product_table";
import { Button } from "../../component/ui/button";
import Link from "next/link";

export default function ProductListPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortKey, setSortKey] = useState<ProductSortKey>("nama_produk");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  useEffect(() => {
    const productsRef = ref(db, "/");
    const unsubscribe = onValue(productsRef, (snapshot) => {
      const data = snapshot.val() as
        | Record<string, FirebaseProduct>
        | FirebaseProduct[]
        | null;

      if (data) {
        const mapped: Product[] = Array.isArray(data)
          ? (data
              .map((item, index) =>
                item
                  ? mapFirebaseProduct(String(index), item as FirebaseProduct)
                  : null
              )
              .filter(Boolean) as Product[])
          : Object.entries(data).map(([id, value]) =>
              mapFirebaseProduct(id, value as FirebaseProduct)
            );

        setProducts(mapped);
      } else {
        setProducts([]);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleSort = (key: ProductSortKey) => {
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

      const haystacks = [
        product.nama_produk,
        product.nama,
        product.nama_bisnis,
        product.nim,
        product.lokasi_barang,
        product.stok_barang,
      ];

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
    <div className="min-h-screen bg-[#DBE2EF] font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-full mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-[#112D4E]">Product List</h1>
          <p className="text-sm text-[#112D4E] mt-1">Browse and manage products.</p>
        </header>

        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="w-full sm:flex-1 sm:max-w-3xl">
              <SearchInput
                value={searchTerm}
                onChange={setSearchTerm}
                onClear={() => setSearchTerm("")}
              />
            </div>
            <div className="flex gap-2">
              <Link href="/newproduct">
                <Button>Add Product</Button>
              </Link>
              <Link href="/print">
                <Button variant="secondary">Print Cards</Button>
              </Link>
            </div>
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
