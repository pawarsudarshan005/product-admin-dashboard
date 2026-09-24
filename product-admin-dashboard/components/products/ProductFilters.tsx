"use client";

import { ArrowDownAZ, ArrowUpAZ, Search, X } from "lucide-react";
import type { Category } from "@/types/product";
import type { SortField, SortOrder } from "@/utils/urlParams";

interface Props {
  readonly searchInput: string;
  readonly onSearchInputChange: (value: string) => void;
  readonly categories: Category[];
  readonly category: string;
  readonly onCategoryChange: (value: string) => void;
  readonly sortBy: SortField | "";
  readonly order: SortOrder;
  readonly onSortChange: (field: SortField | "") => void;
  readonly onOrderToggle: () => void;
}

export default function ProductFilters({
  searchInput,
  onSearchInputChange,
  categories,
  category,
  onCategoryChange,
  sortBy,
  order,
  onSortChange,
  onOrderToggle,
}: Props) {
  const isSearchActive = searchInput.trim().length > 0;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-3">
        <div className="relative min-w-[200px] flex-1 max-w-sm">
          <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => onSearchInputChange(e.target.value)}
            placeholder="Search products..."
            className="w-full rounded-lg border border-slate-300 py-2 pl-9 pr-8 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />
          {isSearchActive && (
            <button
              type="button"
              onClick={() => onSearchInputChange("")}
              aria-label="Clear search"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 cursor-pointer text-slate-400 hover:text-slate-700"
            >
              <X size={14} />
            </button>
          )}
        </div>

        <select
          value={category}
          onChange={(e) => onCategoryChange(e.target.value)}
          disabled={isSearchActive}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700 outline-none focus:border-indigo-500 cursor-pointer disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
        >
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>

        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value as SortField | "")}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700 outline-none focus:border-indigo-500 cursor-pointer"
        >
          <option value="">Sort by...</option>
          <option value="title">Title</option>
          <option value="price">Price</option>
          <option value="rating">Rating</option>
        </select>

        {sortBy && (
          <button
            type="button"
            onClick={onOrderToggle}
            aria-label="Toggle sort order"
            className="flex items-center gap-1.5 rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 cursor-pointer"
          >
            {order === "asc" ? <ArrowUpAZ size={15} /> : <ArrowDownAZ size={15} />}
            {order === "asc" ? "Ascending" : "Descending"}
          </button>
        )}
      </div>

      {isSearchActive && (
        <p className="text-xs text-slate-400">
          Category filter is disabled while searching. The DummyJSON API can search or filter by
          category, but not both at once - clear the search to filter by category.
        </p>
      )}
    </div>
  );
}
