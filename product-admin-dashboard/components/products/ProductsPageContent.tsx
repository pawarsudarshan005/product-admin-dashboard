"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import Link from "next/link";
import { Plus } from "lucide-react";
import {
  deleteProduct,
  getCategories,
  getProducts,
  getProductsByCategory,
  searchProducts,
} from "@/services/productService";
import { applyLocalOverlay, getLocallyCreatedProducts, saveDeletedProductId } from "@/lib/localProducts";
import { popFlashMessage } from "@/lib/flashMessage";
import type { Category, Product } from "@/types/product";
import { buildProductsQueryString, parseProductsParams, type PageSize, type ProductsQueryState, type SortField } from "@/utils/urlParams";
import { useDebounce } from "@/hooks/useDebounce";
import ProductFilters from "./ProductFilters";
import ProductTable from "./ProductTable";
import ProductCard from "./ProductCard";
import ProductPagination from "./ProductPagination";
import Loader from "../common/Loader";
import ErrorMessage from "../common/ErrorMessage";
import EmptyState from "../common/EmptyState";
import Banner from "../common/Banner";
import ConfirmDialog from "../common/ConfirmDialog";

export default function ProductsPageContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const state = parseProductsParams(searchParams);

  const [searchInput, setSearchInput] = useState(state.search);
  const debouncedSearch = useDebounce(searchInput, 500);

  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryToken, setRetryToken] = useState(0);
  const [banner, setBanner] = useState<string | null>(null);
  const [productPendingDelete, setProductPendingDelete] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  function updateUrl(next: Partial<ProductsQueryState>) {
    const merged = { ...state, ...next };
    router.replace(`${pathname}?${buildProductsQueryString(merged)}`);
  }

  useEffect(() => {
    getCategories()
      .then(setCategories)
      .catch(() => setCategories([]));

    const flash = popFlashMessage();
    if (flash) setBanner(flash);
  }, []);

  useEffect(() => {
    if (debouncedSearch === state.search) return;
    updateUrl({ search: debouncedSearch, page: 1 });
  }, [debouncedSearch]);

  useEffect(() => {
    const controller = new AbortController();
    let isCurrent = true;

    async function loadProducts() {
      setLoading(true);
      setError(null);
      try {
        const skip = (state.page - 1) * state.pageSize;
        const queryParams = {
          limit: state.pageSize,
          skip,
          sortBy: state.sortBy || undefined,
          order: state.order,
          signal: controller.signal,
        };

        const response = state.search
          ? await searchProducts(state.search, queryParams)
          : state.category
          ? await getProductsByCategory(state.category, queryParams)
          : await getProducts(queryParams);

        if (!isCurrent) return;

        let items = applyLocalOverlay(response.products);
        let total = response.total;

        if (state.page === 1) {
          const created = getLocallyCreatedProducts();
          items = [...created, ...items];
          total += created.length;
        }

        setProducts(items);
        setTotalCount(total);
      } catch (err) {
        if (axios.isCancel(err) || !isCurrent) return;
        setError(err instanceof Error ? err.message : "Failed to load products");
      } finally {
        if (isCurrent) setLoading(false);
      }
    }

    loadProducts();

    return () => {
      isCurrent = false;
      controller.abort();
    };
  }, [state.page, state.pageSize, state.search, state.category, state.sortBy, state.order, retryToken]);

  function handleCategoryChange(value: string) {
    updateUrl({ category: value, page: 1 });
  }

  function handleSortChange(field: SortField | "") {
    updateUrl({ sortBy: field, order: "asc", page: 1 });
  }

  function handleOrderToggle() {
    updateUrl({ order: state.order === "asc" ? "desc" : "asc" });
  }

  function handlePageChange(page: number) {
    updateUrl({ page });
  }

  function handlePageSizeChange(pageSize: PageSize) {
    updateUrl({ pageSize, page: 1 });
  }

  async function handleConfirmDelete() {
    if (!productPendingDelete || isDeleting) return;
    setIsDeleting(true);
    try {
      await deleteProduct(productPendingDelete.id);
      saveDeletedProductId(productPendingDelete.id);
      setProducts((prev) => prev.filter((p) => p.id !== productPendingDelete.id));
      setTotalCount((prev) => Math.max(0, prev - 1));
      setBanner(`"${productPendingDelete.title}" was deleted.`);
      setProductPendingDelete(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete product");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="mb-5 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-slate-900">Products</h1>
        <Link
          href="/products/new"
          className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 py-2 text-sm font-medium text-white hover:bg-indigo-700"
        >
          <Plus size={15} /> Add Product
        </Link>
      </div>

      {banner && (
        <div className="mb-4">
          <Banner message={banner} onDismiss={() => setBanner(null)} />
        </div>
      )}

      <div className="mb-4">
        <ProductFilters
          searchInput={searchInput}
          onSearchInputChange={setSearchInput}
          categories={categories}
          category={state.category}
          onCategoryChange={handleCategoryChange}
          sortBy={state.sortBy}
          order={state.order}
          onSortChange={handleSortChange}
          onOrderToggle={handleOrderToggle}
        />
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        {loading && <Loader label="Loading products..." />}

        {!loading && error && (
          <ErrorMessage message={error} onRetry={() => setRetryToken((t) => t + 1)} />
        )}

        {!loading && !error && products.length === 0 && (
          <EmptyState message="No products found. Try adjusting your search or filters." />
        )}

        {!loading && !error && products.length > 0 && (
          <>
            <ProductTable products={products} onDelete={setProductPendingDelete} />
            <div className="flex flex-col gap-3 p-3 md:hidden">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} onDelete={setProductPendingDelete} />
              ))}
            </div>
            <ProductPagination
              page={state.page}
              pageSize={state.pageSize}
              totalCount={totalCount}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
            />
          </>
        )}
      </div>

      {productPendingDelete && (
        <ConfirmDialog
          title="Delete product"
          message={`Are you sure you want to delete "${productPendingDelete.title}"? This cannot be undone.`}
          isConfirming={isDeleting}
          onConfirm={handleConfirmDelete}
          onCancel={() => setProductPendingDelete(null)}
        />
      )}
    </div>
  );
}
