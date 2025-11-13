"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "./ui/button";

const NavLink: React.FC<{
  href: string;
  children: React.ReactNode;
}> = ({ href, children }) => (
  <Link href={href} className="block px-3 py-2 rounded hover:bg-gray-100">
    {children}
  </Link>
);

export default function Sidebar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile top bar */}
      <div className="md:hidden flex items-center justify-between p-3 bg-white border-b">
        <div className="text-lg font-semibold text-[#112D4E]">Creativepreneur</div>
        <button
          aria-label="Toggle menu"
          onClick={() => setOpen((s) => !s)}
          className="p-2 rounded bg-[#112D4E] text-white"
        >
          {open ? "Close" : "Menu"}
        </button>
      </div>

      {/* Drawer for mobile */}
      <div
        className={`fixed inset-0 z-40 md:hidden ${open ? "block" : "hidden"}`}
        role="dialog"
        aria-modal="true"
      >
        <div className="fixed inset-0 bg-black/40" onClick={() => setOpen(false)} />
        <aside className="fixed left-0 top-0 bottom-0 w-64 bg-white shadow p-4 overflow-y-auto">
          <div className="mb-4">
            <div className="text-xl font-bold text-[#112D4E]">Creativepreneur</div>
          </div>
          <nav className="space-y-1 text-[#112D4E]">
            <NavLink href="/dashboard">Dashboard</NavLink>
            <NavLink href="/productlist">Products</NavLink>
            <NavLink href="/newproduct">Add Product</NavLink>
            <NavLink href="/print">Print Cards</NavLink>
          </nav>
        </aside>
      </div>

      {/* Desktop sidebar */}
      <aside className="hidden md:flex md:flex-col md:w-64 md:shrink-0 bg-white border-r">
        <div className="p-6">
          <div className="text-2xl font-bold text-[#112D4E] mb-2">Creativepreneur</div>
          <p className="text-sm text-gray-600">Store Dashboard</p>
        </div>
        <nav className="flex-1 p-4 space-y-1 text-[#112D4E]">
          <NavLink href="/dashboard">Dashboard</NavLink>
          <NavLink href="/productlist">Products</NavLink>
          <NavLink href="/newproduct">Add Product</NavLink>
          <NavLink href="/print">Print Cards</NavLink>
        </nav>
      </aside>
    </>
  );
}
