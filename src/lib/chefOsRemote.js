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

  const [
    stationsResult,
    tasksResult,
    inventoryResult,
    reportsResult,
    activityResult,
    messagesResult,
    checklistRunsResult,
    shiftsResult,
    staffResult,
    recipesResult,
    processesResult,
    templatesResult
  ] = await Promise.all([
    supabase.from("stations").select("id,name,description,owner_label,sort_order").eq("restaurant_id", restaurantId).order("sort_order"),
    supabase
      .from("shift_tasks")
      .select("id,title,priority,status,due_at,station_id,shifts!inner(restaurant_id,shift_date,status),stations(name)")
      .eq("shifts.restaurant_id", restaurantId)
      .order("created_at"),
    supabase
      .from("inventory_items")
      .select("id,name,unit_label,par_level,current_note,station_id,supplier_id,cost_per_unit,loss_percent,stations(name),suppliers(name)")
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
      .eq("shifts.restaurant_id", restaurantId),
    supabase
      .from("shifts")
      .select("id,title,shift_date,peak_window,status")
      .eq("restaurant_id", restaurantId)
      .order("created_at", { ascending: false })
      .limit(1),
    supabase
      .from("staff_contacts")
      .select(`
        id,
        full_name,
        role_label,
        phone,
        app_user_id,
        station_id,
        stations(name),
        shift_assignments (
          starts_at,
          ends_at,
          status,
          shift_id
        )
      `)
      .eq("restaurant_id", restaurantId),
    supabase
      .from("recipes")
      .select(`
        id,
        title,
        category,
        yield_label,
        prep_time_minutes,
        food_cost,
        allergens,
        image_url,
        sales_price,
        target_margin_percent,
        recipe_steps (
          body,
          sort_order
        ),
        recipe_ingredients (
          id,
          quantity_gross,
          quantity_net,
          inventory_items (
            id,
            name,
            cost_per_unit,
            unit_label,
            loss_percent
          )
        )
      `)
      .eq("restaurant_id", restaurantId),
    supabase
      .from("station_processes")
      .select("id,station_id,title,process_type,sort_order,stations!inner(restaurant_id)")
      .eq("stations.restaurant_id", restaurantId)
      .order("sort_order"),
    supabase
      .from("checklist_templates")
      .select(`
        id,
        station_id,
        title,
        phase,
        checklist_items (
          title,
          sort_order
        )
      `)
      .eq("restaurant_id", restaurantId)
  ]);

  const results = [
    stationsResult, tasksResult, inventoryResult, reportsResult, activityResult, messagesResult, checklistRunsResult,
    shiftsResult, staffResult, recipesResult, processesResult, templatesResult
  ];
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

  const activeShiftId = shiftsResult.data?.[0]?.id || null;
  const activeShift = shiftsResult.data?.[0] || null;

  let shiftData = null;
  if (activeShift) {
    shiftData = {
      title: activeShift.title ?? "Вечерняя смена",
      date: activeShift.shift_date ?? "",
      startsAt: "11:00",
      endsAt: "22:00",
      peakWindow: activeShift.peak_window ?? "18:30-21:00"
    };
  }

  const staffList = (staffResult.data ?? []).map(contact => mapStaffMember(contact, activeShiftId));
  const recipeList = (recipesResult.data ?? []).map(mapRecipe);
  const stationGuideList = (stationsResult.data ?? []).map(station => 
    mapStationGuide(station, staffList, processesResult.data ?? [], templatesResult.data ?? [])
  );

  return {
    restaurantId,
    tasks: (tasksResult.data ?? []).map((task) => mapTask(task, stationsById)),
    inventoryItems: (inventoryResult.data ?? []).map(mapInventoryItem),
    inventoryReports: (reportsResult.data ?? []).map(mapInventoryReport),
    activity: (activityResult.data ?? []).map(mapActivity),
    chatMessages: (messagesResult.data ?? []).map((message) => mapMessage(message, currentUserId)),
    generalChecklist: generalChecklist.length > 0 ? generalChecklist : null,
    stationChecklists: Object.values(stationChecklists).some(p => Object.values(p).some(arr => arr.length > 0)) ? stationChecklists : null,
    staff: staffList.length > 0 ? staffList : null,
    recipes: recipeList.length > 0 ? recipeList : null,
    stationGuides: stationGuideList.length > 0 ? stationGuideList : null,
    currentShift: shiftData
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
    costPerUnit: item.cost_per_unit ? Number(item.cost_per_unit) : 0,
    lossPercent: item.loss_percent ? Number(item.loss_percent) : 0,
    unitLabel: item.unit_label ?? "кг"
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

function mapStaffMember(contact, activeShiftId) {
  const assignment = (contact.shift_assignments ?? []).find(sa => sa.shift_id === activeShiftId);
  const stationName = contact.stations?.name ?? "Склад";
  const stationId = STATION_NAME_TO_ID[stationName] ?? "warehouse";
  
  let timeStr = "выходной";
  let statusStr = "Выходной";
  if (assignment) {
    const start = assignment.starts_at ? assignment.starts_at.slice(0, 5) : "00:00";
    const end = assignment.ends_at ? assignment.ends_at.slice(0, 5) : "00:00";
    timeStr = `${start}-${end}`;
    statusStr = assignment.status === "active" ? "На смене" : assignment.status === "expected" ? "Ожидается" : "Выходной";
  }

  const instructionsByStation = {
    cold: "Твой фокус: тартар, салаты, холодная подача. Проверяй рыбу, соусы, аллергены и чистоту доски перед каждым блоком.",
    hot: "Подготовить линию к 17:30, держать термощуп рядом, согласовывать отдачу с pass.",
    prep: "Маркировать контейнеры сразу после заготовки, сигналить остатки ниже нормы, не оставлять продукт без даты.",
    pass: "Держать pass, подтверждать стоп-лист, снимать блокеры цехов до пика.",
    sushi: "Проверить рис, нори, соевый соус и чистый нож. Любой вопрос по рыбе сразу в pass.",
  };

  const instruction = instructionsByStation[stationId] ?? "Соблюдать ТТК и санитарные нормы.";

  return {
    id: contact.id,
    name: contact.full_name,
    role: contact.role_label,
    station: stationName,
    stationId,
    time: timeStr,
    status: statusStr,
    phone: contact.phone ?? "",
    avatar: contact.full_name ? contact.full_name.charAt(0).toUpperCase() : "?",
    instruction,
    appUserId: contact.app_user_id
  };
}

function mapRecipe(recipe) {
  const steps = (recipe.recipe_steps ?? [])
    .slice()
    .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
    .map(step => step.body);

  const ingredients = (recipe.recipe_ingredients ?? []).map(ri => {
    const item = ri.inventory_items;
    const gross = Number(ri.quantity_gross) || 0;
    const net = Number(ri.quantity_net) || 0;
    const name = item?.name ?? "Неизвестный продукт";
    const costPerUnit = item?.cost_per_unit ? Number(item.cost_per_unit) : 0;
    const lossPercent = item?.loss_percent ? Number(item.loss_percent) : 0;
    const unitLabel = item?.unit_label ?? "кг";
    
    // Cost calculation: gross * costPerUnit
    const calculatedCost = gross * costPerUnit;

    return {
      id: ri.id,
      itemId: item?.id,
      name,
      gross,
      net,
      costPerUnit,
      lossPercent,
      unitLabel,
      calculatedCost
    };
  });

  // Calculate dynamic food cost
  const dynamicFoodCost = ingredients.reduce((sum, ing) => sum + ing.calculatedCost, 0);

  return {
    id: recipe.id,
    title: recipe.title,
    category: recipe.category,
    time: recipe.prep_time_minutes ? `${recipe.prep_time_minutes} мин` : "15 мин",
    yield: recipe.yield_label ?? "1 порция",
    cost: dynamicFoodCost > 0 ? `${dynamicFoodCost.toFixed(2)} EUR` : (recipe.food_cost ? `${Number(recipe.food_cost).toFixed(2)} EUR` : "0.00 EUR"),
    costNum: dynamicFoodCost > 0 ? dynamicFoodCost : (recipe.food_cost ? Number(recipe.food_cost) : 0),
    allergens: recipe.allergens ?? "нет",
    image: recipe.image_url ?? "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=240&q=80",
    salesPrice: recipe.sales_price ? Number(recipe.sales_price) : 0,
    targetMarginPercent: recipe.target_margin_percent ? Number(recipe.target_margin_percent) : 70,
    steps,
    ingredients
  };
}

function mapStationGuide(station, staffList, stationProcesses, checklistTemplates) {
  const stationId = STATION_NAME_TO_ID[station.name] ?? "warehouse";
  
  const assignedCook = staffList.find(member => member.stationId === stationId && member.status === "На смене");
  const ownerName = assignedCook ? assignedCook.name : (station.owner_label ?? "Не назначен");
  const statusStr = assignedCook ? (stationId === "cold" ? "В работе" : "На смене") : "Ожидается";

  const processes = stationProcesses.filter(sp => sp.station_id === station.id);
  const duties = processes
    .filter(p => p.process_type === "duty")
    .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
    .map(p => p.title);
    
  const mistakes = processes
    .filter(p => p.process_type === "mistake")
    .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
    .map(p => p.title);

  const templates = checklistTemplates.filter(t => t.station_id === station.id);
  
  const setupTemplate = templates.find(t => t.phase === "setup");
  const setup = setupTemplate
    ? (setupTemplate.checklist_items ?? []).slice().sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)).map(item => item.title)
    : [];

  const serviceTemplate = templates.find(t => t.phase === "service");
  const service = serviceTemplate
    ? (serviceTemplate.checklist_items ?? []).slice().sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)).map(item => item.title)
    : [];

  const closeTemplate = templates.find(t => t.phase === "close");
  const close = closeTemplate
    ? (closeTemplate.checklist_items ?? []).slice().sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)).map(item => item.title)
    : [];

  return {
    id: stationId,
    remoteId: station.id,
    name: station.name,
    owner: ownerName,
    status: statusStr,
    description: station.description ?? "",
    duties,
    mistakes,
    setup,
    service,
    close
  };
}

export async function updateRemoteIngredientPrice(itemId, costPerUnit, lossPercent) {
  if (!supabase) return;
  const { error } = await supabase
    .from("inventory_items")
    .update({
      cost_per_unit: costPerUnit,
      loss_percent: lossPercent
    })
    .eq("id", itemId);
  if (error) throw error;
}

export async function updateRemoteRecipeCosting(recipeId, salesPrice, targetMarginPercent) {
  if (!supabase) return;
  const { error } = await supabase
    .from("recipes")
    .update({
      sales_price: salesPrice,
      target_margin_percent: targetMarginPercent
    })
    .eq("id", recipeId);
  if (error) throw error;
}

export async function updateRemoteRecipeIngredients(recipeId, ingredientsList) {
  if (!supabase) return;
  
  // First delete existing recipe ingredients for this recipe
  const { error: deleteError } = await supabase
    .from("recipe_ingredients")
    .delete()
    .eq("recipe_id", recipeId);
    
  if (deleteError) throw deleteError;
  
  if (ingredientsList.length === 0) return;
  
  // Insert new ingredients
  const insertData = ingredientsList.map(ing => ({
    recipe_id: recipeId,
    inventory_item_id: ing.itemId,
    quantity_gross: ing.gross,
    quantity_net: ing.net
  }));
  
  const { error: insertError } = await supabase
    .from("recipe_ingredients")
    .insert(insertData);
    
  if (insertError) throw insertError;
}
