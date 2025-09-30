import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Product } from "../lib/data";
import { Button } from "../component/ui/button";

type ProductTableProps = {
  products: Product[];
  sortKey: keyof Product;
  sortOrder: 'asc' | 'desc';
  onSort: (key: keyof Product) => void;
};

const ProductTable: React.FC<ProductTableProps> = ({ products, sortKey, sortOrder, onSort }) => {
  const [selected, setSelected] = useState<Product | null>(null);

  const renderSortIcon = (key: keyof Product) => {
    if (sortKey !== key) {
      return <ChevronDown className="h-4 w-4 text-gray-400" />;
    }
    return sortOrder === 'asc'
      ? <ChevronUp className="h-4 w-4 text-gray-800" />
      : <ChevronDown className="h-4 w-4 text-gray-800" />;
  };

  const headers: { key: keyof Product; label: string }[] = [
    { key: 'produk', label: 'Nama Produk' },
    { key: 'nama', label: 'Nama Mahasiswa' },
    { key: 'nim', label: 'NIM' },
    { key: 'harga', label: 'Harga Produk' },
  ];

  // Group by kode produk
  const grouped = products.reduce((acc, product) => {
    if (!acc[product.kode]) acc[product.kode] = [];
    acc[product.kode].push(product);
    return acc;
  }, {} as Record<string, Product[]>);

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow">
      <table className="w-full text-left">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            {headers.map(header => (
              <th
                key={header.key}
                className="px-6 py-3 text-sm font-semibold text-gray-600 uppercase tracking-wider cursor-pointer select-none"
                onClick={() => onSort(header.key)}
              >
                <div className="flex items-center space-x-1">
                  <span>{header.label}</span>
                  {renderSortIcon(header.key)}
                </div>
              </th>
            ))}
            <th className="px-6 py-3 text-sm font-semibold text-gray-600 uppercase">Detail</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {products.length > 0 ? (
            Object.entries(grouped).map(([kode, items]) => (
              <tr key={kode} className="hover:bg-gray-50 transition-colors">
                {/* Nama Produk */}
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  {items[0].produk}
                </td>

                {/* Nama Mahasiswa */}
                <td className="px-6 py-4 text-sm text-gray-500">
                  {items.map((p, idx) => (
                    <div key={idx}>{p.nama}</div>
                  ))}
                </td>

                {/* NIM */}
                <td className="px-6 py-4 text-sm text-gray-500">
                  {items.map((p, idx) => (
                    <div key={idx}>{p.nim}</div>
                  ))}
                </td>

                {/* Harga Produk */}
                <td className="px-6 py-4 text-sm text-gray-500">
                  {items[0].harga}
                </td>

                {/* Tombol More Details */}
                <td className="px-6 py-4">
                  <Button
                    variant="outline"
                    onClick={() => setSelected(items[0])}
                  >
                    More Details
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} className="text-center py-10 text-gray-500">
                No products found. Try adjusting your filters.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Modal Detail */}
      {selected && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-lg font-bold mb-3">{selected.produk}</h2>

            {/* Foto Produk */}
            {selected.foto && (
              <div className="mb-3">
                <img
                  src={selected.foto}
                  alt={selected.produk}
                  className="w-full h-48 object-cover rounded"
                />
              </div>
            )}

            <p><strong>Kategori:</strong> {selected.category}</p>
            <p><strong>Biaya Prototype:</strong> {selected.biaya_prototype}</p>
            <p><strong>No HP:</strong> {selected.no_hp}</p>
            <p><strong>Media Sosial:</strong> {selected.link}</p>
            <p><strong>Kode Produk:</strong> {selected.kode}</p>

            <div className="mt-4 flex justify-end gap-2">
              <Button variant="secondary" onClick={() => setSelected(null)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductTable;
