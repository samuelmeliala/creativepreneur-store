"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { ref, get, update, remove } from "firebase/database";
import ProductForm, { ProductFormData } from "../../../../component/product_form";
import { Button } from "../../../../component/ui/button";
import {
  db,
} from "../../../../lib/firebase";
import {
  mapFirebaseProduct,
  FirebaseProduct,
  productToSharedFirebasePayload,
  normalizeProductName,
} from "../../../../lib/data";

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
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

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

  const handleDelete = async () => {
    if (!productId || isDeleting) return;
    setIsDeleting(true);
    setError(null);

    try {
      const productRef = ref(db, `${PRODUCTS_PATH}${productId}`);
      await remove(productRef);
      router.push("/productlist?deleted=1");
    } catch (err) {
      console.error("Failed to delete product", err);
      setError("Failed to delete product. Please try again.");
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#DBE2EF] font-sans p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-full space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[#112D4E]">Edit Product</h1>
            <p className="text-sm text-[#112D4E] mt-1">Update the fields below to modify the product.</p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="delete"
              className="border-red-200 text-red-700 hover:bg-red-50"
              onClick={() => setShowDeleteConfirm(true)}
              disabled={isSubmitting || isDeleting || isLoading || !!error || !initialData}
            >
              {isDeleting ? "Deleting..." : "Delete Product"}
            </Button>
            <Button
              type="button"
              variant="primary"
              onClick={() => router.push("/productlist")}
              disabled={isSubmitting || isDeleting}
            >
              Back to Product List
            </Button>
          </div>
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

      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div className="w-full max-w-md rounded-xl bg-white shadow-xl p-6 space-y-4">
            <div>
              <h2 className="text-xl font-semibold text-[#112D4E]">Delete product?</h2>
              <p className="mt-1 text-sm text-gray-600">
                This action cannot be undone. The product will be permanently removed from the database.
              </p>
            </div>
            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isDeleting}
              >
                Cancel
              </Button>
              <Button
                type="button"
                className="bg-red-600 hover:bg-red-700 text-white"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default EditProductPage;
