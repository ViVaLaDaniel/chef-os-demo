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
  { id: 1, name: "Олег", role: "Су-шеф", station: "Pass", stationId: "pass", time: "09:00-18:00", status: "На смене", phone: "+48123123123", avatar: "О", instruction: "Держать pass, подтверждать стоп-лист, снимать блокеры цехов до пика." },
  { id: 2, name: "Ирина", role: "Повар", station: "Холодный цех", stationId: "cold", time: "11:00-22:00", status: "На смене", phone: "+48123123124", avatar: "И", instruction: "Твой фокус: тартар, салаты, холодная подача. Проверяй рыбу, соусы, аллергены и чистоту доски перед каждым блоком." },
  { id: 3, name: "Матеуш", role: "Повар", station: "Горячий цех", stationId: "hot", time: "12:00-23:00", status: "Ожидается", phone: "+48123123125", avatar: "М", instruction: "Подготовить линию к 17:30, держать термощуп рядом, согласовывать отдачу с pass." },
  { id: 4, name: "Саша", role: "Повар", station: "Заготовочный", stationId: "prep", time: "08:00-16:00", status: "На смене", phone: "+48123123126", avatar: "С", instruction: "Маркировать контейнеры сразу после заготовки, сигналить остатки ниже нормы, не оставлять продукт без даты." },
  { id: 5, name: "Ника", role: "Повар", station: "Суши", stationId: "sushi", time: "14:00-23:00", status: "Ожидается", phone: "+48123123127", avatar: "Н", instruction: "Проверить рис, нори, соевый соус и чистый нож. Любой вопрос по рыбе сразу в pass." },
];

const currentCook = staff[1];

const currentShift = {
  title: "Вечерняя смена",
  date: "2026-06-03",
  startsAt: "11:00",
  endsAt: "22:00",
  peakWindow: "18:30-21:00",
};

const universalInstructions = [
  "Мой руки перед стартом, после сырого продукта, телефона, мусора и перчаток.",
  "Аллергены держи отдельно: доска, нож, соус, контейнер и ложка не смешиваются.",
  "Нет устных изменений ТТК: если не хватает продукта, ставь сигнал и жди подтверждение су-шефа.",
  "Любой риск по температуре, запаху, сроку или упаковке сразу в стоп-сигнал.",
];

const initialGeneralChecklist = [
  { id: "brief", title: "Короткий бриф смены проведен", station: "Команда", done: true },
  { id: "stop", title: "Стоп-лист подтвержден у pass", station: "Pass", done: false },
  { id: "allergens", title: "VIP и аллергены сверены", station: "Pass", done: false },
  { id: "stock", title: "Критичные остатки проверены", station: "Склад", done: false },
  { id: "hygiene", title: "Гигиена и маркировка проверены", station: "Все цеха", done: false },
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
    setup: ["Проверить температуру холодильника", "Разложить ножи, доски, перчатки", "Сверить стоп-лист по рыбе"],
    service: ["Готовить тартар только перед отдачей", "Проверять фото эталона", "Сигналить pass при нехватке продукта"],
    close: ["Промаркировать остатки", "Списать спорный продукт", "Передать заметки су-шефу"],
  },
  {
    id: "hot",
    name: "Горячий цех",
    owner: "Матеуш",
    status: "Ожидается",
    description: "Основные блюда, термообработка, гарниры, контроль температуры подачи.",
    duties: ["Разогреть линию к 17:30", "Проверить термощуп", "Подготовить гарниры на пик"],
    mistakes: ["Не отдавать блюдо без проверки pass", "Не смешивать щипцы сырого и готового продукта"],
    setup: ["Включить линию и проверить сковороды", "Проверить термощуп", "Разложить гарниры по порциям"],
    service: ["Работать партиями, не забивать плиту", "Температуру спорного блюда проверять до pass", "Срочные задержки сообщать сразу"],
    close: ["Охладить заготовки по правилу кухни", "Закрыть газ/индукцию", "Отметить остатки масла и гарниров"],
  },
  {
    id: "prep",
    name: "Заготовочный",
    owner: "Саша",
    status: "На смене",
    description: "Mise en place, нарезки, маринады, полуфабрикаты и маркировка сроков.",
    duties: ["Промаркировать контейнеры", "Сверить план заготовок", "Отметить остатки ниже нормы"],
    mistakes: ["Не оставлять контейнеры без даты", "Не принимать продукт без температуры"],
    setup: ["Сверить план заготовок", "Подготовить чистые контейнеры и этикетки", "Проверить сырье на приемке"],
    service: ["Пополнять линии без хаоса", "Держать FIFO", "Сигналить низкие остатки до нуля"],
    close: ["Пересчитать критичные остатки", "Закрыть маркировку", "Передать список на закупку"],
  },
  {
    id: "pass",
    name: "Pass / выдача",
    owner: "Олег",
    status: "На смене",
    description: "Контроль финальной подачи, стоп-лист, коммуникация зала и кухни.",
    duties: ["Подтвердить стоп-лист", "Сверить VIP-заметки", "Ускорять конфликтные заказы"],
    mistakes: ["Не менять ТТК устно", "Не отдавать блюдо без финального контроля"],
    setup: ["Сверить VIP и аллергены", "Обновить стоп-лист", "Провести короткий бриф"],
    service: ["Принимать сигналы цехов", "Решать очередность отдачи", "Не выпускать спорную тарелку"],
    close: ["Закрыть журнал проблем", "Собрать handover", "Подтвердить закупочные заявки"],
  },
  {
    id: "sushi",
    name: "Суши",
    owner: "Ника",
    status: "Ожидается",
    description: "Рис, нори, рыба, роллы, сашими, соусы и контроль чистого холодного процесса.",
    duties: ["Проверить рис и нори", "Держать отдельный нож", "Сигналить остатки соевого соуса"],
    mistakes: ["Не использовать спорную рыбу", "Не смешивать доски после сырого продукта"],
    setup: ["Проверить рис и уксус", "Подготовить чистый нож", "Сверить рыбу со стоп-листом"],
    service: ["Держать порции ровно", "Сразу убирать сырой продукт", "Любой запах/цвет сообщать pass"],
    close: ["Списать остатки по правилам", "Промыть и высушить коврики", "Отметить соусы и нори"],
  },
];

const phaseLabels = {
  setup: "До сервиса",
  service: "Во время сервиса",
  close: "Закрытие",
};

const initialStationChecklists = Object.fromEntries(
  stationGuides.map((station) => [
    station.id,
    {
      setup: makeChecklist(station.setup, `${station.id}-setup`),
      service: makeChecklist(station.service, `${station.id}-service`),
      close: makeChecklist(station.close, `${station.id}-close`),
    },
  ])
);

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

const quickActionCatalog = {
  shift: [
    { id: "need-sous", group: "Проблема", label: "Нужен су-шеф", description: "Позвать ответственного к станции", tone: "amber", event: "Позвал су-шефа", meta: currentCook.station },
    { id: "late-ticket", group: "Проблема", label: "Задержка отдачи", description: "Сообщить pass, что блюдо задерживается", tone: "red", event: "Сообщил задержку отдачи", meta: currentCook.station },
    { id: "station-task", group: "Смена", label: "Задача на мой цех", description: "Добавить срочную задачу в mise en place", tone: "amber", event: "Создал задачу на цех", meta: currentCook.station },
    { id: "open-checklist", group: "Чек-лист", label: "Открыть мой чек-лист", description: "Перейти к процессам моей станции", tone: "green", event: "Открыл чек-лист станции", meta: currentCook.station },
    { id: "stop-item", group: "Стоп", label: "Поставить блюдо в стоп", description: "Сигнал для pass/су-шефа на подтверждение", tone: "red", event: "Создал стоп-сигнал", meta: "Pass" },
  ],
  recipes: [
    { id: "recipe-issue", group: "ТТК", label: "Ошибка в рецепте", description: "Сообщить шефу о неточности", tone: "amber", event: "Сообщил ошибку в ТТК", meta: "ТТК" },
    { id: "photo-standard", group: "ТТК", label: "Фото эталона", description: "Добавить или запросить фото подачи", tone: "green", event: "Запросил фото эталона", meta: "ТТК" },
    { id: "missing-ingredient", group: "Проблема", label: "Нет ингредиента", description: "Связать ТТК со складовым сигналом", tone: "red", event: "Сообщил: нет ингредиента для ТТК", meta: currentCook.station },
  ],
  inventory: [
    { id: "empty-stock", group: "Склад", label: "Продукт закончился", description: "Критичный сигнал су-шефу", tone: "red", event: "Складовой сигнал: продукт закончился", meta: currentCook.station },
    { id: "one-left", group: "Склад", label: "Осталась 1 единица", description: "Предупредить до полного нуля", tone: "amber", event: "Складовой сигнал: осталась 1 единица", meta: currentCook.station },
    { id: "confirm-order", group: "Закупка", label: "Подтвердить заявку", description: "Су-шеф подтверждает сигнал", tone: "green", event: "Подтвердил складовую заявку", meta: "Склад" },
    { id: "photo-shelf", group: "Фото", label: "Фото полки", description: "Прикрепить визуальное подтверждение", tone: "amber", event: "Добавил фото складской проблемы", meta: "Склад" },
  ],
  stations: [
    { id: "open-process", group: "Процесс", label: "Открыть процесс", description: "Посмотреть инструкции станции", tone: "green", event: "Открыл процесс станции", meta: currentCook.station },
    { id: "process-blocker", group: "Проблема", label: "Блокер процесса", description: "Сообщить, что станция не может продолжить", tone: "red", event: "Сообщил блокер процесса", meta: currentCook.station },
    { id: "handover-note", group: "Закрытие", label: "Заметка на передачу", description: "Оставить handover для следующей смены", tone: "amber", event: "Добавил заметку на передачу", meta: currentCook.station },
  ],
  chat: [
    { id: "call-sous", group: "Команда", label: "Позвать су-шефа", description: "Короткий командный сигнал", tone: "amber", event: "Позвал су-шефа в чат", meta: "Чат" },
    { id: "pin-announcement", group: "Команда", label: "Закрепить объявление", description: "Важное сообщение для всей кухни", tone: "green", event: "Закрепил объявление", meta: "Чат" },
    { id: "urgent-alert", group: "Проблема", label: "Срочное сообщение", description: "Выделить сообщение как критичное", tone: "red", event: "Отправил срочное сообщение", meta: "Чат" },
  ],
};

const messages = [
  { id: 1, from: "Олег", text: "Рыба приехала. Проверяю температуру.", mine: false, time: "10:18" },
  { id: 2, from: "Chef", text: "Принять только после фото накладной.", mine: true, time: "10:19" },
  { id: 3, from: "Ирина", text: "Соус бер блан готов, держу на водяной.", mine: false, time: "10:24" },
];

function App() {
  const [activeTab, setActiveTab] = React.useState("shift");
  const [tasks, setTasks] = React.useState(initialTasks);
  const [generalChecklist, setGeneralChecklist] = React.useState(initialGeneralChecklist);
  const [stationChecklists, setStationChecklists] = React.useState(initialStationChecklists);
  const [activity, setActivity] = React.useState(initialActivity);
  const [inventoryReports, setInventoryReports] = React.useState([]);
  const [query, setQuery] = React.useState("");
  const [recipeFilter, setRecipeFilter] = React.useState("Все");
  const [selectedRecipe, setSelectedRecipe] = React.useState(null);
  const [selectedStation, setSelectedStation] = React.useState(null);
  const [selectedStop, setSelectedStop] = React.useState(null);
  const [staffOpen, setStaffOpen] = React.useState(false);
  const [profileOpen, setProfileOpen] = React.useState(false);
  const [notificationsOpen, setNotificationsOpen] = React.useState(false);
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
    setInventoryReports((current) => [{ id: Date.now(), item: item.name, station: item.station, level, supplier: item.supplier, status: "Новая" }, ...current]);
    addActivity(action, item.station, level === "закончилось" ? "red" : "amber", "Повар");
    setToast(`Сигнал отправлен су-шефу: ${item.name}`);
  }

  function confirmInventoryReport(report) {
    setInventoryReports((current) => current.map((item) => (item.id === report.id ? { ...item, status: "Подтверждена" } : item)));
    addActivity(`Подтвердил заявку: ${report.item}`, report.station, "green", "Су-шеф");
    setToast(`Заявка подтверждена: ${report.item}`);
  }

  function handleQuickAction(action) {
    addActivity(action.event, action.meta, action.tone, currentCook.name);
    if (action.id === "station-task") {
      setTasks((current) => [
        ...current,
        { id: Date.now(), title: "Срочная задача цеха", station: currentCook.station, due: "сейчас", done: false, priority: "critical" },
      ]);
    }
    if (action.id === "open-checklist" || action.id === "open-process") {
      setSelectedStation(stationGuides.find((station) => station.id === currentCook.stationId));
    }
    if (action.id === "empty-stock" || action.id === "one-left" || action.id === "missing-ingredient") {
      setInventoryReports((current) => [
        { id: Date.now(), item: action.id === "missing-ingredient" ? "Ингредиент ТТК" : "Не указан", station: currentCook.station, level: action.label, supplier: "Назначит су-шеф", status: "Новая" },
        ...current,
      ]);
    }
    if (action.id === "stop-item") {
      setSelectedStop({ id: Date.now(), item: "Новое блюдо", reason: "Требует подтверждения су-шефа", station: currentCook.station });
    }
    setToast(action.tone === "red" ? `Критичный сигнал: ${action.label}` : `Выполнено: ${action.label}`);
    setQuickPanelOpen(false);
  }

  function toggleGeneralChecklist(item) {
    setGeneralChecklist((current) => current.map((entry) => (entry.id === item.id ? { ...entry, done: !entry.done } : entry)));
    addActivity(`${item.done ? "Вернул" : "Закрыл"} общий чек: ${item.title}`, item.station, item.done ? "amber" : "green", currentCook.name);
  }

  function toggleStationChecklist(stationId, phase, itemId) {
    const station = stationGuides.find((entry) => entry.id === stationId);
    const item = stationChecklists[stationId]?.[phase]?.find((entry) => entry.id === itemId);
    setStationChecklists((current) => ({
      ...current,
      [stationId]: {
        ...current[stationId],
        [phase]: current[stationId][phase].map((entry) => (entry.id === itemId ? { ...entry, done: !entry.done } : entry)),
      },
    }));
    if (item && station) {
      addActivity(`${item.done ? "Вернул" : "Закрыл"} чек: ${item.title}`, station.name, item.done ? "amber" : "green", currentCook.name);
    }
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
    <main className="min-h-screen overflow-x-hidden px-3 py-3 text-slate-900 sm:px-6">
      <section className="relative mx-auto flex h-[calc(100dvh-24px)] w-full max-w-full flex-col overflow-hidden rounded-[2rem] border border-white/70 bg-slate-50 shadow-soft sm:max-w-md lg:max-w-5xl">
        <StatusBar />
        <AppHeader title={screenTitle} activeTab={activeTab} onNotifications={() => setNotificationsOpen(true)} onProfile={() => setProfileOpen(true)} />
        <div className="flex-1 overflow-y-auto px-4 pb-[calc(10rem+env(safe-area-inset-bottom))] pt-2 lg:px-6">
          <AuthStatus session={session} loading={authLoading} onSignIn={handleGoogleSignIn} onSignOut={handleSignOut} />
          {activeTab === "shift" && (
            <ShiftScreen
              tasks={tasks}
              setTasks={setTasks}
              generalChecklist={generalChecklist}
              stationChecklists={stationChecklists}
              toggleGeneralChecklist={toggleGeneralChecklist}
              activity={activity}
              addActivity={addActivity}
              setStaffOpen={setStaffOpen}
              setSelectedStop={setSelectedStop}
              setSelectedStation={setSelectedStation}
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
          {activeTab === "inventory" && <InventoryScreen reports={inventoryReports} onReport={reportInventory} onConfirm={confirmInventoryReport} />}
          {activeTab === "stations" && <StationsScreen stationChecklists={stationChecklists} setSelectedStation={setSelectedStation} />}
          {activeTab === "chat" && <Chat />}
        </div>
        {toast && <Toast message={toast} onClose={() => setToast("")} />}
        {profileOpen && <ProfileSheet cook={currentCook} onClose={() => setProfileOpen(false)} setSelectedStation={setSelectedStation} />}
        {notificationsOpen && <NotificationsSheet activity={activity} onClose={() => setNotificationsOpen(false)} />}
        {selectedStop && <StopSheet item={selectedStop} onClose={() => setSelectedStop(null)} />}
        {staffOpen && <StaffSheet onClose={() => setStaffOpen(false)} setToast={setToast} />}
        {selectedRecipe && <RecipeSheet recipe={selectedRecipe} onClose={() => setSelectedRecipe(null)} />}
        {selectedStation && <StationSheet station={selectedStation} checklist={stationChecklists[selectedStation.id]} onToggleChecklist={toggleStationChecklist} onClose={() => setSelectedStation(null)} />}
        {quickPanelOpen && <QuickPanel activeTab={activeTab} onClose={() => setQuickPanelOpen(false)} onAction={handleQuickAction} />}
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
  const now = useNow();
  const remaining = getShiftRemaining(now, currentShift.endsAt);

  return (
    <div className="flex min-h-10 items-center justify-between gap-3 px-6 pt-2 text-[13px] font-black text-slate-900">
      <div className="flex min-w-0 items-center gap-2">
        <span>{formatTime(now)}</span>
        <span className={`rounded-full px-2 py-1 text-[11px] font-black ${remaining.expired ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"}`}>
          {remaining.expired ? "смена закончилась" : `до конца ${remaining.label}`}
        </span>
      </div>
      <div className="flex items-center gap-1.5">
        <div className="h-3 w-4 rounded-sm border-2 border-slate-900" />
        <div className="h-3 w-5 rounded-sm bg-slate-900" />
      </div>
    </div>
  );
}

function AppHeader({ title, activeTab, onNotifications, onProfile }) {
  const now = useNow();

  return (
    <header className="px-4 pb-3 pt-2 lg:px-6">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-wide text-amber-600">{activeTab === "shift" ? "Chef OS" : "Kitchen Command"}</p>
          <h1 className="truncate text-3xl font-black leading-tight tracking-normal text-slate-950">{title}</h1>
          <p className="mt-1 text-sm font-bold text-slate-500">{formatDate(now)} · {currentShift.title} {currentShift.startsAt}-{currentShift.endsAt}</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={onNotifications} className="grid h-12 w-12 place-items-center rounded-2xl border border-slate-200 bg-white text-slate-700 shadow-sm" aria-label="Уведомления">
            <Bell size={21} />
          </button>
          <button onClick={onProfile} className="relative grid h-12 w-12 place-items-center rounded-2xl bg-slate-900 text-lg font-black text-white" aria-label="Профиль повара">
            {currentCook.avatar}
            <span className="absolute -right-0.5 -top-0.5 h-4 w-4 rounded-full border-2 border-slate-50 bg-green-500" />
          </button>
        </div>
      </div>
    </header>
  );
}

function ShiftScreen({ tasks, setTasks, generalChecklist, stationChecklists, toggleGeneralChecklist, activity, addActivity, setStaffOpen, setSelectedStop, setSelectedStation, setToast }) {
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
        <section className="rounded-3xl bg-white p-4 shadow-sm">
          <div className="flex items-start gap-3">
            <button onClick={() => setSelectedStation(stationGuides.find((station) => station.id === currentCook.stationId))} className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-amber-500 text-lg font-black text-white" aria-label="Открыть мою станцию">
              {currentCook.avatar}
            </button>
            <div className="min-w-0">
              <p className="text-sm font-black text-amber-600">Моя станция · {currentCook.station}</p>
              <p className="text-xl font-black text-slate-950">{currentCook.name}</p>
              <p className="mt-1 text-sm font-bold leading-snug text-slate-600">{currentCook.instruction}</p>
            </div>
          </div>
        </section>

        <section className="rounded-3xl bg-slate-900 p-4 text-white shadow-sm">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-bold text-slate-300">Пик смены</p>
              <p className="text-2xl font-black">{currentShift.peakWindow}</p>
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
              <button key={item.id} onClick={() => setSelectedStop(item)} className="flex min-h-20 w-full items-center gap-3 rounded-3xl bg-red-50 p-3 text-left shadow-sm">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-red-500 text-white">
                  <AlertTriangle size={24} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-base font-black text-red-950">{item.item}</p>
                  <p className="text-sm font-bold text-red-700">{item.reason} · {item.station}</p>
                </div>
              </button>
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

        <section>
          <SectionHead title="Общий чек-лист" badge={formatProgress(getChecklistProgress(generalChecklist))} />
          <div className="space-y-3">
            {generalChecklist.map((item) => (
              <ChecklistRow key={item.id} item={item} meta={item.station} onClick={() => toggleGeneralChecklist(item)} />
            ))}
          </div>
        </section>
      </div>

      <div className="space-y-5">
        <ChecklistOverview stationChecklists={stationChecklists} setSelectedStation={setSelectedStation} />
        <section>
          <SectionHead title="Быстрые сигналы" badge="1 касание" />
          <div className="grid grid-cols-2 gap-3">
            {["Закончился продукт", "Осталась 1 банка", "Нужен су-шеф", "Фото проблемы"].map((label) => (
              <button
                key={label}
                onClick={() => {
                  addActivity(`Быстрый сигнал: ${label}`, currentCook.station, label.includes("Закончился") ? "red" : "amber", currentCook.name);
                  setToast(`Сигнал создан: ${label}`);
                }}
                className="flex min-h-20 flex-col justify-between rounded-3xl bg-white p-4 text-left shadow-sm"
              >
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

function InventoryScreen({ reports, onReport, onConfirm }) {
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
              <div className="mb-3 flex items-start justify-between gap-3">
                <div>
                  <p className="text-base font-black text-amber-950">{report.item}: {report.level}</p>
                  <p className="text-sm font-bold text-amber-700">{report.station} · {report.supplier}</p>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-black ${report.status === "Подтверждена" ? "bg-green-500 text-white" : "bg-amber-500 text-white"}`}>{report.status}</span>
              </div>
              <button onClick={() => onConfirm(report)} disabled={report.status === "Подтверждена"} className="min-h-12 w-full rounded-2xl bg-slate-900 px-4 text-sm font-black text-white disabled:bg-green-500">
                {report.status === "Подтверждена" ? "Подтверждено" : "Подтвердить су-шефом"}
              </button>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

function StationsScreen({ stationChecklists, setSelectedStation }) {
  const myStation = stationGuides.find((station) => station.id === currentCook.stationId);
  const myProgress = getStationProgress(stationChecklists[currentCook.stationId]);

  return (
    <div className="space-y-5">
      <section className="rounded-3xl bg-slate-900 p-4 text-white shadow-sm">
        <p className="text-sm font-bold text-slate-300">Текущий профиль</p>
        <p className="text-2xl font-black">{currentCook.name} · {currentCook.station}</p>
        <p className="mt-2 text-sm font-semibold text-slate-200">{currentCook.instruction}</p>
        <div className="mt-4 rounded-2xl bg-white/10 p-3">
          <p className="text-xs font-bold text-slate-300">Мой чек-лист</p>
          <p className="text-2xl font-black text-white">{formatProgress(myProgress)}</p>
        </div>
        <button onClick={() => setSelectedStation(myStation)} className="mt-4 min-h-12 w-full rounded-2xl bg-amber-500 px-4 text-sm font-black text-white">
          Открыть инструкцию станции
        </button>
      </section>

      <section>
        <SectionHead title="Инструкция для всех" />
        <div className="space-y-2">
          {universalInstructions.map((instruction) => (
            <div key={instruction} className="flex gap-3 rounded-2xl bg-white p-3 shadow-sm">
              <ShieldCheck className="mt-0.5 shrink-0 text-green-500" size={20} />
              <p className="text-sm font-bold leading-snug text-slate-800">{instruction}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <SectionHead title="Все цеха и процессы" />
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
              <p className="mt-2 text-sm font-black text-amber-700">Чек-лист: {formatProgress(getStationProgress(stationChecklists[station.id]))}</p>
              <p className="mt-2 line-clamp-2 text-sm font-semibold text-slate-600">{station.description}</p>
            </button>
          ))}
        </div>
      </section>
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

function ProfileSheet({ cook, onClose, setSelectedStation }) {
  const station = stationGuides.find((item) => item.id === cook.stationId);

  return (
    <Sheet onClose={onClose} title={cook.name} eyebrow={`${cook.role} · ${cook.station}`}>
      <div className="space-y-4">
        <div className="rounded-3xl bg-slate-900 p-4 text-white">
          <div className="mb-3 flex items-center gap-3">
            <span className="grid h-16 w-16 place-items-center rounded-3xl bg-amber-500 text-2xl font-black">{cook.avatar}</span>
            <div>
              <p className="text-sm font-bold text-slate-300">Сегодня</p>
              <p className="text-xl font-black">{cook.time}</p>
            </div>
          </div>
          <p className="text-sm font-semibold leading-snug text-slate-100">{cook.instruction}</p>
        </div>

        <section>
          <SectionHead title="Личная инструкция" />
          <div className="space-y-2">
            {["Проверь свою станцию до пика", "Сигналь остатки до полного нуля", "Открывай ТТК перед спорной отдачей"].map((item) => (
              <div key={item} className="flex gap-3 rounded-2xl bg-amber-50 p-3">
                <Check className="mt-0.5 shrink-0 text-amber-600" size={20} />
                <p className="text-sm font-bold text-slate-800">{item}</p>
              </div>
            ))}
          </div>
        </section>

        <button onClick={() => setSelectedStation(station)} className="min-h-14 w-full rounded-2xl bg-slate-900 px-4 text-base font-black text-white">
          Открыть процессы моей станции
        </button>
      </div>
    </Sheet>
  );
}

function NotificationsSheet({ activity, onClose }) {
  return (
    <Sheet onClose={onClose} title="Уведомления" eyebrow="Смена сейчас">
      <div className="space-y-3">
        {activity.slice(0, 6).map((event) => (
          <article key={event.id} className="rounded-3xl bg-slate-50 p-4">
            <p className="text-base font-black text-slate-950">{event.action}</p>
            <p className="mt-1 text-sm font-bold text-slate-500">{event.actor} · {event.meta} · {event.time}</p>
          </article>
        ))}
      </div>
    </Sheet>
  );
}

function StopSheet({ item, onClose }) {
  return (
    <Sheet onClose={onClose} title={item.item} eyebrow="Стоп-лист">
      <div className="space-y-3">
        <div className="rounded-3xl bg-red-50 p-4">
          <p className="text-sm font-black text-red-700">Причина</p>
          <p className="mt-1 text-lg font-black text-red-950">{item.reason}</p>
          <p className="mt-2 text-sm font-bold text-red-700">Цех: {item.station}</p>
        </div>
        <div className="rounded-3xl bg-slate-50 p-4">
          <p className="text-sm font-black text-slate-500">Что делать повару</p>
          <p className="mt-1 text-base font-bold leading-snug text-slate-900">Не отдавать блюдо и не обещать замену гостю. Сигнал уходит су-шефу/pass, решение подтверждает только ответственный.</p>
        </div>
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

function StationSheet({ station, checklist, onToggleChecklist, onClose }) {
  return (
    <Sheet onClose={onClose} title={station.name} eyebrow={`Ответственный: ${station.owner}`}>
      <p className="rounded-3xl bg-slate-50 p-4 text-base font-bold leading-snug text-slate-800">{station.description}</p>
      <div className="mt-4 grid gap-3">
        <StationChecklistBlock title="До сервиса" stationId={station.id} phase="setup" items={checklist.setup} onToggle={onToggleChecklist} />
        <StationChecklistBlock title="Во время сервиса" stationId={station.id} phase="service" items={checklist.service} onToggle={onToggleChecklist} />
        <StationChecklistBlock title="Закрытие" stationId={station.id} phase="close" items={checklist.close} onToggle={onToggleChecklist} />
        <ProcessBlock title="Что делает цех" items={station.duties} />
        <ProcessBlock title="Нельзя" items={station.mistakes} danger />
      </div>
    </Sheet>
  );
}

function QuickPanel({ activeTab, onClose, onAction }) {
  const actions = quickActionCatalog[activeTab];
  const groupedActions = actions.reduce((groups, action) => {
    return {
      ...groups,
      [action.group]: [...(groups[action.group] ?? []), action],
    };
  }, {});

  return (
    <Sheet onClose={onClose} title="Что случилось?" eyebrow="Быстрое действие">
      <p className="mb-4 rounded-3xl bg-slate-50 p-3 text-sm font-bold leading-snug text-slate-700">
        Выбери действие за одно касание. Повар сигналит факт, су-шеф подтверждает решение.
      </p>
      <div className="space-y-4">
        {Object.entries(groupedActions).map(([group, groupActions]) => (
          <section key={group}>
            <p className="mb-2 text-xs font-black uppercase tracking-wide text-slate-500">{group}</p>
            <div className="space-y-2">
              {groupActions.map((action) => (
                <button key={action.id} onClick={() => onAction(action)} className="flex min-h-16 w-full items-center gap-3 rounded-2xl bg-slate-50 px-3 py-2 text-left">
                  <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-2xl text-white ${action.tone === "red" ? "bg-red-500" : action.tone === "green" ? "bg-green-500" : "bg-amber-500"}`}>
                    {action.id.includes("photo") ? <Camera size={21} /> : action.tone === "red" ? <AlertTriangle size={21} /> : <Plus size={21} />}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-base font-black text-slate-950">{action.label}</span>
                    <span className="block text-sm font-semibold leading-snug text-slate-500">{action.description}</span>
                  </span>
                </button>
              ))}
            </div>
          </section>
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

function ChecklistOverview({ stationChecklists, setSelectedStation }) {
  return (
    <section>
      <SectionHead title="Картина чек-листов" badge="по цехам" />
      <div className="space-y-3">
        {stationGuides.map((station) => {
          const progress = getStationProgress(stationChecklists[station.id]);
          return (
            <button key={station.id} onClick={() => setSelectedStation(station)} className="flex min-h-16 w-full items-center gap-3 rounded-3xl bg-white p-3 text-left shadow-sm">
              <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl ${progress.done === progress.total ? "bg-green-500 text-white" : "bg-amber-100 text-amber-700"}`}>
                <ListChecks size={24} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-base font-black text-slate-950">{station.name}</span>
                <span className="text-sm font-semibold text-slate-500">{station.owner} · {formatProgress(progress)}</span>
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

function ChecklistRow({ item, meta, onClick }) {
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

function StationChecklistBlock({ title, stationId, phase, items, onToggle }) {
  const progress = getChecklistProgress(items);

  return (
    <div className="rounded-3xl bg-white p-3 shadow-sm">
      <div className="mb-3 flex items-center justify-between gap-3">
        <p className="text-base font-black text-slate-950">{title}</p>
        <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-black text-amber-700">{formatProgress(progress)}</span>
      </div>
      <div className="space-y-2">
        {items.map((item) => (
          <ChecklistRow key={item.id} item={item} onClick={() => onToggle(stationId, phase, item.id)} />
        ))}
      </div>
    </div>
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

function makeChecklist(items, prefix) {
  return items.map((title, index) => ({
    id: `${prefix}-${index + 1}`,
    title,
    done: index === 0,
  }));
}

function getChecklistProgress(items) {
  return {
    done: items.filter((item) => item.done).length,
    total: items.length,
  };
}

function getStationProgress(stationChecklist) {
  const allItems = Object.values(stationChecklist ?? {}).flat();
  return getChecklistProgress(allItems);
}

function formatProgress(progress) {
  return `${progress.done}/${progress.total}`;
}

function useNow() {
  const [now, setNow] = React.useState(() => new Date());

  React.useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 60000);
    return () => window.clearInterval(timer);
  }, []);

  return now;
}

function formatTime(date) {
  return new Intl.DateTimeFormat("ru-RU", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function formatDate(date) {
  return new Intl.DateTimeFormat("ru-RU", {
    weekday: "short",
    day: "2-digit",
    month: "long",
  }).format(date);
}

function getShiftRemaining(now, endsAt) {
  const [hours, minutes] = endsAt.split(":").map(Number);
  const end = new Date(now);
  end.setHours(hours, minutes, 0, 0);
  const diffMs = end.getTime() - now.getTime();

  if (diffMs <= 0) {
    return { expired: true, label: "0м" };
  }

  const totalMinutes = Math.ceil(diffMs / 60000);
  const remainingHours = Math.floor(totalMinutes / 60);
  const remainingMinutes = totalMinutes % 60;

  return {
    expired: false,
    label: remainingHours > 0 ? `${remainingHours}ч ${remainingMinutes}м` : `${remainingMinutes}м`,
  };
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
