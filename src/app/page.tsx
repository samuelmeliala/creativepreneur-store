"use client";

import { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { db } from "../lib/firebase";

// Definisikan interface sesuai data di Firebase
interface Product {
  biaya_prototype: string;
  foto: string;
  harga: string;
  kode: string;
  link: string;
  nama: string;
  nim: string;
  no_hp: string;
  produk: string;
}

export default function HomePage() {
  const [products, setProducts] = useState<Record<string, Product> | null>(null);

  useEffect(() => {
    // Data kamu ada langsung di root "/"
    const productsRef = ref(db, "/");
    const unsubscribe = onValue(productsRef, (snapshot) => {
      if (snapshot.exists()) {
        setProducts(snapshot.val());
      } else {
        setProducts({});
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Daftar Produk</h2>

      {!products ? (
        <p>Loading...</p>
      ) : Object.keys(products).length === 0 ? (
        <p>Tidak ada produk</p>
      ) : (
        <div className="space-y-4">
          {Object.entries(products).map(([id, product]) => (
            <div
              key={id}
              className="p-4 bg-white rounded-xl shadow-md border border-gray-200"
            >
              <h3 className="font-bold text-lg">{product.produk}</h3>
              <p className="text-gray-600">Harga: Rp {parseInt(product.harga).toLocaleString("id-ID")}</p>
              <p>Biaya Prototype: Rp {parseInt(product.biaya_prototype).toLocaleString("id-ID")}</p>
              <p>Kode: {product.kode}</p>
              <p>Nama: {product.nama}</p>
              <p>NIM: {product.nim}</p>
              <p>No HP: {product.no_hp}</p>
              {product.link && (
                <a
                  href={product.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 underline"
                >
                  Link Produk
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
