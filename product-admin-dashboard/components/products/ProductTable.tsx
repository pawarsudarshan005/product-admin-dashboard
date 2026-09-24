import Image from "next/image";
import Link from "next/link";
import { Pencil, Star, Trash2 } from "lucide-react";
import type { Product } from "@/types/product";

interface Props {
  readonly products: Product[];
  readonly onDelete: (product: Product) => void;
}

export default function ProductTable({ products, onDelete }: Props) {
  return (
    <table className="hidden w-full text-left text-sm md:table">
      <thead>
        <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-400">
          <th className="px-4 py-3 font-medium">Product</th>
          <th className="px-4 py-3 font-medium">Category</th>
          <th className="px-4 py-3 font-medium">Price</th>
          <th className="px-4 py-3 font-medium">Rating</th>
          <th className="px-4 py-3 font-medium">Stock</th>
          <th className="px-4 py-3 font-medium text-right">Actions</th>
        </tr>
      </thead>
      <tbody>
        {products.map((product) => (
          <tr key={product.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
            <td className="px-4 py-3">
              <Link href={`/products/${product.id}`} className="flex items-center gap-3">
                <Image
                  src={product.thumbnail}
                  alt={product.title}
                  width={40}
                  height={40}
                  className="h-10 w-10 shrink-0 rounded-lg object-cover"
                  unoptimized
                />
                <span className="font-medium text-slate-800 hover:underline">{product.title}</span>
              </Link>
            </td>
            <td className="px-4 py-3 capitalize text-slate-600">{product.category}</td>
            <td className="px-4 py-3 text-slate-700">${product.price}</td>
            <td className="px-4 py-3">
              <span className="inline-flex items-center gap-1 text-slate-600">
                <Star size={13} className="fill-amber-400 text-amber-400" />
                {product.rating.toFixed(1)}
              </span>
            </td>
            <td className="px-4 py-3 text-slate-600">{product.stock}</td>
            <td className="px-4 py-3">
              <div className="flex justify-end gap-1.5">
                <Link
                  href={`/products/${product.id}/edit`}
                  aria-label={`Edit ${product.title}`}
                  className="rounded-lg border border-slate-200 p-1.5 text-slate-500 hover:border-slate-300 hover:text-slate-800"
                >
                  <Pencil size={14} />
                </Link>
                <button
                  type="button"
                  onClick={() => onDelete(product)}
                  aria-label={`Delete ${product.title}`}
                  className="cursor-pointer rounded-lg border border-slate-200 p-1.5 text-slate-500 hover:border-red-300 hover:text-red-600"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
