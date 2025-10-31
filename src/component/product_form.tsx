"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { ProductPayload, Categories, CATEGORY_LIST } from "../lib/data";
import { Button } from "../component/ui/button";
import { saveProductWithCloudinary } from "../lib/saveProductCloud";

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

const DEFAULT_LOKASI = "Binus Bandung Paskal";

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
  nomer_induk_barang: "",
  lokasi_barang: DEFAULT_LOKASI,
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
  const isEditing = Boolean(initialData);

  const resolvedInitial = useMemo(() => {
    if (initialData) {
      return {
        ...INITIAL_FORM_STATE,
        ...initialData,
        lokasi_barang: initialData.lokasi_barang || DEFAULT_LOKASI,
      };
    }
    return INITIAL_FORM_STATE;
  }, [initialData]);

  const [formData, setFormData] = useState<ProductFormData>(resolvedInitial);

  // NEW: hold selected file + preview (not in your payload)
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");

  useEffect(() => {
    setFormData(resolvedInitial);
    setFile(null);
    setPreview(initialData?.foto_produk ? initialData.foto_produk : "");
  }, [resolvedInitial, initialData?.foto_produk]);

  const isFieldDisabled = (field: keyof ProductFormData) => {
    if (isEditing) {
      // When editing only lokasi_barang and stok_barang are editable
      if (field === "lokasi_barang") return !lokasiEditable;
      if (field === "stok_barang") return false;
      return true;
    }

    // Not editing: follow props for participant / lokasi fields
    if (
      field === "nama" ||
      field === "nim" ||
      field === "no_hp" ||
      field === "nama_bisnis" ||
      field === "tanggal_berdiri" ||
      field === "nama_produk" ||
      field === "harga_produk" ||
      field === "tanggal_diserahkan" ||
      field === "foto_produk"
    ) {
      return !participantEditable;
    }
    if (field === "lokasi_barang") return !lokasiEditable;
    return false;
  };

  const inputBaseClass =
    "mt-1 w-full rounded-md border px-3 py-2 text-black focus:border-blue-500 focus:ring-2 focus:ring-blue-500";

  const getInputClass = (field: keyof ProductFormData) => {
    const disabled = isFieldDisabled(field);
    // When disabled, use gray text and slightly muted bg + gray border
    if (disabled) {
      return (
        inputBaseClass +
        " bg-gray-50 text-gray-500 border-gray-200 placeholder-gray-400"
      );
    }
    return inputBaseClass + " border-gray-300 text-black placeholder-gray-400";
  };

  // File input ref (used by the "Pilih Gambar" button)
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // NEW: handle the file input separately (uncontrolled).
  const handleFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const f = event.target.files?.[0] ?? null;
    setFile(f);
    const url = f ? URL.createObjectURL(f) : "";
    setPreview(url);
    if (url) {
      setFormData((prev) => ({ ...prev, foto_produk: url }));
    }
  };

  // Revoke object URL when preview changes or component unmounts
  useEffect(() => {
    return () => {
      if (preview && preview.startsWith("blob:")) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // If a new file is picked, upload it and set foto_produk to the URL
    let payload: ProductFormData = { ...formData };

    if (file && !isFieldDisabled("foto_produk")) {
      if (!file.type.startsWith("image/")) {
        alert("File harus berupa gambar.");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert("Ukuran gambar harus < 5MB.");
        return;
      }

      // Upload -> get URL
      const { imageUrl } = await saveProductWithCloudinary(file, {
      name: formData.nama_produk || "Produk",
      price: Number(String(formData.harga_produk).replace(/[^\d]/g, "") || 0),
      category: String(formData.kategori_bisnis),
      description: formData.nama_bisnis || "",
    });

      payload = { ...payload, foto_produk: imageUrl };
    }

    // Submit the final payload (with uploaded image URL when applicable)
    await onSubmit(payload);

    // Cleanup blob preview and file state after successful submit
    if (preview && preview.startsWith("blob:")) {
      try {
        URL.revokeObjectURL(preview);
      } catch (_) {
        /* ignore */
      }
    }
    setFile(null);
    setPreview("");
  };

  const resetForm = () => {
    setFormData(resolvedInitial);
    setFile(null);
    setPreview("");
  };

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
              readOnly={isFieldDisabled("nama")}
              disabled={isFieldDisabled("nama")}
              className={getInputClass("nama")}
              placeholder="John Doe"
            />
            {isFieldDisabled("nama") && (
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
              readOnly={isFieldDisabled("nim")}
              disabled={isFieldDisabled("nim")}
              className={getInputClass("nim")}
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
              readOnly={isFieldDisabled("no_hp")}
              disabled={isFieldDisabled("no_hp")}
              className={getInputClass("no_hp")}
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
              readOnly={isFieldDisabled("nama_bisnis")}
              disabled={isFieldDisabled("nama_bisnis")}
              className={getInputClass("nama_bisnis")}
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
              value={formData.tanggal_berdiri}
              onChange={handleChange}
              required
              readOnly={isFieldDisabled("tanggal_berdiri")}
              disabled={isFieldDisabled("tanggal_berdiri")}
              className={getInputClass("tanggal_berdiri")}
              placeholder="1 Januari 2099"
            />
          </div>
          
          <div>
            <label htmlFor="foto_produk" className="block text-sm font-medium text-gray-700">
              Foto Produk
            </label>
            <input
              id="foto_produk"
              name="foto_produk"
              type="file"
              accept="image/*"
              onChange={handleFile}
              ref={(el) => {
                fileInputRef.current = el;
              }}
              readOnly={isFieldDisabled("foto_produk")}
              disabled={isFieldDisabled("foto_produk")}
              className="sr-only"
            />
            <div className="mt-2 flex items-center gap-2">
              <Button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isFieldDisabled("foto_produk")}
              >
                Pilih Gambar
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  // Clear the native file input's value so the browser UI shows no file selected
                  if (fileInputRef.current) {
                    try {
                      fileInputRef.current.value = "";
                    } catch (_) {
                      /* ignore */
                    }
                  }

                  // Revoke blob preview URL if present
                  if (preview && preview.startsWith("blob:")) {
                    try {
                      URL.revokeObjectURL(preview);
                    } catch (_) {
                      /* ignore */
                    }
                  }

                  setFile(null);
                  setPreview("");
                  setFormData((prev) => ({ ...prev, foto_produk: "" }));
                }}
                disabled={isFieldDisabled("foto_produk")}
              >
                Hapus
              </Button>
            </div>
            <div className="mt-2">
              <div
                className={
                  "w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 truncate"
                }
                title={file?.name || (formData.foto_produk ? String(formData.foto_produk).split("/").pop() : "No file selected")}
              >
                {file?.name || (formData.foto_produk ? String(formData.foto_produk).split("/").pop() : "No file selected")}
              </div>
            </div>

            {preview && (
              <img
                src={preview}
                alt="Preview"
                className="mt-2 h-32 object-cover rounded"
              />
            )}
            {!!formData.foto_produk && !preview && (
              <img
                src={formData.foto_produk}
                alt="Current"
                className="mt-2 h-32 object-cover rounded"
              />
            )}
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
              disabled={isFieldDisabled("kategori_bisnis")}
              className={getInputClass("kategori_bisnis")}
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
              readOnly={isFieldDisabled("nama_produk")}
              disabled={isFieldDisabled("nama_produk")}
              className={getInputClass("nama_produk")}
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
              readOnly={isFieldDisabled("harga_produk")}
              disabled={isFieldDisabled("harga_produk")}
              className={getInputClass("harga_produk")}
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
              value={formData.tanggal_diserahkan}
              onChange={handleChange}
              required
              readOnly={isFieldDisabled("tanggal_diserahkan")}
              disabled={isFieldDisabled("tanggal_diserahkan")}
              className={getInputClass("tanggal_diserahkan")}
              placeholder="1 Januari 2099"
            />
          </div>

          

          <div>
            <label htmlFor="lokasi_barang" className="block text-sm font-medium text-gray-700">
              Lokasi
            </label>
            <input
              id="lokasi_barang"
              name="lokasi_barang"
              value={formData.lokasi_barang}
              onChange={handleChange}
              required
              readOnly={isFieldDisabled("lokasi_barang")}
              disabled={isFieldDisabled("lokasi_barang")}
              className={getInputClass("lokasi_barang")}
              placeholder="Jakarta"
            />
            {isFieldDisabled("lokasi_barang") && (
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
              readOnly={isFieldDisabled("stok_barang")}
              disabled={isFieldDisabled("stok_barang")}
              className={getInputClass("stok_barang")}
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
