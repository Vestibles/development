"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { IconDelete } from "@/components/ui/IconDelete";
import { ExportPanel } from "@/components/export/ExportPanel";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Collapsible } from "@/components/ui/Collapsible";
import { SegmentTabs } from "@/components/ui/SegmentTabs";
import { StallProducts } from "@/components/stalls/StallProducts";
import { useEvent } from "@/lib/context/EventContext";
import { defaultProductForStall } from "@/lib/stalls/products";
import {
  formatCurrency,
  formatPercent,
  stallMetrics,
} from "@/lib/calculations";

type StallsTab = "stalls" | "expenses";

export default function StallsPage() {
  const { data, addStall, updateStall, removeStall, addExpense, updateExpense, removeExpense } =
    useEvent();
  const [tab, setTab] = useState<StallsTab>("stalls");
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [itemCost, setItemCost] = useState("1");
  const [sellingPrice, setSellingPrice] = useState("2.5");
  const [quantity, setQuantity] = useState("50");

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    const item_cost = parseFloat(itemCost) || 0;
    const selling_price = parseFloat(sellingPrice) || 0;
    const qty = parseInt(quantity, 10) || 0;
    addStall({
      name: name.trim() || "New stall",
      item_cost,
      selling_price,
      quantity: qty,
      products: [
        defaultProductForStall({
          name: name.trim() || "Main item",
          item_cost,
          selling_price,
          quantity: qty,
        }),
      ],
    });
    setName("");
    setShowForm(false);
  }

  return (
    <div className="space-y-4">
      <PageHeader
        title="Stalls"
        subtitle="Tap a stall or product to expand and edit"
      />

      <SegmentTabs
        tabs={[
          { id: "stalls", label: `Stalls (${data.stalls.length})` },
          { id: "expenses", label: `Expenses (${data.expenses.length})` },
        ]}
        active={tab}
        onChange={setTab}
      />

      {tab === "stalls" ? (
        <>
          <ExportPanel data={data} scope="stalls" variant="compact" />

          <Button fullWidth onClick={() => setShowForm(!showForm)}>
            <Plus className="h-5 w-5" aria-hidden />
            Add stall
          </Button>

          {showForm ? (
            <Card>
              <form onSubmit={handleAdd} className="space-y-3">
                <Field label="Stall name" value={name} onChange={(e) => setName(e.target.value)} required />
                <div className="grid grid-cols-2 gap-3">
                  <Field
                    label="Cost per item (£)"
                    type="number"
                    step="0.01"
                    min={0}
                    value={itemCost}
                    onChange={(e) => setItemCost(e.target.value)}
                  />
                  <Field
                    label="Selling price (£)"
                    type="number"
                    step="0.01"
                    min={0}
                    value={sellingPrice}
                    onChange={(e) => setSellingPrice(e.target.value)}
                  />
                </div>
                <Field
                  label="Quantity planned"
                  type="number"
                  min={0}
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                />
                <Button type="submit" fullWidth>
                  Save stall
                </Button>
              </form>
            </Card>
          ) : null}

          <div className="space-y-2">
            {data.stalls.map((stall) => {
              const metrics = stallMetrics(stall);
              return (
                <Collapsible
                  key={stall.id}
                  title={stall.name}
                  subtitle={`${formatCurrency(metrics.profit)} profit · ${formatPercent(metrics.marginPercent)} margin · ${metrics.units} items`}
                >
                  <div className="mb-2 flex justify-end">
                    <IconDelete
                      itemName={stall.name}
                      onDelete={() => removeStall(stall.id)}
                    />
                  </div>
                  <Field
                    label="Stall name"
                    value={stall.name}
                    onChange={(e) =>
                      updateStall(stall.id, { name: e.target.value })
                    }
                  />
                  <StallProducts
                    stall={stall}
                    onUpdate={(patch) => updateStall(stall.id, patch)}
                  />
                  <div className="mt-2">
                    <Field
                      label="Notes"
                      value={stall.notes ?? ""}
                      onChange={(e) =>
                        updateStall(stall.id, {
                          notes: e.target.value || null,
                        })
                      }
                    />
                  </div>
                  <dl className="mt-3 grid grid-cols-3 gap-2 rounded-xl bg-[var(--color-cream)] p-3 text-center text-sm">
                    <div>
                      <dt className="text-[var(--color-muted)]">Revenue</dt>
                      <dd className="font-semibold">{formatCurrency(metrics.revenue)}</dd>
                    </div>
                    <div>
                      <dt className="text-[var(--color-muted)]">Profit</dt>
                      <dd className="font-semibold text-[var(--color-sage-dark)]">
                        {formatCurrency(metrics.profit)}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-[var(--color-muted)]">Margin</dt>
                      <dd className="font-semibold">{formatPercent(metrics.marginPercent)}</dd>
                    </div>
                  </dl>
                </Collapsible>
              );
            })}
          </div>
        </>
      ) : (
        <section className="space-y-3">
          <ExportPanel data={data} scope="expenses" variant="compact" />
          {data.expenses.map((exp) => (
            <Collapsible
              key={exp.id}
              padding="sm"
              title={exp.description}
              subtitle={`${exp.category} · budget ${formatCurrency(exp.budgeted)}`}
            >
              <div className="mb-2 flex justify-end">
                <IconDelete
                  itemName={exp.description}
                  onDelete={() => removeExpense(exp.id)}
                />
              </div>
              <Field
                label="Description"
                value={exp.description}
                onChange={(e) =>
                  updateExpense(exp.id, { description: e.target.value })
                }
              />
              <div className="mt-2">
                <Field
                  label="Category"
                  value={exp.category}
                  onChange={(e) =>
                    updateExpense(exp.id, { category: e.target.value })
                  }
                />
              </div>
              <div className="mt-2 grid grid-cols-2 gap-2">
                <Field
                  label="Budget"
                  type="number"
                  value={exp.budgeted}
                  onChange={(e) =>
                    updateExpense(exp.id, { budgeted: parseFloat(e.target.value) || 0 })
                  }
                />
                <Field
                  label="Actual"
                  type="number"
                  value={exp.actual}
                  onChange={(e) =>
                    updateExpense(exp.id, { actual: parseFloat(e.target.value) || 0 })
                  }
                />
              </div>
            </Collapsible>
          ))}
          <Button
            variant="secondary"
            fullWidth
            onClick={() =>
              addExpense({
                category: "General",
                description: "New expense",
                budgeted: 0,
                actual: 0,
              })
            }
          >
            <Plus className="h-5 w-5" /> Add expense
          </Button>
        </section>
      )}
    </div>
  );
}
