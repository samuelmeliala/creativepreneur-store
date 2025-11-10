"use client";

import React, { useEffect, useState } from "react";
import QRCodeLib from "qrcode";
import { Product } from "../lib/data";

interface ProductPrintCardProps {
  product: Product;
  /** when true, render a larger preview suitable for scanning */
  large?: boolean;
  team?: { nama: string; nim: string }[];
}


// Standard business card size: 3.5 x 2 inches (about 336 x 192 px at 96dpi)
const ProductPrintCard: React.FC<ProductPrintCardProps> = ({ product, large = false, team }) => {
  const [qrSrc, setQrSrc] = useState<string | null>(null);

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

    const pixelSize = large ? 400 : 200;
    QRCodeLib.toDataURL(textPayload, { margin: 1, width: pixelSize })
      .then((url) => {
        if (mounted) setQrSrc(url);
      })
      .catch(() => {
        if (mounted) setQrSrc(null);
      });

    return () => { mounted = false; };
  }, [product, large]);

  // sizing
  const cardWidth = large ? '520px' : '320px';
  const cardHeight = large ? '320px' : '170px';
  const padding = large ? '20px' : '14px';
  const fontSize = large ? '14px' : '12px';
  const qrDisplaySize = large ? 220 : 80;

  return (
  <div
    className={`print-card border border-gray-400 rounded shadow bg-white ${large ? '' : 'm-2'} flex flex-col justify-between items-start`}
    style={{
      width: cardWidth,
      height: cardHeight,
      padding: padding,
      fontSize: fontSize,
      boxSizing: 'border-box',
      position: 'relative',
      breakInside: 'avoid',
      pageBreakInside: 'avoid',
    }}
  >
    <div className="w-full flex flex-row justify-between items-start">
      <div className="flex-1 min-w-0">
        <div className="font-bold text-base mb-1 text-blue-900 truncate w-full" title={product.nama_bisnis}>
          {product.nama_bisnis}
        </div>
        <div className="text-xs text-gray-700 mb-2 font-semibold">
          {product.kategori_bisnis}
        </div>
        <div className="text-sm text-gray-900 font-medium break-words">
          {product.nama_produk}
        </div>
      </div>
      {/* QR code (generated offline as data URL from text payload) */}
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

export default ProductPrintCard;
