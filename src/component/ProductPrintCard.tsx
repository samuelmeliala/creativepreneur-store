import React from "react";
import { Product } from "../lib/data";

interface ProductPrintCardProps {
  product: Product;
}


// Standard business card size: 3.5 x 2 inches (about 336 x 192 px at 96dpi)
const ProductPrintCard: React.FC<ProductPrintCardProps> = ({ product }) => (
  <div
    className="print-card border border-gray-400 rounded shadow bg-white m-2 flex flex-col justify-between items-start"
    style={{
      width: '320px', // slightly bigger width
      height: '170px', // slightly bigger height
      padding: '14px',
      fontSize: '12px', // slightly bigger font
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
      {/* QR code placeholder - larger for scan clarity */}
      <div className="ml-2 flex-shrink-0 w-20 h-20 border border-dashed border-gray-300 rounded flex items-center justify-center text-xs text-gray-400">
        QR
      </div>
    </div>
    {/* Preview watermark for screen only */}
    <div className="absolute top-2 right-2 text-[10px] text-gray-400 print:hidden"></div>
  </div>
);

export default ProductPrintCard;
