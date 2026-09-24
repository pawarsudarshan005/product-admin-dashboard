import { Loader2 } from "lucide-react";

export default function Loader({ label = "Loading..." }: { readonly label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-16 text-slate-500">
      <Loader2 className="animate-spin" size={28} />
      <p className="text-sm">{label}</p>
    </div>
  );
}
