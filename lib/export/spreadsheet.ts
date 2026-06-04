import {
  buildDashboardSummary,
  stallMarginPercent,
  stallProfit,
  stallRevenue,
  stallTotalCost,
  ticketRevenue,
} from "../calculations";
import type { AppData, DashboardSummary } from "../types";

export type ExportScope =
  | "all"
  | "summary"
  | "stalls"
  | "expenses"
  | "shopping"
  | "tickets"
  | "volunteers";

type XLSXModule = typeof import("xlsx");

async function loadXlsx(): Promise<XLSXModule> {
  return import("xlsx");
}

function safeFilename(name: string): string {
  return name.replace(/[^\w\s-]/g, "").replace(/\s+/g, "-").slice(0, 60);
}

function supplierName(data: AppData, id: string | null): string {
  if (!id) return "";
  return data.suppliers.find((s) => s.id === id)?.name ?? "";
}

function volunteerName(data: AppData, id: string): string {
  return data.volunteers.find((v) => v.id === id)?.name ?? "";
}

function summaryRows(data: AppData, summary: DashboardSummary): (string | number)[][] {
  return [
    ["Fun Day Planner — Export"],
    ["Generated", new Date().toLocaleString("en-GB")],
    [],
    ["Event", data.event.name],
    ["Date", data.event.event_date ?? ""],
    ["Attendance estimate", data.event.attendance_estimate],
    [],
    ["Financial summary"],
    ["Expected revenue", summary.expectedRevenue],
    ["Stall revenue", summary.stallRevenue],
    ["Ticket revenue", summary.ticketRevenue],
    ["Donations", summary.donationTotal],
    ["Expected expenses", summary.expectedExpenses],
    ["Projected profit", summary.projectedProfit],
    ["Overall margin %", Number(summary.marginPercent.toFixed(1))],
  ];
}

function stallsRows(data: AppData): Record<string, string | number | boolean>[] {
  return data.stalls.map((s) => ({
    Name: s.name,
    "Cost per item": s.item_cost,
    "Selling price": s.selling_price,
    Quantity: s.quantity,
    Revenue: stallRevenue(s),
    "Total cost": stallTotalCost(s),
    Profit: stallProfit(s),
    "Margin %": Number(stallMarginPercent(s.selling_price, s.item_cost).toFixed(1)),
    Notes: s.notes ?? "",
  }));
}

function expensesRows(data: AppData): Record<string, string | number>[] {
  return data.expenses.map((e) => ({
    Category: e.category,
    Description: e.description,
    Budgeted: e.budgeted,
    Actual: e.actual,
    Variance: e.budgeted - e.actual,
  }));
}

function suppliersRows(data: AppData): Record<string, string | number | boolean>[] {
  return data.suppliers.map((s) => ({
    Name: s.name,
    Contact: s.contact,
    Notes: s.notes ?? "",
  }));
}

function purchasesRows(data: AppData): Record<string, string | number | boolean>[] {
  return data.purchases.map((p) => ({
    Item: p.item_name,
    Supplier: supplierName(data, p.supplier_id),
    Budgeted: p.budgeted,
    Actual: p.actual,
    "Order qty": p.quantity,
    "Stock on hand": p.stock_on_hand,
    Purchased: p.purchased ? "Yes" : "No",
  }));
}

function ticketsRows(data: AppData): Record<string, string | number>[] {
  const t = data.ticketSales;
  return [
    {
      Type: "Adult",
      Count: t.adult_count,
      "Price each": t.adult_price,
      Subtotal: t.adult_count * t.adult_price,
    },
    {
      Type: "Family",
      Count: t.family_count,
      "Price each": t.family_price,
      Subtotal: t.family_count * t.family_price,
    },
    {
      Type: "Child",
      Count: t.child_count,
      "Price each": t.child_price,
      Subtotal: t.child_count * t.child_price,
    },
    {
      Type: "Raffle",
      Count: t.raffle_count,
      "Price each": t.raffle_price,
      Subtotal: t.raffle_count * t.raffle_price,
    },
    {
      Type: "Donations",
      Count: 1,
      "Price each": t.donations,
      Subtotal: t.donations,
    },
    {
      Type: "TOTAL",
      Count: "",
      "Price each": "",
      Subtotal: ticketRevenue(t) + t.donations,
    },
  ];
}

function volunteersRows(data: AppData): Record<string, string | number | boolean>[] {
  return data.volunteers.map((v) => ({
    Name: v.name,
    Role: v.role,
    Phone: v.phone,
    Email: v.email,
    Notes: v.notes ?? "",
  }));
}

function shiftsRows(data: AppData): Record<string, string | number | boolean>[] {
  return data.shifts.map((sh) => ({
    Volunteer: volunteerName(data, sh.volunteer_id),
    "Stall / area": sh.stall_or_area,
    Start: sh.shift_start,
    End: sh.shift_end,
    Notes: sh.notes ?? "",
  }));
}

function buildWorkbook(
  XLSX: XLSXModule,
  data: AppData,
  scope: ExportScope = "all"
): import("xlsx").WorkBook {
  const summary = buildDashboardSummary(
    data.stalls,
    data.expenses,
    data.ticketSales,
    data.event.attendance_estimate
  );
  const wb = XLSX.utils.book_new();

  const appendJson = (
    name: string,
    rows: Record<string, string | number | boolean>[]
  ) => {
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(rows), name.slice(0, 31));
  };

  const appendAoa = (name: string, rows: (string | number)[][]) => {
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(rows), name.slice(0, 31));
  };

  if (scope === "all" || scope === "summary") {
    appendAoa("Summary", summaryRows(data, summary));
  }
  if (scope === "all" || scope === "stalls") {
    appendJson("Stalls", stallsRows(data));
  }
  if (scope === "all" || scope === "expenses") {
    appendJson("Expenses", expensesRows(data));
  }
  if (scope === "all" || scope === "shopping") {
    appendJson("Suppliers", suppliersRows(data));
    appendJson("Purchases", purchasesRows(data));
  }
  if (scope === "all" || scope === "tickets") {
    appendJson("Tickets", ticketsRows(data));
  }
  if (scope === "all" || scope === "volunteers") {
    appendJson("Volunteers", volunteersRows(data));
    appendJson("Shifts", shiftsRows(data));
  }

  return wb;
}

export async function downloadExcel(
  data: AppData,
  scope: ExportScope = "all"
): Promise<void> {
  const XLSX = await loadXlsx();
  const wb = buildWorkbook(XLSX, data, scope);
  const base = safeFilename(data.event.name) || "fun-day";
  const suffix = scope === "all" ? "full-report" : scope;
  XLSX.writeFile(wb, `${base}-${suffix}.xlsx`);
}

export async function downloadCsv(
  data: AppData,
  scope: ExportScope = "all"
): Promise<void> {
  const XLSX = await loadXlsx();
  const wb = buildWorkbook(XLSX, data, scope);
  const base = safeFilename(data.event.name) || "fun-day";
  const suffix = scope === "all" ? "full-report" : scope;

  if (scope === "all") {
    for (const sheetName of wb.SheetNames) {
      const csv = XLSX.utils.sheet_to_csv(wb.Sheets[sheetName]);
      triggerDownload(
        `${base}-${sheetName.toLowerCase().replace(/\s+/g, "-")}.csv`,
        csv
      );
    }
    return;
  }

  const sheet = wb.Sheets[wb.SheetNames[0]];
  const csv = XLSX.utils.sheet_to_csv(sheet);
  triggerDownload(`${base}-${suffix}.csv`, csv);
}

export async function copyForGoogleSheets(data: AppData): Promise<void> {
  const summary = buildDashboardSummary(
    data.stalls,
    data.expenses,
    data.ticketSales,
    data.event.attendance_estimate
  );
  const lines: string[] = [];
  const add = (row: (string | number)[]) => lines.push(row.join("\t"));

  add(["Fun Day Planner"]);
  add(["Event", data.event.name]);
  add(["Date", data.event.event_date ?? ""]);
  add(["Attendance", data.event.attendance_estimate]);
  add([]);
  add(["Metric", "Value"]);
  add(["Expected revenue", summary.expectedRevenue]);
  add(["Expected expenses", summary.expectedExpenses]);
  add(["Projected profit", summary.projectedProfit]);
  add([]);
  add(["Stalls", "Cost", "Price", "Qty", "Profit"]);
  data.stalls.forEach((s) => {
    add([s.name, s.item_cost, s.selling_price, s.quantity, stallProfit(s)]);
  });

  await navigator.clipboard.writeText(lines.join("\n"));
}

function triggerDownload(filename: string, content: string) {
  const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export const EXPORT_SCOPE_LABELS: Record<ExportScope, string> = {
  all: "Full report",
  summary: "Dashboard summary",
  stalls: "Stalls",
  expenses: "Expenses",
  shopping: "Shopping & stock",
  tickets: "Tickets & donations",
  volunteers: "Volunteers & shifts",
};
