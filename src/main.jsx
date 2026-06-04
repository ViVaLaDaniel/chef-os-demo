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
  Menu,
  MessageCircle,
  Package,
  Phone,
  Plus,
  Search,
  Send,
  Settings,
  ShieldCheck,
  ShoppingBasket,
  Sparkles,
  RotateCcw,
  Users,
  Utensils,
  Wifi,
  WifiOff,
  X,
  Database,
  Scale,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import "./index.css";
import {
  bootstrapAndLoadChefOsWorkspace,
  confirmRemoteInventoryReport,
  createRemoteChannelMessage,
  createRemoteInventoryReport,
  resetRemoteDemoWorkspace,
  updateRemoteShiftTask,
  updateRemoteChecklistResult,
  updateRemoteIngredientPrice,
  updateRemoteRecipeCosting,
  updateRemoteRecipeIngredients,
  createRemoteRestaurant,
  joinRemoteRestaurantByInviteCode,
  getRemoteUserMemberships,
  assignRemoteStaffStation,
} from "./lib/chefOsRemote";
import { isSupabaseConfigured, signInWithGoogle, signOut, supabase } from "./lib/supabase";

const tabs = [
  { id: "shift", label: "Смена", icon: Home },
  { id: "recipes", label: "ТТК", icon: Utensils },
  { id: "base", label: "База", icon: Database },
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

const initialInventoryItems = [
  { id: 1, name: "Тунец", station: "Холодный цех", stock: "1 лоток", par: "4 лотка", status: "critical", supplier: "Nord Fish", costPerUnit: 22.00, lossPercent: 0.10, unitLabel: "лоток" },
  { id: 2, name: "Сливочное масло", station: "Горячий цех", stock: "2 пачки", par: "8 пачек", status: "low", supplier: "Prime Market", costPerUnit: 4.50, lossPercent: 0.02, unitLabel: "пачка" },
  { id: 3, name: "Соевый соус", station: "Суши", stock: "1 банка", par: "6 банок", status: "low", supplier: "Asian Pro", costPerUnit: 6.20, lossPercent: 0.00, unitLabel: "банка" },
  { id: 4, name: "Микс зелени", station: "Холодный цех", stock: "норма", par: "3 бокса", status: "ok", supplier: "Bio Herbs", costPerUnit: 2.40, lossPercent: 0.15, unitLabel: "бокс" },
];

const recipes = [
  {
    id: 1,
    title: "Тартар из тунца",
    category: "Закуски",
    time: "12 мин",
    yield: "180 г",
    cost: "4.80 EUR",
    costNum: 4.80,
    salesPrice: 16.50,
    targetMarginPercent: 70,
    allergens: "рыба, кунжут",
    image: "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=240&q=80",
    steps: ["Охладить миску и нож", "Нарезать кубик 6 мм", "Смешать с соусом перед отдачей", "Проверить фото эталона"],
    ingredients: [
      { itemId: 1, name: "Тунец", gross: 0.180, net: 0.160, costPerUnit: 22.00, lossPercent: 0.10, unitLabel: "лоток", calculatedCost: 3.96 },
      { itemId: 4, name: "Микс зелени", gross: 0.020, net: 0.015, costPerUnit: 2.40, lossPercent: 0.15, unitLabel: "бокс", calculatedCost: 0.048 },
      { itemId: 3, name: "Соевый соус", gross: 0.010, net: 0.010, costPerUnit: 6.20, lossPercent: 0.00, unitLabel: "банка", calculatedCost: 0.062 },
    ]
  },
  {
    id: 2,
    title: "Крем-суп из тыквы",
    category: "Супы",
    time: "28 мин",
    yield: "320 г",
    cost: "2.10 EUR",
    costNum: 2.10,
    salesPrice: 8.50,
    targetMarginPercent: 70,
    allergens: "сливки",
    image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=240&q=80",
    steps: ["Прогреть основу", "Пробить до гладкости", "Проверить соль", "Подать с семечками"],
    ingredients: [
      { itemId: 2, name: "Сливочное масло", gross: 0.050, net: 0.050, costPerUnit: 4.50, lossPercent: 0.02, unitLabel: "пачка", calculatedCost: 0.225 }
    ]
  },
  {
    id: 3,
    title: "Утиная грудка",
    category: "Горячее",
    time: "34 мин",
    yield: "260 г",
    cost: "7.40 EUR",
    costNum: 7.40,
    salesPrice: 24.50,
    targetMarginPercent: 70,
    allergens: "нет",
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=240&q=80",
    steps: ["Надсечь кожу", "Старт на холодной сковороде", "Довести до 56 C", "Отдых 6 минут"],
    ingredients: [
      { itemId: 2, name: "Сливочное масло", gross: 0.030, net: 0.030, costPerUnit: 4.50, lossPercent: 0.02, unitLabel: "пачка", calculatedCost: 0.135 }
    ]
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

const OPERATIONAL_CACHE_KEY = "chef-os-demo:operational-cache";
const OPERATIONAL_CACHE_VERSION = 1;

export function App() {
  const initialOperationalState = React.useMemo(readOperationalCache, []);
  const [activeTab, setActiveTab] = React.useState("shift");
  const [tasks, setTasks] = React.useState(initialOperationalState.tasks);
  const [generalChecklist, setGeneralChecklist] = React.useState(initialOperationalState.generalChecklist);
  const [stationChecklists, setStationChecklists] = React.useState(initialOperationalState.stationChecklists);
  const [activity, setActivity] = React.useState(initialOperationalState.activity);
  const [inventoryItems, setInventoryItems] = React.useState(initialOperationalState.inventoryItems);
  const [inventoryReports, setInventoryReports] = React.useState(initialOperationalState.inventoryReports);
  const [chatMessages, setChatMessages] = React.useState(initialOperationalState.chatMessages);
  const [staffList, setStaffList] = React.useState(initialOperationalState.staff ?? staff);
  const [recipesList, setRecipesList] = React.useState(initialOperationalState.recipes ?? recipes);
  const [stationGuidesList, setStationGuidesList] = React.useState(initialOperationalState.stationGuides ?? stationGuides);
  const [currentShiftState, setCurrentShiftState] = React.useState(initialOperationalState.currentShift ?? currentShift);
  const [cacheStatus, setCacheStatus] = React.useState({
    savedAt: initialOperationalState.savedAt,
    source: initialOperationalState.source,
  });
  const [remoteWorkspace, setRemoteWorkspace] = React.useState({ restaurantId: null, status: "idle", message: "" });
  const [query, setQuery] = React.useState("");
  const [recipeFilter, setRecipeFilter] = React.useState("Все");
  const [selectedRecipe, setSelectedRecipe] = React.useState(null);
  const [selectedStation, setSelectedStation] = React.useState(null);
  const [selectedStop, setSelectedStop] = React.useState(null);
  const [staffOpen, setStaffOpen] = React.useState(false);
  const [profileOpen, setProfileOpen] = React.useState(false);
  const [notificationsOpen, setNotificationsOpen] = React.useState(false);
  const [scheduleOpen, setScheduleOpen] = React.useState(false);
  const [settingsOpen, setSettingsOpen] = React.useState(false);
  const [topMenuOpen, setTopMenuOpen] = React.useState(false);
  const [quickPanelOpen, setQuickPanelOpen] = React.useState(false);
  const [toast, setToast] = React.useState("");
  const [session, setSession] = React.useState(null);
  const [authLoading, setAuthLoading] = React.useState(false);
  const [resetLoading, setResetLoading] = React.useState(false);
  const isOnline = useOnlineStatus();
  const accountName = getAccountDisplayName(session);
  const accountUserId = session?.user?.id ?? null;

  const currentCook = React.useMemo(() => {
    if (session && staffList && staffList.length > 0) {
      const match = staffList.find((member) => member.appUserId === accountUserId);
      if (match) return match;
    }
    return (staffList?.[1] || staff[1]);
  }, [session, staffList, accountUserId]);

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

  React.useEffect(() => {
    if (!session || !isSupabaseConfigured) {
      setRemoteWorkspace((current) => ({ ...current, status: "idle", message: "" }));
      return;
    }

    let isCancelled = false;

    async function loadWorkspace() {
      if (!accountUserId) return;
      setRemoteWorkspace((current) => ({ ...current, status: "loading", message: "Проверка подписок" }));

      try {
        const memberships = await getRemoteUserMemberships(accountUserId);
        if (isCancelled) return;

        if (memberships.length === 0) {
          setRemoteWorkspace({ 
            restaurantId: null, 
            restaurantName: null, 
            inviteCode: null, 
            status: "onboarding", 
            message: "Выберите или создайте кухню" 
          });
          return;
        }

        setRemoteWorkspace((current) => ({ ...current, status: "loading", message: "Загружаю базу" }));
        const workspace = await bootstrapAndLoadChefOsWorkspace({ currentUserId: accountUserId });
        if (isCancelled || !workspace) {
          return;
        }

        setRemoteWorkspace({ 
          restaurantId: workspace.restaurantId, 
          restaurantName: workspace.restaurantName,
          inviteCode: workspace.inviteCode,
          status: "connected", 
          message: "Supabase подключен" 
        });
        setTasks(workspace.tasks.length > 0 ? workspace.tasks : initialTasks);
        setInventoryItems(workspace.inventoryItems.length > 0 ? workspace.inventoryItems : initialInventoryItems);
        setInventoryReports(workspace.inventoryReports);
        setActivity(workspace.activity.length > 0 ? workspace.activity : initialActivity);
        setChatMessages(workspace.chatMessages.length > 0 ? workspace.chatMessages : messages);
        if (workspace.generalChecklist) {
          setGeneralChecklist(workspace.generalChecklist);
        }
        if (workspace.stationChecklists) {
          setStationChecklists(workspace.stationChecklists);
        }
        if (workspace.staff) {
          setStaffList(workspace.staff);
        }
        if (workspace.recipes) {
          setRecipesList(workspace.recipes);
        }
        if (workspace.stationGuides) {
          setStationGuidesList(workspace.stationGuides);
        }
        if (workspace.currentShift) {
          setCurrentShiftState(workspace.currentShift);
        }
      } catch (error) {
        if (isCancelled) {
          return;
        }
        console.error("Failed to load workspace", error);
        setRemoteWorkspace({ restaurantId: null, status: "error", message: "Ошибка подключения к базе" });
        setToast(`База недоступна: ${error.message}`);
      }
    }

    loadWorkspace();

    return () => {
      isCancelled = true;
    };
  }, [accountUserId, session]);

  React.useEffect(() => {
    const savedAt = writeOperationalCache({
      tasks,
      generalChecklist,
      stationChecklists,
      inventoryItems,
      inventoryReports,
      activity,
      chatMessages,
      staff: staffList,
      recipes: recipesList,
      stationGuides: stationGuidesList,
      currentShift: currentShiftState
    });

    if (savedAt) {
      setCacheStatus({ savedAt, source: "cache" });
    }
  }, [activity, chatMessages, generalChecklist, inventoryItems, inventoryReports, stationChecklists, tasks, staffList, recipesList, stationGuidesList, currentShiftState]);

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

  function addActivity(action, meta, tone = "amber", actor = accountName) {
    setActivity((current) => [{ id: Date.now(), actor, action, meta, time: "сейчас", tone }, ...current]);
  }

  async function reportInventory(item, level) {
    const action = `${item.name}: ${level}`;
    const localReport = { id: Date.now(), item: item.name, station: item.station, level, supplier: item.supplier, status: "Новая" };
    setInventoryReports((current) => [localReport, ...current]);
    addActivity(action, item.station, level === "закончилось" ? "red" : "amber", accountName);
    setToast(`Сигнал отправлен су-шефу: ${item.name}`);

    if (remoteWorkspace.status !== "connected") {
      return;
    }

    try {
      const remoteReport = await createRemoteInventoryReport({ restaurantId: remoteWorkspace.restaurantId, item, level, userId: accountUserId });
      if (remoteReport) {
        setInventoryReports((current) => current.map((report) => (report.id === localReport.id ? remoteReport : report)));
      }
    } catch (error) {
      setToast(`Сигнал сохранен локально, база недоступна: ${error.message}`);
    }
  }

  async function confirmInventoryReport(report) {
    setInventoryReports((current) => current.map((item) => (item.id === report.id ? { ...item, status: "Подтверждена" } : item)));
    addActivity(`Подтвердил заявку: ${report.item}`, report.station, "green", accountName);
    setToast(`Заявка подтверждена: ${report.item}`);

    try {
      await confirmRemoteInventoryReport(report, { userId: accountUserId });
    } catch (error) {
      setToast(`Подтверждение сохранено локально, база недоступна: ${error.message}`);
    }
  }

  async function toggleTask(task) {
    const nextDone = !task.done;
    setTasks((current) => current.map((item) => (item.id === task.id ? { ...item, done: nextDone } : item)));
    addActivity(`${nextDone ? "Закрыл" : "Вернул"} задачу: ${task.title}`, task.station, nextDone ? "green" : "amber", accountName);

    try {
      await updateRemoteShiftTask(task, nextDone, { userId: accountUserId });
    } catch (error) {
      setToast(`Задача сохранена локально, база недоступна: ${error.message}`);
    }
  }

  const handleCreateWorkspace = async (name) => {
    setAuthLoading(true);
    setToast("");
    try {
      const restId = await createRemoteRestaurant(name);
      if (restId) {
        setToast(`Ресторан "${name}" успешно создан!`);
        setRemoteWorkspace({ restaurantId: restId, status: "connected", message: "Supabase подключен" });
        window.location.reload();
      } else {
        throw new Error("Не удалось получить ID ресторана");
      }
    } catch (err) {
      console.error(err);
      setToast("Ошибка создания: " + err.message);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleJoinWorkspace = async (code) => {
    setAuthLoading(true);
    setToast("");
    try {
      const restId = await joinRemoteRestaurantByInviteCode(code);
      if (restId) {
        setToast("Вы успешно присоединились к проекту!");
        setRemoteWorkspace({ restaurantId: restId, status: "connected", message: "Supabase подключен" });
        window.location.reload();
      } else {
        throw new Error("Не удалось присоединиться");
      }
    } catch (err) {
      console.error(err);
      setToast("Ошибка: " + err.message);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleOpenDemoWorkspace = async () => {
    setAuthLoading(true);
    setToast("");
    try {
      const workspace = await bootstrapAndLoadChefOsWorkspace({ currentUserId: accountUserId });
      if (workspace) {
        setToast("Демо-кухня готова!");
        window.location.reload();
      }
    } catch (err) {
      console.error(err);
      setToast("Ошибка: " + err.message);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSwitchWorkspace = () => {
    localStorage.removeItem("chef-os-demo:operational-cache");
    localStorage.removeItem("chef-os:intro-seen");
    setRemoteWorkspace({ restaurantId: null, restaurantName: null, inviteCode: null, status: "onboarding", message: "Выберите или создайте кухню" });
    setSettingsOpen(false);
    setToast("Выберите или создайте кухню");
  };

  const handleAssignStaffStation = async (contactId, stationCode, roleLabel) => {
    try {
      const stationUuid = stationCode === "warehouse" ? null : (stationGuidesList.find(g => g.id === stationCode)?.remoteId || null);
      await assignRemoteStaffStation(contactId, stationUuid, roleLabel);
      
      setStaffList(current => current.map(item => {
        if (item.id === contactId) {
          const stationName = stationCode === "warehouse" ? "Склад" : (stationGuidesList.find(g => g.id === stationCode)?.name || "Склад");
          return {
            ...item,
            stationId: stationCode,
            station: stationName,
            role: roleLabel
          };
        }
        return item;
      }));
      setToast("Сотрудник назначен!");
    } catch (err) {
      console.error(err);
      setToast("Ошибка назначения: " + err.message);
    }
  };

  async function sendChatMessage(text) {
    const senderLabel = currentCook ? `${currentCook.name} | ${currentCook.station}` : accountName;
    const localMessage = { id: Date.now(), from: senderLabel, text, mine: true, time: "сейчас" };
    setChatMessages((current) => [...current, localMessage]);

    try {
      const remoteMessage = await createRemoteChannelMessage({ restaurantId: remoteWorkspace.restaurantId, text, senderLabel, userId: accountUserId });
      if (remoteMessage) {
        setChatMessages((current) => current.map((message) => (message.id === localMessage.id ? remoteMessage : message)));
      }
    } catch (error) {
      setToast(`Сообщение сохранено локально, база недоступна: ${error.message}`);
    }
  }

  async function resetDemoWorkspace() {
    if (remoteWorkspace.status !== "connected") {
      setToast("Сначала подключите Supabase через Google");
      return;
    }

    setResetLoading(true);
    try {
      await resetRemoteDemoWorkspace({ actorLabel: accountName });
      const workspace = await bootstrapAndLoadChefOsWorkspace({ currentUserId: accountUserId });
      setRemoteWorkspace({ restaurantId: workspace.restaurantId, status: "connected", message: "Supabase подключен" });
      setTasks(workspace.tasks.length > 0 ? workspace.tasks : initialTasks);
      setInventoryItems(workspace.inventoryItems.length > 0 ? workspace.inventoryItems : initialInventoryItems);
      setInventoryReports(workspace.inventoryReports);
      setActivity(workspace.activity.length > 0 ? workspace.activity : initialActivity);
      setChatMessages(workspace.chatMessages.length > 0 ? workspace.chatMessages : messages);
      if (workspace.generalChecklist) {
        setGeneralChecklist(workspace.generalChecklist);
      } else {
        setGeneralChecklist(initialGeneralChecklist);
      }
      if (workspace.stationChecklists) {
        setStationChecklists(workspace.stationChecklists);
      } else {
        setStationChecklists(initialStationChecklists);
      }
      if (workspace.staff) {
        setStaffList(workspace.staff);
      } else {
        setStaffList(staff);
      }
      if (workspace.recipes) {
        setRecipesList(workspace.recipes);
      } else {
        setRecipesList(recipes);
      }
      if (workspace.stationGuides) {
        setStationGuidesList(workspace.stationGuides);
      } else {
        setStationGuidesList(stationGuides);
      }
      if (workspace.currentShift) {
        setCurrentShiftState(workspace.currentShift);
      } else {
        setCurrentShiftState(currentShift);
      }
      setToast("Demo workspace очищен");
    } catch (error) {
      setToast(`Reset не выполнен: ${error.message}`);
    } finally {
      setResetLoading(false);
    }
  }

  async function handleUpdateIngredientPrice(itemId, newPrice, newLoss) {
    setInventoryItems(current => current.map(item => {
      if (item.id === itemId) {
        return {
          ...item,
          costPerUnit: newPrice,
          lossPercent: newLoss
        };
      }
      return item;
    }));

    setRecipesList(current => current.map(recipe => {
      let hasChanged = false;
      const updatedIngredients = (recipe.ingredients || []).map(ing => {
        if (ing.itemId === itemId) {
          hasChanged = true;
          const calculatedCost = ing.gross * newPrice;
          return {
            ...ing,
            costPerUnit: newPrice,
            lossPercent: newLoss,
            calculatedCost
          };
        }
        return ing;
      });

      if (hasChanged) {
        const dynamicFoodCost = updatedIngredients.reduce((sum, ing) => sum + ing.calculatedCost, 0);
        return {
          ...recipe,
          ingredients: updatedIngredients,
          cost: `${dynamicFoodCost.toFixed(2)} EUR`,
          costNum: dynamicFoodCost
        };
      }
      return recipe;
    }));

    try {
      if (remoteWorkspace.status === "connected") {
        await updateRemoteIngredientPrice(itemId, newPrice, newLoss);
        setToast("Цена ингредиента сохранена на сервере");
      } else {
        setToast("Сохранено локально (нет связи)");
      }
    } catch (err) {
      setToast(`Ошибка сохранения на сервере: ${err.message}`);
    }
  }

  async function handleUpdateRecipeCosting(recipeId, salesPrice, targetMargin) {
    try {
      if (remoteWorkspace.status === "connected") {
        await updateRemoteRecipeCosting(recipeId, salesPrice, targetMargin);
      }
      setRecipesList(current => current.map(recipe => {
        if (recipe.id === recipeId) {
          return {
            ...recipe,
            salesPrice: Number(salesPrice) || 0,
            targetMarginPercent: Number(targetMargin) || 70
          };
        }
        return recipe;
      }));
      setToast("Настройки калькуляции сохранены");
    } catch (error) {
      setToast(`Ошибка сохранения калькуляции: ${error.message}`);
    }
  }

  async function handleUpdateRecipeIngredients(recipeId, ingredientsList) {
    try {
      if (remoteWorkspace.status === "connected") {
        await updateRemoteRecipeIngredients(recipeId, ingredientsList);
      }
      
      setRecipesList(current => current.map(recipe => {
        if (recipe.id === recipeId) {
          const updatedIngredients = ingredientsList.map(ing => {
            const matchingInventoryItem = inventoryItems.find(item => item.id === ing.itemId);
            const costPerUnit = matchingInventoryItem?.costPerUnit ?? 0;
            const lossPercent = matchingInventoryItem?.lossPercent ?? 0;
            const calculatedCost = ing.gross * costPerUnit;
            return {
              itemId: ing.itemId,
              name: ing.name || matchingInventoryItem?.name || "Продукт",
              gross: Number(ing.gross) || 0,
              net: Number(ing.net) || 0,
              costPerUnit,
              lossPercent,
              unitLabel: ing.unitLabel || matchingInventoryItem?.unitLabel || "кг",
              calculatedCost
            };
          });
          
          const dynamicFoodCost = updatedIngredients.reduce((sum, ing) => sum + ing.calculatedCost, 0);
          return {
            ...recipe,
            ingredients: updatedIngredients,
            cost: `${dynamicFoodCost.toFixed(2)} EUR`,
            costNum: dynamicFoodCost
          };
        }
        return recipe;
      }));
      
      setToast("Состав ТТК успешно сохранен");
    } catch (error) {
      setToast(`Ошибка сохранения состава ТТК: ${error.message}`);
    }
  }

  function handleQuickAction(action) {
    addActivity(action.event, action.meta, action.tone, accountName);
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

  async function toggleGeneralChecklist(item) {
    const nextDone = !item.done;
    setGeneralChecklist((current) => current.map((entry) => (entry.id === item.id ? { ...entry, done: nextDone } : entry)));
    addActivity(`${item.done ? "Вернул" : "Закрыл"} общий чек: ${item.title}`, item.station, item.done ? "amber" : "green", accountName);

    try {
      if (remoteWorkspace.status === "connected" && typeof item.id === "string" && item.id.length > 10) {
        await updateRemoteChecklistResult(item.id, nextDone, { userId: accountUserId });
      }
    } catch (error) {
      setToast(`Чек-лист сохранен локально, база недоступна: ${error.message}`);
    }
  }

  async function toggleStationChecklist(stationId, phase, itemId) {
    const station = stationGuides.find((entry) => entry.id === stationId);
    const item = stationChecklists[stationId]?.[phase]?.find((entry) => entry.id === itemId);
    if (!item) return;

    const nextDone = !item.done;
    setStationChecklists((current) => ({
      ...current,
      [stationId]: {
        ...current[stationId],
        [phase]: current[stationId][phase].map((entry) => (entry.id === itemId ? { ...entry, done: nextDone } : entry)),
      },
    }));
    if (station) {
      addActivity(`${item.done ? "Вернул" : "Закрыл"} чек: ${item.title}`, station.name, item.done ? "amber" : "green", accountName);
    }

    try {
      if (remoteWorkspace.status === "connected" && typeof itemId === "string" && itemId.length > 10) {
        await updateRemoteChecklistResult(itemId, nextDone, { userId: accountUserId });
      }
    } catch (error) {
      setToast(`Чек-лист сохранен локально, база недоступна: ${error.message}`);
    }
  }

  const normalizedQuery = query.trim().toLowerCase();
  const filteredRecipes = (recipeFilter === "Все" ? recipesList : recipesList.filter((recipe) => recipe.category === recipeFilter)).filter((recipe) =>
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
        <StatusBar currentShift={currentShiftState} />
        <AppHeader title={screenTitle} activeTab={activeTab} currentCook={currentCook} currentShift={currentShiftState} onMenu={() => setTopMenuOpen(true)} />
        <div className="flex-1 overflow-y-auto px-4 pb-[calc(10rem+env(safe-area-inset-bottom))] pt-2 lg:px-6">
          <AuthStatus session={session} loading={authLoading} isOnline={isOnline} cacheStatus={cacheStatus} remoteWorkspace={remoteWorkspace} onSignIn={handleGoogleSignIn} onSignOut={handleSignOut} />
          {remoteWorkspace.status === "onboarding" ? (
            <OnboardingScreen
              onCreate={handleCreateWorkspace}
              onJoin={handleJoinWorkspace}
              onDemo={handleOpenDemoWorkspace}
              loading={authLoading}
            />
          ) : (
            <>
              {activeTab === "shift" && (
                <ShiftScreen
                  tasks={tasks}
                  generalChecklist={generalChecklist}
                  stationChecklists={stationChecklists}
                  currentCook={currentCook}
                  stationGuides={stationGuidesList}
                  currentShift={currentShiftState}
                  onToggleTask={toggleTask}
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
              {activeTab === "base" && (
                <BaseScreen
                  inventoryItems={inventoryItems}
                  onUpdateIngredientPrice={handleUpdateIngredientPrice}
                />
              )}
              {activeTab === "inventory" && <InventoryScreen inventoryItems={inventoryItems} reports={inventoryReports} onReport={reportInventory} onConfirm={confirmInventoryReport} />}
              {activeTab === "stations" && (
                <StationsScreen
                  stationChecklists={stationChecklists}
                  currentCook={currentCook}
                  stationGuides={stationGuidesList}
                  setSelectedStation={setSelectedStation}
                />
              )}
              {activeTab === "chat" && <Chat messages={chatMessages} onSendMessage={sendChatMessage} />}
            </>
          )}
        </div>
        {toast && <Toast message={toast} onClose={() => setToast("")} />}
        {topMenuOpen && (
          <TopMenuSheet
            currentCook={currentCook}
            onClose={() => setTopMenuOpen(false)}
            onOpenProfile={() => {
              setTopMenuOpen(false);
              setProfileOpen(true);
            }}
            onOpenNotifications={() => {
              setTopMenuOpen(false);
              setNotificationsOpen(true);
            }}
            onOpenSchedule={() => {
              setTopMenuOpen(false);
              setScheduleOpen(true);
            }}
            onOpenStaff={() => {
              setTopMenuOpen(false);
              setStaffOpen(true);
            }}
            onOpenSettings={() => {
              setTopMenuOpen(false);
              setSettingsOpen(true);
            }}
          />
        )}
        {profileOpen && <ProfileSheet cook={currentCook} stationGuides={stationGuidesList} onClose={() => setProfileOpen(false)} setSelectedStation={setSelectedStation} />}
        {notificationsOpen && <NotificationsSheet activity={activity} onClose={() => setNotificationsOpen(false)} />}
        {scheduleOpen && (
          <ScheduleSheet
            onClose={() => setScheduleOpen(false)}
            onOpenStaff={() => {
              setScheduleOpen(false);
              setStaffOpen(true);
            }}
          />
        )}
        {settingsOpen && <SettingsSheet remoteWorkspace={remoteWorkspace} currentCook={currentCook} resetLoading={resetLoading} onResetDemo={resetDemoWorkspace} onSwitchWorkspace={handleSwitchWorkspace} onClose={() => setSettingsOpen(false)} />}
        {selectedStop && <StopSheet item={selectedStop} onClose={() => setSelectedStop(null)} />}
        {staffOpen && <StaffSheet staff={staffList} currentUserRole={currentCook?.role} onAssignStation={handleAssignStaffStation} onClose={() => setStaffOpen(false)} setToast={setToast} />}
        {selectedRecipe && (
          <RecipeSheet
            recipe={recipesList.find(r => r.id === selectedRecipe.id) || selectedRecipe}
            inventoryItems={inventoryItems}
            onClose={() => setSelectedRecipe(null)}
            onUpdateRecipeCosting={handleUpdateRecipeCosting}
            onUpdateRecipeIngredients={handleUpdateRecipeIngredients}
            setToast={setToast}
          />
        )}
        {selectedStation && <StationSheet station={selectedStation} checklist={stationChecklists[selectedStation.id]} onToggleChecklist={toggleStationChecklist} onClose={() => setSelectedStation(null)} />}
        {quickPanelOpen && <QuickPanel activeTab={activeTab} currentCook={currentCook} onClose={() => setQuickPanelOpen(false)} onAction={handleQuickAction} />}
        <Fab activeTab={activeTab} onClick={() => setQuickPanelOpen(true)} />
        <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
      </section>
    </main>
  );
}

function AuthStatus({ session, loading, isOnline, cacheStatus, remoteWorkspace, onSignIn, onSignOut }) {
  const userLabel = getAccountDisplayName(session);
  const userAvatarUrl = session?.user?.user_metadata?.avatar_url || session?.user?.user_metadata?.picture;
  const NetworkIcon = isOnline ? Wifi : WifiOff;
  const cacheLabel = cacheStatus.savedAt ? `Смена сохранена ${formatCacheTime(cacheStatus.savedAt)}` : "Локальный кеш готов";
  const databaseLabel = getDatabaseLabel(remoteWorkspace, session);

  return (
    <section className="mb-4 flex min-h-16 items-center justify-between gap-3 rounded-3xl bg-white p-3 shadow-sm">
      <div className="flex min-w-0 flex-1 items-center gap-3">
        {session && <AccountAvatar userLabel={userLabel} avatarUrl={userAvatarUrl} />}
        <div className="min-w-0">
        <p className="text-xs font-black uppercase tracking-wide text-slate-500">{isSupabaseConfigured ? "Общая база" : "Demo mode"}</p>
        <p className="truncate text-sm font-black text-slate-950">{session ? userLabel : isSupabaseConfigured ? "Войдите через Google" : "Supabase env не задан"}</p>
        <p className={`mt-1 inline-flex items-center gap-1 text-xs font-black ${isOnline ? "text-green-600" : "text-amber-600"}`}>
          <NetworkIcon size={14} />
          {isOnline ? "Online" : "Offline кеш"}
        </p>
        <p className="mt-0.5 text-xs font-bold text-slate-400">{cacheLabel}</p>
        <p className="mt-0.5 text-xs font-bold text-slate-400">{databaseLabel}</p>
        </div>
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

function AccountAvatar({ userLabel, avatarUrl }) {
  const fallback = getInitials(userLabel);

  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt={userLabel ? `Фото аккаунта ${userLabel}` : "Фото аккаунта"}
        className="h-12 w-12 shrink-0 rounded-2xl object-cover ring-2 ring-amber-100"
        referrerPolicy="no-referrer"
      />
    );
  }

  return (
    <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-amber-500 text-base font-black text-white ring-2 ring-amber-100">
      {fallback}
    </span>
  );
}

function StatusBar({ currentShift }) {
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

function AppHeader({ title, activeTab, currentCook, currentShift, onMenu }) {
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
          <button onClick={onMenu} className="relative flex h-12 w-14 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-sm" aria-label="Открыть меню">
            <Menu size={24} />
            <span className="absolute -right-1 -top-1 grid h-6 w-6 place-items-center rounded-full border-2 border-slate-50 bg-amber-500 text-[11px] font-black">{currentCook.avatar}</span>
          </button>
        </div>
      </div>
    </header>
  );
}

function ShiftScreen({ tasks, generalChecklist, stationChecklists, currentCook, stationGuides, currentShift, onToggleTask, toggleGeneralChecklist, activity, addActivity, setStaffOpen, setSelectedStop, setSelectedStation, setToast }) {
  const openTasks = tasks.filter((task) => !task.done).length;

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
              <button key={task.id} onClick={() => onToggleTask(task)} className="flex min-h-16 w-full items-center gap-3 rounded-3xl bg-white p-3 text-left shadow-sm">
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
                  addActivity(`Быстрый сигнал: ${label}`, currentCook.station, label.includes("Закончился") ? "red" : "amber", accountName);
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

function InventoryScreen({ inventoryItems, reports, onReport, onConfirm }) {
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

function StationsScreen({ stationChecklists, currentCook, stationGuides, setSelectedStation }) {
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

function Chat({ messages: chatMessages, onSendMessage }) {
  const [draft, setDraft] = React.useState("");

  function sendMessage() {
    const text = draft.trim();
    if (!text) return;
    onSendMessage(text);
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

function StaffSheet({ staff: staffList, currentUserRole, onClose, onAssignStation, setToast }) {
  const [editingPerson, setEditingPerson] = React.useState(null);
  const [selectedStation, setSelectedStation] = React.useState("");
  const [selectedRole, setSelectedRole] = React.useState("");

  const isManager = currentUserRole === "Шеф/Владелец" || currentUserRole === "Шеф-повар" || currentUserRole === "Су-шеф" || currentUserRole === "Су-шеф";

  const handleStartEdit = (person) => {
    setEditingPerson(person);
    setSelectedStation(person.stationId || "cold");
    setSelectedRole(person.role || "Повар");
  };

  const handleSave = async () => {
    try {
      await onAssignStation(editingPerson.id, selectedStation, selectedRole);
      setEditingPerson(null);
      setToast("Настройки сотрудника обновлены!");
    } catch (err) {
      console.error(err);
      setToast("Ошибка обновления: " + err.message);
    }
  };

  const stationOptions = [
    { id: "cold", label: "Холодный цех" },
    { id: "hot", label: "Горячий цех" },
    { id: "prep", label: "Заготовочный" },
    { id: "pass", label: "Pass / выдача" },
    { id: "sushi", label: "Суши" },
    { id: "warehouse", label: "Склад" }
  ];

  const roleOptions = ["Повар", "Су-шеф", "Шеф-повар", "Закупщик", "Шеф/Владелец"];

  return (
    <Sheet onClose={onClose} title="Люди на смене">
      <div className="space-y-3">
        {editingPerson ? (
          <div className="rounded-3xl bg-slate-50 p-4 space-y-4">
            <h4 className="font-black text-slate-900">Настройки доступа: {editingPerson.name}</h4>
            
            <div>
              <label className="text-xs font-bold text-slate-500">Рабочий цех / Станция</label>
              <select
                value={selectedStation}
                onChange={(e) => setSelectedStation(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
              >
                {stationOptions.map(opt => (
                  <option key={opt.id} value={opt.id}>{opt.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-500">Должность / Роль</label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
              >
                {roleOptions.map(role => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setEditingPerson(null)}
                className="flex-1 rounded-xl border border-slate-200 bg-white py-2 text-sm font-bold text-slate-600"
              >
                Отмена
              </button>
              <button
                onClick={handleSave}
                className="flex-1 rounded-xl bg-amber-500 py-2 text-sm font-bold text-white hover:bg-amber-600"
              >
                Сохранить
              </button>
            </div>
          </div>
        ) : (
          staffList.map((person) => (
            <article key={person.id} className="flex min-h-20 items-center gap-3 rounded-3xl bg-slate-50 p-3">
              <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-slate-900 text-lg font-black text-white">{person.avatar}</div>
              <div className="min-w-0 flex-1">
                <p className="text-lg font-black text-slate-950">{person.name}</p>
                <p className="text-sm font-semibold text-slate-500">{person.role} · {person.station} · {person.time}</p>
              </div>
              {isManager && (
                <button
                  onClick={() => handleStartEdit(person)}
                  className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-slate-200 text-slate-700 hover:bg-slate-300 mr-1"
                  aria-label="Редактировать цех"
                >
                  <Settings size={20} />
                </button>
              )}
              <a href={`tel:${person.phone}`} onClick={() => setToast(`Звонок: ${person.name}`)} className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-green-500 text-white" aria-label={`Позвонить ${person.name}`}>
                <Phone size={22} />
              </a>
            </article>
          ))
        )}
      </div>
    </Sheet>
  );
}

function TopMenuSheet({ currentCook, onClose, onOpenProfile, onOpenNotifications, onOpenSchedule, onOpenStaff, onOpenSettings }) {
  const menuItems = [
    { label: "Профиль", description: `${currentCook.name} · ${currentCook.station}`, icon: Users, onClick: onOpenProfile },
    { label: "График", description: "Смены, повара, нагрузка", icon: Clock3, onClick: onOpenSchedule },
    { label: "Люди", description: "Кто сейчас на смене", icon: ChefHat, onClick: onOpenStaff },
    { label: "Уведомления", description: "Сигналы и события смены", icon: Bell, onClick: onOpenNotifications },
    { label: "Настройки", description: "Роль, язык, ресторан, база", icon: Settings, onClick: onOpenSettings },
  ];

  return (
    <Sheet onClose={onClose} title="Меню" eyebrow="Chef OS">
      <div className="space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button key={item.label} onClick={item.onClick} className="flex min-h-16 w-full items-center gap-3 rounded-2xl bg-slate-50 p-3 text-left">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-slate-900 text-white">
                <Icon size={22} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-base font-black text-slate-950">{item.label}</span>
                <span className="block text-sm font-semibold text-slate-500">{item.description}</span>
              </span>
            </button>
          );
        })}
      </div>
    </Sheet>
  );
}

function ScheduleSheet({ onClose, onOpenStaff }) {
  const scheduleRows = [
    { day: "Сегодня, 03 июня", shift: "11:00-22:00", load: "Пик 18:30-21:00", team: "5 поваров", station: "Все цеха" },
    { day: "Чт, 04 июня", shift: "10:00-23:00", load: "Банкет", team: "7 поваров", station: "Горячий + Pass усиление" },
    { day: "Пт, 05 июня", shift: "12:00-00:00", load: "Высокая", team: "8 поваров", station: "Все цеха" },
    { day: "Сб, 06 июня", shift: "12:00-00:00", load: "Полная посадка", team: "9 поваров", station: "Все цеха + суши" },
  ];

  return (
    <Sheet onClose={onClose} title="График" eyebrow="Смены кухни">
      <div className="space-y-3">
        {scheduleRows.map((row) => (
          <article key={row.day} className="rounded-3xl bg-slate-50 p-4">
            <div className="mb-3 flex items-start justify-between gap-3">
              <div>
                <p className="text-lg font-black text-slate-950">{row.day}</p>
                <p className="text-sm font-bold text-slate-500">{row.shift} · {row.load}</p>
              </div>
              <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-black text-amber-700">{row.team}</span>
            </div>
            <p className="text-sm font-bold text-slate-700">{row.station}</p>
            <button onClick={onOpenStaff} className="mt-3 min-h-12 w-full rounded-2xl bg-slate-900 px-4 text-sm font-black text-white">
              Показать людей
            </button>
          </article>
        ))}
      </div>
    </Sheet>
  );
}

function SettingsSheet({ remoteWorkspace, currentCook, resetLoading, onResetDemo, onSwitchWorkspace, onClose }) {
  const canResetDemo = remoteWorkspace.status === "connected" && !resetLoading;

  const handleCopyInvite = () => {
    if (remoteWorkspace.inviteCode) {
      navigator.clipboard.writeText(remoteWorkspace.inviteCode);
      alert("Код приглашения скопирован: " + remoteWorkspace.inviteCode);
    }
  };

  const rows = [
    ["Ресторан", remoteWorkspace.restaurantName || "Chef OS Demo"],
    ["Роль", currentCook?.role || "Повар"],
    ["Язык", "Русский"],
    ["База", getDatabaseLabel(remoteWorkspace)],
  ];

  if (remoteWorkspace.status === "connected" && remoteWorkspace.inviteCode) {
    rows.push(["Код приглашения", remoteWorkspace.inviteCode]);
  }

  return (
    <Sheet onClose={onClose} title="Настройки" eyebrow={remoteWorkspace.restaurantName || "Chef OS"}>
      <div className="space-y-3">
        {rows.map(([label, value]) => (
          <div key={label} className="flex min-h-14 items-center justify-between gap-3 rounded-2xl bg-slate-50 px-4">
            <span className="text-sm font-black text-slate-500">{label}</span>
            {label === "Код приглашения" ? (
              <button
                onClick={handleCopyInvite}
                className="text-right text-sm font-black text-amber-600 hover:text-amber-700"
              >
                {value} (копировать)
              </button>
            ) : (
              <span className="text-right text-sm font-black text-slate-950">{value}</span>
            )}
          </div>
        ))}

        {remoteWorkspace.status === "connected" && (
          <button
            onClick={() => {
              localStorage.removeItem("chef-os:intro-seen");
              alert("Состояние приветствия сброшено. Слайды будут показаны при смене кухни или новом входе.");
            }}
            className="flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-black text-slate-700 hover:bg-slate-50"
          >
            <Sparkles size={18} className="text-amber-500 animate-pulse" />
            Показать приветствие снова
          </button>
        )}

        {remoteWorkspace.status === "connected" && (
          <button
            onClick={onSwitchWorkspace}
            className="flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-black text-slate-700 hover:bg-slate-50"
          >
            Сменить кухню / Выйти
          </button>
        )}

        <button
          onClick={onResetDemo}
          disabled={!canResetDemo}
          className="flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 text-sm font-black text-white disabled:bg-slate-300"
        >
          <RotateCcw size={18} />
          {resetLoading ? "Очищаю demo..." : "Очистить demo данные"}
        </button>
      </div>
    </Sheet>
  );
}

function OnboardingScreen({ onCreate, onJoin, onDemo, loading }) {
  const [restName, setRestName] = React.useState("");
  const [inviteCode, setInviteCode] = React.useState("");
  const [mode, setMode] = React.useState(null);
  const [introSeen, setIntroSeen] = React.useState(() => {
    return localStorage.getItem("chef-os:intro-seen") === "true";
  });
  const [currentSlide, setCurrentSlide] = React.useState(0);

  const finishIntro = () => {
    localStorage.setItem("chef-os:intro-seen", "true");
    setIntroSeen(true);
  };

  const slides = [
    {
      id: "shift",
      title: "Контролируйте смену",
      description: "Единый экран для всех цехов: горячие задачи, стоп-листы и чек-листы готовности кухни к сервису.",
      icon: ChefHat,
      bgColor: "bg-amber-500/10",
      textColor: "text-amber-600",
      gradient: "from-amber-500/10 to-orange-500/5",
    },
    {
      id: "inventory",
      title: "Быстрая связь со складом",
      description: "Сообщайте су-шефу о заканчивающихся продуктах в один тап прямо во время запары на сервисе.",
      icon: Package,
      bgColor: "bg-emerald-500/10",
      textColor: "text-emerald-600",
      gradient: "from-emerald-500/10 to-teal-500/5",
    },
    {
      id: "recipes",
      title: "Себестоимость под контролем",
      description: "Технико-технологические карты с составом брутто/нетто, наценкой и автоматическим расчетом Food Cost при изменении цен поставщика.",
      icon: Utensils,
      bgColor: "bg-rose-500/10",
      textColor: "text-rose-600",
      gradient: "from-rose-500/10 to-pink-500/5",
    },
    {
      id: "chat",
      title: "Слаженная команда",
      description: "Внутренний чат, который автоматически показывает имя повара и его рабочий цех для мгновенной координации.",
      icon: MessageCircle,
      bgColor: "bg-indigo-500/10",
      textColor: "text-indigo-600",
      gradient: "from-indigo-500/10 to-blue-500/5",
    },
  ];

  if (!introSeen) {
    const slide = slides[currentSlide];
    const Icon = slide.icon;

    return (
      <div className="mx-auto my-6 max-w-md overflow-hidden rounded-3xl border border-slate-200/80 bg-white/90 p-6 shadow-soft backdrop-blur-md transition-all duration-300">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-amber-500 animate-ping"></span>
            <span className="text-xs font-black uppercase tracking-wider text-slate-400">Chef OS Обзор</span>
          </div>
          <button
            onClick={finishIntro}
            className="text-xs font-black text-slate-400 hover:text-slate-600 transition-colors"
          >
            Пропустить
          </button>
        </div>

        <div className={`rounded-2xl bg-gradient-to-br ${slide.gradient} p-8 text-center border border-slate-100/50`}>
          <div className={`mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-[2rem] ${slide.bgColor} ${slide.textColor} shadow-inner transition-transform duration-300 hover:scale-110`}>
            <Icon size={44} className="animate-pulse" />
          </div>
          <h2 className="text-lg font-black text-slate-900 leading-tight min-h-[56px] flex items-center justify-center">
            {slide.title}
          </h2>
          <p className="mt-3 text-sm font-semibold text-slate-500 leading-relaxed min-h-[80px]">
            {slide.description}
          </p>
        </div>

        <div className="flex justify-center gap-2 my-6">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                index === currentSlide ? "w-6 bg-slate-900" : "w-2.5 bg-slate-200 hover:bg-slate-300"
              }`}
              aria-label={`Перейти к слайду ${index + 1}`}
            />
          ))}
        </div>

        <div className="flex gap-3">
          {currentSlide > 0 && (
            <button
              onClick={() => setCurrentSlide((c) => c - 1)}
              className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 active:scale-[0.98] transition-all"
              aria-label="Назад"
            >
              <ChevronLeft size={20} />
            </button>
          )}
          
          <button
            onClick={() => {
              if (currentSlide === slides.length - 1) {
                finishIntro();
              } else {
                setCurrentSlide((c) => c + 1);
              }
            }}
            className="flex-1 flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-slate-900 font-black text-white shadow-md hover:bg-slate-800 active:scale-[0.98] transition-all"
          >
            <span>{currentSlide === slides.length - 1 ? "Начать работу" : "Далее"}</span>
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto my-6 max-w-md overflow-hidden rounded-3xl border border-slate-200/80 bg-white/90 p-6 shadow-soft backdrop-blur-md">
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600">
          <ChefHat size={32} className="animate-pulse" />
        </div>
        <h2 className="text-xl font-black text-slate-900">Добро пожаловать в Chef OS</h2>
        <p className="mt-2 text-sm font-semibold text-slate-500">Выберите или создайте рабочее пространство для вашей кухни</p>
      </div>

      <div className="mt-8 space-y-4">
        {mode === null && (
          <>
            <button
              onClick={() => setMode("create")}
              className="flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-slate-50/50 p-4 transition-all hover:border-amber-500 hover:bg-amber-50/10 text-left"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500 text-white">
                  <Plus size={20} />
                </div>
                <div>
                  <div className="font-black text-slate-800">Создать новую кухню</div>
                  <div className="text-xs font-semibold text-slate-400">Для шеф-поваров и владельцев</div>
                </div>
              </div>
            </button>

            <button
              onClick={() => setMode("join")}
              className="flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-slate-50/50 p-4 transition-all hover:border-emerald-500 hover:bg-emerald-50/10 text-left"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500 text-white">
                  <Users size={20} />
                </div>
                <div>
                  <div className="font-black text-slate-800">Присоединиться по коду</div>
                  <div className="text-xs font-semibold text-slate-400">Для су-шефов, поваров и закупщиков</div>
                </div>
              </div>
            </button>

            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-slate-200"></div>
              <span className="flex-shrink mx-4 text-xs font-bold text-slate-400">или</span>
              <div className="flex-grow border-t border-slate-200"></div>
            </div>

            <button
              onClick={onDemo}
              disabled={loading}
              className="flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 font-black text-white shadow-md transition-all hover:bg-slate-800 disabled:opacity-50"
            >
              <Sparkles size={18} />
              Открыть демо-кухню
            </button>
          </>
        )}

        {mode === "create" && (
          <div className="space-y-4">
            <h3 className="font-black text-slate-800">Создание нового проекта</h3>
            <div>
              <label className="text-xs font-bold text-slate-500">Название кухни / ресторана</label>
              <input
                type="text"
                placeholder="Например, Ресторан Облака"
                value={restName}
                onChange={(e) => setRestName(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setMode(null)}
                className="flex-1 rounded-xl border border-slate-200 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50"
              >
                Назад
              </button>
              <button
                onClick={() => onCreate(restName)}
                disabled={loading || !restName.trim()}
                className="flex-1 rounded-xl bg-amber-500 py-3 text-sm font-bold text-white hover:bg-amber-600 disabled:opacity-50"
              >
                {loading ? "Создание..." : "Создать"}
              </button>
            </div>
          </div>
        )}

        {mode === "join" && (
          <div className="space-y-4">
            <h3 className="font-black text-slate-800">Присоединение к проекту</h3>
            <div>
              <label className="text-xs font-bold text-slate-500">Код приглашения (Invite Code)</label>
              <input
                type="text"
                placeholder="CHEF-XXXX-XXXX"
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setMode(null)}
                className="flex-1 rounded-xl border border-slate-200 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50"
              >
                Назад
              </button>
              <button
                onClick={() => onJoin(inviteCode)}
                disabled={loading || !inviteCode.trim()}
                className="flex-1 rounded-xl bg-emerald-500 py-3 text-sm font-bold text-white hover:bg-emerald-600 disabled:opacity-50"
              >
                {loading ? "Вход..." : "Присоединиться"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ProfileSheet({ cook, stationGuides, onClose, setSelectedStation }) {
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

function RecipeSheet({ recipe, inventoryItems, onClose, onUpdateRecipeCosting, onUpdateRecipeIngredients, setToast }) {
  const [recipeTab, setRecipeTab] = React.useState("steps");
  
  // Costing tab states
  const [salesPriceInput, setSalesPriceInput] = React.useState(recipe.salesPrice || 0);
  const [targetMargin, setTargetMargin] = React.useState(recipe.targetMarginPercent || 70);
  const [costingLoading, setCostingLoading] = React.useState(false);

  // Sync state if recipe changes
  React.useEffect(() => {
    setSalesPriceInput(recipe.salesPrice || 0);
    setTargetMargin(recipe.targetMarginPercent || 70);
  }, [recipe]);

  // Ingredients editing states
  const [isEditingIngredients, setIsEditingIngredients] = React.useState(false);
  const [editingIngredients, setEditingIngredients] = React.useState([]);
  const [selectedNewItem, setSelectedNewItem] = React.useState("");

  const handleStartEditIngredients = () => {
    setEditingIngredients((recipe.ingredients || []).map(ing => ({
      itemId: ing.itemId,
      gross: ing.gross,
      net: ing.net,
      name: ing.name,
      unitLabel: ing.unitLabel
    })));
    setIsEditingIngredients(true);
  };

  const handleAddIngredient = () => {
    if (!selectedNewItem) return;
    const item = inventoryItems.find(i => i.id === selectedNewItem);
    if (!item) return;

    // Check if already in the list
    if (editingIngredients.some(ing => ing.itemId === item.id)) {
      setToast("Этот ингредиент уже добавлен");
      return;
    }

    setEditingIngredients(current => [
      ...current,
      {
        itemId: item.id,
        gross: 0.1, // default 100g
        net: 0.08,  // default 80g
        name: item.name,
        unitLabel: item.unitLabel
      }
    ]);
    setSelectedNewItem("");
  };

  const handleRemoveIngredient = (itemId) => {
    setEditingIngredients(current => current.filter(ing => ing.itemId !== itemId));
  };

  const handleIngredientValueChange = (itemId, field, value) => {
    setEditingIngredients(current => current.map(ing => {
      if (ing.itemId === itemId) {
        return {
          ...ing,
          [field]: Number(value) || 0
        };
      }
      return ing;
    }));
  };

  const handleSaveIngredients = async () => {
    try {
      await onUpdateRecipeIngredients(recipe.id, editingIngredients);
      setIsEditingIngredients(false);
    } catch (err) {
      setToast(`Ошибка при сохранении: ${err.message}`);
    }
  };

  const handleSaveCosting = async () => {
    setCostingLoading(true);
    try {
      await onUpdateRecipeCosting(recipe.id, salesPriceInput, targetMargin);
    } catch (err) {
      setToast(`Ошибка: ${err.message}`);
    } finally {
      setCostingLoading(false);
    }
  };

  // Math for costing
  const foodCostNum = recipe.costNum || 0;
  const salesPriceNum = Number(salesPriceInput) || 0;
  
  // Food cost % of sales price
  const foodCostPercent = salesPriceNum > 0 ? (foodCostNum / salesPriceNum) * 100 : 0;
  
  // Realized margin %
  const marginPercent = salesPriceNum > 0 ? ((salesPriceNum - foodCostNum) / salesPriceNum) * 100 : 0;

  // Realized markup %
  const markupPercent = foodCostNum > 0 ? ((salesPriceNum - foodCostNum) / foodCostNum) * 100 : 0;

  return (
    <Sheet onClose={onClose} title={recipe.title} eyebrow={recipe.category}>
      <div className="mb-4 h-36 overflow-hidden rounded-3xl bg-amber-100">
        <img src={recipe.image} alt="" className="h-full w-full object-cover" />
      </div>

      <div className="grid grid-cols-3 gap-2">
        <Metric label="Время" value={recipe.time} />
        <Metric label="Выход" value={recipe.yield} />
        <Metric label="Себестоимость" value={recipe.cost} />
      </div>

      {/* Tabs */}
      <div className="mt-4 flex gap-1 border-b border-slate-100 pb-2">
        {["steps", "composition", "costing"].map(tab => (
          <button
            key={tab}
            onClick={() => {
              setRecipeTab(tab);
              setIsEditingIngredients(false);
            }}
            className={`flex-1 py-2 text-center text-xs font-black rounded-xl transition-all ${
              recipeTab === tab
                ? "bg-slate-900 text-white shadow-sm"
                : "bg-slate-50 text-slate-600 hover:bg-slate-100"
            }`}
          >
            {tab === "steps" ? "Приготовление" : tab === "composition" ? "Состав" : "Калькуляция"}
          </button>
        ))}
      </div>

      {/* Steps Tab */}
      {recipeTab === "steps" && (
        <div className="mt-4 rounded-3xl bg-slate-50 p-4">
          <p className="text-sm font-black text-slate-500">Шаги</p>
          <ol className="mt-2 space-y-2">
            {recipe.steps && recipe.steps.length > 0 ? (
              recipe.steps.map((step, index) => (
                <li key={step} className="flex gap-2 text-sm font-bold text-slate-800">
                  <span className="text-amber-600 font-black">{index + 1}.</span>
                  {step}
                </li>
              ))
            ) : (
              <p className="text-sm font-semibold text-slate-500 text-center py-4 bg-slate-50 rounded-2xl">Шаги приготовления не заполнены</p>
            )}
          </ol>
        </div>
      )}

      {/* Composition (Ingredients) Tab */}
      {recipeTab === "composition" && (
        <div className="mt-4 space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-black text-slate-500">Ингредиенты (на {recipe.yield})</p>
            {!isEditingIngredients && (
              <button
                onClick={handleStartEditIngredients}
                className="text-xs font-black text-amber-600 hover:text-amber-700 bg-amber-50 px-3 py-1.5 rounded-xl transition-colors"
              >
                Редактировать состав
              </button>
            )}
          </div>

          {isEditingIngredients ? (
            <div className="space-y-3 bg-slate-50 p-3 rounded-3xl">
              <div className="space-y-3 max-h-[30vh] overflow-y-auto no-scrollbar">
                {editingIngredients.map((ing, idx) => (
                  <div key={ing.itemId} className="flex flex-col gap-2 bg-white p-3 rounded-2xl border border-slate-100">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-black text-slate-950 truncate max-w-[80%]">{ing.name}</span>
                      <button 
                        onClick={() => handleRemoveIngredient(ing.itemId)}
                        className="text-red-500 hover:text-red-700 font-bold text-xs"
                      >
                        Удалить
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase">Брутто ({ing.unitLabel})</label>
                        <input
                          type="number"
                          step="0.001"
                          min="0"
                          value={ing.gross}
                          onChange={(e) => handleIngredientValueChange(ing.itemId, "gross", e.target.value)}
                          className="w-full h-8 px-2 font-bold text-slate-950 text-xs rounded-xl border border-slate-200"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase">Нетто ({ing.unitLabel})</label>
                        <input
                          type="number"
                          step="0.001"
                          min="0"
                          value={ing.net}
                          onChange={(e) => handleIngredientValueChange(ing.itemId, "net", e.target.value)}
                          className="w-full h-8 px-2 font-bold text-slate-950 text-xs rounded-xl border border-slate-200"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add New Ingredient Selector */}
              <div className="border-t border-slate-200 pt-3">
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Добавить ингредиент</label>
                <div className="flex gap-2">
                  <select
                    value={selectedNewItem}
                    onChange={(e) => setSelectedNewItem(e.target.value)}
                    className="flex-1 h-9 px-2 font-bold text-xs text-slate-800 rounded-xl border border-slate-200 bg-white"
                  >
                    <option value="">-- Выберите продукт --</option>
                    {inventoryItems
                      .filter(item => !editingIngredients.some(ing => ing.itemId === item.id))
                      .map(item => (
                        <option key={item.id} value={item.id}>{item.name} ({item.unitLabel})</option>
                      ))}
                  </select>
                  <button
                    onClick={handleAddIngredient}
                    className="h-9 px-3 bg-slate-900 text-white font-black text-xs rounded-xl hover:bg-slate-800"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={handleSaveIngredients}
                  className="flex-1 h-10 bg-green-600 text-white text-xs font-black rounded-xl hover:bg-green-700 shadow-sm"
                >
                  Сохранить состав
                </button>
                <button
                  onClick={() => setIsEditingIngredients(false)}
                  className="flex-1 h-10 bg-slate-200 text-slate-700 text-xs font-black rounded-xl hover:bg-slate-300"
                >
                  Отмена
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex text-[10px] font-black uppercase text-slate-400 px-2">
                <span className="flex-[2] min-w-0">Продукт</span>
                <span className="flex-1 text-right">Брутто</span>
                <span className="flex-1 text-right">Нетто</span>
                <span className="flex-1 text-right">Себест.</span>
              </div>
              {recipe.ingredients && recipe.ingredients.length > 0 ? (
                recipe.ingredients.map(ing => (
                  <div key={ing.itemId || ing.name} className="flex items-center text-sm font-bold text-slate-800 bg-slate-50 p-2.5 rounded-2xl">
                    <span className="flex-[2] truncate pr-1">{ing.name}</span>
                    <span className="flex-1 text-right">{ing.gross.toFixed(3)} {ing.unitLabel}</span>
                    <span className="flex-1 text-right">{ing.net.toFixed(3)} {ing.unitLabel}</span>
                    <span className="flex-1 text-right text-slate-900 font-extrabold">{ing.calculatedCost.toFixed(2)} EUR</span>
                  </div>
                ))
              ) : (
                <p className="text-sm font-semibold text-slate-500 text-center py-4 bg-slate-50 rounded-2xl">Состав не заполнен</p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Costing (Margin/Markup Calc) Tab */}
      {recipeTab === "costing" && (
        <div className="mt-4 space-y-4">
          <p className="text-sm font-black text-slate-500">Экономические показатели блюда</p>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-50 p-3 rounded-2xl">
              <p className="text-[10px] font-black uppercase text-slate-400">Себестоимость</p>
              <p className="text-lg font-black text-slate-950 mt-1">{foodCostNum.toFixed(2)} EUR</p>
            </div>
            <div className="bg-slate-50 p-3 rounded-2xl">
              <p className="text-[10px] font-black uppercase text-slate-400">Фуд-кост %</p>
              <p className={`text-lg font-black mt-1 ${foodCostPercent > 30 ? "text-red-500 animate-pulse" : "text-green-600"}`}>
                {foodCostPercent > 0 ? `${foodCostPercent.toFixed(1)}%` : "н/д"}
              </p>
            </div>
            <div className="bg-slate-50 p-3 rounded-2xl">
              <p className="text-[10px] font-black uppercase text-slate-400">Маржинальность</p>
              <p className="text-lg font-black text-slate-950 mt-1">
                {marginPercent > 0 ? `${marginPercent.toFixed(1)}%` : "н/д"}
              </p>
            </div>
            <div className="bg-slate-50 p-3 rounded-2xl">
              <p className="text-[10px] font-black uppercase text-slate-400">Наценка</p>
              <p className="text-lg font-black text-slate-950 mt-1">
                {markupPercent > 0 ? `${markupPercent.toFixed(0)}%` : "н/д"}
              </p>
            </div>
          </div>

          {foodCostPercent > 30 && (
            <div className="flex gap-2 bg-red-50 border border-red-200 text-red-700 text-xs font-bold leading-relaxed p-3.5 rounded-2xl">
              <AlertTriangle className="shrink-0 text-red-500" size={18} />
              <span>
                Предупреждение: Высокий фудкост блюда ({foodCostPercent.toFixed(1)}% &gt; 30%)! Рекомендуется увеличить цену продажи или сократить закладки.
              </span>
            </div>
          )}

          {/* Pricing settings form */}
          <div className="space-y-3 border-t border-slate-100 pt-3">
            <div>
              <label className="block text-xs font-black text-slate-700 mb-1">Цена продажи гостю (EUR)</label>
              <input
                type="number"
                step="0.1"
                min="0"
                value={salesPriceInput}
                onChange={(e) => setSalesPriceInput(e.target.value)}
                className="w-full h-11 px-3 font-bold text-slate-950 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-slate-50"
              />
            </div>
            <div>
              <label className="block text-xs font-black text-slate-700 mb-1">Целевой процент маржи (%)</label>
              <input
                type="number"
                step="1"
                min="0"
                max="100"
                value={targetMargin}
                onChange={(e) => setTargetMargin(e.target.value)}
                className="w-full h-11 px-3 font-bold text-slate-950 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-slate-50"
              />
            </div>

            <button
              onClick={handleSaveCosting}
              disabled={costingLoading}
              className="w-full h-11 bg-slate-900 text-white font-black text-xs rounded-2xl hover:bg-slate-800 transition-colors shadow-sm disabled:opacity-50"
            >
              {costingLoading ? "Сохранение..." : "Сохранить калькуляцию"}
            </button>
          </div>
        </div>
      )}
    </Sheet>
  );
}

function BaseScreen({ inventoryItems, onUpdateIngredientPrice }) {
  const [query, setQuery] = React.useState("");
  const [editingItem, setEditingItem] = React.useState(null);
  
  const filteredItems = inventoryItems.filter(item => 
    item.name.toLowerCase().includes(query.toLowerCase()) ||
    item.supplier.toLowerCase().includes(query.toLowerCase())
  );
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-black text-slate-900">База ингредиентов</h2>
      </div>
      
      <SearchBox value={query} onChange={setQuery} />
      
      <div className="grid gap-3 lg:grid-cols-2">
        {filteredItems.map(item => (
          <div key={item.id} className="flex min-h-24 w-full items-center justify-between gap-3 rounded-3xl bg-white p-4 shadow-sm">
            <div className="min-w-0 flex-1">
              <p className="text-lg font-black text-slate-950 truncate">{item.name}</p>
              <div className="mt-1.5 flex flex-wrap gap-2 text-xs font-semibold text-slate-500">
                <span>Цех: {item.station}</span>
                <span>•</span>
                <span>Поставщик: {item.supplier}</span>
              </div>
              <div className="mt-2.5 flex gap-3">
                <div className="bg-slate-50 px-3 py-1.5 rounded-2xl text-xs font-bold text-slate-700">
                  Цена: <span className="text-slate-950 font-black">{item.costPerUnit.toFixed(2)} EUR</span> / {item.unitLabel}
                </div>
                <div className="bg-slate-50 px-3 py-1.5 rounded-2xl text-xs font-bold text-slate-700">
                  Потери: <span className="text-slate-950 font-black">{(item.lossPercent * 100).toFixed(0)}%</span>
                </div>
              </div>
            </div>
            
            <button 
              onClick={() => setEditingItem(item)}
              className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-amber-500 text-white hover:bg-amber-600 transition-colors shadow-sm"
              aria-label="Редактировать цену"
            >
              <Settings size={20} />
            </button>
          </div>
        ))}
        {filteredItems.length === 0 && (
          <div className="rounded-3xl bg-white p-6 text-center shadow-sm lg:col-span-2">
            <Package className="mx-auto mb-3 text-slate-300" size={34} />
            <p className="text-lg font-black text-slate-950">Ингредиенты не найдены</p>
            <p className="mt-1 text-sm font-semibold text-slate-500">Проверь запрос поиска.</p>
          </div>
        )}
      </div>

      {editingItem && (
        <IngredientEditSheet 
          item={editingItem} 
          onClose={() => setEditingItem(null)} 
          onSave={(price, loss) => {
            onUpdateIngredientPrice(editingItem.id, price, loss);
            setEditingItem(null);
          }}
        />
      )}
    </div>
  );
}

function IngredientEditSheet({ item, onClose, onSave }) {
  const [price, setPrice] = React.useState(item.costPerUnit);
  const [loss, setLoss] = React.useState(item.lossPercent * 100);
  
  const handleSave = () => {
    onSave(Number(price) || 0, (Number(loss) || 0) / 100);
  };
  
  return (
    <Sheet onClose={onClose} title={`Редактирование: ${item.name}`} eyebrow="База ингредиентов">
      <div className="space-y-4 mt-2">
        <div>
          <label className="block text-sm font-black text-slate-700 mb-1">Цена за единицу (EUR / {item.unitLabel})</label>
          <input 
            type="number" 
            step="0.01" 
            min="0" 
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full h-12 px-4 font-bold text-slate-950 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-slate-50"
          />
        </div>
        <div>
          <label className="block text-sm font-black text-slate-700 mb-1">Процент отходов/потерь при обработке (%)</label>
          <input 
            type="number" 
            step="1" 
            min="0" 
            max="100" 
            value={loss}
            onChange={(e) => setLoss(e.target.value)}
            className="w-full h-12 px-4 font-bold text-slate-950 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-slate-50"
          />
          <p className="mt-1 text-xs text-slate-500 font-semibold leading-relaxed">
            Указывает процент отходов при чистке, нарезке или тепловой обработке. Например, 15% для чистки картофеля.
          </p>
        </div>
        
        <button 
          onClick={handleSave}
          className="w-full h-12 mt-2 bg-slate-900 text-white font-black rounded-2xl hover:bg-slate-800 transition-colors shadow-sm"
        >
          Сохранить изменения
        </button>
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

function QuickPanel({ activeTab, currentCook, onClose, onAction }) {
  const actionsCatalog = {
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
    base: [
      { id: "price-update", group: "Цены", label: "Обновить цены", description: "Зафиксировать изменение цен у поставщиков", tone: "amber", event: "Обновил прайс-лист ингредиентов", meta: "База" },
    ],
  };

  const actions = actionsCatalog[activeTab];
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

function createSeedOperationalState() {
  return {
    tasks: initialTasks,
    generalChecklist: initialGeneralChecklist,
    stationChecklists: initialStationChecklists,
    inventoryItems: initialInventoryItems,
    inventoryReports: [],
    activity: initialActivity,
    chatMessages: messages,
    savedAt: null,
    source: "seed",
  };
}

function readOperationalCache() {
  const seed = createSeedOperationalState();

  try {
    const rawCache = window.localStorage.getItem(OPERATIONAL_CACHE_KEY);
    if (!rawCache) {
      return seed;
    }

    const parsedCache = JSON.parse(rawCache);
    if (parsedCache?.version !== OPERATIONAL_CACHE_VERSION || !parsedCache?.data) {
      return seed;
    }

    const data = parsedCache.data;

    return {
      tasks: Array.isArray(data.tasks) ? data.tasks : seed.tasks,
      generalChecklist: Array.isArray(data.generalChecklist) ? data.generalChecklist : seed.generalChecklist,
      stationChecklists: data.stationChecklists && typeof data.stationChecklists === "object" ? data.stationChecklists : seed.stationChecklists,
      inventoryItems: Array.isArray(data.inventoryItems) ? data.inventoryItems : seed.inventoryItems,
      inventoryReports: Array.isArray(data.inventoryReports) ? data.inventoryReports : seed.inventoryReports,
      activity: Array.isArray(data.activity) ? data.activity : seed.activity,
      chatMessages: Array.isArray(data.chatMessages) ? data.chatMessages : seed.chatMessages,
      staff: Array.isArray(data.staff) ? data.staff : seed.staff,
      recipes: Array.isArray(data.recipes) ? data.recipes : seed.recipes,
      stationGuides: Array.isArray(data.stationGuides) ? data.stationGuides : seed.stationGuides,
      currentShift: data.currentShift && typeof data.currentShift === "object" ? data.currentShift : seed.currentShift,
      savedAt: typeof parsedCache.savedAt === "string" ? parsedCache.savedAt : null,
      source: "cache",
    };
  } catch {
    return seed;
  }
}

function writeOperationalCache(snapshot) {
  try {
    const savedAt = new Date().toISOString();

    window.localStorage.setItem(
      OPERATIONAL_CACHE_KEY,
      JSON.stringify({
        version: OPERATIONAL_CACHE_VERSION,
        savedAt,
        data: {
          ...snapshot,
        },
      })
    );

    return savedAt;
  } catch {
    return null;
  }
}

function getAccountDisplayName(session) {
  if (!session?.user) {
    return "Chef";
  }

  return session.user.user_metadata?.full_name || session.user.user_metadata?.name || session.user.email || "Chef";
}

function getInitials(value) {
  if (!value) {
    return "?";
  }

  const words = value
    .replace(/@.*/, "")
    .split(/\s+/)
    .filter(Boolean);
  const initials = words.slice(0, 2).map((word) => word[0]).join("");

  return initials.toUpperCase() || "?";
}

function useNow() {
  const [now, setNow] = React.useState(() => new Date());

  React.useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 60000);
    return () => window.clearInterval(timer);
  }, []);

  return now;
}

function useOnlineStatus() {
  const [isOnline, setIsOnline] = React.useState(() => navigator.onLine);

  React.useEffect(() => {
    function handleOnline() {
      setIsOnline(true);
    }

    function handleOffline() {
      setIsOnline(false);
    }

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return isOnline;
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

function formatCacheTime(value) {
  return new Intl.DateTimeFormat("ru-RU", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function getDatabaseLabel(remoteWorkspace, session = null) {
  if (!isSupabaseConfigured) {
    return "Demo mode";
  }

  if (remoteWorkspace.status === "loading") {
    return "Supabase загружается";
  }

  if (remoteWorkspace.status === "connected") {
    return "Supabase подключен";
  }

  if (remoteWorkspace.status === "error") {
    return "Supabase ошибка";
  }

  if (!session) {
    return "Supabase готов, нужен Google вход";
  }

  return "Supabase ожидает вход";
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
    base: "Быстрое действие базы",
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
    <nav className="absolute bottom-3 left-1/2 z-10 grid w-[calc(100%-2rem)] max-w-[28rem] -translate-x-1/2 grid-cols-6 rounded-[1.75rem] border border-slate-200 bg-white/95 p-1.5 shadow-soft backdrop-blur">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const active = activeTab === tab.id;
        return (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex min-h-16 flex-col items-center justify-center gap-1 rounded-3xl text-[10px] font-black ${active ? "bg-slate-900 text-white" : "text-slate-500"}`}>
            <Icon size={20} strokeWidth={active ? 3 : 2.4} />
            <span>{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}

function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) {
    return;
  }

  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/service-worker.js").catch((error) => {
      console.error("Chef OS service worker registration failed", error);
    });
  });
}

registerServiceWorker();

const rootElement = document.getElementById("root");
if (rootElement) {
  createRoot(rootElement).render(<App />);
}
