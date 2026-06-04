import { isSupabaseConfigured } from "./supabase";
import {
  initialTasks,
  initialGeneralChecklist,
  initialStationChecklists,
  initialInventoryItems,
  initialActivity,
  messages,
} from "./mockData";

export const OPERATIONAL_CACHE_KEY = "chef-os-demo:operational-cache";
export const OPERATIONAL_CACHE_VERSION = 1;

export function makeChecklist(items, prefix) {
  return items.map((title, index) => ({
    id: `${prefix}-${index + 1}`,
    title,
    done: index === 0,
  }));
}

export function getChecklistProgress(items) {
  if (!items || !items.length) return { done: 0, total: 0 };
  return {
    done: items.filter((item) => item.done).length,
    total: items.length,
  };
}

export function getStationProgress(stationChecklist) {
  const allItems = Object.values(stationChecklist ?? {}).flat();
  return getChecklistProgress(allItems);
}

export function formatProgress(progress) {
  return `${progress.done}/${progress.total}`;
}

export function createSeedOperationalState() {
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

export function readOperationalCache() {
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

export function writeOperationalCache(snapshot) {
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

export function getAccountDisplayName(session) {
  if (!session?.user) {
    return "Chef";
  }

  return session.user.user_metadata?.full_name || session.user.user_metadata?.name || session.user.email || "Chef";
}

export function getInitials(value) {
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

export function formatTime(date) {
  return new Intl.DateTimeFormat("ru-RU", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function formatDate(date) {
  return new Intl.DateTimeFormat("ru-RU", {
    weekday: "short",
    day: "2-digit",
    month: "long",
  }).format(date);
}

export function formatCacheTime(value) {
  return new Intl.DateTimeFormat("ru-RU", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export function getDatabaseLabel(remoteWorkspace, session = null) {
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

export function getShiftRemaining(now, endsAt) {
  if (!endsAt) return { expired: true, label: "0м" };
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
