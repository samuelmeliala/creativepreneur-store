"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { ref, get, update } from "firebase/database";
import ProductForm, { ProductFormData } from "../../../component/product_form";
import { Button } from "../../../component/ui/button";
import {
  db,
} from "../../../lib/firebase";
import {
  mapFirebaseProduct,
  FirebaseProduct,
  productToSharedFirebasePayload,
  normalizeProductName,
} from "../../../lib/data";

const PRODUCTS_PATH = "/";

const EditProductPage: React.FC = () => {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const productId = useMemo(() => {
    const value = params?.id;
    if (Array.isArray(value)) {
      return value[0];
    }
    return value ?? "";
  }, [params]);

  const [initialData, setInitialData] = useState<ProductFormData | null>(null);
  const [groupKey, setGroupKey] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!productId) {
      setError("Missing product identifier.");
      setIsLoading(false);
      return;
    }

    const productRef = ref(db, `${PRODUCTS_PATH}${productId}`);
    get(productRef)
      .then((snapshot) => {
        if (!snapshot.exists()) {
          setError("Product not found.");
          return;
        }

        const data = snapshot.val() as FirebaseProduct;
        const mapped = mapFirebaseProduct(productId, data);
        setGroupKey(normalizeProductName(mapped.nama_produk));
        const { id: ignoredId, ...payload } = mapped;
        void ignoredId;
        setInitialData(payload);
      })
      .catch((err) => {
        console.error("Failed to load product", err);
        setError("Failed to load product. Please try again later.");
      })
      .finally(() => setIsLoading(false));
  }, [productId]);

  const handleSubmit = async (product: ProductFormData) => {
    if (!productId) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const productsRef = ref(db, PRODUCTS_PATH);
      const snapshot = await get(productsRef);

      if (!snapshot.exists()) {
        throw new Error("Product list is empty.");
      }

      const data = snapshot.val();
      const targetKey = groupKey ?? normalizeProductName(product.nama_produk);
      const sharedPayload = productToSharedFirebasePayload(product);
      const updates: Record<string, FirebaseProduct> = {};

      const applyUpdate = (key: string, value: FirebaseProduct | null | undefined) => {
        if (!value) return;
        const currentName = typeof value["Nama Produk"] === "string" ? value["Nama Produk"] as string : "";
        if (normalizeProductName(currentName) === targetKey) {
          updates[key] = {
            ...value,
            ...sharedPayload,
          } as FirebaseProduct;
        }
      };

      if (Array.isArray(data)) {
        data.forEach((value, index) => {
          applyUpdate(String(index), value as FirebaseProduct | null | undefined);
        });
      } else {
        Object.entries(data as Record<string, FirebaseProduct | null | undefined>).forEach(
          ([key, value]) => applyUpdate(key, value)
        );
      }

      if (Object.keys(updates).length === 0) {
        // Fallback: update only the targeted product record
        const productRef = ref(db, `${PRODUCTS_PATH}${productId}`);
        await update(productRef, sharedPayload);
      } else {
        await update(productsRef, updates);
      }

      router.push("/");
    } catch (err) {
      console.error("Failed to update product", err);
      setError("Failed to update product. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Edit Product</h1>
            <p className="text-gray-600">Update the fields below to modify the product.</p>
          </div>
          <Button type="button" variant="secondary" onClick={() => router.push("/")}>
            Back to Dashboard
          </Button>
        </div>

        {isLoading && (
          <div className="rounded-md border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700">
            Loading product information...
          </div>
        )}

        {error && (
          <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {!isLoading && !error && initialData && (
          <ProductForm
            isSubmitting={isSubmitting}
            onSubmit={handleSubmit}
            initialData={initialData}
            submitLabel="Update Product"
            onCancel={() => router.push("/")}
          />
        )}
      </div>
    </main>
  );
};

export default EditProductPage;
