"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { db } from "../../../../lib/firebase";
import { Product } from "../../../../lib/data";

export default function PrintByNamaBisnisPage() {
  const params = useParams();
  const router = useRouter();
  const namaBisnis = Array.isArray(params.nama_bisnis) ? params.nama_bisnis[0] : params.nama_bisnis;
  const [product, setProduct] = useState<Product | null>(null);
  const [team, setTeam] = useState<{ nama: string; nim: string; no_hp?: string }[]>([]);

  useEffect(() => {
    if (!namaBisnis) return;
    const productsRef = ref(db, "/");
    const unsubscribe = onValue(productsRef, (snapshot) => {
      const data = snapshot.val();
      let arrayData = Array.isArray(data) ? data.filter(Boolean) : Object.values(data);
      // Find all products with the same nama_bisnis (case/space insensitive)
      const normalized = (str: string) => str.toLowerCase().replace(/\s+/g, "");
      const group = arrayData.filter((item: any) =>
        item["Nama Bisnis"] && normalized(item["Nama Bisnis"]) === normalized(namaBisnis)
      );
      if (group.length > 0) {
        // Use the first as the main product
        const main = group[0];
        setProduct({
          nama: main["Nama"],
          nim: main["NIM"],
          no_hp: main["Nomor Telepon"],
          nama_bisnis: main["Nama Bisnis"],
          tanggal_berdiri: main["Tanggal Berdiri"],
          kategori_bisnis: main["Kategori Bisnis"],
          nama_produk: main["Nama Produk"],
          id: main["id"] ?? main["NIM"] ?? main["Nama Produk"] ?? "",
          nomer_induk_barang: main["Nomer Induk Barang"] ?? "",
          lokasi_barang: main["Lokasi Barang"] ?? "",
          stok_barang: main["Stok Barang"] ?? "",
          harga_produk: main["Harga Produk"],
          tanggal_diserahkan: main["Tanggal Diserahkan"],
          foto_produk: main["Foto Produk"],
        });
        // Collect all team members for this product
        setTeam(group.map((item: any) => ({
          nama: item["Nama"],
          nim: item["NIM"],
          no_hp: item["Nomor Telepon"] || ""
        })));
      } else {
        setProduct(null);
        setTeam([]);
      }
    });
    return () => unsubscribe();
  }, [namaBisnis]);

  if (!product) {
    return <div className="p-8 text-center text-gray-500">Product not found.</div>;
  }

  // Handler for clicking outside the details
  const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      router.push('/print');
    }
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-[#DBE2EF] min-h-screen" onClick={handleOutsideClick}>
      {/* Fixed Back Button */}
      <button
        className="fixed top-6 left-6 px-5 py-2 bg-[#ffffff] text-black font-semibold rounded-lg hover:bg-[#8f8f8f] transition-colors shadow-lg z-50"
        onClick={() => router.push('/print')}
      >
       Back
      </button>
      <div className="max-w-2xl w-full mx-auto mt-12 p-8 bg-white rounded-2xl shadow-lg border border-blue-200 relative" onClick={e => e.stopPropagation()}>
        <h1 className="text-4xl font-extrabold text-[#112D4E] mb-2 tracking-tight">{product.nama_bisnis}</h1>
        <div className="mb-2 text-[#3F72AF] font-semibold text-xl">{product.kategori_bisnis}</div>
        <div className="mb-6 text-2xl text-[#22223B] font-bold">{product.nama_produk}</div>
        <div className="space-y-1 text-lg">
          <div><span className="font-bold text-[#112D4E]">Nomer Induk Barang:</span> <span className="text-[#22223B]">{product.nomer_induk_barang}</span></div>
          <div><span className="font-bold text-[#112D4E]">Tanggal Berdiri:</span> <span className="text-[#22223B]">{product.tanggal_berdiri}</span></div>
          <div><span className="font-bold text-[#112D4E]">Lokasi Barang:</span> <span className="text-[#22223B]">{product.lokasi_barang}</span></div>
          <div><span className="font-bold text-[#112D4E]">Stok Barang:</span> <span className="text-[#22223B]">{product.stok_barang}</span></div>
          <div><span className="font-bold text-[#112D4E]">Harga Produk:</span> <span className="text-[#22223B]">{product.harga_produk}</span></div>
          <div><span className="font-bold text-[#112D4E]">Tanggal Diserahkan:</span> <span className="text-[#22223B]">{product.tanggal_diserahkan}</span></div>
        </div>
        <h2 className="mt-10 mb-3 text-2xl font-bold text-[#3F72AF]">Anggota Terkait Produk Ini</h2>
        <div className="overflow-x-auto rounded-lg border border-gray-200 bg-gray-50">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-[#DBE2EF]">
              <tr>
                <th className="px-6 py-3 text-left text-base font-bold text-[#112D4E] uppercase tracking-wider">Nama</th>
                <th className="px-6 py-3 text-left text-base font-bold text-[#112D4E] uppercase tracking-wider">NIM</th>
                <th className="px-6 py-3 text-left text-base font-bold text-[#112D4E] uppercase tracking-wider">No HP</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {team.map((member, idx) => (
                <tr key={idx}>
                  <td className="px-6 py-3 text-lg text-[#22223B]">{member.nama}</td>
                  <td className="px-6 py-3 text-lg text-[#22223B]">{member.nim}</td>
                  <td className="px-6 py-3 text-lg text-[#22223B]">{member.no_hp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
//
