import { X } from "lucide-react";

export function Sheet({ title, eyebrow, children, onClose }) {
  return (
    <div className="absolute inset-0 z-40 flex items-end bg-slate-950/35 p-3 backdrop-blur-sm animate-fade-in">
      <section className="max-h-[86vh] w-full overflow-y-auto rounded-[2rem] bg-white p-4 shadow-soft">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div className="min-w-0">
            {eyebrow && <p className="text-sm font-black uppercase tracking-wide text-amber-600">{eyebrow}</p>}
            <h2 className="text-2xl font-black text-slate-950">{title}</h2>
          </div>
          <button
            onClick={onClose}
            className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-slate-100 text-slate-700"
            aria-label="Закрыть"
          >
            <X size={24} />
          </button>
        </div>
        {children}
      </section>
    </div>
  );
}
