"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import ProductForm from "@/components/products/ProductForm";
import { getCategories, getProductById, updateProduct } from "@/services/productService";
import { getLocalProduct, isLocallyDeleted, saveUpdatedProduct } from "@/lib/localProducts";
import { setFlashMessage } from "@/lib/flashMessage";
import type { ApiError } from "@/lib/api";
import type { Category, Product, ProductFormValues } from "@/types/product";
import Loader from "@/components/common/Loader";
import ErrorMessage from "@/components/common/ErrorMessage";
import ProductNotFound from "@/components/products/ProductNotFound";

export default function EditProductPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = Number(params.id);

  const [categories, setCategories] = useState<Category[]>([]);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryToken, setRetryToken] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    getCategories()
      .then(setCategories)
      .catch(() => setCategories([]));
  }, []);

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

  async function handleSubmit(values: ProductFormValues) {
    if (!product || isSubmitting) return;
    setIsSubmitting(true);
    setError(null);
    try {
      await updateProduct(product.id, values);

      const updated: Product = { ...product, ...values, images: [values.thumbnail] };
      saveUpdatedProduct(updated);
      setFlashMessage(`"${updated.title}" was updated.`);
      router.push(`/products/${product.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update product");
      setIsSubmitting(false);
    }
  }

  if (loading) return <Loader label="Loading product..." />;
  if (notFound) return <ProductNotFound />;
  if (error && !product) return <ErrorMessage message={error} onRetry={() => setRetryToken((t) => t + 1)} />;
  if (!product) return null;

  return (
    <div className="mx-auto max-w-xl px-4 py-6 sm:px-6 lg:px-8">
      <Link
        href={`/products/${product.id}`}
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800"
      >
        <ArrowLeft size={14} /> Back to product
      </Link>
      <h1 className="mb-5 text-xl font-semibold text-slate-900">Edit Product</h1>

      {error && <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

      <div className="rounded-xl border border-slate-200 bg-white p-5">
        <ProductForm
          initialValues={{
            title: product.title,
            description: product.description,
            category: product.category,
            price: product.price,
            stock: product.stock,
            rating: product.rating,
            thumbnail: product.thumbnail,
          }}
          categories={categories}
          isSubmitting={isSubmitting}
          submitLabel="Save Changes"
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}
