"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Menu,
  PackageSearch,
  PlusSquare,
  Printer,
  X,
} from "lucide-react";
import { Button } from "./ui/button";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Product List", href: "/productlist", icon: PackageSearch },
  { label: "Add Product", href: "/newproduct", icon: PlusSquare },
  { label: "Print Cards", href: "/print", icon: Printer },
];

const NavLink: React.FC<{
  href: string;
  children: React.ReactNode;
  isActive: boolean;
  onClick?: () => void;
  isCompact?: boolean;
}> = ({ href, children, isActive, onClick, isCompact }) => (
  <Link
    href={href}
    onClick={onClick}
    className={`group flex items-center rounded-xl px-3 py-2 text-sm font-medium tracking-wide transition-colors ${
      isCompact ? "justify-center gap-0" : "gap-3"
    } ${
      isActive
        ? "bg-[#DBE2EF] text-[#112D4E] shadow-sm"
        : "text-gray-600 hover:bg-gray-100 hover:text-[#112D4E]"
    }`}
  >
    {children}
  </Link>
);

export default function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const toggleMobile = () => setIsMobileOpen((prev) => !prev);
  const closeMobile = () => setIsMobileOpen(false);

  const brand = (
    <button
      type="button"
      onClick={() => setIsCollapsed((prev) => !prev)}
      aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
      className={`group flex items-center gap-2 rounded-2xl border border-transparent px-1 py-1 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3F72AF] focus-visible:ring-offset-2 ${
        isCollapsed ? "justify-center" : "justify-start"
      }`}
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#112D4E] text-base font-semibold tracking-wide text-white shadow-sm transition group-hover:bg-[#0f2542]">
        CP
      </div>
      {!isCollapsed && (
        <div className="text-left">
          <p className="text-base font-semibold text-[#112D4E]">Creativepreneur</p>
          <p className="text-xs text-gray-500">Store Dashboard</p>
        </div>
      )}
    </button>
  );

  return (
    <>
      {/* Mobile top bar */}
      <div className="flex items-center justify-between border-b bg-white px-4 py-3 shadow-sm md:hidden">
        <div className="text-lg font-semibold text-[#112D4E]">Creativepreneur</div>
        <Button
          variant="outline"
          aria-label={isMobileOpen ? "Close navigation" : "Open navigation"}
          onClick={toggleMobile}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full p-2"
        >
          {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile drawer */}
      <div
        className={`fixed inset-0 z-40 md:hidden ${isMobileOpen ? "opacity-100" : "pointer-events-none opacity-0"}`}
      >
        <div
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          onClick={closeMobile}
        />
        <aside className="relative h-full w-72 bg-white p-6 shadow-2xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg font-bold text-[#112D4E]">Creativepreneur</p>
              <p className="text-xs text-gray-500">Store Dashboard</p>
            </div>
            <Button
              variant="outline"
              aria-label="Close navigation"
              onClick={closeMobile}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full p-2"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <nav className="mt-6 space-y-2">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.href}
                href={item.href}
                isActive={pathname?.startsWith(item.href) ?? false}
                onClick={closeMobile}
              >
                <item.icon className="h-5 w-5 text-[#112D4E]" />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </aside>
      </div>

      {/* Desktop sidebar */}
      <aside
        className={`print:hidden ${
          isCollapsed ? "md:w-20" : "md:w-64"
        } hidden h-screen flex-shrink-0 border-r bg-white/80 px-3 pb-6 pt-5 shadow-sm backdrop-blur md:flex md:flex-col md:sticky md:top-0`}
      >
        <div className="flex items-center justify-between gap-2">{brand}</div>
        <nav className="mt-8 flex-1 space-y-1">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.href}
              href={item.href}
              isActive={pathname?.startsWith(item.href) ?? false}
              isCompact={isCollapsed}
            >
              <item.icon className="h-5 w-5 flex-shrink-0 text-[#3F72AF]" />
              <span
                className={`whitespace-nowrap overflow-hidden text-sm font-semibold transition-all ${
                  isCollapsed ? "w-0 opacity-0" : "opacity-100"
                }`}
              >
                {item.label}
              </span>
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
}