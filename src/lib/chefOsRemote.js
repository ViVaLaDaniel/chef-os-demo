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

const STATION_NAME_TO_ID = {
  "Холодный цех": "cold",
  "Горячий цех": "hot",
  "Заготовочный": "prep",
  "Pass / выдача": "pass",
  "Суши": "sushi",
};

function getGeneralChecklistItemStation(title) {
  const t = title.toLowerCase();
  if (t.includes("бриф")) return "Команда";
  if (t.includes("стоп-лист") || t.includes("vip")) return "Pass";
  if (t.includes("остатки")) return "Склад";
  return "Все цеха";
}

export async function bootstrapAndLoadChefOsWorkspace({ currentUserId } = {}) {
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

  const [stationsResult, tasksResult, inventoryResult, reportsResult, activityResult, messagesResult, checklistRunsResult] = await Promise.all([
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
    supabase.from("channel_messages").select("id,sender_user_id,sender_label,body,created_at").eq("restaurant_id", restaurantId).order("created_at", { ascending: true }).limit(50),
    supabase
      .from("shift_checklist_runs")
      .select(`
        id,
        template_id,
        shifts!inner(restaurant_id),
        checklist_templates (
          id,
          title,
          phase,
          station_id
        ),
        shift_checklist_item_results (
          id,
          item_id,
          is_completed,
          checklist_items (
            id,
            title,
            sort_order
          )
        )
      `)
      .eq("shifts.restaurant_id", restaurantId)
  ]);

  const results = [stationsResult, tasksResult, inventoryResult, reportsResult, activityResult, messagesResult, checklistRunsResult];
  const failedResult = results.find((result) => result.error);
  if (failedResult) {
    throw failedResult.error;
  }

  const stationsById = new Map((stationsResult.data ?? []).map((station) => [station.id, station]));

  // Map checklists
  let generalChecklist = [];
  const stationChecklists = {
    cold: { setup: [], service: [], close: [] },
    hot: { setup: [], service: [], close: [] },
    prep: { setup: [], service: [], close: [] },
    pass: { setup: [], service: [], close: [] },
    sushi: { setup: [], service: [], close: [] }
  };

  for (const run of (checklistRunsResult.data ?? [])) {
    const tpl = run.checklist_templates;
    if (!tpl) continue;

    const sortedResults = (run.shift_checklist_item_results ?? []).slice().sort((a, b) => {
      return (a.checklist_items?.sort_order ?? 0) - (b.checklist_items?.sort_order ?? 0);
    });

    if (tpl.phase === "general") {
      generalChecklist = sortedResults.map((r) => ({
        id: r.id,
        title: r.checklist_items?.title ?? "Чек",
        station: getGeneralChecklistItemStation(r.checklist_items?.title ?? ""),
        done: r.is_completed
      }));
    } else if (tpl.station_id) {
      const station = stationsById.get(tpl.station_id);
      if (station) {
        const stationKey = STATION_NAME_TO_ID[station.name];
        const phaseKey = tpl.phase;
        if (stationKey && phaseKey && stationChecklists[stationKey]?.[phaseKey]) {
          stationChecklists[stationKey][phaseKey] = sortedResults.map((r) => ({
            id: r.id,
            title: r.checklist_items?.title ?? "Чек",
            done: r.is_completed
          }));
        }
      }
    }
  }

  return {
    restaurantId,
    tasks: (tasksResult.data ?? []).map((task) => mapTask(task, stationsById)),
    inventoryItems: (inventoryResult.data ?? []).map(mapInventoryItem),
    inventoryReports: (reportsResult.data ?? []).map(mapInventoryReport),
    activity: (activityResult.data ?? []).map(mapActivity),
    chatMessages: (messagesResult.data ?? []).map((message) => mapMessage(message, currentUserId)),
    generalChecklist: generalChecklist.length > 0 ? generalChecklist : null,
    stationChecklists: Object.values(stationChecklists).some(p => Object.values(p).some(arr => arr.length > 0)) ? stationChecklists : null
  };
}

export async function updateRemoteChecklistResult(resultId, done, { userId } = {}) {
  if (!supabase) {
    return;
  }

  const { error } = await supabase
    .from("shift_checklist_item_results")
    .update({
      is_completed: done,
      completed_by: done ? userId ?? null : null,
      completed_at: done ? new Date().toISOString() : null,
    })
    .eq("id", resultId);

  if (error) {
    throw error;
  }
}

export async function updateRemoteShiftTask(task, done, { userId } = {}) {
  if (!supabase || !task.remoteId) {
    return;
  }

  const { error } = await supabase
    .from("shift_tasks")
    .update({
      status: done ? "done" : "todo",
      completed_by: done ? userId ?? null : null,
      completed_at: done ? new Date().toISOString() : null,
    })
    .eq("id", task.remoteId);

  if (error) {
    throw error;
  }
}

export async function createRemoteInventoryReport({ restaurantId, item, level, userId }) {
  if (!supabase || !restaurantId || !item.remoteId) {
    return null;
  }

  const { data, error } = await supabase
    .from("inventory_reports")
    .insert({
      restaurant_id: restaurantId,
      inventory_item_id: item.remoteId,
      station_id: item.stationId ?? null,
      reported_by: userId ?? null,
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

export async function confirmRemoteInventoryReport(report, { userId } = {}) {
  if (!supabase || !report.remoteId) {
    return;
  }

  const { error } = await supabase
    .from("inventory_reports")
    .update({
      status: "confirmed",
      confirmed_by: userId ?? null,
      confirmed_at: new Date().toISOString(),
    })
    .eq("id", report.remoteId);

  if (error) {
    throw error;
  }
}

export async function createRemoteChannelMessage({ restaurantId, text, senderLabel, userId }) {
  if (!supabase || !restaurantId) {
    return null;
  }

  const { data, error } = await supabase
    .from("channel_messages")
    .insert({
      restaurant_id: restaurantId,
      sender_user_id: userId ?? null,
      sender_label: senderLabel,
      body: text,
    })
    .select("id,sender_user_id,sender_label,body,created_at")
    .single();

  if (error) {
    throw error;
  }

  return mapMessage(data, userId);
}

export async function resetRemoteDemoWorkspace({ actorLabel } = {}) {
  if (!supabase) {
    return null;
  }

  const { data, error } = await supabase.rpc("reset_demo_workspace", { actor_label: actorLabel ?? null });
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

function mapMessage(message, currentUserId) {
  const senderLabel = message.sender_label ?? "Chef";

  return {
    id: message.id,
    from: senderLabel,
    text: message.body,
    mine: message.sender_user_id ? message.sender_user_id === currentUserId : senderLabel === "Chef",
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
