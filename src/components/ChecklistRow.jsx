import React from "react";
import { Check } from "lucide-react";

export function ChecklistRow({ item, meta, onClick }) {
  return (
    <button onClick={onClick} className="flex min-h-16 w-full items-center gap-3 rounded-3xl bg-white p-3 text-left shadow-sm">
      <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl ${item.done ? "bg-green-500 text-white" : "bg-slate-100 text-slate-600"}`}>
        <Check size={24} strokeWidth={3} />
      </span>
      <span className="min-w-0 flex-1">
        <span className={`block text-base font-black ${item.done ? "text-slate-400 line-through" : "text-slate-950"}`}>{item.title}</span>
        {meta && <span className="text-sm font-semibold text-slate-500">{meta}</span>}
      </span>
    </button>
  );
}
