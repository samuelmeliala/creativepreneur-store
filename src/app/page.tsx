"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { ref, onValue } from "firebase/database";
import { db } from '../lib/firebase';
import SearchInput from '../component/search';
import { Product } from '../lib/data';
import ProductTable from '../component/product_table';

export default function ProductDashboard() {
  // The products state is initialized as an empty array.
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortKey, setSortKey] = useState<keyof Product>('produk');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // NOTE: All useEffect code for connecting to and fetching from Firebase has been removed.
  useEffect(() => {
    const productsRef = ref(db, "/");
    const unsubscribe = onValue(productsRef, (snapshot) => {
      const data = snapshot.val();
      if (Array.isArray(data)) {
        setProducts(data);
      } else if (data) {
        // If data is an object, convert to array
        setProducts(Object.values(data));
      } else {
        setProducts([]);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleSort = (key: keyof Product) => {
    if (key === sortKey) {
      setSortOrder(prevOrder => (prevOrder === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
  };

  const filteredAndSortedProducts = useMemo(() => {
    if (!Array.isArray(products)) return [];

  const result = products
      .filter(product => product.produk.toLowerCase().includes(searchTerm.toLowerCase()));

    result.sort((a, b) => {
      const valA = a[sortKey];
      const valB = b[sortKey];
      
      if (typeof valA === 'number' && typeof valB === 'number') {
        return sortOrder === 'asc' ? valA - valB : valB - valA;
      }
      
      if (String(valA) < String(valB)) return sortOrder === 'asc' ? -1 : 1;
      if (String(valA) > String(valB)) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [products, searchTerm, sortKey, sortOrder]);

  return (
    <div className="min-h-screen bg-gray-100 font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-full mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800">Product Dashboard</h1>
          <p className="text-lg text-gray-600 mt-1">Manage and view your product inventory.</p>
        </header>

        <div className="bg-white rounded-lg shadow p-6 mb-8 space-y-6">
          <SearchInput
            value={searchTerm}
            onChange={setSearchTerm}
            onClear={() => setSearchTerm('')}
          />
        </div>

        <ProductTable
          products={filteredAndSortedProducts}
          sortKey={sortKey}
          sortOrder={sortOrder}
          onSort={handleSort}
        />
        
        <footer className="text-center mt-8 text-gray-500 text-sm">
          <p>Showing {filteredAndSortedProducts.length} of {products.length} products.</p>
        </footer>
      </div>
    </div>
  );
}

