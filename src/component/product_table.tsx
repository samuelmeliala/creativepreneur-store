import React from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Product } from "../lib/data";

type ProductTableProps = {
  products: Product[];
  sortKey: keyof Product;
  sortOrder: 'asc' | 'desc';
  onSort: (key: keyof Product) => void;
};

const ProductTable: React.FC<ProductTableProps> = ({ products, sortKey, sortOrder, onSort }) => {
  const renderSortIcon = (key: keyof Product) => {
    if (sortKey !== key) {
      return <ChevronDown className="h-4 w-4 text-gray-400" />;
    }
    return sortOrder === 'asc'
      ? <ChevronUp className="h-4 w-4 text-gray-800" />
      : <ChevronDown className="h-4 w-4 text-gray-800" />;
  };

  const headers: { key: keyof Product; label: string }[] = [
    { key: 'nama', label: 'Nama Mahasiswa' },
    { key: 'category', label: 'Kategori' },
    { key: 'harga', label: 'Harga Produk' },
    { key: 'produk', label: 'Nama Produk' },
    { key: 'biaya_prototype', label: 'Biaya Prototype' },
    { key: 'nim', label: 'NIM' },
    { key: 'no_hp', label: 'No HP' },
    { key: 'medsos', label: 'Media Sosial' },
    { key: 'kode', label: 'Kode Produk' },
    { key: 'foto', label: 'Foto Produk' },
  ];

  // Kelompokkan produk berdasarkan kode
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
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {products.length > 0 ? (
            Object.entries(grouped).map(([kode, items]) => (
              <tr key={kode} className="hover:bg-gray-50 transition-colors">
                {/* Nama Mahasiswa (join ke bawah) */}
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {items.map((p, idx) => (
                    <div key={idx}>{p.nama}</div>
                  ))}
                </td>

                {/* Kategori (ambil dari produk pertama) */}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    items[0].category === 'Food & Beverage' ? 'bg-blue-100 text-blue-800' :
                    items[0].category === 'Fashion' ? 'bg-green-100 text-green-800' :
                    items[0].category === 'Technology' ? 'bg-purple-100 text-purple-800' :
                    items[0].category === 'Services' ? 'bg-red-100 text-red-800' :
                    items[0].category === 'Health & Beauty' ? 'bg-pink-100 text-pink-800' :
                    items[0].category === 'Education' ? 'bg-indigo-100 text-indigo-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {items[0].category}
                  </span>
                </td>

                {/* Harga Produk (ambil satu, bukan join) */}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {items[0].harga}
                </td>

                {/* Nama Produk (ambil satu, bukan join) */}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {items[0].produk}
                </td>

                {/* Biaya Prototype (ambil satu, bukan join) */}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {items[0].biaya_prototype}
                </td>

                {/* NIM (join ke bawah) */}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {items.map((p, idx) => (
                    <div key={idx}>{p.nim}</div>
                  ))}
                </td>

                {/* No HP (join ke bawah) */}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {items.map((p, idx) => (
                    <div key={idx}>{p.no_hp}</div>
                  ))}
                </td>

                {/* Media Sosial */}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {items.map((p, idx) => (
                    <div key={idx}>{p.medsos}</div>
                  ))}
                </td>

                {/* Kode Produk */}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {kode}
                </td>

                {/* Foto Produk */}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {/* <img src={items[0].foto} alt={items[0].produk} className="h-10 w-10 object-cover rounded" /> */}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={10} className="text-center py-10 text-gray-500">
                No products found. Try adjusting your filters.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ProductTable;
