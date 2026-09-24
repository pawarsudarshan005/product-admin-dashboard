import { AlertTriangle, RotateCw } from "lucide-react";

interface Props {
  readonly message: string;
  readonly onRetry?: () => void;
}

export default function ErrorMessage({ message, onRetry }: Props) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
      <AlertTriangle className="text-red-500" size={28} />
      <p className="max-w-sm text-sm text-slate-600">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3.5 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50 cursor-pointer"
        >
          <RotateCw size={14} />
          Retry
        </button>
      )}
    </div>
  );
}
