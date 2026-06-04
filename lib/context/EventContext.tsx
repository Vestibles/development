"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { buildDashboardSummary } from "../calculations";
import { seedData, DEMO_EVENT_ID } from "../data/seed";
import { newId } from "../id";
import { getSupabase, isSupabaseConfigured } from "../supabase/client";
import * as db from "../supabase/persist";
import type {
  AppData,
  DashboardSummary,
  Event,
  Expense,
  Purchase,
  Stall,
  Supplier,
  TicketSales,
  Volunteer,
  VolunteerShift,
} from "../types";

const STORAGE_KEY = "funday-planner-data";

interface EventContextValue {
  data: AppData;
  summary: DashboardSummary;
  loading: boolean;
  usingSupabase: boolean;
  syncError: string | null;
  updateEvent: (patch: Partial<Event>) => void;
  addStall: (stall: Omit<Stall, "id" | "event_id">) => void;
  updateStall: (id: string, patch: Partial<Stall>) => void;
  removeStall: (id: string) => void;
  addExpense: (expense: Omit<Expense, "id" | "event_id">) => void;
  updateExpense: (id: string, patch: Partial<Expense>) => void;
  removeExpense: (id: string) => void;
  addSupplier: (supplier: Omit<Supplier, "id" | "event_id">) => void;
  updateSupplier: (id: string, patch: Partial<Supplier>) => void;
  removeSupplier: (id: string) => void;
  addPurchase: (purchase: Omit<Purchase, "id" | "event_id">) => void;
  updatePurchase: (id: string, patch: Partial<Purchase>) => void;
  removePurchase: (id: string) => void;
  updateTicketSales: (patch: Partial<TicketSales>) => void;
  addVolunteer: (volunteer: Omit<Volunteer, "id" | "event_id">) => void;
  updateVolunteer: (id: string, patch: Partial<Volunteer>) => void;
  removeVolunteer: (id: string) => void;
  addShift: (shift: Omit<VolunteerShift, "id" | "event_id">) => void;
  updateShift: (id: string, patch: Partial<VolunteerShift>) => void;
  removeShift: (id: string) => void;
  resetToSeed: () => void;
}

const EventContext = createContext<EventContextValue | null>(null);

function loadLocal(): AppData {
  if (typeof window === "undefined") return seedData;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as AppData;
  } catch {
    /* ignore */
  }
  return seedData;
}

async function loadFromSupabase(): Promise<AppData | null> {
  const supabase = getSupabase();
  if (!supabase) return null;

  const { data: eventRow } = await supabase
    .from("events")
    .select("*")
    .eq("id", DEMO_EVENT_ID)
    .maybeSingle();

  if (!eventRow) return null;

  const eventId = eventRow.id as string;

  const [stalls, expenses, suppliers, purchases, ticketSales, volunteers, shifts] =
    await Promise.all([
      supabase.from("stalls").select("*").eq("event_id", eventId),
      supabase.from("expenses").select("*").eq("event_id", eventId),
      supabase.from("suppliers").select("*").eq("event_id", eventId),
      supabase.from("purchases").select("*").eq("event_id", eventId),
      supabase.from("ticket_sales").select("*").eq("event_id", eventId).maybeSingle(),
      supabase.from("volunteers").select("*").eq("event_id", eventId),
      supabase.from("volunteer_shifts").select("*").eq("event_id", eventId),
    ]);

  return {
    event: {
      id: eventRow.id,
      name: eventRow.name,
      event_date: eventRow.event_date,
      attendance_estimate: eventRow.attendance_estimate ?? 0,
    },
    stalls: (stalls.data ?? []).map(mapStall),
    expenses: (expenses.data ?? []).map(mapExpense),
    suppliers: (suppliers.data ?? []).map(mapSupplier),
    purchases: (purchases.data ?? []).map(mapPurchase),
    ticketSales: ticketSales.data
      ? mapTicketSales(ticketSales.data)
      : { ...seedData.ticketSales, event_id: eventId, id: newId() },
    volunteers: (volunteers.data ?? []).map(mapVolunteer),
    shifts: (shifts.data ?? []).map(mapShift),
  };
}

function mapStall(row: Record<string, unknown>): Stall {
  return {
    id: String(row.id),
    event_id: String(row.event_id),
    name: String(row.name),
    item_cost: Number(row.item_cost),
    selling_price: Number(row.selling_price),
    quantity: Number(row.quantity),
    notes: row.notes as string | null,
  };
}

function mapExpense(row: Record<string, unknown>): Expense {
  return {
    id: String(row.id),
    event_id: String(row.event_id),
    category: String(row.category),
    description: String(row.description),
    budgeted: Number(row.budgeted),
    actual: Number(row.actual),
  };
}

function mapSupplier(row: Record<string, unknown>): Supplier {
  return {
    id: String(row.id),
    event_id: String(row.event_id),
    name: String(row.name),
    contact: String(row.contact ?? ""),
    notes: row.notes as string | null,
  };
}

function mapPurchase(row: Record<string, unknown>): Purchase {
  return {
    id: String(row.id),
    event_id: String(row.event_id),
    supplier_id: row.supplier_id ? String(row.supplier_id) : null,
    item_name: String(row.item_name),
    budgeted: Number(row.budgeted),
    actual: Number(row.actual),
    quantity: Number(row.quantity),
    stock_on_hand: Number(row.stock_on_hand),
    purchased: Boolean(row.purchased),
  };
}

function mapTicketSales(row: Record<string, unknown>): TicketSales {
  return {
    id: String(row.id),
    event_id: String(row.event_id),
    adult_count: Number(row.adult_count),
    adult_price: Number(row.adult_price),
    family_count: Number(row.family_count),
    family_price: Number(row.family_price),
    child_count: Number(row.child_count),
    child_price: Number(row.child_price),
    raffle_count: Number(row.raffle_count),
    raffle_price: Number(row.raffle_price),
    donations: Number(row.donations),
  };
}

function mapVolunteer(row: Record<string, unknown>): Volunteer {
  return {
    id: String(row.id),
    event_id: String(row.event_id),
    name: String(row.name),
    email: String(row.email ?? ""),
    phone: String(row.phone ?? ""),
    role: String(row.role ?? ""),
    notes: row.notes as string | null,
  };
}

function mapShift(row: Record<string, unknown>): VolunteerShift {
  return {
    id: String(row.id),
    event_id: String(row.event_id),
    volunteer_id: String(row.volunteer_id),
    stall_or_area: String(row.stall_or_area),
    shift_start: String(row.shift_start),
    shift_end: String(row.shift_end),
    notes: row.notes as string | null,
  };
}

export function EventProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<AppData>(seedData);
  const [loading, setLoading] = useState(true);
  const [syncError, setSyncError] = useState<string | null>(null);
  const usingSupabase = isSupabaseConfigured();

  const persistLocal = useCallback((next: AppData) => {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    }
  }, []);

  const runSync = useCallback(
    async (fn: () => Promise<void>) => {
      if (!usingSupabase) return;
      try {
        await fn();
        setSyncError(null);
      } catch (err) {
        setSyncError(err instanceof Error ? err.message : "Failed to save changes");
      }
    },
    [usingSupabase]
  );

  const apply = useCallback(
    (
      updater: (prev: AppData) => AppData,
      sync?: (next: AppData) => Promise<void>
    ) => {
      setData((prev) => {
        const next = updater(prev);
        if (!loading) persistLocal(next);
        if (sync) void runSync(() => sync(next));
        return next;
      });
    },
    [loading, persistLocal, runSync]
  );

  useEffect(() => {
    let cancelled = false;

    async function init() {
      if (usingSupabase) {
        const remote = await loadFromSupabase();
        if (!cancelled && remote) {
          setData(remote);
          persistLocal(remote);
          setLoading(false);
          return;
        }
      }
      if (!cancelled) {
        const local = loadLocal();
        setData(local);
        setLoading(false);
      }
    }

    init();
    return () => {
      cancelled = true;
    };
  }, [usingSupabase, persistLocal]);

  const eventId = data.event.id;

  const summary = useMemo(
    () =>
      buildDashboardSummary(
        data.stalls,
        data.expenses,
        data.ticketSales,
        data.event.attendance_estimate
      ),
    [data]
  );

  const updateEvent = useCallback(
    (patch: Partial<Event>) => {
      apply(
        (d) => ({ ...d, event: { ...d.event, ...patch } }),
        async (next) => db.persistEvent(next.event)
      );
    },
    [apply]
  );

  const addStall = useCallback(
    (stall: Omit<Stall, "id" | "event_id">) => {
      const created: Stall = { ...stall, id: newId(), event_id: eventId };
      apply(
        (d) => ({ ...d, stalls: [...d.stalls, created] }),
        () => db.persistStall(created)
      );
    },
    [apply, eventId]
  );

  const updateStall = useCallback(
    (id: string, patch: Partial<Stall>) => {
      apply(
        (d) => ({
          ...d,
          stalls: d.stalls.map((s) => (s.id === id ? { ...s, ...patch } : s)),
        }),
        async (next) => {
          const stall = next.stalls.find((s) => s.id === id);
          if (stall) await db.persistStall(stall);
        }
      );
    },
    [apply]
  );

  const removeStall = useCallback(
    (id: string) => {
      apply(
        (d) => ({ ...d, stalls: d.stalls.filter((s) => s.id !== id) }),
        () => db.deleteStall(id)
      );
    },
    [apply]
  );

  const addExpense = useCallback(
    (expense: Omit<Expense, "id" | "event_id">) => {
      const created: Expense = { ...expense, id: newId(), event_id: eventId };
      apply(
        (d) => ({ ...d, expenses: [...d.expenses, created] }),
        () => db.persistExpense(created)
      );
    },
    [apply, eventId]
  );

  const updateExpense = useCallback(
    (id: string, patch: Partial<Expense>) => {
      apply(
        (d) => ({
          ...d,
          expenses: d.expenses.map((e) => (e.id === id ? { ...e, ...patch } : e)),
        }),
        async (next) => {
          const expense = next.expenses.find((e) => e.id === id);
          if (expense) await db.persistExpense(expense);
        }
      );
    },
    [apply]
  );

  const removeExpense = useCallback(
    (id: string) => {
      apply(
        (d) => ({ ...d, expenses: d.expenses.filter((e) => e.id !== id) }),
        () => db.deleteExpense(id)
      );
    },
    [apply]
  );

  const addSupplier = useCallback(
    (supplier: Omit<Supplier, "id" | "event_id">) => {
      const created: Supplier = { ...supplier, id: newId(), event_id: eventId };
      apply(
        (d) => ({ ...d, suppliers: [...d.suppliers, created] }),
        () => db.persistSupplier(created)
      );
    },
    [apply, eventId]
  );

  const updateSupplier = useCallback(
    (id: string, patch: Partial<Supplier>) => {
      apply(
        (d) => ({
          ...d,
          suppliers: d.suppliers.map((s) =>
            s.id === id ? { ...s, ...patch } : s
          ),
        }),
        async (next) => {
          const supplier = next.suppliers.find((s) => s.id === id);
          if (supplier) await db.persistSupplier(supplier);
        }
      );
    },
    [apply]
  );

  const removeSupplier = useCallback(
    (id: string) => {
      let affectedPurchaseIds: string[] = [];
      apply(
        (d) => {
          affectedPurchaseIds = d.purchases
            .filter((p) => p.supplier_id === id)
            .map((p) => p.id);
          return {
            ...d,
            suppliers: d.suppliers.filter((s) => s.id !== id),
            purchases: d.purchases.map((p) =>
              p.supplier_id === id ? { ...p, supplier_id: null } : p
            ),
          };
        },
        async (next) => {
          await db.deleteSupplier(id);
          for (const pid of affectedPurchaseIds) {
            const p = next.purchases.find((x) => x.id === pid);
            if (p) await db.persistPurchase(p);
          }
        }
      );
    },
    [apply]
  );

  const addPurchase = useCallback(
    (purchase: Omit<Purchase, "id" | "event_id">) => {
      const created: Purchase = { ...purchase, id: newId(), event_id: eventId };
      apply(
        (d) => ({ ...d, purchases: [...d.purchases, created] }),
        () => db.persistPurchase(created)
      );
    },
    [apply, eventId]
  );

  const updatePurchase = useCallback(
    (id: string, patch: Partial<Purchase>) => {
      apply(
        (d) => ({
          ...d,
          purchases: d.purchases.map((p) =>
            p.id === id ? { ...p, ...patch } : p
          ),
        }),
        async (next) => {
          const purchase = next.purchases.find((p) => p.id === id);
          if (purchase) await db.persistPurchase(purchase);
        }
      );
    },
    [apply]
  );

  const removePurchase = useCallback(
    (id: string) => {
      apply(
        (d) => ({ ...d, purchases: d.purchases.filter((p) => p.id !== id) }),
        () => db.deletePurchase(id)
      );
    },
    [apply]
  );

  const updateTicketSales = useCallback(
    (patch: Partial<TicketSales>) => {
      apply(
        (d) => ({
          ...d,
          ticketSales: { ...d.ticketSales, ...patch },
        }),
        async (next) => db.persistTicketSales(next.ticketSales)
      );
    },
    [apply]
  );

  const addVolunteer = useCallback(
    (volunteer: Omit<Volunteer, "id" | "event_id">) => {
      const created: Volunteer = { ...volunteer, id: newId(), event_id: eventId };
      apply(
        (d) => ({ ...d, volunteers: [...d.volunteers, created] }),
        () => db.persistVolunteer(created)
      );
    },
    [apply, eventId]
  );

  const updateVolunteer = useCallback(
    (id: string, patch: Partial<Volunteer>) => {
      apply(
        (d) => ({
          ...d,
          volunteers: d.volunteers.map((v) =>
            v.id === id ? { ...v, ...patch } : v
          ),
        }),
        async (next) => {
          const volunteer = next.volunteers.find((v) => v.id === id);
          if (volunteer) await db.persistVolunteer(volunteer);
        }
      );
    },
    [apply]
  );

  const removeVolunteer = useCallback(
    (id: string) => {
      apply(
        (d) => ({
          ...d,
          volunteers: d.volunteers.filter((v) => v.id !== id),
          shifts: d.shifts.filter((s) => s.volunteer_id !== id),
        }),
        () => db.deleteVolunteer(id)
      );
    },
    [apply]
  );

  const addShift = useCallback(
    (shift: Omit<VolunteerShift, "id" | "event_id">) => {
      const created: VolunteerShift = { ...shift, id: newId(), event_id: eventId };
      apply(
        (d) => ({ ...d, shifts: [...d.shifts, created] }),
        () => db.persistShift(created)
      );
    },
    [apply, eventId]
  );

  const updateShift = useCallback(
    (id: string, patch: Partial<VolunteerShift>) => {
      apply(
        (d) => ({
          ...d,
          shifts: d.shifts.map((s) => (s.id === id ? { ...s, ...patch } : s)),
        }),
        async (next) => {
          const shift = next.shifts.find((s) => s.id === id);
          if (shift) await db.persistShift(shift);
        }
      );
    },
    [apply]
  );

  const removeShift = useCallback(
    (id: string) => {
      apply(
        (d) => ({ ...d, shifts: d.shifts.filter((s) => s.id !== id) }),
        () => db.deleteShift(id)
      );
    },
    [apply]
  );

  const resetToSeed = useCallback(() => {
    setData(seedData);
    persistLocal(seedData);
    localStorage.removeItem(STORAGE_KEY);
    persistLocal(seedData);
    setSyncError(null);
  }, [persistLocal]);

  const value: EventContextValue = {
    data,
    summary,
    loading,
    usingSupabase,
    syncError,
    updateEvent,
    addStall,
    updateStall,
    removeStall,
    addExpense,
    updateExpense,
    removeExpense,
    addSupplier,
    updateSupplier,
    removeSupplier,
    addPurchase,
    updatePurchase,
    removePurchase,
    updateTicketSales,
    addVolunteer,
    updateVolunteer,
    removeVolunteer,
    addShift,
    updateShift,
    removeShift,
    resetToSeed,
  };

  return (
    <EventContext.Provider value={value}>{children}</EventContext.Provider>
  );
}

export function useEvent() {
  const ctx = useContext(EventContext);
  if (!ctx) throw new Error("useEvent must be used within EventProvider");
  return ctx;
}
