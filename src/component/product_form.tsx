"use client";

import React, { useState } from "react";
import { Product, Categories } from "../lib/data";
import { Button } from "../component/ui/button";

export type ProductFormData = Product;

type ProductFormProps = {
  isSubmitting: boolean;
  onSubmit: (product: ProductFormData) => Promise<void> | void;
};

const CATEGORY_OPTIONS: Categories[] = [
  'Advertising, Printing, & Media',
  'Ceramics, Glass & Porcelain',
  'Food & Beverages',
  'Automotive & Components',
  'Computer & Services',
  'Wood Industry',
  'Fashion',
  'Perdagangan',
  'Craft / Kriya',
  'Sports',
  'Others',
];

const INITIAL_FORM_STATE: ProductFormData = {
  nama: "",
  nim: "",
  no_hp: "",
  nama_bisnis: "",
  tanggal_berdiri: "",
  kategori_bisnis: CATEGORY_OPTIONS[0],
  nama_produk: "",
  harga_produk: "",
  tanggal_diserahkan: "",
  foto_produk: "",
};

const ProductForm: React.FC<ProductFormProps> = ({ isSubmitting, onSubmit }) => {
  const [formData, setFormData] = useState<ProductFormData>(INITIAL_FORM_STATE);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await onSubmit(formData);
  };

  const resetForm = () => setFormData(INITIAL_FORM_STATE);

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 md:p-8 rounded-xl shadow space-y-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label htmlFor="nama" className="block text-sm font-medium text-gray-700">
              Nama Mahasiswa
            </label>
            <input
              id="nama"
              name="nama"
              value={formData.nama}
              onChange={handleChange}
              required
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-black focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label htmlFor="nim" className="block text-sm font-medium text-gray-700">
              NIM
            </label>
            <input
              id="nim"
              name="nim"
              value={formData.nim}
              onChange={handleChange}
              required
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-black focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
              placeholder="2501XXXXXX"
            />
          </div>

          <div>
            <label htmlFor="no_hp" className="block text-sm font-medium text-gray-700">
              Nomor Telepon
            </label>
            <input
              id="no_hp"
              name="no_hp"
              value={formData.no_hp}
              onChange={handleChange}
              required
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-black focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
              placeholder="08XXXXXXXXXX"
            />
          </div>

          <div>
            <label htmlFor="nama_bisnis" className="block text-sm font-medium text-gray-700">
              Nama Bisnis
            </label>
            <input
              id="nama_bisnis"
              name="nama_bisnis"
              value={formData.nama_bisnis}
              onChange={handleChange}
              required
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-black focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
              placeholder="Nama brand"
            />
          </div>

          <div>
            <label
              htmlFor="tanggal_berdiri"
              className="block text-sm font-medium text-gray-700"
            >
              Tanggal Berdiri
            </label>
            <input
              id="tanggal_berdiri"
              name="tanggal_berdiri"
              type="date"
              value={formData.tanggal_berdiri}
              onChange={handleChange}
              required
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-black focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label
              htmlFor="kategori_bisnis"
              className="block text-sm font-medium text-gray-700"
            >
              Kategori Bisnis
            </label>
            <select
              id="kategori_bisnis"
              name="kategori_bisnis"
              value={formData.kategori_bisnis}
              onChange={handleChange}
              required
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-black focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
            >
              {CATEGORY_OPTIONS.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="nama_produk" className="block text-sm font-medium text-gray-700">
              Nama Produk
            </label>
            <input
              id="nama_produk"
              name="nama_produk"
              value={formData.nama_produk}
              onChange={handleChange}
              required
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-black focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
              placeholder="Nama produk"
            />
          </div>

          <div>
            <label htmlFor="harga_produk" className="block text-sm font-medium text-gray-700">
              Harga Produk
            </label>
            <input
              id="harga_produk"
              name="harga_produk"
              value={formData.harga_produk}
              onChange={handleChange}
              required
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-black focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
              placeholder="RpXXX.XXX"
            />
          </div>

          <div>
            <label
              htmlFor="tanggal_diserahkan"
              className="block text-sm font-medium text-gray-700"
            >
              Tanggal Diserahkan
            </label>
            <input
              id="tanggal_diserahkan"
              name="tanggal_diserahkan"
              type="date"
              value={formData.tanggal_diserahkan}
              onChange={handleChange}
              required
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-black focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="foto_produk" className="block text-sm font-medium text-gray-700">
              URL Foto Produk
            </label>
            <input
              id="foto_produk"
              name="foto_produk"
              value={formData.foto_produk}
              onChange={handleChange}
              required
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-black focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
              placeholder="https://"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-gray-200">
        <Button
          type="button"
          variant="secondary"
          onClick={resetForm}
          disabled={isSubmitting}
        >
          Reset
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Add Product"}
        </Button>
      </div>
    </form>
  );
};

export default ProductForm;
