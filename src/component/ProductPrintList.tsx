import React from "react";
import { Product } from "../lib/data";
import ProductPrintCard from "../component/ProductPrintCard";

interface ProductPrintListProps {
  products: Product[];
  selectedIds?: string[];
  onSelect?: (id: string, checked: boolean) => void;
}


const ProductPrintList: React.FC<ProductPrintListProps> = ({ products, selectedIds, onSelect }) => {
  // Aggregate products by (nama_bisnis|kategori_bisnis|nama_produk) and collect team members
  type Grouped = {
    primary: Product;
    team: { nama: string; nim: string }[];
  };

  const groupsMap = new Map<string, Grouped>();
  products.forEach((p) => {
    const key = `${p.nama_bisnis}|${p.kategori_bisnis}|${p.nama_produk}`;
    const entry = groupsMap.get(key);
    const member = { nama: p.nama ?? "", nim: p.nim ?? "" };
    if (!entry) {
      groupsMap.set(key, { primary: p, team: [member] });
    } else {
      // avoid duplicate members
      if (!entry.team.some((m) => m.nama === member.nama && m.nim === member.nim)) {
        entry.team.push(member);
      }
    }
  });

  let uniqueGroups = Array.from(groupsMap.values());
  // Newest upload first: reverse the array
  uniqueGroups = uniqueGroups.reverse();

  return (
    <div className="bg-[#DBE2EF] p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 print:grid-cols-3 print:grid-rows-3 print:gap-2 print:mx-auto print:w-full print:max-w-[1200px]">
        {uniqueGroups.map((group, idx) => {
          const id = group.primary.id;
          const checked = selectedIds?.includes(id) ?? false;
          return (
            <div key={idx} className="relative group">
              <ProductPrintCard product={group.primary} team={group.team} />
              {onSelect && (
                <div className="absolute bottom-4 right-4 z-10 flex items-center print:hidden">
                  <span className="mr-2 text-xs text-gray-700">Click untuk print</span>
                  <input 
                    type="checkbox"
                    className="w-5 h-5 accent-blue-600 border-2 border-gray-400 rounded shadow"
                    style={{ margin: 0 }}
                    checked={checked}
                    onChange={e => onSelect(id, e.target.checked)}
                    title="Select for printing"
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProductPrintList;
