import { useEffect } from "react";
import { X } from "lucide-react";

export function Toast({ message, onClose }) {
  useEffect(() => {
    const timer = window.setTimeout(onClose, 2200);
    return () => window.clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="absolute left-4 right-4 top-24 z-30 flex min-h-14 items-center justify-between gap-3 rounded-3xl bg-slate-900 px-4 py-3 text-white shadow-soft">
      <span className="text-sm font-black">{message}</span>
      <button
        onClick={onClose}
        className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-white/10"
        aria-label="Закрыть уведомление"
      >
        <X size={20} />
      </button>
    </div>
  );
}
