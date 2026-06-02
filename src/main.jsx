import React from "react";
import { createRoot } from "react-dom/client";
import {
  Bell,
  CalendarDays,
  Check,
  ChefHat,
  Clock3,
  Database,
  FileText,
  Flame,
  Home,
  MessageCircle,
  Minus,
  Phone,
  Plus,
  Search,
  ShieldCheck,
  ShoppingBasket,
  Sparkles,
  Star,
  X,
  Users,
  Utensils,
  WalletCards,
} from "lucide-react";
import "./index.css";

const tabs = [
  { id: "dashboard", label: "Обзор", icon: Home },
  { id: "recipes", label: "ТТК", icon: Utensils },
  { id: "database", label: "Базы", icon: Database },
  { id: "schedule", label: "График", icon: CalendarDays },
  { id: "chat", label: "Чат", icon: MessageCircle },
];

const stats = [
  { label: "Фудкост", value: "29.4%", delta: "-1.8%", icon: WalletCards, tone: "amber" },
  { label: "На смене", value: "12", delta: "3 цеха", icon: Users, tone: "green" },
  { label: "Ожидают", value: "8", delta: "2 срочно", icon: ShoppingBasket, tone: "red" },
];

const initialTasks = [
  { id: 1, title: "Проверить заготовки соусов", zone: "Холодный цех", done: false, priority: "high" },
  { id: 2, title: "Принять поставку рыбы", zone: "Склад", done: false, priority: "high" },
  { id: 3, title: "Обновить стоп-лист", zone: "Pass", done: true, priority: "normal" },
  { id: 4, title: "Брифинг по банкету 19:30", zone: "Команда", done: false, priority: "normal" },
];

const recipeFilters = ["Все", "Закуски", "Супы", "Горячее", "Соусы"];

const recipes = [
  {
    id: 1,
    title: "Тартар из тунца",
    category: "Закуски",
    time: "12 мин",
    yield: "180 г",
    cost: "4.80 EUR",
    emoji: "🥗",
    image: "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=240&q=80",
  },
  {
    id: 2,
    title: "Крем-суп из тыквы",
    category: "Супы",
    time: "28 мин",
    yield: "320 г",
    cost: "2.10 EUR",
    emoji: "🍲",
    image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=240&q=80",
  },
  {
    id: 3,
    title: "Утиная грудка",
    category: "Горячее",
    time: "34 мин",
    yield: "260 г",
    cost: "7.40 EUR",
    emoji: "🍽️",
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=240&q=80",
  },
  {
    id: 4,
    title: "Бер блан",
    category: "Соусы",
    time: "18 мин",
    yield: "500 г",
    cost: "3.35 EUR",
    emoji: "🧈",
    image: "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=240&q=80",
  },
];

const suppliers = [
  { id: 1, name: "Nord Fish", category: "Рыба и морепродукты", minimum: "250 EUR", rating: "98%" },
  { id: 2, name: "Bio Herbs", category: "Зелень и овощи", minimum: "90 EUR", rating: "94%" },
  { id: 3, name: "Prime Meat", category: "Мясо и птица", minimum: "300 EUR", rating: "96%" },
];

const clients = [
  { id: 1, name: "Марина Волкова", category: "VIP, без лактозы", minimum: "Любит стол 12", rating: "5 визитов" },
  { id: 2, name: "Андрей Левин", category: "Дегустационное меню", minimum: "Без кинзы", rating: "12 визитов" },
  { id: 3, name: "Yulia Group", category: "Корпоративный банкет", minimum: "18 персон", rating: "Срочно" },
];

const week = [
  { day: "Пн", date: "02", active: true },
  { day: "Вт", date: "03" },
  { day: "Ср", date: "04" },
  { day: "Чт", date: "05" },
  { day: "Пт", date: "06" },
  { day: "Сб", date: "07" },
  { day: "Вс", date: "08" },
];

const staff = [
  { id: 1, name: "Олег", role: "Су-шеф", time: "09:00-18:00", status: "На смене", color: "bg-green-500", avatar: "О" },
  { id: 2, name: "Ирина", role: "Холодный цех", time: "11:00-22:00", status: "Ожидается", color: "bg-amber-500", avatar: "И" },
  { id: 3, name: "Матеуш", role: "Горячий цех", time: "12:00-23:00", status: "На смене", color: "bg-green-500", avatar: "М" },
  { id: 4, name: "Саша", role: "Заготовки", time: "08:00-16:00", status: "На смене", color: "bg-green-500", avatar: "С" },
];

const messages = [
  { id: 1, from: "Олег", text: "Рыба приехала. Проверяю температуру.", mine: false, time: "10:18" },
  { id: 2, from: "Chef", text: "Принять только после фото накладной.", mine: true, time: "10:19" },
  { id: 3, from: "Ирина", text: "Соус бер блан готов, держу на водяной.", mine: false, time: "10:24" },
];

function App() {
  const [activeTab, setActiveTab] = React.useState("dashboard");
  const [tasks, setTasks] = React.useState(initialTasks);
  const [recipeFilter, setRecipeFilter] = React.useState("Все");
  const [databaseMode, setDatabaseMode] = React.useState("suppliers");
  const [selectedDay, setSelectedDay] = React.useState("02");
  const [query, setQuery] = React.useState("");
  const [selectedRecipe, setSelectedRecipe] = React.useState(null);
  const [quickPanelOpen, setQuickPanelOpen] = React.useState(false);
  const [callToast, setCallToast] = React.useState("");

  const normalizedQuery = query.trim().toLowerCase();
  const filteredRecipes = (recipeFilter === "Все" ? recipes : recipes.filter((recipe) => recipe.category === recipeFilter)).filter((recipe) =>
    `${recipe.title} ${recipe.category}`.toLowerCase().includes(normalizedQuery)
  );

  const screenTitle = {
    dashboard: "Обзор смены",
    recipes: "ТТК",
    database: "Справочники",
    schedule: "График смен",
    chat: "# Общая кухня",
  }[activeTab];

  return (
    <main className="min-h-screen px-3 py-3 text-slate-900 sm:px-6">
      <section className="relative mx-auto flex min-h-[calc(100vh-24px)] w-full max-w-md flex-col overflow-hidden rounded-[2rem] border border-white/70 bg-slate-50 shadow-soft sm:min-h-[860px]">
        <StatusBar />
        <AppHeader title={screenTitle} activeTab={activeTab} />
        <div className="flex-1 overflow-y-auto px-4 pb-28 pt-2">
          {activeTab === "dashboard" && <Dashboard tasks={tasks} setTasks={setTasks} query={query} setQuery={setQuery} />}
          {activeTab === "recipes" && <Recipes filter={recipeFilter} setFilter={setRecipeFilter} recipes={filteredRecipes} query={query} setQuery={setQuery} setSelectedRecipe={setSelectedRecipe} />}
          {activeTab === "database" && <DatabaseScreen mode={databaseMode} setMode={setDatabaseMode} setCallToast={setCallToast} />}
          {activeTab === "schedule" && <Schedule selectedDay={selectedDay} setSelectedDay={setSelectedDay} />}
          {activeTab === "chat" && <Chat />}
        </div>
        {callToast && <Toast message={callToast} onClose={() => setCallToast("")} />}
        {selectedRecipe && <RecipeSheet recipe={selectedRecipe} onClose={() => setSelectedRecipe(null)} />}
        {quickPanelOpen && <QuickPanel activeTab={activeTab} onClose={() => setQuickPanelOpen(false)} />}
        <Fab activeTab={activeTab} onClick={() => setQuickPanelOpen(true)} />
        <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
      </section>
    </main>
  );
}

function StatusBar() {
  return (
    <div className="flex h-9 items-center justify-between px-6 pt-2 text-[13px] font-black text-slate-900">
      <span>10:30</span>
      <div className="flex items-center gap-1.5">
        <div className="h-3 w-4 rounded-sm border-2 border-slate-900" />
        <div className="h-3 w-5 rounded-sm bg-slate-900" />
      </div>
    </div>
  );
}

function AppHeader({ title, activeTab }) {
  return (
    <header className="px-4 pb-3 pt-2">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-amber-600">{activeTab === "dashboard" ? "Chef OS" : "Kitchen Command"}</p>
          <h1 className="text-3xl font-black leading-tight tracking-normal text-slate-950">{title}</h1>
        </div>
        <div className="flex items-center gap-2">
          <button className="grid h-12 w-12 place-items-center rounded-2xl border border-slate-200 bg-white text-slate-700 shadow-sm" aria-label="Уведомления">
            <Bell size={21} />
          </button>
          <div className="relative grid h-12 w-12 place-items-center rounded-2xl bg-slate-900 text-lg font-black text-white">
            Д
            <span className="absolute -right-0.5 -top-0.5 h-4 w-4 rounded-full border-2 border-slate-50 bg-green-500" />
          </div>
        </div>
      </div>
    </header>
  );
}

function Dashboard({ tasks, setTasks, query, setQuery }) {
  return (
    <div className="space-y-5">
      <SearchBox value={query} onChange={setQuery} />
      <div className="no-scrollbar -mx-4 flex snap-x gap-3 overflow-x-auto px-4">
        {stats.map((stat) => (
          <StatCard key={stat.label} stat={stat} />
        ))}
      </div>
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-xl font-black">Задачи на смену</h2>
          <span className="rounded-full bg-amber-100 px-3 py-1 text-sm font-extrabold text-amber-700">{tasks.filter((task) => !task.done).length} активны</span>
        </div>
        <div className="space-y-3">
          {tasks.map((task) => (
            <button
              key={task.id}
              onClick={() => setTasks((current) => current.map((item) => (item.id === task.id ? { ...item, done: !item.done } : item)))}
              className="flex min-h-16 w-full items-center gap-3 rounded-3xl bg-white p-3 text-left shadow-sm"
            >
              <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl ${task.done ? "bg-green-500 text-white" : task.priority === "high" ? "bg-red-50 text-red-500" : "bg-amber-50 text-amber-600"}`}>
                {task.done ? <Check size={24} strokeWidth={3} /> : <Minus size={24} strokeWidth={3} />}
              </span>
              <span className="min-w-0 flex-1">
                <span className={`block text-base font-black ${task.done ? "text-slate-400 line-through" : "text-slate-950"}`}>{task.title}</span>
                <span className="text-sm font-semibold text-slate-500">{task.zone}</span>
              </span>
            </button>
          ))}
        </div>
      </section>
      <ActionStrip />
    </div>
  );
}

function SearchBox({ value, onChange }) {
  return (
    <label className="flex h-14 items-center gap-3 rounded-3xl bg-white px-4 shadow-sm">
      <Search className="text-slate-400" size={22} />
      <input value={value} onChange={(event) => onChange(event.target.value)} className="h-full min-w-0 flex-1 bg-transparent text-base font-semibold outline-none placeholder:text-slate-400" placeholder="Блюдо, поставщик, VIP..." />
    </label>
  );
}

function StatCard({ stat }) {
  const Icon = stat.icon;
  const tone = {
    amber: "bg-amber-500 text-white",
    green: "bg-green-500 text-white",
    red: "bg-red-500 text-white",
  }[stat.tone];

  return (
    <article className="min-w-[76%] snap-start rounded-3xl bg-white p-4 shadow-sm">
      <div className="mb-5 flex items-center justify-between">
        <span className={`grid h-12 w-12 place-items-center rounded-2xl ${tone}`}>
          <Icon size={24} />
        </span>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-extrabold text-slate-600">{stat.delta}</span>
      </div>
      <p className="text-sm font-bold text-slate-500">{stat.label}</p>
      <p className="text-4xl font-black tracking-normal text-slate-950">{stat.value}</p>
    </article>
  );
}

function ActionStrip() {
  return (
    <div className="grid grid-cols-3 gap-3">
      {[
        { label: "Стоп", icon: ShieldCheck, color: "bg-red-500" },
        { label: "Заказ", icon: ShoppingBasket, color: "bg-amber-500" },
        { label: "Бриф", icon: Sparkles, color: "bg-slate-900" },
      ].map((action) => {
        const Icon = action.icon;
        return (
          <button key={action.label} className={`${action.color} flex min-h-20 flex-col items-center justify-center gap-1 rounded-3xl text-white shadow-sm`}>
            <Icon size={24} />
            <span className="text-sm font-black">{action.label}</span>
          </button>
        );
      })}
    </div>
  );
}

function Recipes({ filter, setFilter, recipes, query, setQuery, setSelectedRecipe }) {
  return (
    <div className="space-y-4">
      <SearchBox value={query} onChange={setQuery} />
      <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4">
        {recipeFilters.map((item) => (
          <button
            key={item}
            onClick={() => setFilter(item)}
            className={`min-h-12 shrink-0 rounded-2xl px-5 text-sm font-black ${filter === item ? "bg-slate-900 text-white" : "bg-white text-slate-600 shadow-sm"}`}
          >
            {item}
          </button>
        ))}
      </div>
      <div className="space-y-3">
        {recipes.map((recipe) => (
          <button key={recipe.id} onClick={() => setSelectedRecipe(recipe)} className="flex min-h-28 w-full items-center gap-3 rounded-3xl bg-white p-3 text-left shadow-sm">
            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-3xl bg-amber-100">
              <img src={recipe.image} alt="" className="h-full w-full object-cover" />
              <span className="absolute bottom-1 right-1 grid h-8 w-8 place-items-center rounded-full bg-white text-lg shadow-sm">{recipe.emoji}</span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-lg font-black text-slate-950">{recipe.title}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                <Badge icon={Clock3} label={recipe.time} />
                <Badge icon={ChefHat} label={recipe.yield} />
              </div>
              <p className="mt-2 text-sm font-bold text-slate-500">Себестоимость: {recipe.cost}</p>
            </div>
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-amber-500 text-white">
              <Plus size={24} />
            </span>
          </button>
        ))}
        {recipes.length === 0 && (
          <div className="rounded-3xl bg-white p-6 text-center shadow-sm">
            <FileText className="mx-auto mb-3 text-slate-300" size={34} />
            <p className="text-lg font-black text-slate-950">ТТК не найдена</p>
            <p className="mt-1 text-sm font-semibold text-slate-500">Проверь фильтр или запрос поиска.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function DatabaseScreen({ mode, setMode, setCallToast }) {
  const items = mode === "suppliers" ? suppliers : clients;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 rounded-3xl bg-white p-1 shadow-sm">
        <button onClick={() => setMode("suppliers")} className={`min-h-12 rounded-[1.35rem] text-sm font-black ${mode === "suppliers" ? "bg-slate-900 text-white" : "text-slate-500"}`}>
          Поставщики
        </button>
        <button onClick={() => setMode("clients")} className={`min-h-12 rounded-[1.35rem] text-sm font-black ${mode === "clients" ? "bg-slate-900 text-white" : "text-slate-500"}`}>
          Клиенты
        </button>
      </div>
      <div className="space-y-3">
        {items.map((item) => (
          <article key={item.id} className="flex min-h-24 items-center gap-3 rounded-3xl bg-white p-4 shadow-sm">
            <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-amber-100 text-amber-700">
              {mode === "suppliers" ? <ShoppingBasket size={26} /> : <Star size={26} />}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-lg font-black text-slate-950">{item.name}</p>
              <p className="text-sm font-semibold text-slate-500">{item.category}</p>
              <p className="mt-1 text-sm font-black text-slate-700">{mode === "suppliers" ? "Мин. заказ" : "Заметка"}: {item.minimum}</p>
            </div>
            <button onClick={() => setCallToast(`Быстрый звонок: ${item.name}`)} className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-green-500 text-white" aria-label="Позвонить">
              <Phone size={22} />
            </button>
          </article>
        ))}
      </div>
    </div>
  );
}

function Schedule({ selectedDay, setSelectedDay }) {
  return (
    <div className="space-y-4">
      <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4">
        {week.map((item) => {
          const active = selectedDay === item.date;
          return (
            <button key={item.date} onClick={() => setSelectedDay(item.date)} className={`flex h-20 w-16 shrink-0 flex-col items-center justify-center rounded-3xl font-black ${active ? "bg-amber-500 text-white" : "bg-white text-slate-700 shadow-sm"}`}>
              <span className="text-xs">{item.day}</span>
              <span className="text-2xl">{item.date}</span>
            </button>
          );
        })}
      </div>
      <div className="rounded-3xl bg-slate-900 p-4 text-white">
        <div className="flex items-center gap-3">
          <Flame className="text-amber-400" size={26} />
          <div>
            <p className="text-sm font-bold text-slate-300">Пиковая нагрузка</p>
            <p className="text-xl font-black">18:30-21:00</p>
          </div>
        </div>
      </div>
      <div className="space-y-3">
        {staff.map((person) => (
          <article key={person.id} className="flex min-h-20 items-center gap-3 rounded-3xl bg-white p-3 shadow-sm">
            <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-slate-100 text-lg font-black text-slate-900">{person.avatar}</div>
            <div className="min-w-0 flex-1">
              <p className="text-lg font-black text-slate-950">{person.name}</p>
              <p className="text-sm font-semibold text-slate-500">{person.role} · {person.time}</p>
            </div>
            <span className={`min-w-24 rounded-full px-3 py-2 text-center text-xs font-black text-white ${person.color}`}>{person.status}</span>
          </article>
        ))}
      </div>
    </div>
  );
}

function Chat() {
  const [chatMessages, setChatMessages] = React.useState(messages);
  const [draft, setDraft] = React.useState("");

  function sendMessage() {
    const text = draft.trim();
    if (!text) return;
    setChatMessages((current) => [...current, { id: Date.now(), from: "Chef", text, mine: true, time: "сейчас" }]);
    setDraft("");
  }

  return (
    <div className="flex min-h-full flex-col gap-4">
      <div className="rounded-3xl bg-white p-4 shadow-sm">
        <p className="text-sm font-bold text-slate-500">Канал смены</p>
        <p className="text-2xl font-black text-slate-950"># Общая кухня</p>
      </div>
      <div className="flex flex-1 flex-col gap-3">
        {chatMessages.map((message) => (
          <div key={message.id} className={`flex ${message.mine ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[82%] rounded-3xl px-4 py-3 shadow-sm ${message.mine ? "bg-amber-500 text-white" : "bg-white text-slate-900"}`}>
              {!message.mine && <p className="mb-1 text-xs font-black text-amber-600">{message.from}</p>}
              <p className="text-base font-bold leading-snug">{message.text}</p>
              <p className={`mt-1 text-right text-xs font-bold ${message.mine ? "text-amber-100" : "text-slate-400"}`}>{message.time}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2 rounded-3xl bg-white p-2 shadow-sm">
        <input value={draft} onChange={(event) => setDraft(event.target.value)} onKeyDown={(event) => event.key === "Enter" && sendMessage()} className="h-12 min-w-0 flex-1 bg-transparent px-3 font-semibold outline-none placeholder:text-slate-400" placeholder="Сообщение кухне..." />
        <button onClick={sendMessage} className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-amber-500 text-white disabled:bg-slate-200" aria-label="Отправить" disabled={!draft.trim()}>
          <Plus size={24} />
        </button>
      </div>
    </div>
  );
}

function Badge({ icon: Icon, label }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-black text-slate-600">
      <Icon size={14} />
      {label}
    </span>
  );
}

function Toast({ message, onClose }) {
  React.useEffect(() => {
    const timer = window.setTimeout(onClose, 2200);
    return () => window.clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="absolute left-4 right-4 top-24 z-30 flex min-h-14 items-center justify-between gap-3 rounded-3xl bg-slate-900 px-4 py-3 text-white shadow-soft">
      <span className="text-sm font-black">{message}</span>
      <button onClick={onClose} className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-white/10" aria-label="Закрыть уведомление">
        <X size={20} />
      </button>
    </div>
  );
}

function RecipeSheet({ recipe, onClose }) {
  return (
    <div className="absolute inset-0 z-40 flex items-end bg-slate-950/35 p-3 backdrop-blur-sm">
      <section className="w-full rounded-[2rem] bg-white p-4 shadow-soft">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-black uppercase tracking-wide text-amber-600">{recipe.category}</p>
            <h2 className="text-2xl font-black text-slate-950">{recipe.title}</h2>
          </div>
          <button onClick={onClose} className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-slate-100 text-slate-700" aria-label="Закрыть ТТК">
            <X size={24} />
          </button>
        </div>
        <div className="mb-4 h-40 overflow-hidden rounded-3xl bg-amber-100">
          <img src={recipe.image} alt="" className="h-full w-full object-cover" />
        </div>
        <div className="grid grid-cols-3 gap-2">
          <Metric label="Время" value={recipe.time} />
          <Metric label="Выход" value={recipe.yield} />
          <Metric label="Cost" value={recipe.cost} />
        </div>
        <div className="mt-4 rounded-3xl bg-slate-50 p-4">
          <p className="text-sm font-black text-slate-500">Контроль шефа</p>
          <p className="mt-1 text-base font-bold leading-snug text-slate-900">Проверить mise en place, температуру подачи и фото эталона перед запуском блюда на линию.</p>
        </div>
      </section>
    </div>
  );
}

function Metric({ label, value }) {
  return (
    <div className="rounded-2xl bg-slate-100 p-3 text-center">
      <p className="text-xs font-black text-slate-500">{label}</p>
      <p className="mt-1 text-sm font-black text-slate-950">{value}</p>
    </div>
  );
}

function QuickPanel({ activeTab, onClose }) {
  const actions = {
    dashboard: ["Создать задачу", "Обновить стоп-лист", "Сделать брифинг"],
    recipes: ["Новая ТТК", "Фото эталона", "Расчет фудкоста"],
    database: ["Новый поставщик", "Новый VIP", "Сверка заказа"],
    schedule: ["Добавить смену", "Позвать замену", "Отметить опоздание"],
    chat: ["Закрепить объявление", "Позвать су-шефа", "Отправить фото"],
  }[activeTab];

  return (
    <div className="absolute inset-0 z-40 flex items-end bg-slate-950/35 p-3 backdrop-blur-sm">
      <section className="w-full rounded-[2rem] bg-white p-4 shadow-soft">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-xl font-black text-slate-950">Быстрое действие</h2>
          <button onClick={onClose} className="grid h-12 w-12 place-items-center rounded-2xl bg-slate-100 text-slate-700" aria-label="Закрыть быстрые действия">
            <X size={24} />
          </button>
        </div>
        <div className="space-y-2">
          {actions.map((action) => (
            <button key={action} onClick={onClose} className="flex min-h-14 w-full items-center justify-between rounded-2xl bg-slate-50 px-4 text-left text-base font-black text-slate-900">
              {action}
              <Plus className="text-amber-500" size={22} />
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}

function Fab({ activeTab, onClick }) {
  const labels = {
    dashboard: "Быстрое действие",
    recipes: "Добавить ТТК",
    database: "Новый контакт",
    schedule: "Новая смена",
    chat: "Новое сообщение",
  };

  return (
    <button onClick={onClick} className="absolute bottom-24 right-5 z-20 grid h-16 w-16 place-items-center rounded-3xl bg-amber-500 text-white shadow-soft" aria-label={labels[activeTab]}>
      <Plus size={32} strokeWidth={3} />
    </button>
  );
}

function BottomNav({ activeTab, setActiveTab }) {
  return (
    <nav className="absolute bottom-3 left-1/2 z-10 grid w-[calc(100%-2rem)] max-w-[25rem] -translate-x-1/2 grid-cols-5 rounded-[1.75rem] border border-slate-200 bg-white/95 p-1.5 shadow-soft backdrop-blur">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const active = activeTab === tab.id;
        return (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex min-h-16 flex-col items-center justify-center gap-1 rounded-3xl text-[11px] font-black ${active ? "bg-slate-900 text-white" : "text-slate-500"}`}>
            <Icon size={22} strokeWidth={active ? 3 : 2.4} />
            <span>{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}

createRoot(document.getElementById("root")).render(<App />);
