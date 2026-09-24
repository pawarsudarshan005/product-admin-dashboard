"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import ProductForm from "@/components/products/ProductForm";
import { createProduct, getCategories } from "@/services/productService";
import { saveCreatedProduct } from "@/lib/localProducts";
import { setFlashMessage } from "@/lib/flashMessage";
import type { Category, Product, ProductFormValues } from "@/types/product";

export default function NewProductPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getCategories()
      .then(setCategories)
      .catch(() => setCategories([]));
  }, []);

  async function handleSubmit(values: ProductFormValues) {
    if (isSubmitting) return;
    setIsSubmitting(true);
    setError(null);
    try {
      await createProduct(values);

      const product: Product = {
        id: Date.now(),
        title: values.title,
        description: values.description,
        category: values.category,
        price: values.price,
        discountPercentage: 0,
        rating: values.rating,
        stock: values.stock,
        thumbnail: values.thumbnail,
        images: [values.thumbnail],
        reviews: [],
      };

      saveCreatedProduct(product);
      setFlashMessage(`"${product.title}" was added.`);
      router.push("/products");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create product");
      setIsSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-6 sm:px-6 lg:px-8">
      <Link
        href="/products"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800"
      >
        <ArrowLeft size={14} /> Back to products
      </Link>
      <h1 className="mb-5 text-xl font-semibold text-slate-900">Add Product</h1>

      {error && <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

      <div className="rounded-xl border border-slate-200 bg-white p-5">
        <ProductForm
          categories={categories}
          isSubmitting={isSubmitting}
          submitLabel="Create Product"
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}
