import Link from "next/link";
import { PackageX } from "lucide-react";

export default function ProductNotFound() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-3 px-4 py-20 text-center">
      <PackageX className="text-slate-300" size={40} />
      <h1 className="text-lg font-semibold text-slate-900">Product not found</h1>
      <p className="text-sm text-slate-500">We couldn&apos;t find a product with this ID.</p>
      <Link
        href="/products"
        className="mt-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
      >
        Back to products
      </Link>
    </div>
  );
}
