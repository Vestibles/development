import { getSupabase } from "./client";
import type {
  Event,
  Expense,
  Purchase,
  Stall,
  Supplier,
  TicketSales,
  Volunteer,
  VolunteerShift,
} from "../types";

async function client() {
  const supabase = getSupabase();
  if (!supabase) return null;
  return supabase;
}

export async function persistEvent(event: Event): Promise<void> {
  const supabase = await client();
  if (!supabase) return;
  await supabase.from("events").upsert({
    id: event.id,
    name: event.name,
    event_date: event.event_date,
    attendance_estimate: event.attendance_estimate,
  });
}

export async function persistStall(stall: Stall): Promise<void> {
  const supabase = await client();
  if (!supabase) return;
  await supabase.from("stalls").upsert({
    id: stall.id,
    event_id: stall.event_id,
    name: stall.name,
    item_cost: stall.item_cost,
    selling_price: stall.selling_price,
    quantity: stall.quantity,
    notes: stall.notes ?? null,
    products: stall.products ?? [],
  });
}

export async function deleteStall(id: string): Promise<void> {
  const supabase = await client();
  if (!supabase) return;
  await supabase.from("stalls").delete().eq("id", id);
}

export async function persistExpense(expense: Expense): Promise<void> {
  const supabase = await client();
  if (!supabase) return;
  await supabase.from("expenses").upsert({
    id: expense.id,
    event_id: expense.event_id,
    category: expense.category,
    description: expense.description,
    budgeted: expense.budgeted,
    actual: expense.actual,
  });
}

export async function deleteExpense(id: string): Promise<void> {
  const supabase = await client();
  if (!supabase) return;
  await supabase.from("expenses").delete().eq("id", id);
}

export async function persistSupplier(supplier: Supplier): Promise<void> {
  const supabase = await client();
  if (!supabase) return;
  await supabase.from("suppliers").upsert({
    id: supplier.id,
    event_id: supplier.event_id,
    name: supplier.name,
    contact: supplier.contact,
    notes: supplier.notes ?? null,
  });
}

export async function deleteSupplier(id: string): Promise<void> {
  const supabase = await client();
  if (!supabase) return;
  await supabase.from("suppliers").delete().eq("id", id);
}

export async function persistPurchase(purchase: Purchase): Promise<void> {
  const supabase = await client();
  if (!supabase) return;
  await supabase.from("purchases").upsert({
    id: purchase.id,
    event_id: purchase.event_id,
    supplier_id: purchase.supplier_id,
    item_name: purchase.item_name,
    budgeted: purchase.budgeted,
    actual: purchase.actual,
    quantity: purchase.quantity,
    stock_on_hand: purchase.stock_on_hand,
    purchased: purchase.purchased,
  });
}

export async function deletePurchase(id: string): Promise<void> {
  const supabase = await client();
  if (!supabase) return;
  await supabase.from("purchases").delete().eq("id", id);
}

export async function persistTicketSales(tickets: TicketSales): Promise<void> {
  const supabase = await client();
  if (!supabase) return;
  await supabase.from("ticket_sales").upsert({
    id: tickets.id,
    event_id: tickets.event_id,
    adult_count: tickets.adult_count,
    adult_price: tickets.adult_price,
    family_count: tickets.family_count,
    family_price: tickets.family_price,
    child_count: tickets.child_count,
    child_price: tickets.child_price,
    raffle_count: tickets.raffle_count,
    raffle_price: tickets.raffle_price,
    donations: tickets.donations,
  });
}

export async function persistVolunteer(volunteer: Volunteer): Promise<void> {
  const supabase = await client();
  if (!supabase) return;
  await supabase.from("volunteers").upsert({
    id: volunteer.id,
    event_id: volunteer.event_id,
    name: volunteer.name,
    email: volunteer.email,
    phone: volunteer.phone,
    role: volunteer.role,
    notes: volunteer.notes ?? null,
  });
}

export async function deleteVolunteer(id: string): Promise<void> {
  const supabase = await client();
  if (!supabase) return;
  await supabase.from("volunteer_shifts").delete().eq("volunteer_id", id);
  await supabase.from("volunteers").delete().eq("id", id);
}

export async function persistShift(shift: VolunteerShift): Promise<void> {
  const supabase = await client();
  if (!supabase) return;
  await supabase.from("volunteer_shifts").upsert({
    id: shift.id,
    event_id: shift.event_id,
    volunteer_id: shift.volunteer_id,
    stall_or_area: shift.stall_or_area,
    shift_start: shift.shift_start,
    shift_end: shift.shift_end,
    notes: shift.notes ?? null,
  });
}

export async function deleteShift(id: string): Promise<void> {
  const supabase = await client();
  if (!supabase) return;
  await supabase.from("volunteer_shifts").delete().eq("id", id);
}
