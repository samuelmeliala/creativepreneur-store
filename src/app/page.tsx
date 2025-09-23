"use client";

import React, { useEffect, useState, useMemo } from 'react';
import { signInWithCustomToken, signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { ref, onValue } from "firebase/database";
import { Product } from '../lib/data';
import { appId } from '../lib/firebase';
import SearchInput from '../component/search';
// import CategoryFilter from '../component/category_filter';
import ProductTable from '../component/product_table';
import { auth, db } from '../lib/firebase';
declare const __initial_auth_token: string | undefined;


// --- MAIN DASHBOARD PAGE ---

export default function ProductDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortKey, setSortKey] = useState<keyof Product>('nama');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  useEffect(() => {
    const signIn = async () => {
      try {
        if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
          await signInWithCustomToken(auth, __initial_auth_token);
        } else {
          await signInAnonymously(auth);
        }
      } catch (error) {
        console.error("Error signing in:", error);
      }
    };
    signIn();

    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        const productsRef = ref(db, `/artifacts/${appId}/public/data/products`);
        
        const unsubscribeSnapshot = onValue(productsRef, (snapshot) => {
          const data = snapshot.val();
          if (data) {
            const productsData = Object.keys(data).map(key => ({
              id: key,
              ...data[key]
            })) as Product[];
            setProducts(productsData);
          } else {
            setProducts([]);
          }
        }, (error) => {
          console.error("Error fetching products:", error);
        });

        return () => unsubscribeSnapshot();
      } else {
        setProducts([]);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  // const handleCategoryChange = (category: string) => {
  //   setSelectedCategories(prev =>
  //     prev.includes(category)
  //       ? prev.filter(c => c !== category)
  //       : [...prev, category]
  //   );
  // };

  const handleSort = (key: keyof Product) => {
    if (key === sortKey) {
      setSortOrder(prevOrder => (prevOrder === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
  };

  const filteredAndSortedProducts = useMemo(() => {
    const result = products
      // .filter(product => selectedCategories.length === 0 || selectedCategories.includes(product.category))
      .filter(product => product.nama.toLowerCase().includes(searchTerm.toLowerCase()));

    result.sort((a, b) => {
      const valA = a[sortKey];
      const valB = b[sortKey];
      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [products, searchTerm, sortKey, sortOrder]);

  return (
    <div className="min-h-screen bg-gray-100 font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
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
          {/* <CategoryFilter
            selectedCategories={selectedCategories}
            onCategoryChange={handleCategoryChange}
          /> */}
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

