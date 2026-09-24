import { ChevronLeft, ChevronRight } from "lucide-react";
import { PAGE_SIZE_OPTIONS, type PageSize } from "@/utils/urlParams";

interface Props {
  readonly page: number;
  readonly pageSize: PageSize;
  readonly totalCount: number;
  readonly onPageChange: (page: number) => void;
  readonly onPageSizeChange: (pageSize: PageSize) => void;
}

function pageWindow(page: number, pageCount: number): number[] {
  const size = Math.min(5, pageCount);
  let start = Math.max(1, page - 2);
  if (start + size - 1 > pageCount) start = pageCount - size + 1;
  return Array.from({ length: size }, (_, i) => start + i);
}

export default function ProductPagination({ page, pageSize, totalCount, onPageChange, onPageSizeChange }: Props) {
  const pageCount = Math.max(1, Math.ceil(totalCount / pageSize));
  const from = totalCount === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(totalCount, page * pageSize);

  return (
    <div className="flex flex-col gap-3 border-t border-slate-200 px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3 text-sm text-slate-500">
        <span>
          Showing <span className="font-medium text-slate-700">{from}</span>–
          <span className="font-medium text-slate-700">{to}</span> of{" "}
          <span className="font-medium text-slate-700">{totalCount}</span>
        </span>

        <select
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value) as PageSize)}
          className="rounded-lg border border-slate-300 px-2 py-1 text-xs text-slate-600 outline-none cursor-pointer"
        >
          {PAGE_SIZE_OPTIONS.map((size) => (
            <option key={size} value={size}>
              {size} / page
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          aria-label="Previous page"
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:enabled:border-slate-300 disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer"
        >
          <ChevronLeft size={15} />
        </button>

        {pageWindow(page, pageCount).map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => onPageChange(p)}
            aria-current={p === page ? "page" : undefined}
            className={`h-8 min-w-[32px] rounded-lg px-2 text-sm font-medium cursor-pointer ${
              p === page
                ? "bg-indigo-600 text-white"
                : "border border-slate-200 text-slate-600 hover:border-slate-300"
            }`}
          >
            {p}
          </button>
        ))}

        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= pageCount}
          aria-label="Next page"
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:enabled:border-slate-300 disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer"
        >
          <ChevronRight size={15} />
        </button>
      </div>
    </div>
  );
}
