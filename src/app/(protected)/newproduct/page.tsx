"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ref, push, get } from "firebase/database";
import ProductForm, { ProductFormData } from "../../../component/product_form";
import { db } from "../../../lib/firebase";
import {
  FirebaseProduct,
  mapFirebaseProduct,
  Product,
  productToFirebasePayload,
} from "../../../lib/data";
import { generateNomerIndukBarang } from "../../../lib/nomerIndukBarang";

const PRODUCTS_PATH = "/";

const AddProductPage: React.FC = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (product: ProductFormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const productsRef = ref(db, PRODUCTS_PATH);
      let existingProducts: Product[] = [];
      const snapshot = await get(productsRef);
      if (snapshot.exists()) {
        const data = snapshot.val();
        if (Array.isArray(data)) {
          existingProducts = data
            .map((value, index) =>
              value ? mapFirebaseProduct(String(index), value as FirebaseProduct) : null
            )
            .filter(Boolean) as Product[];
        } else {
          existingProducts = Object.entries(
            data as Record<string, FirebaseProduct | null | undefined>
          )
            .map(([key, value]) =>
              value ? mapFirebaseProduct(key, value) : null
            )
            .filter(Boolean) as Product[];
        }
      }

      const nomerIndukBarang =
        product.nomer_induk_barang ||
        generateNomerIndukBarang(product, existingProducts) ||
        "";

      const payload = productToFirebasePayload({
        ...product,
        nomer_induk_barang: nomerIndukBarang,
      });

      await push(productsRef, payload);
      router.push("/productlist?added=1");
    } catch (err) {
      console.error("Failed to add product", err);
      setError("Failed to add product. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <main className="min-h-screen bg-[#DBE2EF] font-sans p-4 sm:p-6 lg:p-8">
        <div className="max-w-full mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <header>
              <h1 className="text-3xl font-bold text-[#112D4E]">Add Product</h1>
              <p className="text-sm text-[#112D4E] mt-1">Fill in the form below to add a new product.</p>
            </header>
          </div>

          {error && (
            <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}
          <ProductForm
            isSubmitting={isSubmitting}
            onSubmit={handleSubmit}
            submitLabel="Submit Product"
            onCancel={() => router.push("/")}
            lokasiEditable={false}
          />
        </div>
      </main>
    </>
  );
};

export default AddProductPage;
