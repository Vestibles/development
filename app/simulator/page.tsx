"use client";

import { useMemo, useState } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Field } from "@/components/ui/Field";
import {
  breakEvenUnits,
  formatCurrency,
  formatPercent,
  requiredSalesForTarget,
  stallMarginPercent,
  stallUnitProfit,
} from "@/lib/calculations";
import { suggestPrice } from "@/lib/insights";

export default function SimulatorPage() {
  const [itemCost, setItemCost] = useState(1.2);
  const [sellingPrice, setSellingPrice] = useState(3);
  const [quantity, setQuantity] = useState(80);
  const [fixedCost, setFixedCost] = useState(50);
  const [targetProfit, setTargetProfit] = useState(100);

  const unitProfit = stallUnitProfit(sellingPrice, itemCost);
  const totalProfit = unitProfit * quantity;
  const margin = stallMarginPercent(sellingPrice, itemCost);
  const breakEven = breakEvenUnits(fixedCost, sellingPrice, itemCost);
  const salesNeeded = requiredSalesForTarget(
    targetProfit,
    sellingPrice,
    itemCost
  );
  const suggested = suggestPrice(itemCost);

  const profitColor = useMemo(() => {
    if (unitProfit <= 0) return "text-[var(--color-coral)]";
    if (margin < 30) return "text-amber-700";
    return "text-[var(--color-sage-dark)]";
  }, [unitProfit, margin]);

  return (
    <div className="space-y-5">
      <PageHeader
        title="Profit simulator"
        subtitle="Adjust prices and see results instantly"
      />

      <Card className="space-y-4">
        <Field
          label="Item cost (£)"
          type="number"
          step="0.01"
          min={0}
          value={itemCost}
          onChange={(e) => setItemCost(parseFloat(e.target.value) || 0)}
        />
        <Field
          label="Selling price (£)"
          type="number"
          step="0.01"
          min={0}
          value={sellingPrice}
          onChange={(e) => setSellingPrice(parseFloat(e.target.value) || 0)}
        />
        <Field
          label="Quantity to sell"
          type="number"
          min={0}
          value={quantity}
          onChange={(e) => setQuantity(parseInt(e.target.value, 10) || 0)}
        />
        <Field
          label="Fixed stall cost (£)"
          type="number"
          min={0}
          value={fixedCost}
          onChange={(e) => setFixedCost(parseFloat(e.target.value) || 0)}
          hint="e.g. gazebo hire, signage, initial stock"
        />
        <Field
          label="Target profit (£)"
          type="number"
          min={0}
          value={targetProfit}
          onChange={(e) => setTargetProfit(parseFloat(e.target.value) || 0)}
        />
      </Card>

      <Card>
        <h2 className="mb-3 text-sm font-semibold">Live results</h2>
        <dl className="space-y-3">
          <div className="flex justify-between">
            <dt className="text-[var(--color-muted)]">Profit per item</dt>
            <dd className={`font-semibold ${profitColor}`}>
              {formatCurrency(unitProfit)}
            </dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-[var(--color-muted)]">Total profit</dt>
            <dd className={`text-xl font-bold ${profitColor}`}>
              {formatCurrency(totalProfit)}
            </dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-[var(--color-muted)]">Margin</dt>
            <dd className="font-semibold">{formatPercent(margin)}</dd>
          </div>
          <div className="flex justify-between border-t border-[var(--color-border)] pt-3">
            <dt className="text-[var(--color-muted)]">Break-even units</dt>
            <dd className="font-semibold">
              {breakEven === Infinity ? "—" : breakEven}
            </dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-[var(--color-muted)]">Sales for target profit</dt>
            <dd className="font-semibold">
              {salesNeeded === Infinity ? "—" : salesNeeded}
            </dd>
          </div>
        </dl>
      </Card>

      <Card className="border-[var(--color-lavender)]/40 bg-[var(--color-lavender)]/10">
        <p className="text-sm font-medium text-[#6b5b8a]">Suggested price (40% margin)</p>
        <p className="mt-1 text-2xl font-bold">{formatCurrency(suggested)}</p>
        <p className="mt-2 text-xs text-[var(--color-muted)]">
          Based on your item cost. Round to a friendly price (e.g. £2.50).
        </p>
      </Card>
    </div>
  );
}
