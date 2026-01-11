"use client";


import React, { useEffect, useState } from "react";
import QRCodeLib from "qrcode";
import { Product } from "../lib/data";
import { QR_DOMAIN } from "../lib/qrconfig";

type Props = { product: Product };

const OfflineQRCode: React.FC<Props> = ({ product }) => {
  const [dataUrl, setDataUrl] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    // Always generate QR code for /print/${nama_bisnis} using QR_DOMAIN
    const qrValue = `${QR_DOMAIN}/print/${encodeURIComponent(product.nama_bisnis)}`;

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
