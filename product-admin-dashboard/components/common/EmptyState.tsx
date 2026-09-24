import { PackageSearch } from "lucide-react";
import type { ReactNode } from "react";

interface Props {
  readonly message: string;
  readonly action?: ReactNode;
}

export default function EmptyState({ message, action }: Props) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
      <PackageSearch className="text-slate-300" size={32} />
      <p className="max-w-sm text-sm text-slate-500">{message}</p>
      {action}
    </div>
  );
}
