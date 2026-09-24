import Image from "next/image";
import Link from "next/link";
import { Pencil, Star, Trash2 } from "lucide-react";
import type { Product } from "@/types/product";

interface Props {
  readonly product: Product;
  readonly onDelete: (product: Product) => void;
}

export default function ProductCard({ product, onDelete }: Props) {
  return (
    <div className="flex gap-3 rounded-xl border border-slate-200 bg-white p-3">
      <Image
        src={product.thumbnail}
        alt={product.title}
        width={64}
        height={64}
        className="h-16 w-16 shrink-0 rounded-lg object-cover"
        unoptimized
      />
      <div className="min-w-0 flex-1">
        <Link href={`/products/${product.id}`} className="font-medium text-slate-800 hover:underline">
          {product.title}
        </Link>
        <p className="mt-0.5 text-xs capitalize text-slate-500">{product.category}</p>

        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-slate-600">
          <span className="font-medium text-slate-800">${product.price}</span>
          <span className="inline-flex items-center gap-1">
            <Star size={12} className="fill-amber-400 text-amber-400" />
            {product.rating.toFixed(1)}
          </span>
          <span>Stock: {product.stock}</span>
        </div>

        <div className="mt-2 flex gap-2">
          <Link
            href={`/products/${product.id}/edit`}
            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-600"
          >
            <Pencil size={12} /> Edit
          </Link>
          <button
            type="button"
            onClick={() => onDelete(product)}
            className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-medium text-red-600"
          >
            <Trash2 size={12} /> Delete
          </button>
        </div>
      </div>
    </div>
  );
}
