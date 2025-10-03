import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Product, Categories } from "../lib/data";
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

  const categoryColors: Record<Categories, string> = {
    'Advertising, Printing, & Media': 'bg-blue-100 text-blue-800',
    'Ceramics, Glass & Porcelain': 'bg-slate-100 text-slate-800',
    'Food & Beverages': 'bg-amber-100 text-amber-800',
    'Automotive & Components': 'bg-rose-100 text-rose-800',
    'Computer & Services': 'bg-indigo-100 text-indigo-800',
    'Wood Industry': 'bg-emerald-100 text-emerald-800',
    'Fashion': 'bg-pink-100 text-pink-800',
    'Perdagangan': 'bg-orange-100 text-orange-800',
    'Craft / Kriya': 'bg-cyan-100 text-cyan-800',
    'Sports': 'bg-yellow-100 text-yellow-800',
    'Others': 'bg-gray-100 text-gray-800',
  };

  const headers: { key: keyof Product; label: string }[] = [
    { key: 'nama_produk', label: 'Nama Produk' },
    { key: 'nama', label: 'Nama Mahasiswa' },
    { key: 'nim', label: 'NIM' },
    { key: 'kategori_bisnis', label: 'Kategori' },
    { key: 'harga_produk', label: 'Harga Produk' },
  ];

  // Group by nama_produk (biar 1 produk bisa punya banyak mahasiswa)
  const grouped = products.reduce((acc, product) => {
    if (!acc[product.nama_produk]) acc[product.nama_produk] = [];
    acc[product.nama_produk].push(product);
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
            Object.entries(grouped).map(([namaProduk, items]) => (
              <tr key={namaProduk} className="hover:bg-gray-50 transition-colors">
                {/* Nama Produk */}
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  {items[0].nama_produk}
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

                {/* Kategori */}
                <td className="px-6 py-4 text-sm text-gray-500">
                  <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${categoryColors[items[0].kategori_bisnis]}`}>
                    {items[0].kategori_bisnis}
                  </span>
                </td>

                {/* Harga Produk */}
                <td className="px-6 py-4 text-sm text-gray-500">
                  {items[0].harga_produk}
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
              <td colSpan={6} className="text-center py-10 text-gray-500">
                No products found. Try adjusting your filters.
              </td>
            </tr>
          )}
        </tbody>
      </table>
      
      {/* Modal Detail */}
      {selected && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-lg w-96 shadow-lg">
            <h2 className="text-lg font-bold mb-3 text-gray-900">
              {selected.nama_produk}
              </h2>

      {/* Foto Produk */}
      {selected.foto_produk && (
        <div className="mb-3">
          <img
            src={selected.foto_produk}
            alt={selected.nama_produk}
            className="w-full h-48 object-cover rounded"
          />
        </div>
      )}

      <p className="text-gray-800"><strong>Kategori:</strong> {selected.kategori_bisnis}</p>
      <p className="text-gray-800"><strong>Nama Bisnis:</strong> {selected.nama_bisnis}</p>
      <p className="text-gray-800"><strong>Tanggal Berdiri:</strong> {selected.tanggal_berdiri}</p>
      <p className="text-gray-800"><strong>Nomor Telepon:</strong> {selected.no_hp}</p>
      <p className="text-gray-800"><strong>Tanggal Diserahkan:</strong> {selected.tanggal_diserahkan}</p>

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