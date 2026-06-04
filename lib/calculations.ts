import type {
  DashboardSummary,
  Expense,
  Purchase,
  Stall,
  StallMetrics,
  TicketSales,
} from "./types";

export function stallUnitProfit(sellingPrice: number, itemCost: number): number {
  return sellingPrice - itemCost;
}

export function stallMarginPercent(
  sellingPrice: number,
  itemCost: number
): number {
  if (sellingPrice <= 0) return 0;
  return ((sellingPrice - itemCost) / sellingPrice) * 100;
}

export function stallRevenue(stall: Stall): number {
  return stall.selling_price * stall.quantity;
}

export function stallTotalCost(stall: Stall): number {
  return stall.item_cost * stall.quantity;
}

export function stallProfit(stall: Stall): number {
  return stallUnitProfit(stall.selling_price, stall.item_cost) * stall.quantity;
}

export function stallMetrics(stall: Stall): StallMetrics {
  return {
    id: stall.id,
    name: stall.name,
    revenue: stallRevenue(stall),
    cost: stallTotalCost(stall),
    profit: stallProfit(stall),
    marginPercent: stallMarginPercent(stall.selling_price, stall.item_cost),
    units: stall.quantity,
  };
}

export function breakEvenUnits(
  fixedCost: number,
  sellingPrice: number,
  itemCost: number
): number {
  const unitProfit = stallUnitProfit(sellingPrice, itemCost);
  if (unitProfit <= 0) return Infinity;
  return Math.ceil(fixedCost / unitProfit);
}

export function requiredSalesForTarget(
  targetProfit: number,
  sellingPrice: number,
  itemCost: number
): number {
  const unitProfit = stallUnitProfit(sellingPrice, itemCost);
  if (unitProfit <= 0) return Infinity;
  return Math.ceil(targetProfit / unitProfit);
}

export function ticketRevenue(tickets: TicketSales): number {
  return (
    tickets.adult_count * tickets.adult_price +
    tickets.family_count * tickets.family_price +
    tickets.child_count * tickets.child_price +
    tickets.raffle_count * tickets.raffle_price
  );
}

export function totalStallRevenue(stalls: Stall[]): number {
  return stalls.reduce((sum, s) => sum + stallRevenue(s), 0);
}

export function totalStallProfit(stalls: Stall[]): number {
  return stalls.reduce((sum, s) => sum + stallProfit(s), 0);
}

export function totalExpenses(expenses: Expense[]): number {
  return expenses.reduce((sum, e) => sum + e.actual, 0);
}

export function totalExpenseBudget(expenses: Expense[]): number {
  return expenses.reduce((sum, e) => sum + e.budgeted, 0);
}

export function totalPurchaseActual(purchases: Purchase[]): number {
  return purchases.reduce((sum, p) => sum + p.actual, 0);
}

export function totalPurchaseBudget(purchases: Purchase[]): number {
  return purchases.reduce((sum, p) => sum + p.budgeted, 0);
}

export function buildDashboardSummary(
  stalls: Stall[],
  expenses: Expense[],
  tickets: TicketSales,
  attendanceEstimate: number
): DashboardSummary {
  const stallRev = totalStallRevenue(stalls);
  const ticketRev = ticketRevenue(tickets);
  const donationTotal = tickets.donations;
  const expectedRevenue = stallRev + ticketRev + donationTotal;
  const expectedExpenses =
    totalExpenses(expenses) +
    stalls.reduce((sum, s) => sum + stallTotalCost(s), 0);
  const projectedProfit = expectedRevenue - expectedExpenses;
  const topStalls = [...stalls]
    .map(stallMetrics)
    .sort((a, b) => b.profit - a.profit)
    .slice(0, 5);

  const marginPercent =
    expectedRevenue > 0 ? (projectedProfit / expectedRevenue) * 100 : 0;

  return {
    expectedRevenue,
    expectedExpenses,
    projectedProfit,
    attendanceEstimate,
    stallRevenue: stallRev,
    ticketRevenue: ticketRev,
    donationTotal,
    topStalls,
    marginPercent,
  };
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`;
}
