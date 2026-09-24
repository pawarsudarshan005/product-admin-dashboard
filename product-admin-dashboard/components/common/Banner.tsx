import { CheckCircle2, X } from "lucide-react";

interface Props {
  readonly message: string;
  readonly onDismiss: () => void;
}

/** Small success banner shown after add/edit/delete actions. */
export default function Banner({ message, onDismiss }: Props) {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-4 py-2.5 text-sm text-green-800">
      <CheckCircle2 size={16} className="shrink-0" />
      <span className="flex-1">{message}</span>
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Dismiss"
        className="cursor-pointer text-green-700 hover:text-green-900"
      >
        <X size={15} />
      </button>
    </div>
  );
}
