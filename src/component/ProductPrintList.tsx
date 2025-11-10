import React from "react";
import { Product } from "../lib/data";
import ProductPrintCard from "../component/ProductPrintCard";

interface ProductPrintListProps {
  products: Product[];
}

const ProductPrintList: React.FC<ProductPrintListProps> = ({ products }) => {
  const [selectedProduct, setSelectedProduct] = React.useState<Product | null>(null);

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

  const uniqueGroups = Array.from(groupsMap.values());

  return (
    <div className="bg-[#DBE2EF] p-4">
      <div className="flex flex-wrap gap-2">
        {uniqueGroups.map((group, idx) => (
          <div key={idx} onClick={() => setSelectedProduct(group.primary)} style={{ cursor: 'pointer' }}>
            <ProductPrintCard product={group.primary} team={group.team} />
          </div>
        ))}
      </div>

      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#DBE2EF]" onClick={() => setSelectedProduct(null)}>
          <div className="bg-white rounded-lg shadow-lg p-6 relative" style={{ width: '560px', height: 'auto' }} onClick={e => e.stopPropagation()}>
            {/* When previewing larger, find its group to pass team members and large flag */}
            <ProductPrintCard product={selectedProduct} team={(() => {
              const key = `${selectedProduct.nama_bisnis}|${selectedProduct.kategori_bisnis}|${selectedProduct.nama_produk}`;
              return groupsMap.get(key)?.team ?? [{ nama: selectedProduct.nama, nim: selectedProduct.nim }];
            })()} large />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductPrintList;
