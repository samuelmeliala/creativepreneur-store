"use client";

import React, { useEffect, useState } from "react";
import QRCodeLib from "qrcode";
import { Product } from "../lib/data";

type Props = { product: Product };

const OfflineQRCode: React.FC<Props> = ({ product }) => {
  const [dataUrl, setDataUrl] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const textPayload = `nama: ${product.nama}\nnim: ${product.nim}\nno_hp: ${product.no_hp}\nnama_bisnis: ${product.nama_bisnis}\ntanggal_berdiri: ${product.tanggal_berdiri}\nkategori_bisnis: ${product.kategori_bisnis}\nnama_produk: ${product.nama_produk}\nid: ${product.id}\nnomer_induk_barang: ${product.nomer_induk_barang}\nlokasi_barang: ${product.lokasi_barang}\nstok_barang: ${product.stok_barang}\nharga_produk: ${product.harga_produk}\ntanggal_diserahkan: ${product.tanggal_diserahkan}\nfoto_produk: ${product.foto_produk}`;

    // Prefer PDF link when id is available (adjust as needed)
    const preferredUrl = (typeof window !== "undefined" && product.id)
      ? `${window.location.origin}/pdfs/${encodeURIComponent(product.id)}.pdf`
      : null;

    const qrValue = preferredUrl ?? textPayload;

    QRCodeLib.toDataURL(qrValue, { margin: 1, scale: 6 })
      .then((url) => {
        if (isMounted) setDataUrl(url as string);
      })
      .catch((err) => {
        console.error("Failed to generate QR", err);
        if (isMounted) setDataUrl(null);
      });

    return () => {
      isMounted = false;
    };
  }, [product]);

  if (!dataUrl) {
    return <div className="w-20 h-20 flex items-center justify-center text-xs text-gray-400">QR...</div>;
  }

  return <img src={dataUrl} alt="QR code" width={80} height={80} className="object-contain" />;
};

export default OfflineQRCode;
