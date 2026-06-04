import { tabs } from "../lib/mockData";

export function BottomNav({ activeTab, setActiveTab }) {
  return (
    <nav className="absolute bottom-3 left-1/2 z-10 grid w-[calc(100%-2rem)] max-w-[28rem] -translate-x-1/2 grid-cols-6 rounded-[1.75rem] border border-slate-200 bg-white/95 p-1.5 shadow-soft backdrop-blur">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const active = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex min-h-16 flex-col items-center justify-center gap-1 rounded-3xl text-[10px] font-black transition-all ${
              active ? "bg-slate-900 text-white" : "text-slate-500 hover:text-slate-700"
            }`}
          >
            <Icon size={20} strokeWidth={active ? 3 : 2.4} />
            <span>{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
