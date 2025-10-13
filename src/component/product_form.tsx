"use client";

import React, { useEffect, useMemo, useState } from "react";
import { ProductPayload, Categories, CATEGORY_LIST } from "../lib/data";
import { Button } from "../component/ui/button";

export type ProductFormData = ProductPayload;

type ProductFormProps = {
  isSubmitting: boolean;
  onSubmit: (product: ProductFormData) => Promise<void> | void;
  initialData?: ProductFormData;
  submitLabel?: string;
  onCancel?: () => void;
  lokasiEditable?: boolean;
  participantEditable?: boolean;
};

const CATEGORY_OPTIONS: Categories[] = CATEGORY_LIST;

const DEFAULT_LOKASI = "Lokasi akan ditentukan melalui proses review";

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
  lokasi_status: DEFAULT_LOKASI,
  stok_barang: "",
};

const ProductForm: React.FC<ProductFormProps> = ({
  isSubmitting,
  onSubmit,
  initialData,
  submitLabel = "Save Product",
  onCancel,
  lokasiEditable = true,
  participantEditable = true,
}) => {
  const resolvedInitial = useMemo(() => {
    if (initialData) {
      return {
        ...INITIAL_FORM_STATE,
        ...initialData,
        lokasi: initialData.lokasi_status || DEFAULT_LOKASI,
      };
    }
    return INITIAL_FORM_STATE;
  }, [initialData]);

  const [formData, setFormData] = useState<ProductFormData>(resolvedInitial);

  useEffect(() => {
    setFormData(resolvedInitial);
  }, [resolvedInitial]);

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

  const resetForm = () => setFormData(resolvedInitial);

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
              readOnly={!participantEditable}
              disabled={!participantEditable}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-black focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
              placeholder="John Doe"
            />
            {!participantEditable && (
              <p className="mt-1 text-xs text-gray-500">Data mahasiswa tidak dapat diubah dari halaman ini.</p>
            )}
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
              readOnly={!participantEditable}
              disabled={!participantEditable}
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
              readOnly={!participantEditable}
              disabled={!participantEditable}
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

          <div>
            <label htmlFor="lokasi" className="block text-sm font-medium text-gray-700">
              Lokasi
            </label>
            <input
              id="lokasi"
              name="lokasi"
              value={formData.lokasi_status}
              onChange={handleChange}
              required
              readOnly={!lokasiEditable}
              disabled={!lokasiEditable}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-black focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
              placeholder="Jakarta"
            />
            {!lokasiEditable && (
              <p className="mt-1 text-xs text-gray-500">
                Lokasi akan dikonfirmasi oleh admin setelah produk direview.
              </p>
            )}
          </div>

          <div>
            <label htmlFor="stok_barang" className="block text-sm font-medium text-gray-700">
              Stok Barang
            </label>
            <input
              id="stok_barang"
              name="stok_barang"
              type="number"
              value={formData.stok_barang}
              onChange={handleChange}
              min="0"
              required
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-black focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
              placeholder="0"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-gray-200">
        <div className="flex gap-3">
          <Button
            type="button"
            variant="secondary"
            onClick={resetForm}
            disabled={isSubmitting}
          >
            Reset
          </Button>
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          )}
        </div>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : submitLabel}
        </Button>
      </div>
    </form>
  );
};

export default ProductForm;
