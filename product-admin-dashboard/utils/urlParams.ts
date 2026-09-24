export const PAGE_SIZE_OPTIONS = [10, 20, 50] as const;
export type PageSize = (typeof PAGE_SIZE_OPTIONS)[number];

export const SORT_FIELDS = ["title", "price", "rating"] as const;
export type SortField = (typeof SORT_FIELDS)[number];
export type SortOrder = "asc" | "desc";

export interface ProductsQueryState {
  page: number;
  pageSize: PageSize;
  search: string;
  category: string;
  sortBy: SortField | "";
  order: SortOrder;
}

export const DEFAULT_QUERY_STATE: ProductsQueryState = {
  page: 1,
  pageSize: 20,
  search: "",
  category: "",
  sortBy: "",
  order: "asc",
};

export function parseProductsParams(searchParams: URLSearchParams): ProductsQueryState {
  const rawPage = Number(searchParams.get("page"));
  const page = Number.isInteger(rawPage) && rawPage > 0 ? rawPage : DEFAULT_QUERY_STATE.page;

  const rawPageSize = Number(searchParams.get("pageSize"));
  const pageSize = PAGE_SIZE_OPTIONS.includes(rawPageSize as PageSize)
    ? (rawPageSize as PageSize)
    : DEFAULT_QUERY_STATE.pageSize;

  const search = searchParams.get("search")?.trim() ?? "";
  const category = searchParams.get("category")?.trim() ?? "";

  const rawSortBy = searchParams.get("sort");
  const sortBy = (SORT_FIELDS as readonly string[]).includes(rawSortBy ?? "")
    ? (rawSortBy as SortField)
    : "";

  const order: SortOrder = searchParams.get("order") === "desc" ? "desc" : "asc";

  return { page, pageSize, search, category, sortBy, order };
}

export function buildProductsQueryString(state: ProductsQueryState): string {
  const params = new URLSearchParams();
  params.set("page", String(state.page));
  params.set("pageSize", String(state.pageSize));
  if (state.search) params.set("search", state.search);
  if (state.category) params.set("category", state.category);
  if (state.sortBy) {
    params.set("sort", state.sortBy);
    params.set("order", state.order);
  }
  return params.toString();
}
