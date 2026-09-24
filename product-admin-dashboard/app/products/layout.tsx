"use client";

import type { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import ProtectedRoute from "@/components/common/ProtectedRoute";
import Sidebar from "@/components/products/Sidebar";
import { clearAuth, getUser } from "@/lib/auth";

export default function ProductsLayout({ children }: { readonly children: ReactNode }) {
  const router = useRouter();
  const user = getUser();

  function handleLogout() {
    clearAuth();
    router.replace("/login");
  }

  return (
    <ProtectedRoute>
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <div className="flex flex-1 flex-col overflow-hidden bg-slate-50">
          <header className="flex-none border-b border-slate-200 bg-white">
            <div className="flex items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
              <span className="text-sm font-semibold text-slate-900 md:hidden">Product Admin Dashboard</span>
              <div className="ml-auto flex items-center gap-3">
                {user && (
                  <span className="text-sm text-slate-500">
                    {user.firstName} {user.lastName}
                  </span>
                )}
                <button
                  type="button"
                  onClick={handleLogout}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  <LogOut size={14} /> Logout
                </button>
              </div>
            </div>
          </header>
          <main className="flex-1 overflow-y-auto">{children}</main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
