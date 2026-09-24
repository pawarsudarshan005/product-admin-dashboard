import { api } from "@/lib/api";
import type { Category, Product, ProductFormValues, ProductListResponse } from "@/types/product";

export interface ProductQueryParams {
  limit: number;
  skip: number;
  sortBy?: "title" | "price" | "rating";
  order?: "asc" | "desc";
  signal?: AbortSignal;
}

function sortParams(params: ProductQueryParams) {
  return params.sortBy ? { sortBy: params.sortBy, order: params.order ?? "asc" } : {};
}

export async function getProducts(params: ProductQueryParams): Promise<ProductListResponse> {
  const response = await api.get<ProductListResponse>("/products", {
    params: { limit: params.limit, skip: params.skip, ...sortParams(params) },
    signal: params.signal,
  });
  return response.data;
}

export async function searchProducts(query: string, params: ProductQueryParams): Promise<ProductListResponse> {
  const response = await api.get<ProductListResponse>("/products/search", {
    params: { q: query, limit: params.limit, skip: params.skip, ...sortParams(params) },
    signal: params.signal,
  });
  return response.data;
}

export async function getProductsByCategory(
  category: string,
  params: ProductQueryParams
): Promise<ProductListResponse> {
  const response = await api.get<ProductListResponse>(`/products/category/${category}`, {
    params: { limit: params.limit, skip: params.skip, ...sortParams(params) },
    signal: params.signal,
  });
  return response.data;
}

export async function getCategories(): Promise<Category[]> {
  const response = await api.get<Array<{ slug: string; name: string }>>("/products/categories");
  return response.data.map((category) => ({ slug: category.slug, name: category.name }));
}

export async function getProductById(id: number): Promise<Product> {
  const response = await api.get<Product>(`/products/${id}`);
  return response.data;
}

export async function createProduct(values: ProductFormValues): Promise<Product> {
  const response = await api.post<Product>("/products/add", values);
  return response.data;
}

export async function updateProduct(id: number, values: ProductFormValues): Promise<Product> {
  const response = await api.put<Product>(`/products/${id}`, values);
  return response.data;
}

export async function deleteProduct(id: number): Promise<void> {
  await api.delete(`/products/${id}`);
}
