"use client";

import React, { useEffect, useState } from "react";
import QRCodeLib from "qrcode";
import { Product } from "../lib/data";
import { QR_DOMAIN } from "../lib/qrconfig";

interface ProductPrintCardProps {
  product: Product;
  team?: { nama: string; nim: string }[];
}

// Standard business card size: 3.5 x 2 inches (about 336 x 192 px at 96dpi)
const ProductPrintCard: React.FC<ProductPrintCardProps> = ({ product, team }) => {
  const [qrSrc, setQrSrc] = useState<string | null>(null);
  const qrUrl = `${QR_DOMAIN}/print/${normalizeNamaBisnis(product.nama_bisnis)}`;

  React.useEffect(() => {
    let mounted = true;
    // Build payload; include team members when available
    const baseLines = [
      `nama: ${product.nama}`,
      `nim: ${product.nim}`,
      `no_hp: ${product.no_hp}`,
      `nama_bisnis: ${product.nama_bisnis}`,
      `tanggal_berdiri: ${product.tanggal_berdiri}`,
      `kategori_bisnis: ${product.kategori_bisnis}`,
      `nama_produk: ${product.nama_produk}`,
      `id: ${product.id}`,
      `nomer_induk_barang: ${product.nomer_induk_barang}`,
      `lokasi_barang: ${product.lokasi_barang}`,
      `stok_barang: ${product.stok_barang}`,
      `harga_produk: ${product.harga_produk}`,
      `tanggal_diserahkan: ${product.tanggal_diserahkan}`,
      `foto_produk: ${product.foto_produk}`,
    ];

    // Determine team members: prefer 'team' prop, then product.team if present, then single member from product
    let teamMembers: { nama: string; nim: string }[] = [];
    if (Array.isArray(team) && team.length > 0) {
      teamMembers = team;
    } else if ((product as any).team && Array.isArray((product as any).team)) {
      teamMembers = (product as any).team as { nama: string; nim: string }[];
    } else {
      teamMembers = [{ nama: product.nama ?? "", nim: product.nim ?? "" }];
    }

    const teamLines = teamMembers.map((m) => `team_member: ${m.nama} (${m.nim})`);

    const textPayload = [...baseLines, ...teamLines].join("\n");

    const pixelSize = 200;
    QRCodeLib.toDataURL(qrUrl, { margin: 1, width: pixelSize })
      .then((url) => {
        if (mounted) setQrSrc(url);
      })
      .catch(() => {
        if (mounted) setQrSrc(null);
      });

    return () => { mounted = false; };
  }, [product, qrUrl]);

  // sizing
  const cardWidth = '280px';
  const cardHeight = '170px';
  const padding = '12px';
  const fontSize = '10px';
  const qrDisplaySize = 90;

  return (
    <div
      className={`print-card border border-gray-400 rounded shadow bg-white m-2 flex flex-col justify-between items-start print:border-black print:border-2`}
      style={{
        width: cardWidth,
        height: cardHeight,
        padding: padding,
        fontSize: fontSize,
        boxSizing: 'border-box',
        position: 'relative',
        breakInside: 'avoid',
        pageBreakInside: 'avoid',
        cursor: 'pointer',
      }}
      onClick={() => window.location.href = qrUrl}
      role="button"
      tabIndex={0}
    >
      <div className="w-full flex flex-row justify-between items-start">
        <div className="flex-1 min-w-0 flex flex-col justify-between">
          <div>
            <div className={`font-bold text-sm mb-1 text-blue-900 truncate w-full`} title={product.nama_bisnis}>
              {product.nama_bisnis}
            </div>
            <div className={`text-[11px] text-gray-700 mb-1 font-semibold`}>
              {product.kategori_bisnis}
            </div>
            <div className={`text-xs text-gray-900 font-medium break-words`}>
              {product.nama_produk}
            </div>
          </div>
        </div>
        {/* QR code (always show, but not too large) */}
        <div className="ml-2 flex-shrink-0 border border-dashed border-gray-300 rounded flex items-center justify-center bg-white" style={{ width: qrDisplaySize, height: qrDisplaySize }}>
          {qrSrc ? (
            <img src={qrSrc} alt="QR code" width={qrDisplaySize} height={qrDisplaySize} className="object-contain" />
          ) : (
            <div className="text-xs text-gray-400">QR</div>
          )}
        </div>
      </div>
      {/* Preview watermark for screen only */}
      <div className="absolute top-2 right-2 text-[10px] text-gray-400 print:hidden"></div>
    </div>
  );
};

const normalizeNamaBisnis = (nama: string) => nama.toLowerCase().replace(/\s+/g, "");

export default ProductPrintCard;
