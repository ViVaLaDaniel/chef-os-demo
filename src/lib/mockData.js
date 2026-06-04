import {
  Home,
  Utensils,
  Database,
  Package,
  ListChecks,
  MessageCircle,
} from "lucide-react";

export const tabs = [
  { id: "shift", label: "Смена", icon: Home },
  { id: "recipes", label: "ТТК", icon: Utensils },
  { id: "base", label: "База", icon: Database },
  { id: "inventory", label: "Склад", icon: Package },
  { id: "stations", label: "Цеха", icon: ListChecks },
  { id: "chat", label: "Чат", icon: MessageCircle },
];

export const staff = [
  { id: 1, name: "Олег", role: "Су-шеф", station: "Pass", stationId: "pass", time: "09:00-18:00", status: "На смене", phone: "+48123123123", avatar: "О", instruction: "Держать pass, подтверждать стоп-лист, снимать блокеры цехов до пика." },
  { id: 2, name: "Ирина", role: "Повар", station: "Холодный цех", stationId: "cold", time: "11:00-22:00", status: "На смене", phone: "+48123123124", avatar: "И", instruction: "Твой фокус: тартар, салаты, холодная подача. Проверяй рыбу, соусы, аллергены и чистоту доски перед каждым блоком." },
  { id: 3, name: "Матеуш", role: "Повар", station: "Горячий цех", stationId: "hot", time: "12:00-23:00", status: "Ожидается", phone: "+48123123125", avatar: "М", instruction: "Подготовить линию к 17:30, держать термощуп рядом, согласовывать отдачу с pass." },
  { id: 4, name: "Саша", role: "Повар", station: "Заготовочный", stationId: "prep", time: "08:00-16:00", status: "На смене", phone: "+48123123126", avatar: "С", instruction: "Маркировать контейнеры сразу после заготовки, сигналить остатки ниже нормы, не оставлять продукт без даты." },
  { id: 5, name: "Ника", role: "Повар", station: "Суши", stationId: "sushi", time: "14:00-23:00", status: "Ожидается", phone: "+48123123127", avatar: "Н", instruction: "Проверить рис, нори, соевый соус и чистый нож. Любой вопрос по рыбе сразу в pass." },
];

export const currentCookDefault = staff[1];

export const currentShift = {
  title: "Вечерняя смена",
  date: "2026-06-03",
  startsAt: "11:00",
  endsAt: "22:00",
  peakWindow: "18:30-21:00",
};

export const universalInstructions = [
  "Мой руки перед стартом, после сырого продукта, телефона, мусора и перчаток.",
  "Аллергены держи отдельно: доска, нож, соус, контейнер и ложка не смешиваются.",
  "Нет устных изменений ТТК: если не хватает продукта, ставь сигнал и жди подтверждение су-шефа.",
  "Любой риск по температуре, запаху, сроку или упаковке сразу в стоп-сигнал.",
];

export const initialGeneralChecklist = [
  { id: "brief", title: "Короткий бриф смены проведен", station: "Команда", done: true },
  { id: "stop", title: "Стоп-лист подтвержден у pass", station: "Pass", done: false },
  { id: "allergens", title: "VIP и аллергены сверены", station: "Pass", done: false },
  { id: "stock", title: "Критичные остатки проверены", station: "Склад", done: false },
  { id: "hygiene", title: "Гигиена и маркировка проверены", station: "Все цеха", done: false },
];

export const stationGuides = [
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

export const phaseLabels = {
  setup: "До сервиса",
  service: "Во время сервиса",
  close: "Закрытие",
};

export function makeChecklist(items, prefix) {
  return items.map((title, index) => ({
    id: `${prefix}-${index + 1}`,
    title,
    done: index === 0,
  }));
}

export const initialStationChecklists = Object.fromEntries(
  stationGuides.map((station) => [
    station.id,
    {
      setup: makeChecklist(station.setup, `${station.id}-setup`),
      service: makeChecklist(station.service, `${station.id}-service`),
      close: makeChecklist(station.close, `${station.id}-close`),
    },
  ])
);

export const initialTasks = [
  { id: 1, title: "Принять рыбу и температуру", station: "Склад", due: "10:45", done: false, priority: "critical" },
  { id: 2, title: "Бер блан 2 литра", station: "Горячий цех", due: "12:00", done: false, priority: "normal" },
  { id: 3, title: "Обновить стоп-лист по тунцу", station: "Pass", due: "сейчас", done: false, priority: "critical" },
  { id: 4, title: "Фото эталона тартара", station: "Холодный цех", due: "14:30", done: true, priority: "normal" },
];

export const stopList = [
  { id: 1, item: "Тунец Bluefin", reason: "Поставка на проверке", station: "Холодный цех" },
  { id: 2, item: "Пюре батат", reason: "Осталось на 4 порции", station: "Горячий цех" },
];

export const initialInventoryItems = [
  { id: 1, name: "Тунец", station: "Холодный цех", stock: "1 лоток", par: "4 лотка", status: "critical", supplier: "Nord Fish", costPerUnit: 22.00, lossPercent: 0.10, unitLabel: "лоток" },
  { id: 2, name: "Сливочное масло", station: "Горячий цех", stock: "2 пачки", par: "8 пачек", status: "low", supplier: "Prime Market", costPerUnit: 4.50, lossPercent: 0.02, unitLabel: "пачка" },
  { id: 3, name: "Соевый соус", station: "Суши", stock: "1 банка", par: "6 банок", status: "low", supplier: "Asian Pro", costPerUnit: 6.20, lossPercent: 0.00, unitLabel: "банка" },
  { id: 4, name: "Микс зелени", station: "Холодный цех", stock: "норма", par: "3 бокса", status: "ok", supplier: "Bio Herbs", costPerUnit: 2.40, lossPercent: 0.15, unitLabel: "бокс" },
];

export const recipes = [
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

export const recipeFilters = ["Все", "Закуски", "Супы", "Горячее", "Соусы"];

export const initialActivity = [
  { id: 1, actor: "Олег", action: "Поставил тунца в стоп-лист", meta: "Pass", time: "10:08", tone: "red" },
  { id: 2, actor: "Ирина", action: "Отметила: соевый соус, осталась 1 банка", meta: "Суши", time: "10:14", tone: "amber" },
  { id: 3, actor: "Саша", action: "Закрыл задачу по фото эталона", meta: "Холодный цех", time: "10:20", tone: "green" },
];

export const messages = [
  { id: 1, from: "Олег", text: "Рыба приехала. Проверяю температуру.", mine: false, time: "10:18" },
  { id: 2, from: "Chef", text: "Принять только после фото накладной.", mine: true, time: "10:19" },
  { id: 3, from: "Ирина", text: "Соус бер блан готов, держу на водяной.", mine: false, time: "10:24" },
];
