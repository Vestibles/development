import { stallMarginPercent, stallUnitProfit } from "./calculations";
import type { Stall, StallMetrics } from "./types";

export interface Insight {
  id: string;
  type: "pricing" | "warning" | "stock" | "tip";
  title: string;
  message: string;
  priority: "high" | "medium" | "low";
}

const TARGET_MARGIN = 40;

export function generateInsights(
  stalls: Stall[],
  attendanceEstimate: number
): Insight[] {
  const insights: Insight[] = [];
  const metrics = stalls.map((s) => ({
    stall: s,
    margin: stallMarginPercent(s.selling_price, s.item_cost),
    unitProfit: stallUnitProfit(s.selling_price, s.item_cost),
  }));

  for (const { stall, margin, unitProfit } of metrics) {
    if (margin < 20 && stall.selling_price > 0) {
      const suggested = stall.item_cost / (1 - TARGET_MARGIN / 100);
      insights.push({
        id: `pricing-${stall.id}`,
        type: "pricing",
        title: `Review pricing: ${stall.name}`,
        message: `Margin is ${margin.toFixed(0)}%. Consider raising the price to about £${suggested.toFixed(2)} for a healthier ${TARGET_MARGIN}% margin.`,
        priority: "high",
      });
    }

    if (unitProfit <= 0) {
      insights.push({
        id: `loss-${stall.id}`,
        type: "warning",
        title: `Low profit: ${stall.name}`,
        message:
          "This stall is not covering its costs per item. Increase the selling price or reduce supplier costs.",
        priority: "high",
      });
    }
  }

  const lowProfit = [...metrics]
    .filter((m) => m.unitProfit > 0)
    .sort((a, b) => a.unitProfit - b.unitProfit)[0];

  if (lowProfit && metrics.length > 1) {
    insights.push({
      id: "low-profit-stall",
      type: "warning",
      title: "Lowest margin stall",
      message: `${lowProfit.stall.name} has the smallest profit per item (£${lowProfit.unitProfit.toFixed(2)}). Focus volunteer support or simplify the menu.`,
      priority: "medium",
    });
  }

  if (attendanceEstimate > 0) {
    const totalUnits = stalls.reduce((sum, s) => sum + s.quantity, 0);
    const perGuest = totalUnits / attendanceEstimate;
    if (perGuest < 0.5) {
      insights.push({
        id: "stock-low",
        type: "stock",
        title: "Stock may run short",
        message: `Planned stock is only ${perGuest.toFixed(1)} items per expected guest. Consider increasing quantities for popular stalls.`,
        priority: "medium",
      });
    } else if (perGuest > 3) {
      insights.push({
        id: "stock-high",
        type: "stock",
        title: "Possible over-ordering",
        message: `You have ${perGuest.toFixed(1)} planned items per guest. Review quantities to reduce waste and upfront costs.`,
        priority: "low",
      });
    }
  }

  const topStall = stalls
    .map((s) => ({
      name: s.name,
      profit: stallUnitProfit(s.selling_price, s.item_cost) * s.quantity,
    }))
    .sort((a, b) => b.profit - a.profit)[0];

  if (topStall) {
    insights.push({
      id: "tip-top",
      type: "tip",
      title: "Star performer",
      message: `${topStall.name} is projected to raise the most profit. Make sure it is well staffed and visible on the day.`,
      priority: "low",
    });
  }

  return insights.sort((a, b) => {
    const order = { high: 0, medium: 1, low: 2 };
    return order[a.priority] - order[b.priority];
  });
}

export function suggestPrice(itemCost: number, targetMargin = TARGET_MARGIN): number {
  if (targetMargin >= 100) return itemCost;
  return itemCost / (1 - targetMargin / 100);
}

export function rankStallsByProfit(stalls: Stall[]): StallMetrics[] {
  return stalls
    .map((s) => ({
      id: s.id,
      name: s.name,
      revenue: s.selling_price * s.quantity,
      cost: s.item_cost * s.quantity,
      profit: (s.selling_price - s.item_cost) * s.quantity,
      marginPercent: stallMarginPercent(s.selling_price, s.item_cost),
      units: s.quantity,
    }))
    .sort((a, b) => b.profit - a.profit);
}
