"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, Plus } from "lucide-react";

const NAV_ITEMS = [
  { href: "/products", label: "All Products", icon: LayoutGrid, exact: true },
  { href: "/products/new", label: "Add Product", icon: Plus, exact: true },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-56 shrink-0 border-r border-slate-200 bg-white md:flex md:flex-col">
      <div className="px-5 py-4 text-sm font-semibold text-slate-900">Product Admin</div>
      <nav className="flex flex-col gap-1 px-3">
        {NAV_ITEMS.map(({ href, label, icon: Icon, exact }) => {
          const isActive = exact ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium ${
                isActive ? "bg-indigo-50 text-indigo-700" : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              <Icon size={16} />
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
