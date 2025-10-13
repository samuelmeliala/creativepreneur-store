"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ref, push } from "firebase/database";
import ProductForm, { ProductFormData } from "../../component/product_form";
import { db } from "../../lib/firebase";
import { productToFirebasePayload } from "../../lib/data";
import { Button } from "../../component/ui/button";

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
      await push(productsRef, productToFirebasePayload(product));
      router.push("/");
    } catch (err) {
      console.error("Failed to add product", err);
      setError("Failed to add product. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Add Product</h1>
            <p className="text-gray-600">Fill in the form below to add a new product.</p>
          </div>
          <Button
            type="button"
            variant="secondary"
            onClick={() => router.push("/")}
          >
            Back to Dashboard
          </Button>
        </div>

        {error && (
          <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}
        <ProductForm
          isSubmitting={isSubmitting}
          onSubmit={handleSubmit}
          submitLabel="Add Product"
          onCancel={() => router.push("/")}
          lokasiEditable={false}
        />
      </div>
    </main>
  );
};

export default AddProductPage;
