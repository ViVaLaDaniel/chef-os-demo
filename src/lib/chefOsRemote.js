import { supabase } from "./supabase";

const STOCK_LEVEL_MAP = {
  "мало": "low",
  "осталась 1 банка": "one_left",
  "закончилось": "empty",
};

const STOCK_LEVEL_LABELS = {
  low: "мало",
  one_left: "осталась 1 банка",
  empty: "закончилось",
};

const REPORT_STATUS_LABELS = {
  new: "Новая",
  confirmed: "Подтверждена",
  ordered: "Заказана",
  delivered: "Доставлена",
  rejected: "Отклонена",
};

export async function bootstrapAndLoadChefOsWorkspace() {
  if (!supabase) {
    return null;
  }

  const { data: bootstrapRows, error: bootstrapError } = await supabase.rpc("bootstrap_demo_workspace");
  if (bootstrapError) {
    throw bootstrapError;
  }

  const restaurantId = Array.isArray(bootstrapRows) ? bootstrapRows[0]?.restaurant_id : bootstrapRows?.restaurant_id;
  if (!restaurantId) {
    throw new Error("Chef OS workspace bootstrap did not return restaurant_id");
  }

  const [stationsResult, tasksResult, inventoryResult, reportsResult, activityResult, messagesResult] = await Promise.all([
    supabase.from("stations").select("id,name,description,owner_label,sort_order").eq("restaurant_id", restaurantId).order("sort_order"),
    supabase
      .from("shift_tasks")
      .select("id,title,priority,status,due_at,station_id,shifts!inner(restaurant_id,shift_date,status),stations(name)")
      .eq("shifts.restaurant_id", restaurantId)
      .order("created_at"),
    supabase
      .from("inventory_items")
      .select("id,name,unit_label,par_level,current_note,station_id,supplier_id,stations(name),suppliers(name)")
      .eq("restaurant_id", restaurantId)
      .order("created_at"),
    supabase
      .from("inventory_reports")
      .select("id,inventory_item_id,station_id,level,status,created_at,inventory_items(name,suppliers(name)),stations(name)")
      .eq("restaurant_id", restaurantId)
      .order("created_at", { ascending: false }),
    supabase.from("activity_log").select("id,actor_label,action,metadata,created_at").eq("restaurant_id", restaurantId).order("created_at", { ascending: false }).limit(20),
    supabase.from("channel_messages").select("id,sender_label,body,created_at").eq("restaurant_id", restaurantId).order("created_at", { ascending: true }).limit(50),
  ]);

  const results = [stationsResult, tasksResult, inventoryResult, reportsResult, activityResult, messagesResult];
  const failedResult = results.find((result) => result.error);
  if (failedResult) {
    throw failedResult.error;
  }

  const stationsById = new Map((stationsResult.data ?? []).map((station) => [station.id, station]));

  return {
    restaurantId,
    tasks: (tasksResult.data ?? []).map((task) => mapTask(task, stationsById)),
    inventoryItems: (inventoryResult.data ?? []).map(mapInventoryItem),
    inventoryReports: (reportsResult.data ?? []).map(mapInventoryReport),
    activity: (activityResult.data ?? []).map(mapActivity),
    chatMessages: (messagesResult.data ?? []).map(mapMessage),
  };
}

export async function updateRemoteShiftTask(task, done) {
  if (!supabase || !task.remoteId) {
    return;
  }

  const { error } = await supabase
    .from("shift_tasks")
    .update({
      status: done ? "done" : "todo",
      completed_at: done ? new Date().toISOString() : null,
    })
    .eq("id", task.remoteId);

  if (error) {
    throw error;
  }
}

export async function createRemoteInventoryReport({ restaurantId, item, level }) {
  if (!supabase || !restaurantId || !item.remoteId) {
    return null;
  }

  const { data, error } = await supabase
    .from("inventory_reports")
    .insert({
      restaurant_id: restaurantId,
      inventory_item_id: item.remoteId,
      station_id: item.stationId ?? null,
      level: STOCK_LEVEL_MAP[level] ?? "low",
      note: level,
    })
    .select("id,inventory_item_id,station_id,level,status,created_at,inventory_items(name,suppliers(name)),stations(name)")
    .single();

  if (error) {
    throw error;
  }

  return mapInventoryReport(data);
}

export async function confirmRemoteInventoryReport(report) {
  if (!supabase || !report.remoteId) {
    return;
  }

  const { error } = await supabase
    .from("inventory_reports")
    .update({
      status: "confirmed",
      confirmed_at: new Date().toISOString(),
    })
    .eq("id", report.remoteId);

  if (error) {
    throw error;
  }
}

export async function createRemoteChannelMessage({ restaurantId, text, senderLabel }) {
  if (!supabase || !restaurantId) {
    return null;
  }

  const { data, error } = await supabase
    .from("channel_messages")
    .insert({
      restaurant_id: restaurantId,
      sender_label: senderLabel,
      body: text,
    })
    .select("id,sender_label,body,created_at")
    .single();

  if (error) {
    throw error;
  }

  return mapMessage(data);
}

export async function resetRemoteDemoWorkspace() {
  if (!supabase) {
    return null;
  }

  const { data, error } = await supabase.rpc("reset_demo_workspace");
  if (error) {
    throw error;
  }

  return Array.isArray(data) ? data[0] : data;
}

function mapTask(task, stationsById) {
  const stationName = task.stations?.name ?? stationsById.get(task.station_id)?.name ?? "Смена";

  return {
    id: task.id,
    remoteId: task.id,
    title: task.title,
    station: stationName,
    due: task.due_at ? formatRemoteTime(task.due_at) : "сейчас",
    done: task.status === "done",
    priority: task.priority === "critical" ? "critical" : "normal",
  };
}

function mapInventoryItem(item) {
  return {
    id: item.id,
    remoteId: item.id,
    stationId: item.station_id,
    name: item.name,
    station: item.stations?.name ?? "Склад",
    stock: item.current_note ?? "не задано",
    par: item.par_level ? `${item.par_level} ${item.unit_label}` : item.unit_label,
    status: getInventoryStatus(item.current_note),
    supplier: item.suppliers?.name ?? "Не назначен",
  };
}

function mapInventoryReport(report) {
  return {
    id: report.id,
    remoteId: report.id,
    item: report.inventory_items?.name ?? "Продукт",
    station: report.stations?.name ?? "Склад",
    level: STOCK_LEVEL_LABELS[report.level] ?? report.level,
    supplier: report.inventory_items?.suppliers?.name ?? "Не назначен",
    status: REPORT_STATUS_LABELS[report.status] ?? report.status,
  };
}

function mapActivity(event) {
  return {
    id: event.id,
    actor: event.actor_label ?? "Chef OS",
    action: event.action,
    meta: event.metadata?.station ?? event.metadata?.entity ?? "База",
    time: formatRemoteTime(event.created_at),
    tone: event.metadata?.tone ?? "amber",
  };
}

function mapMessage(message) {
  const senderLabel = message.sender_label ?? "Chef";

  return {
    id: message.id,
    from: senderLabel,
    text: message.body,
    mine: senderLabel === "Chef",
    time: formatRemoteTime(message.created_at),
  };
}

function getInventoryStatus(note) {
  if (!note) {
    return "ok";
  }

  const normalized = note.toLowerCase();
  if (normalized.includes("1") || normalized.includes("низ")) {
    return "low";
  }

  return "ok";
}

function formatRemoteTime(value) {
  return new Intl.DateTimeFormat("ru-RU", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}
