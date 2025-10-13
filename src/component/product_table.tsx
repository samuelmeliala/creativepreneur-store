import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Product, Categories, ProductSortKey, normalizeProductName } from "../lib/data";
import { Button } from "../component/ui/button";

type ProductTableProps = {
  products: Product[];
  sortKey: ProductSortKey;
  sortOrder: 'asc' | 'desc';
  onSort: (key: ProductSortKey) => void;
};

type GroupedProduct = {
  groupId: string;
  primary: Product;
  items: Product[];
};

const ProductTable: React.FC<ProductTableProps> = ({ products, sortKey, sortOrder, onSort }) => {
  const [selectedGroup, setSelectedGroup] = useState<GroupedProduct | null>(null);
  const router = useRouter();

  const renderSortIcon = (key: ProductSortKey) => {
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

  const headers: { key: ProductSortKey; label: string }[] = [
    { key: 'nama_produk', label: 'Nama Produk' },
    { key: 'lokasi_status', label: 'Lokasi / Status' },
    { key: 'stok_barang', label: 'Stok Barang' },
    { key: 'nama', label: 'Nama Mahasiswa' },
    { key: 'nim', label: 'NIM' },
    { key: 'kategori_bisnis', label: 'Kategori' },
    { key: 'harga_produk', label: 'Harga Tertinggi Produk' },
  ];

  const groupedProducts = useMemo<GroupedProduct[]>(() => {
    const buckets = new Map<string, Product[]>();

    products.forEach((product) => {
      const key = normalizeProductName(product.nama_produk);
      const bucketKey = key.length > 0 ? key : product.id;
      const list = buckets.get(bucketKey) ?? [];
      list.push(product);
      buckets.set(bucketKey, list);
    });

    const groups = Array.from(buckets.entries()).map(([groupId, items]) => {
      const sortedItems = [...items].sort((a, b) =>
        String(a.nama).localeCompare(String(b.nama))
      );
      return {
        groupId,
        primary: sortedItems[0],
        items: sortedItems,
      } satisfies GroupedProduct;
    });

    const compare = (a: GroupedProduct, b: GroupedProduct) => {
      const valA = a.primary[sortKey];
      const valB = b.primary[sortKey];

      if (typeof valA === "number" && typeof valB === "number") {
        return valA - valB;
      }

      return String(valA ?? "").localeCompare(String(valB ?? ""));
    };

    groups.sort(compare);
    if (sortOrder === "desc") {
      groups.reverse();
    }

    return groups;
  }, [products, sortKey, sortOrder]);

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
            <th className="px-6 py-3 text-sm font-semibold text-gray-600 uppercase">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {groupedProducts.length > 0 ? (
            groupedProducts.map((group) => {
              const { primary, items } = group;
              return (
                <tr key={group.groupId} className="hover:bg-gray-50 transition-colors align-top">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {primary.nama_produk}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{primary.lokasi_status || "-"}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{primary.stok_barang || "-"}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    <div className="space-y-2">
                      {items.map((item) => (
                        <div key={item.id}>{item.nama}</div>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    <div className="space-y-2">
                      {items.map((item) => (
                        <div key={item.id}>{item.nim}</div>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    <span
                      className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${categoryColors[primary.kategori_bisnis]}`}
                    >
                      {primary.kategori_bisnis}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{primary.harga_produk}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-3">
                      <Button
                        variant="outline"
                        onClick={() => setSelectedGroup(group)}
                      >
                        More Details
                      </Button>
                      <Button
                        variant="secondary"
                        onClick={() => router.push(`/edit/${primary.id}`)}
                      >
                        Edit Product
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={headers.length + 1} className="text-center py-10 text-gray-500">
                No products found. Try adjusting your filters.
              </td>
            </tr>
          )}
        </tbody>
      </table>
      
      {/* Modal Detail */}
      {selectedGroup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-lg w-96 shadow-lg">
            <h2 className="text-lg font-bold mb-3 text-gray-900">
              {selectedGroup.primary.nama_produk}
              </h2>

      {/* Foto Produk */}
      {selectedGroup.primary.foto_produk && (
        <div className="mb-3">
          <img
            src={selectedGroup.primary.foto_produk}
            alt={selectedGroup.primary.nama_produk}
            className="w-full h-48 object-cover rounded"
          />
        </div>
      )}

      <p className="text-gray-800"><strong>Kategori:</strong> {selectedGroup.primary.kategori_bisnis}</p>
      <p className="text-gray-800"><strong>Lokasi:</strong> {selectedGroup.primary.lokasi_status || "-"}</p>
      <p className="text-gray-800"><strong>Stok Barang:</strong> {selectedGroup.primary.stok_barang || "-"}</p>
      <p className="text-gray-800"><strong>Nama Bisnis:</strong> {selectedGroup.primary.nama_bisnis}</p>
      <p className="text-gray-800"><strong>Tanggal Berdiri:</strong> {selectedGroup.primary.tanggal_berdiri}</p>
      <p className="text-gray-800"><strong>Nomor Telepon:</strong> {selectedGroup.primary.no_hp}</p>
      <p className="text-gray-800"><strong>Tanggal Diserahkan:</strong> {selectedGroup.primary.tanggal_diserahkan}</p>

      <div className="mt-4">
        <p className="text-gray-800 font-semibold mb-2">Tim Mahasiswa:</p>
        <ul className="space-y-1 text-gray-700">
          {selectedGroup.items.map((item) => (
            <li key={item.id} className="flex justify-between gap-2 text-sm">
              <span>{item.nama}</span>
              <span className="text-gray-500">{item.nim}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-4 flex justify-end gap-2">
        <Button variant="secondary" onClick={() => setSelectedGroup(null)}>
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