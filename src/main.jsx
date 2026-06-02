import React from "react";
import { createRoot } from "react-dom/client";
import {
  AlertTriangle,
  Bell,
  Camera,
  Check,
  ChefHat,
  Clock3,
  FileText,
  Flame,
  History,
  Home,
  ListChecks,
  MessageCircle,
  Package,
  Phone,
  Plus,
  Search,
  Send,
  ShieldCheck,
  ShoppingBasket,
  Sparkles,
  Users,
  Utensils,
  X,
} from "lucide-react";
import "./index.css";
import { isSupabaseConfigured, signInWithGoogle, signOut, supabase } from "./lib/supabase";

const tabs = [
  { id: "shift", label: "Смена", icon: Home },
  { id: "recipes", label: "ТТК", icon: Utensils },
  { id: "inventory", label: "Склад", icon: Package },
  { id: "stations", label: "Цеха", icon: ListChecks },
  { id: "chat", label: "Чат", icon: MessageCircle },
];

const staff = [
  { id: 1, name: "Олег", role: "Су-шеф", station: "Pass", time: "09:00-18:00", status: "На смене", phone: "+48123123123", avatar: "О" },
  { id: 2, name: "Ирина", role: "Повар", station: "Холодный цех", time: "11:00-22:00", status: "На смене", phone: "+48123123124", avatar: "И" },
  { id: 3, name: "Матеуш", role: "Повар", station: "Горячий цех", time: "12:00-23:00", status: "Ожидается", phone: "+48123123125", avatar: "М" },
  { id: 4, name: "Саша", role: "Повар", station: "Заготовочный", time: "08:00-16:00", status: "На смене", phone: "+48123123126", avatar: "С" },
  { id: 5, name: "Ника", role: "Повар", station: "Суши", time: "14:00-23:00", status: "Ожидается", phone: "+48123123127", avatar: "Н" },
];

const stationGuides = [
  {
    id: "cold",
    name: "Холодный цех",
    owner: "Ирина",
    status: "В работе",
    description: "Салаты, тартары, холодные закуски, заготовки для подачи без горячей линии.",
    duties: ["Проверить зелень и соусы", "Поддерживать чистую доску", "Обновлять фото эталона подачи"],
    mistakes: ["Не смешивать аллергенные соусы", "Не держать рыбу вне холода дольше 10 минут"],
  },
  {
    id: "hot",
    name: "Горячий цех",
    owner: "Матеуш",
    status: "Ожидается",
    description: "Основные блюда, термообработка, гарниры, контроль температуры подачи.",
    duties: ["Разогреть линию к 17:30", "Проверить термощуп", "Подготовить гарниры на пик"],
    mistakes: ["Не отдавать блюдо без проверки pass", "Не смешивать щипцы сырого и готового продукта"],
  },
  {
    id: "prep",
    name: "Заготовочный",
    owner: "Саша",
    status: "На смене",
    description: "Mise en place, нарезки, маринады, полуфабрикаты и маркировка сроков.",
    duties: ["Промаркировать контейнеры", "Сверить план заготовок", "Отметить остатки ниже нормы"],
    mistakes: ["Не оставлять контейнеры без даты", "Не принимать продукт без температуры"],
  },
  {
    id: "pass",
    name: "Pass / выдача",
    owner: "Олег",
    status: "На смене",
    description: "Контроль финальной подачи, стоп-лист, коммуникация зала и кухни.",
    duties: ["Подтвердить стоп-лист", "Сверить VIP-заметки", "Ускорять конфликтные заказы"],
    mistakes: ["Не менять ТТК устно", "Не отдавать блюдо без финального контроля"],
  },
];

const initialTasks = [
  { id: 1, title: "Принять рыбу и температуру", station: "Склад", due: "10:45", done: false, priority: "critical" },
  { id: 2, title: "Бер блан 2 литра", station: "Горячий цех", due: "12:00", done: false, priority: "normal" },
  { id: 3, title: "Обновить стоп-лист по тунцу", station: "Pass", due: "сейчас", done: false, priority: "critical" },
  { id: 4, title: "Фото эталона тартара", station: "Холодный цех", due: "14:30", done: true, priority: "normal" },
];

const stopList = [
  { id: 1, item: "Тунец Bluefin", reason: "Поставка на проверке", station: "Холодный цех" },
  { id: 2, item: "Пюре батат", reason: "Осталось на 4 порции", station: "Горячий цех" },
];

const inventoryItems = [
  { id: 1, name: "Тунец", station: "Холодный цех", stock: "1 лоток", par: "4 лотка", status: "critical", supplier: "Nord Fish" },
  { id: 2, name: "Сливочное масло", station: "Горячий цех", stock: "2 пачки", par: "8 пачек", status: "low", supplier: "Prime Market" },
  { id: 3, name: "Соевый соус", station: "Суши", stock: "1 банка", par: "6 банок", status: "low", supplier: "Asian Pro" },
  { id: 4, name: "Микс зелени", station: "Холодный цех", stock: "норма", par: "3 бокса", status: "ok", supplier: "Bio Herbs" },
];

const recipes = [
  {
    id: 1,
    title: "Тартар из тунца",
    category: "Закуски",
    time: "12 мин",
    yield: "180 г",
    cost: "4.80 EUR",
    allergens: "рыба, кунжут",
    image: "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=240&q=80",
    steps: ["Охладить миску и нож", "Нарезать кубик 6 мм", "Смешать с соусом перед отдачей", "Проверить фото эталона"],
  },
  {
    id: 2,
    title: "Крем-суп из тыквы",
    category: "Супы",
    time: "28 мин",
    yield: "320 г",
    cost: "2.10 EUR",
    allergens: "сливки",
    image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=240&q=80",
    steps: ["Прогреть основу", "Пробить до гладкости", "Проверить соль", "Подать с семечками"],
  },
  {
    id: 3,
    title: "Утиная грудка",
    category: "Горячее",
    time: "34 мин",
    yield: "260 г",
    cost: "7.40 EUR",
    allergens: "нет",
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=240&q=80",
    steps: ["Надсечь кожу", "Старт на холодной сковороде", "Довести до 56 C", "Отдых 6 минут"],
  },
];

const recipeFilters = ["Все", "Закуски", "Супы", "Горячее", "Соусы"];

const initialActivity = [
  { id: 1, actor: "Олег", action: "Поставил тунца в стоп-лист", meta: "Pass", time: "10:08", tone: "red" },
  { id: 2, actor: "Ирина", action: "Отметила: соевый соус, осталась 1 банка", meta: "Суши", time: "10:14", tone: "amber" },
  { id: 3, actor: "Саша", action: "Закрыл задачу по фото эталона", meta: "Холодный цех", time: "10:20", tone: "green" },
];

const messages = [
  { id: 1, from: "Олег", text: "Рыба приехала. Проверяю температуру.", mine: false, time: "10:18" },
  { id: 2, from: "Chef", text: "Принять только после фото накладной.", mine: true, time: "10:19" },
  { id: 3, from: "Ирина", text: "Соус бер блан готов, держу на водяной.", mine: false, time: "10:24" },
];

function App() {
  const [activeTab, setActiveTab] = React.useState("shift");
  const [tasks, setTasks] = React.useState(initialTasks);
  const [activity, setActivity] = React.useState(initialActivity);
  const [inventoryReports, setInventoryReports] = React.useState([]);
  const [query, setQuery] = React.useState("");
  const [recipeFilter, setRecipeFilter] = React.useState("Все");
  const [selectedRecipe, setSelectedRecipe] = React.useState(null);
  const [selectedStation, setSelectedStation] = React.useState(null);
  const [staffOpen, setStaffOpen] = React.useState(false);
  const [quickPanelOpen, setQuickPanelOpen] = React.useState(false);
  const [toast, setToast] = React.useState("");
  const [session, setSession] = React.useState(null);
  const [authLoading, setAuthLoading] = React.useState(false);

  React.useEffect(() => {
    if (!supabase) return undefined;

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session ?? null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function handleGoogleSignIn() {
    if (!isSupabaseConfigured) {
      setToast("Supabase env пока не подключен");
      return;
    }

    setAuthLoading(true);
    const { error } = await signInWithGoogle();
    if (error) {
      setToast(`Google login error: ${error.message}`);
      setAuthLoading(false);
    }
  }

  async function handleSignOut() {
    setAuthLoading(true);
    await signOut();
    setAuthLoading(false);
    setToast("Вы вышли из аккаунта");
  }

  function addActivity(action, meta, tone = "amber", actor = "Chef") {
    setActivity((current) => [{ id: Date.now(), actor, action, meta, time: "сейчас", tone }, ...current]);
  }

  function reportInventory(item, level) {
    const action = `${item.name}: ${level}`;
    setInventoryReports((current) => [{ id: Date.now(), item: item.name, station: item.station, level, supplier: item.supplier }, ...current]);
    addActivity(action, item.station, level === "закончилось" ? "red" : "amber", "Повар");
    setToast(`Сигнал отправлен су-шефу: ${item.name}`);
  }

  const normalizedQuery = query.trim().toLowerCase();
  const filteredRecipes = (recipeFilter === "Все" ? recipes : recipes.filter((recipe) => recipe.category === recipeFilter)).filter((recipe) =>
    `${recipe.title} ${recipe.category} ${recipe.allergens}`.toLowerCase().includes(normalizedQuery)
  );

  const screenTitle = {
    shift: "Смена сейчас",
    recipes: "ТТК",
    inventory: "Склад",
    stations: "Цеха",
    chat: "# Общая кухня",
  }[activeTab];

  return (
    <main className="min-h-screen px-3 py-3 text-slate-900 sm:px-6">
      <section className="relative mx-auto flex min-h-[calc(100vh-24px)] w-full max-w-md flex-col overflow-hidden rounded-[2rem] border border-white/70 bg-slate-50 shadow-soft lg:max-w-5xl">
        <StatusBar />
        <AppHeader title={screenTitle} activeTab={activeTab} />
        <div className="flex-1 overflow-y-auto px-4 pb-28 pt-2 lg:px-6">
          <AuthStatus session={session} loading={authLoading} onSignIn={handleGoogleSignIn} onSignOut={handleSignOut} />
          {activeTab === "shift" && (
            <ShiftScreen
              tasks={tasks}
              setTasks={setTasks}
              activity={activity}
              addActivity={addActivity}
              setStaffOpen={setStaffOpen}
              setToast={setToast}
            />
          )}
          {activeTab === "recipes" && (
            <Recipes
              filter={recipeFilter}
              setFilter={setRecipeFilter}
              recipes={filteredRecipes}
              query={query}
              setQuery={setQuery}
              setSelectedRecipe={setSelectedRecipe}
            />
          )}
          {activeTab === "inventory" && <InventoryScreen reports={inventoryReports} onReport={reportInventory} />}
          {activeTab === "stations" && <StationsScreen setSelectedStation={setSelectedStation} />}
          {activeTab === "chat" && <Chat />}
        </div>
        {toast && <Toast message={toast} onClose={() => setToast("")} />}
        {staffOpen && <StaffSheet onClose={() => setStaffOpen(false)} setToast={setToast} />}
        {selectedRecipe && <RecipeSheet recipe={selectedRecipe} onClose={() => setSelectedRecipe(null)} />}
        {selectedStation && <StationSheet station={selectedStation} onClose={() => setSelectedStation(null)} />}
        {quickPanelOpen && <QuickPanel activeTab={activeTab} onClose={() => setQuickPanelOpen(false)} />}
        <Fab activeTab={activeTab} onClick={() => setQuickPanelOpen(true)} />
        <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
      </section>
    </main>
  );
}

function AuthStatus({ session, loading, onSignIn, onSignOut }) {
  const userLabel = session?.user?.user_metadata?.full_name || session?.user?.email;

  return (
    <section className="mb-4 flex min-h-16 items-center justify-between gap-3 rounded-3xl bg-white p-3 shadow-sm">
      <div className="min-w-0">
        <p className="text-xs font-black uppercase tracking-wide text-slate-500">{isSupabaseConfigured ? "Общая база" : "Demo mode"}</p>
        <p className="truncate text-sm font-black text-slate-950">{session ? userLabel : isSupabaseConfigured ? "Войдите через Google" : "Supabase env не задан"}</p>
      </div>
      <button
        onClick={session ? onSignOut : onSignIn}
        disabled={loading}
        className="min-h-12 shrink-0 rounded-2xl bg-slate-900 px-4 text-sm font-black text-white disabled:bg-slate-300"
      >
        {loading ? "..." : session ? "Выйти" : "Google"}
      </button>
    </section>
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
    <header className="px-4 pb-3 pt-2 lg:px-6">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-wide text-amber-600">{activeTab === "shift" ? "Chef OS" : "Kitchen Command"}</p>
          <h1 className="truncate text-3xl font-black leading-tight tracking-normal text-slate-950">{title}</h1>
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

function ShiftScreen({ tasks, setTasks, activity, addActivity, setStaffOpen, setToast }) {
  const openTasks = tasks.filter((task) => !task.done).length;

  function toggleTask(task) {
    setTasks((current) => current.map((item) => (item.id === task.id ? { ...item, done: !item.done } : item)));
    if (!task.done) {
      addActivity(`Закрыл задачу: ${task.title}`, task.station, "green");
    }
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
      <div className="space-y-5">
        <section className="rounded-3xl bg-slate-900 p-4 text-white shadow-sm">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-bold text-slate-300">Пик смены</p>
              <p className="text-2xl font-black">18:30-21:00</p>
            </div>
            <span className="grid h-14 w-14 place-items-center rounded-2xl bg-amber-500 text-white">
              <Flame size={28} />
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <ShiftMetric label="Люди" value="5" onClick={() => setStaffOpen(true)} />
            <ShiftMetric label="Задачи" value={String(openTasks)} />
            <ShiftMetric label="Стоп" value={String(stopList.length)} danger />
          </div>
        </section>

        <section>
          <SectionHead title="Критично сейчас" badge={`${stopList.length} стоп`} />
          <div className="space-y-3">
            {stopList.map((item) => (
              <article key={item.id} className="flex min-h-20 items-center gap-3 rounded-3xl bg-red-50 p-3 text-left shadow-sm">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-red-500 text-white">
                  <AlertTriangle size={24} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-base font-black text-red-950">{item.item}</p>
                  <p className="text-sm font-bold text-red-700">{item.reason} · {item.station}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section>
          <SectionHead title="Mise en place" badge={`${openTasks} активны`} />
          <div className="space-y-3">
            {tasks.map((task) => (
              <button key={task.id} onClick={() => toggleTask(task)} className="flex min-h-16 w-full items-center gap-3 rounded-3xl bg-white p-3 text-left shadow-sm">
                <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl ${task.done ? "bg-green-500 text-white" : task.priority === "critical" ? "bg-red-500 text-white" : "bg-amber-100 text-amber-700"}`}>
                  {task.done ? <Check size={24} strokeWidth={3} /> : <Clock3 size={24} />}
                </span>
                <span className="min-w-0 flex-1">
                  <span className={`block text-base font-black ${task.done ? "text-slate-400 line-through" : "text-slate-950"}`}>{task.title}</span>
                  <span className="text-sm font-semibold text-slate-500">{task.station} · до {task.due}</span>
                </span>
              </button>
            ))}
          </div>
        </section>
      </div>

      <div className="space-y-5">
        <section>
          <SectionHead title="Быстрые сигналы" />
          <div className="grid grid-cols-2 gap-3">
            {["Закончился продукт", "Осталась 1 банка", "Нужен су-шеф", "Фото проблемы"].map((label) => (
              <button key={label} onClick={() => setToast(`Сигнал создан: ${label}`)} className="flex min-h-20 flex-col justify-between rounded-3xl bg-white p-4 text-left shadow-sm">
                <Sparkles className="text-amber-500" size={24} />
                <span className="text-sm font-black text-slate-950">{label}</span>
              </button>
            ))}
          </div>
        </section>
        <ActivityLog activity={activity} />
      </div>
    </div>
  );
}

function ShiftMetric({ label, value, danger, onClick }) {
  const Tag = onClick ? "button" : "div";
  return (
    <Tag onClick={onClick} className={`min-h-20 rounded-2xl p-3 text-left ${danger ? "bg-red-500" : "bg-white/10"} ${onClick ? "cursor-pointer" : ""}`}>
      <p className="text-xs font-bold text-white/75">{label}</p>
      <p className="text-3xl font-black text-white">{value}</p>
    </Tag>
  );
}

function InventoryScreen({ reports, onReport }) {
  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_0.85fr]">
      <section className="space-y-3">
        <SectionHead title="Остатки по цехам" badge="повар сигналит" />
        {inventoryItems.map((item) => (
          <article key={item.id} className="rounded-3xl bg-white p-4 shadow-sm">
            <div className="mb-3 flex items-start justify-between gap-3">
              <div>
                <p className="text-lg font-black text-slate-950">{item.name}</p>
                <p className="text-sm font-semibold text-slate-500">{item.station} · поставщик {item.supplier}</p>
              </div>
              <StatusPill status={item.status} />
            </div>
            <div className="mb-3 grid grid-cols-2 gap-2">
              <Metric label="Сейчас" value={item.stock} />
              <Metric label="Норма" value={item.par} />
            </div>
            <div className="grid grid-cols-3 gap-2">
              <SignalButton label="мало" onClick={() => onReport(item, "мало")} />
              <SignalButton label="1 банка" onClick={() => onReport(item, "осталась 1 банка")} />
              <SignalButton label="нет" danger onClick={() => onReport(item, "закончилось")} />
            </div>
          </article>
        ))}
      </section>

      <section>
        <SectionHead title="Заявки поваров" badge={`${reports.length} новых`} />
        <div className="space-y-3">
          {reports.length === 0 && (
            <div className="rounded-3xl bg-white p-5 text-center shadow-sm">
              <ShoppingBasket className="mx-auto mb-3 text-slate-300" size={34} />
              <p className="text-lg font-black text-slate-950">Пока нет сигналов</p>
              <p className="mt-1 text-sm font-semibold text-slate-500">Когда повар отметит остаток, су-шеф увидит это здесь.</p>
            </div>
          )}
          {reports.map((report) => (
            <article key={report.id} className="rounded-3xl bg-amber-50 p-4 shadow-sm">
              <p className="text-base font-black text-amber-950">{report.item}: {report.level}</p>
              <p className="text-sm font-bold text-amber-700">{report.station} · {report.supplier}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

function StationsScreen({ setSelectedStation }) {
  return (
    <div className="grid gap-3 lg:grid-cols-2">
      {stationGuides.map((station) => (
        <button key={station.id} onClick={() => setSelectedStation(station)} className="min-h-36 rounded-3xl bg-white p-4 text-left shadow-sm">
          <div className="mb-3 flex items-center justify-between gap-3">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-amber-100 text-amber-700">
              <ChefHat size={25} />
            </span>
            <span className={`rounded-full px-3 py-1 text-xs font-black text-white ${station.status === "Ожидается" ? "bg-amber-500" : "bg-green-500"}`}>{station.status}</span>
          </div>
          <p className="text-xl font-black text-slate-950">{station.name}</p>
          <p className="mt-1 text-sm font-bold text-slate-500">Ответственный: {station.owner}</p>
          <p className="mt-2 line-clamp-2 text-sm font-semibold text-slate-600">{station.description}</p>
        </button>
      ))}
    </div>
  );
}

function Recipes({ filter, setFilter, recipes, query, setQuery, setSelectedRecipe }) {
  return (
    <div className="space-y-4">
      <SearchBox value={query} onChange={setQuery} />
      <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4">
        {recipeFilters.map((item) => (
          <button key={item} onClick={() => setFilter(item)} className={`min-h-12 shrink-0 rounded-2xl px-5 text-sm font-black ${filter === item ? "bg-slate-900 text-white" : "bg-white text-slate-600 shadow-sm"}`}>
            {item}
          </button>
        ))}
      </div>
      <div className="grid gap-3 lg:grid-cols-2">
        {recipes.map((recipe) => (
          <button key={recipe.id} onClick={() => setSelectedRecipe(recipe)} className="flex min-h-28 w-full items-center gap-3 rounded-3xl bg-white p-3 text-left shadow-sm">
            <div className="h-20 w-20 shrink-0 overflow-hidden rounded-3xl bg-amber-100">
              <img src={recipe.image} alt="" className="h-full w-full object-cover" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-lg font-black text-slate-950">{recipe.title}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                <Badge icon={Clock3} label={recipe.time} />
                <Badge icon={ChefHat} label={recipe.yield} />
              </div>
              <p className="mt-2 text-sm font-bold text-slate-500">Аллергены: {recipe.allergens}</p>
            </div>
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
          <Send size={22} />
        </button>
      </div>
    </div>
  );
}

function StaffSheet({ onClose, setToast }) {
  return (
    <Sheet onClose={onClose} title="Люди на смене">
      <div className="space-y-3">
        {staff.map((person) => (
          <article key={person.id} className="flex min-h-20 items-center gap-3 rounded-3xl bg-slate-50 p-3">
            <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-slate-900 text-lg font-black text-white">{person.avatar}</div>
            <div className="min-w-0 flex-1">
              <p className="text-lg font-black text-slate-950">{person.name}</p>
              <p className="text-sm font-semibold text-slate-500">{person.role} · {person.station} · {person.time}</p>
            </div>
            <a href={`tel:${person.phone}`} onClick={() => setToast(`Звонок: ${person.name}`)} className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-green-500 text-white" aria-label={`Позвонить ${person.name}`}>
              <Phone size={22} />
            </a>
          </article>
        ))}
      </div>
    </Sheet>
  );
}

function RecipeSheet({ recipe, onClose }) {
  return (
    <Sheet onClose={onClose} title={recipe.title} eyebrow={recipe.category}>
      <div className="mb-4 h-40 overflow-hidden rounded-3xl bg-amber-100">
        <img src={recipe.image} alt="" className="h-full w-full object-cover" />
      </div>
      <div className="grid grid-cols-3 gap-2">
        <Metric label="Время" value={recipe.time} />
        <Metric label="Выход" value={recipe.yield} />
        <Metric label="Cost" value={recipe.cost} />
      </div>
      <div className="mt-4 rounded-3xl bg-slate-50 p-4">
        <p className="text-sm font-black text-slate-500">Шаги</p>
        <ol className="mt-2 space-y-2">
          {recipe.steps.map((step, index) => (
            <li key={step} className="flex gap-2 text-sm font-bold text-slate-800">
              <span className="text-amber-600">{index + 1}.</span>
              {step}
            </li>
          ))}
        </ol>
      </div>
    </Sheet>
  );
}

function StationSheet({ station, onClose }) {
  return (
    <Sheet onClose={onClose} title={station.name} eyebrow={`Ответственный: ${station.owner}`}>
      <p className="rounded-3xl bg-slate-50 p-4 text-base font-bold leading-snug text-slate-800">{station.description}</p>
      <div className="mt-4 grid gap-3">
        <ProcessBlock title="Что делает цех" items={station.duties} />
        <ProcessBlock title="Нельзя" items={station.mistakes} danger />
      </div>
    </Sheet>
  );
}

function QuickPanel({ activeTab, onClose }) {
  const actions = {
    shift: ["Создать задачу", "Обновить стоп-лист", "Открыть брифинг"],
    recipes: ["Новая ТТК", "Фото эталона", "Расчет фудкоста"],
    inventory: ["Сигнал: продукт закончился", "Создать заявку поставщику", "Добавить фото"],
    stations: ["Новый процесс", "Назначить ответственного", "Проверить чек-лист"],
    chat: ["Закрепить объявление", "Позвать су-шефа", "Отправить фото"],
  }[activeTab];

  return (
    <Sheet onClose={onClose} title="Быстрое действие">
      <div className="space-y-2">
        {actions.map((action) => (
          <button key={action} onClick={onClose} className="flex min-h-14 w-full items-center justify-between rounded-2xl bg-slate-50 px-4 text-left text-base font-black text-slate-900">
            {action}
            {action.includes("фото") || action.includes("Фото") ? <Camera className="text-amber-500" size={22} /> : <Plus className="text-amber-500" size={22} />}
          </button>
        ))}
      </div>
    </Sheet>
  );
}

function ActivityLog({ activity }) {
  return (
    <section>
      <SectionHead title="Журнал действий" />
      <div className="space-y-3">
        {activity.slice(0, 5).map((event) => (
          <article key={event.id} className="flex gap-3 rounded-3xl bg-white p-3 shadow-sm">
            <span className={`mt-1 grid h-10 w-10 shrink-0 place-items-center rounded-2xl text-white ${event.tone === "red" ? "bg-red-500" : event.tone === "green" ? "bg-green-500" : "bg-amber-500"}`}>
              <History size={20} />
            </span>
            <div>
              <p className="text-sm font-black text-slate-950">{event.action}</p>
              <p className="text-xs font-bold text-slate-500">{event.actor} · {event.meta} · {event.time}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function SearchBox({ value, onChange }) {
  return (
    <label className="flex h-14 items-center gap-3 rounded-3xl bg-white px-4 shadow-sm">
      <Search className="text-slate-400" size={22} />
      <input value={value} onChange={(event) => onChange(event.target.value)} className="h-full min-w-0 flex-1 bg-transparent text-base font-semibold outline-none placeholder:text-slate-400" placeholder="Блюдо, аллерген, цех..." />
    </label>
  );
}

function SectionHead({ title, badge }) {
  return (
    <div className="mb-3 flex items-center justify-between gap-3">
      <h2 className="text-xl font-black text-slate-950">{title}</h2>
      {badge && <span className="rounded-full bg-amber-100 px-3 py-1 text-sm font-extrabold text-amber-700">{badge}</span>}
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

function StatusPill({ status }) {
  const map = {
    critical: "bg-red-500 text-white",
    low: "bg-amber-500 text-white",
    ok: "bg-green-500 text-white",
  };
  const label = {
    critical: "критично",
    low: "мало",
    ok: "норма",
  }[status];

  return <span className={`rounded-full px-3 py-1 text-xs font-black ${map[status]}`}>{label}</span>;
}

function SignalButton({ label, danger, onClick }) {
  return (
    <button onClick={onClick} className={`min-h-12 rounded-2xl px-2 text-sm font-black ${danger ? "bg-red-500 text-white" : "bg-slate-100 text-slate-800"}`}>
      {label}
    </button>
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

function ProcessBlock({ title, items, danger }) {
  return (
    <div className={`rounded-3xl p-4 ${danger ? "bg-red-50" : "bg-amber-50"}`}>
      <p className={`text-sm font-black ${danger ? "text-red-700" : "text-amber-700"}`}>{title}</p>
      <ul className="mt-2 space-y-2">
        {items.map((item) => (
          <li key={item} className="flex gap-2 text-sm font-bold text-slate-800">
            <ShieldCheck className={danger ? "text-red-500" : "text-amber-500"} size={18} />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
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

function Sheet({ title, eyebrow, children, onClose }) {
  return (
    <div className="absolute inset-0 z-40 flex items-end bg-slate-950/35 p-3 backdrop-blur-sm">
      <section className="max-h-[86vh] w-full overflow-y-auto rounded-[2rem] bg-white p-4 shadow-soft">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div className="min-w-0">
            {eyebrow && <p className="text-sm font-black uppercase tracking-wide text-amber-600">{eyebrow}</p>}
            <h2 className="text-2xl font-black text-slate-950">{title}</h2>
          </div>
          <button onClick={onClose} className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-slate-100 text-slate-700" aria-label="Закрыть">
            <X size={24} />
          </button>
        </div>
        {children}
      </section>
    </div>
  );
}

function Fab({ activeTab, onClick }) {
  const labels = {
    shift: "Быстрое действие смены",
    recipes: "Добавить ТТК",
    inventory: "Сигнал склада",
    stations: "Новый процесс",
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
