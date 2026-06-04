import { create } from "zustand";
import {
  readOperationalCache,
  writeOperationalCache,
  getAccountDisplayName,
} from "../lib/utils";
import {
  staff as mockStaff,
  recipes as mockRecipes,
  stationGuides as mockStationGuides,
  currentShift as mockCurrentShift,
  initialTasks,
  initialInventoryItems,
  initialActivity,
  messages,
  initialGeneralChecklist,
  initialStationChecklists,
} from "../lib/mockData";
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
} from "../lib/chefOsRemote";
import { isSupabaseConfigured, signInWithGoogle, signOut, supabase } from "../lib/supabase";

const initialOperationalState = readOperationalCache();

export const useChefStore = create((set, get) => ({
  // Tab navigation
  activeTab: "shift",
  setActiveTab: (activeTab) => set({ activeTab }),

  // Operational State variables
  tasks: initialOperationalState.tasks,
  generalChecklist: initialOperationalState.generalChecklist,
  stationChecklists: initialOperationalState.stationChecklists,
  activity: initialOperationalState.activity,
  inventoryItems: initialOperationalState.inventoryItems,
  inventoryReports: initialOperationalState.inventoryReports || [],
  chatMessages: initialOperationalState.chatMessages,
  staffList: initialOperationalState.staff ?? mockStaff,
  recipesList: initialOperationalState.recipes ?? mockRecipes,
  stationGuidesList: initialOperationalState.stationGuides ?? mockStationGuides,
  currentShiftState: initialOperationalState.currentShift ?? mockCurrentShift,

  // Cache statuses
  cacheStatus: {
    savedAt: initialOperationalState.savedAt,
    source: initialOperationalState.source,
  },
  setCacheStatus: (cacheStatus) => set({ cacheStatus }),

  // Workspace and Auth Statuses
  remoteWorkspace: { restaurantId: null, status: "idle", message: "" },
  setRemoteWorkspace: (updater) => set((state) => ({
    remoteWorkspace: typeof updater === "function" ? updater(state.remoteWorkspace) : updater,
  })),

  session: null,
  setSession: (session) => set({ session }),

  authLoading: false,
  setAuthLoading: (authLoading) => set({ authLoading }),

  resetLoading: false,
  setResetLoading: (resetLoading) => set({ resetLoading }),

  toast: "",
  setToast: (toast) => set({ toast }),

  // Modal / Sheet visibility states
  staffOpen: false,
  setStaffOpen: (staffOpen) => set({ staffOpen }),

  profileOpen: false,
  setProfileOpen: (profileOpen) => set({ profileOpen }),

  notificationsOpen: false,
  setNotificationsOpen: (notificationsOpen) => set({ notificationsOpen }),

  scheduleOpen: false,
  setScheduleOpen: (scheduleOpen) => set({ scheduleOpen }),

  settingsOpen: false,
  setSettingsOpen: (settingsOpen) => set({ settingsOpen }),

  topMenuOpen: false,
  setTopMenuOpen: (topMenuOpen) => set({ topMenuOpen }),

  quickPanelOpen: false,
  setQuickPanelOpen: (quickPanelOpen) => set({ quickPanelOpen }),

  // Selection states
  selectedRecipe: null,
  setSelectedRecipe: (selectedRecipe) => set({ selectedRecipe }),

  selectedStation: null,
  setSelectedStation: (selectedStation) => set({ selectedStation }),

  selectedStop: null,
  setSelectedStop: (selectedStop) => set({ selectedStop }),

  // Getters
  getAccountName: () => getAccountDisplayName(get().session),
  getAccountUserId: () => get().session?.user?.id ?? null,
  getCurrentCook: () => {
    const { session, staffList } = get();
    const accountUserId = session?.user?.id ?? null;
    if (session && staffList && staffList.length > 0) {
      const match = staffList.find((member) => member.appUserId === accountUserId);
      if (match) return match;
    }
    return staffList?.[1] || mockStaff[1];
  },

  // Actions
  setTasks: (tasks) => set({ tasks }),
  setInventoryItems: (inventoryItems) => set({ inventoryItems }),
  setInventoryReports: (inventoryReports) => set({ inventoryReports }),
  setActivity: (activity) => set({ activity }),
  setChatMessages: (chatMessages) => set({ chatMessages }),
  setGeneralChecklist: (generalChecklist) => set({ generalChecklist }),
  setStationChecklists: (stationChecklists) => set({ stationChecklists }),
  setStaffList: (staffList) => set({ staffList }),
  setRecipesList: (recipesList) => set({ recipesList }),
  setStationGuidesList: (stationGuidesList) => set({ stationGuidesList }),
  setCurrentShiftState: (currentShiftState) => set({ currentShiftState }),

  addActivity: (action, meta, tone = "amber", actor = null) => {
    const actorName = actor || get().getAccountName();
    set((state) => ({
      activity: [
        { id: Date.now(), actor: actorName, action, meta, time: "сейчас", tone },
        ...state.activity,
      ],
    }));
  },

  handleGoogleSignIn: async () => {
    if (!isSupabaseConfigured) {
      set({ toast: "Supabase env пока не подключен" });
      return;
    }
    set({ authLoading: true });
    const { error } = await signInWithGoogle();
    if (error) {
      set({ toast: `Google login error: ${error.message}`, authLoading: false });
    }
  },

  handleSignOut: async () => {
    set({ authLoading: true });
    await signOut();
    set({ authLoading: false, toast: "Вы вышли из аккаунта" });
  },

  handleCreateWorkspace: async (name) => {
    set({ authLoading: true, toast: "" });
    try {
      const restId = await createRemoteRestaurant(name);
      if (restId) {
        set({
          toast: `Ресторан "${name}" успешно создан!`,
          remoteWorkspace: { restaurantId: restId, status: "connected", message: "Supabase подключен" },
        });
        window.location.reload();
      } else {
        throw new Error("Не удалось получить ID ресторана");
      }
    } catch (err) {
      console.error(err);
      set({ toast: "Ошибка создания: " + err.message });
    } finally {
      set({ authLoading: false });
    }
  },

  handleJoinWorkspace: async (code) => {
    set({ authLoading: true, toast: "" });
    try {
      const restId = await joinRemoteRestaurantByInviteCode(code);
      if (restId) {
        set({
          toast: "Вы успешно присоединились к проекту!",
          remoteWorkspace: { restaurantId: restId, status: "connected", message: "Supabase подключен" },
        });
        window.location.reload();
      } else {
        throw new Error("Не удалось присоединиться");
      }
    } catch (err) {
      console.error(err);
      set({ toast: "Ошибка: " + err.message });
    } finally {
      set({ authLoading: false });
    }
  },

  handleOpenDemoWorkspace: async () => {
    set({ authLoading: true, toast: "" });
    const accountUserId = get().getAccountUserId();
    try {
      const workspace = await bootstrapAndLoadChefOsWorkspace({ currentUserId: accountUserId });
      if (workspace) {
        set({ toast: "Демо-кухня готова!" });
        window.location.reload();
      }
    } catch (err) {
      console.error(err);
      set({ toast: "Ошибка: " + err.message });
    } finally {
      set({ authLoading: false });
    }
  },

  handleSwitchWorkspace: () => {
    localStorage.removeItem(OPERATIONAL_CACHE_KEY);
    localStorage.removeItem("chef-os:intro-seen");
    set({
      remoteWorkspace: { restaurantId: null, restaurantName: null, inviteCode: null, status: "onboarding", message: "Выберите или создайте кухню" },
      settingsOpen: false,
      toast: "Выберите или создайте кухню",
    });
  },

  reportInventory: async (item, level) => {
    const action = `${item.name}: ${level}`;
    const accountName = get().getAccountName();
    const accountUserId = get().getAccountUserId();
    const remoteWorkspace = get().remoteWorkspace;

    const localReport = {
      id: Date.now(),
      item: item.name,
      station: item.station,
      level,
      supplier: item.supplier,
      status: "Новая",
    };

    set((state) => ({
      inventoryReports: [localReport, ...state.inventoryReports],
    }));
    get().addActivity(action, item.station, level === "закончилось" ? "red" : "amber", accountName);
    set({ toast: `Сигнал отправлен су-шефу: ${item.name}` });

    if (remoteWorkspace.status !== "connected") {
      return;
    }

    try {
      const remoteReport = await createRemoteInventoryReport({
        restaurantId: remoteWorkspace.restaurantId,
        item,
        level,
        userId: accountUserId,
      });
      if (remoteReport) {
        set((state) => ({
          inventoryReports: state.inventoryReports.map((report) =>
            report.id === localReport.id ? remoteReport : report
          ),
        }));
      }
    } catch (error) {
      set({ toast: `Сигнал сохранен локально, база недоступна: ${error.message}` });
    }
  },

  confirmInventoryReport: async (report) => {
    const accountName = get().getAccountName();
    const accountUserId = get().getAccountUserId();

    set((state) => ({
      inventoryReports: state.inventoryReports.map((item) =>
        item.id === report.id ? { ...item, status: "Подтверждена" } : item
      ),
    }));
    get().addActivity(`Подтвердил заявку: ${report.item}`, report.station, "green", accountName);
    set({ toast: `Заявка подтверждена: ${report.item}` });

    try {
      await confirmRemoteInventoryReport(report, { userId: accountUserId });
    } catch (error) {
      set({ toast: `Подтверждение сохранено локально, база недоступна: ${error.message}` });
    }
  },

  toggleTask: async (task) => {
    const nextDone = !task.done;
    const accountName = get().getAccountName();
    const accountUserId = get().getAccountUserId();

    set((state) => ({
      tasks: state.tasks.map((item) => (item.id === task.id ? { ...item, done: nextDone } : item)),
    }));
    get().addActivity(
      `${nextDone ? "Закрыл" : "Вернул"} задачу: ${task.title}`,
      task.station,
      nextDone ? "green" : "amber",
      accountName
    );

    try {
      await updateRemoteShiftTask(task, nextDone, { userId: accountUserId });
    } catch (error) {
      set({ toast: `Задача сохранена локально, база недоступна: ${error.message}` });
    }
  },

  handleAssignStaffStation: async (contactId, stationCode, roleLabel) => {
    const stationGuidesList = get().stationGuidesList;
    try {
      const stationUuid =
        stationCode === "warehouse"
          ? null
          : stationGuidesList.find((g) => g.id === stationCode)?.remoteId || null;
      await assignRemoteStaffStation(contactId, stationUuid, roleLabel);

      set((state) => ({
        staffList: state.staffList.map((item) => {
          if (item.id === contactId) {
            const stationName =
              stationCode === "warehouse"
                ? "Склад"
                : stationGuidesList.find((g) => g.id === stationCode)?.name || "Склад";
            return {
              ...item,
              stationId: stationCode,
              station: stationName,
              role: roleLabel,
            };
          }
          return item;
        }),
        toast: "Сотрудник назначен!",
      }));
    } catch (err) {
      console.error(err);
      set({ toast: "Ошибка назначения: " + err.message });
    }
  },

  sendChatMessage: async (text) => {
    const currentCook = get().getCurrentCook();
    const accountName = get().getAccountName();
    const accountUserId = get().getAccountUserId();
    const remoteWorkspace = get().remoteWorkspace;

    const senderLabel = currentCook
      ? `${currentCook.name} | ${currentCook.station}`
      : accountName;
    const localMessage = { id: Date.now(), from: senderLabel, text, mine: true, time: "сейчас" };

    set((state) => ({
      chatMessages: [...state.chatMessages, localMessage],
    }));

    try {
      const remoteMessage = await createRemoteChannelMessage({
        restaurantId: remoteWorkspace.restaurantId,
        text,
        senderLabel,
        userId: accountUserId,
      });
      if (remoteMessage) {
        set((state) => ({
          chatMessages: state.chatMessages.map((message) =>
            message.id === localMessage.id ? remoteMessage : message
          ),
        }));
      }
    } catch (error) {
      set({ toast: `Сообщение сохранено локально, база недоступна: ${error.message}` });
    }
  },

  resetDemoWorkspace: async () => {
    const remoteWorkspace = get().remoteWorkspace;
    const accountName = get().getAccountName();
    const accountUserId = get().getAccountUserId();

    if (remoteWorkspace.status !== "connected") {
      set({ toast: "Сначала подключите Supabase через Google" });
      return;
    }

    set({ resetLoading: true });
    try {
      await resetRemoteDemoWorkspace({ actorLabel: accountName });
      const workspace = await bootstrapAndLoadChefOsWorkspace({ currentUserId: accountUserId });
      set({
        remoteWorkspace: { restaurantId: workspace.restaurantId, status: "connected", message: "Supabase подключен" },
        tasks: workspace.tasks.length > 0 ? workspace.tasks : initialTasks,
        inventoryItems: workspace.inventoryItems.length > 0 ? workspace.inventoryItems : initialInventoryItems,
        inventoryReports: workspace.inventoryReports || [],
        activity: workspace.activity.length > 0 ? workspace.activity : initialActivity,
        chatMessages: workspace.chatMessages.length > 0 ? workspace.chatMessages : messages,
        generalChecklist: workspace.generalChecklist || initialGeneralChecklist,
        stationChecklists: workspace.stationChecklists || initialStationChecklists,
        staffList: workspace.staff || mockStaff,
        recipesList: workspace.recipes || mockRecipes,
        stationGuidesList: workspace.stationGuides || mockStationGuides,
        currentShiftState: workspace.currentShift || mockCurrentShift,
        toast: "Demo workspace очищен",
      });
    } catch (error) {
      set({ toast: `Reset не выполнен: ${error.message}` });
    } finally {
      set({ resetLoading: false });
    }
  },

  handleUpdateIngredientPrice: async (itemId, newPrice, newLoss) => {
    set((state) => ({
      inventoryItems: state.inventoryItems.map((item) =>
        item.id === itemId ? { ...item, costPerUnit: newPrice, lossPercent: newLoss } : item
      ),
      recipesList: state.recipesList.map((recipe) => {
        let hasChanged = false;
        const updatedIngredients = (recipe.ingredients || []).map((ing) => {
          if (ing.itemId === itemId) {
            hasChanged = true;
            const calculatedCost = ing.gross * newPrice;
            return {
              ...ing,
              costPerUnit: newPrice,
              lossPercent: newLoss,
              calculatedCost,
            };
          }
          return ing;
        });

        if (hasChanged) {
          const dynamicFoodCost = updatedIngredients.reduce(
            (sum, ing) => sum + ing.calculatedCost,
            0
          );
          return {
            ...recipe,
            ingredients: updatedIngredients,
            cost: `${dynamicFoodCost.toFixed(2)} EUR`,
            costNum: dynamicFoodCost,
          };
        }
        return recipe;
      }),
    }));

    try {
      const remoteWorkspace = get().remoteWorkspace;
      if (remoteWorkspace.status === "connected") {
        await updateRemoteIngredientPrice(itemId, newPrice, newLoss);
        set({ toast: "Цена ингредиента сохранена на сервере" });
      } else {
        set({ toast: "Сохранено локально (нет связи)" });
      }
    } catch (err) {
      set({ toast: `Ошибка сохранения на сервере: ${err.message}` });
    }
  },

  handleUpdateRecipeCosting: async (recipeId, salesPrice, targetMargin) => {
    try {
      const remoteWorkspace = get().remoteWorkspace;
      if (remoteWorkspace.status === "connected") {
        await updateRemoteRecipeCosting(recipeId, salesPrice, targetMargin);
      }
      set((state) => ({
        recipesList: state.recipesList.map((recipe) => {
          if (recipe.id === recipeId) {
            return {
              ...recipe,
              salesPrice: Number(salesPrice) || 0,
              targetMarginPercent: Number(targetMargin) || 70,
            };
          }
          return recipe;
        }),
        toast: "Настройки калькуляции сохранены",
      }));
    } catch (error) {
      set({ toast: `Ошибка сохранения калькуляции: ${error.message}` });
    }
  },

  handleUpdateRecipeIngredients: async (recipeId, ingredientsList) => {
    const inventoryItems = get().inventoryItems;
    try {
      const remoteWorkspace = get().remoteWorkspace;
      if (remoteWorkspace.status === "connected") {
        await updateRemoteRecipeIngredients(recipeId, ingredientsList);
      }

      set((state) => ({
        recipesList: state.recipesList.map((recipe) => {
          if (recipe.id === recipeId) {
            const updatedIngredients = ingredientsList.map((ing) => {
              const matchingInventoryItem = inventoryItems.find((item) => item.id === ing.itemId);
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
                calculatedCost,
              };
            });

            const dynamicFoodCost = updatedIngredients.reduce(
              (sum, ing) => sum + ing.calculatedCost,
              0
            );
            return {
              ...recipe,
              ingredients: updatedIngredients,
              cost: `${dynamicFoodCost.toFixed(2)} EUR`,
              costNum: dynamicFoodCost,
            };
          }
          return recipe;
        }),
        toast: "Состав ТТК успешно сохранен",
      }));
    } catch (error) {
      set({ toast: `Ошибка сохранения состава ТТК: ${error.message}` });
    }
  },

  handleQuickAction: (action) => {
    const currentCook = get().getCurrentCook();
    const accountName = get().getAccountName();
    const stationGuidesList = get().stationGuidesList;

    get().addActivity(action.event, action.meta, action.tone, accountName);

    if (action.id === "station-task") {
      set((state) => ({
        tasks: [
          ...state.tasks,
          {
            id: Date.now(),
            title: "Срочная задача цеха",
            station: currentCook.station,
            due: "сейчас",
            done: false,
            priority: "critical",
          },
        ],
      }));
    }

    if (action.id === "open-checklist" || action.id === "open-process") {
      set({
        selectedStation: stationGuidesList.find((station) => station.id === currentCook.stationId),
      });
    }

    if (action.id === "empty-stock" || action.id === "one-left" || action.id === "missing-ingredient") {
      set((state) => ({
        inventoryReports: [
          {
            id: Date.now(),
            item: action.id === "missing-ingredient" ? "Ингредиент ТТК" : "Не указан",
            station: currentCook.station,
            level: action.label,
            supplier: "Назначит су-шеф",
            status: "Новая",
          },
          ...state.inventoryReports,
        ],
      }));
    }

    if (action.id === "stop-item") {
      set({
        selectedStop: {
          id: Date.now(),
          item: "Новое блюдо",
          reason: "Требует подтверждения су-шефа",
          station: currentCook.station,
        },
      });
    }

    set({
      toast: action.tone === "red" ? `Критичный сигнал: ${action.label}` : `Выполнено: ${action.label}`,
      quickPanelOpen: false,
    });
  },

  toggleGeneralChecklist: async (item) => {
    const nextDone = !item.done;
    const accountName = get().getAccountName();
    const accountUserId = get().getAccountUserId();
    const remoteWorkspace = get().remoteWorkspace;

    set((state) => ({
      generalChecklist: state.generalChecklist.map((entry) =>
        entry.id === item.id ? { ...entry, done: nextDone } : entry
      ),
    }));
    get().addActivity(
      `${item.done ? "Вернул" : "Закрыл"} общий чек: ${item.title}`,
      item.station,
      item.done ? "amber" : "green",
      accountName
    );

    try {
      if (remoteWorkspace.status === "connected" && typeof item.id === "string" && item.id.length > 10) {
        await updateRemoteChecklistResult(item.id, nextDone, { userId: accountUserId });
      }
    } catch (error) {
      set({ toast: `Чек-лист сохранен локально, база недоступна: ${error.message}` });
    }
  },

  toggleStationChecklist: async (stationId, phase, itemId) => {
    const stationGuidesList = get().stationGuidesList;
    const stationChecklists = get().stationChecklists;
    const accountName = get().getAccountName();
    const accountUserId = get().getAccountUserId();
    const remoteWorkspace = get().remoteWorkspace;

    const station = stationGuidesList.find((entry) => entry.id === stationId);
    const item = stationChecklists[stationId]?.[phase]?.find((entry) => entry.id === itemId);
    if (!item) return;

    const nextDone = !item.done;
    set((state) => ({
      stationChecklists: {
        ...state.stationChecklists,
        [stationId]: {
          ...state.stationChecklists[stationId],
          [phase]: state.stationChecklists[stationId][phase].map((entry) =>
            entry.id === itemId ? { ...entry, done: nextDone } : entry
          ),
        },
      },
    }));

    if (station) {
      get().addActivity(
        `${item.done ? "Вернул" : "Закрыл"} чек: ${item.title}`,
        station.name,
        item.done ? "amber" : "green",
        accountName
      );
    }

    try {
      if (remoteWorkspace.status === "connected" && typeof itemId === "string" && itemId.length > 10) {
        await updateRemoteChecklistResult(itemId, nextDone, { userId: accountUserId });
      }
    } catch (error) {
      set({ toast: `Чек-лист сохранен локально, база недоступна: ${error.message}` });
    }
  },

  syncToCache: () => {
    const {
      tasks,
      generalChecklist,
      stationChecklists,
      inventoryItems,
      inventoryReports,
      activity,
      chatMessages,
      staffList,
      recipesList,
      stationGuidesList,
      currentShiftState,
    } = get();

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
      currentShift: currentShiftState,
    });

    if (savedAt) {
      set({ cacheStatus: { savedAt, source: "cache" } });
    }
  },
}));
