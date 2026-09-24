"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Pencil, Star, Trash2 } from "lucide-react";
import { deleteProduct, getProductById } from "@/services/productService";
import { getLocalProduct, isLocallyDeleted, saveDeletedProductId } from "@/lib/localProducts";
import { setFlashMessage } from "@/lib/flashMessage";
import type { ApiError } from "@/lib/api";
import type { Product } from "@/types/product";
import Loader from "@/components/common/Loader";
import ErrorMessage from "@/components/common/ErrorMessage";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import ProductNotFound from "@/components/products/ProductNotFound";

export default function ProductDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = Number(params.id);

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryToken, setRetryToken] = useState(0);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!Number.isInteger(id) || isLocallyDeleted(id)) {
      setNotFound(true);
      setLoading(false);
      return;
    }

    const localProduct = getLocalProduct(id);
    if (localProduct) {
      setProduct(localProduct);
      setLoading(false);
      return;
    }

    let isCurrent = true;
    setLoading(true);
    setError(null);
    setNotFound(false);

    getProductById(id)
      .then((data) => {
        if (isCurrent) setProduct(data);
      })
      .catch((err) => {
        if (!isCurrent) return;
        if ((err as ApiError).status === 404) {
          setNotFound(true);
        } else {
          setError(err instanceof Error ? err.message : "Failed to load product");
        }
      })
      .finally(() => {
        if (isCurrent) setLoading(false);
      });

    return () => {
      isCurrent = false;
    };
  }, [id, retryToken]);

  async function handleConfirmDelete() {
    if (!product || isDeleting) return;
    setIsDeleting(true);
    try {
      await deleteProduct(product.id);
      saveDeletedProductId(product.id);
      setFlashMessage(`"${product.title}" was deleted.`);
      router.push("/products");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete product");
      setIsDeleting(false);
    }
  }

  if (loading) return <Loader label="Loading product..." />;
  if (notFound) return <ProductNotFound />;
  if (error) return <ErrorMessage message={error} onRetry={() => setRetryToken((t) => t + 1)} />;
  if (!product) return null;

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8">
      <Link
        href="/products"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800"
      >
        <ArrowLeft size={14} /> Back to products
      </Link>

      <div className="grid gap-6 rounded-xl border border-slate-200 bg-white p-5 sm:grid-cols-2">
        <div className="flex flex-col gap-3">
          <div className="aspect-square overflow-hidden rounded-lg bg-slate-100">
            <Image
              src={product.thumbnail}
              alt={product.title}
              width={500}
              height={500}
              className="h-full w-full object-cover"
              unoptimized
            />
          </div>
          {product.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto">
              {product.images.map((src, i) => (
                <Image
                  key={src + i}
                  src={src}
                  alt={`${product.title} ${i + 1}`}
                  width={64}
                  height={64}
                  className="h-16 w-16 shrink-0 rounded-lg object-cover"
                  unoptimized
                />
              ))}
            </div>
          )}
        </div>

        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-indigo-600">{product.category}</p>
          <h1 className="mt-1 text-2xl font-semibold text-slate-900">{product.title}</h1>

          <div className="mt-2 flex items-center gap-3 text-sm text-slate-600">
            <span className="inline-flex items-center gap-1">
              <Star size={14} className="fill-amber-400 text-amber-400" /> {product.rating.toFixed(1)}
            </span>
            <span>Stock: {product.stock}</span>
          </div>

          <p className="mt-3 text-2xl font-semibold text-slate-900">${product.price}</p>
          <p className="mt-4 text-sm leading-relaxed text-slate-600">{product.description}</p>

          <div className="mt-6 flex gap-2">
            <Link
              href={`/products/${product.id}/edit`}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 px-3.5 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              <Pencil size={14} /> Edit
            </Link>
            <button
              type="button"
              onClick={() => setConfirmingDelete(true)}
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-red-200 px-3.5 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
            >
              <Trash2 size={14} /> Delete
            </button>
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-xl border border-slate-200 bg-white p-5">
        <h2 className="mb-3 text-base font-semibold text-slate-900">Reviews</h2>
        {(!product.reviews || product.reviews.length === 0) && (
          <p className="text-sm text-slate-500">No reviews yet.</p>
        )}
        <div className="flex flex-col gap-4">
          {product.reviews?.map((review, i) => (
            <div key={review.reviewerEmail + i} className="border-b border-slate-100 pb-3 last:border-0 last:pb-0">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-800">{review.reviewerName}</span>
                <span className="inline-flex items-center gap-1 text-xs text-slate-500">
                  <Star size={12} className="fill-amber-400 text-amber-400" /> {review.rating}
                </span>
              </div>
              <p className="mt-1 text-sm text-slate-600">{review.comment}</p>
              <p className="mt-1 text-xs text-slate-400">{new Date(review.date).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      </div>

      {confirmingDelete && (
        <ConfirmDialog
          title="Delete product"
          message={`Are you sure you want to delete "${product.title}"? This cannot be undone.`}
          isConfirming={isDeleting}
          onConfirm={handleConfirmDelete}
          onCancel={() => setConfirmingDelete(false)}
        />
      )}
    </div>
  );
}
