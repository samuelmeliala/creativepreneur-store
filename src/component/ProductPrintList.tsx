import React from "react";
import { Product } from "../lib/data";
import ProductPrintCard from "../component/ProductPrintCard";

interface ProductPrintListProps {
  products: Product[];
}

const ProductPrintList: React.FC<ProductPrintListProps> = ({ products }) => {
  const handlePrint = () => {
    window.print();
  };

  // Deduplicate by nama_bisnis, kategori_bisnis, nama_produk
  const uniqueProducts = Array.from(
    new Map(
      products.map((p) => [
        `${p.nama_bisnis}|${p.kategori_bisnis}|${p.nama_produk}`,
        p
      ])
    ).values()
  );

  return (
    <div>
      <div className="flex flex-wrap">
        {uniqueProducts.map((product, idx) => (
          <ProductPrintCard key={idx} product={product} />
        ))}
      </div>
    </div>
  );
};

export default ProductPrintList;
