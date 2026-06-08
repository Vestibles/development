"use client";

import { useState } from "react";
import { Plus, CheckCircle2, Circle } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Field, SelectField } from "@/components/ui/Field";
import { IconDelete } from "@/components/ui/IconDelete";
import { Collapsible } from "@/components/ui/Collapsible";
import { SegmentTabs } from "@/components/ui/SegmentTabs";
import { ExportPanel } from "@/components/export/ExportPanel";
import { useEvent } from "@/lib/context/EventContext";
import {
  formatCurrency,
  totalPurchaseActual,
  totalPurchaseBudget,
} from "@/lib/calculations";

type ShopTab = "purchases" | "suppliers";

export default function ShoppingPage() {
  const {
    data,
    addPurchase,
    updatePurchase,
    removePurchase,
    addSupplier,
    updateSupplier,
    removeSupplier,
  } = useEvent();
  const [tab, setTab] = useState<ShopTab>("purchases");

  const budgetTotal = totalPurchaseBudget(data.purchases);
  const actualTotal = totalPurchaseActual(data.purchases);
  const variance = budgetTotal - actualTotal;

  return (
    <div className="space-y-4">
      <PageHeader
        title="Shopping & stock"
        subtitle="Tap items to expand — switch tabs to reduce scrolling"
      />

      <div className="grid grid-cols-3 gap-2">
        <Card padding="sm" className="text-center">
          <p className="text-xs text-[var(--color-muted)]">Budget</p>
          <p className="font-semibold">{formatCurrency(budgetTotal)}</p>
        </Card>
        <Card padding="sm" className="text-center">
          <p className="text-xs text-[var(--color-muted)]">Spent</p>
          <p className="font-semibold">{formatCurrency(actualTotal)}</p>
        </Card>
        <Card padding="sm" className="text-center">
          <p className="text-xs text-[var(--color-muted)]">Remaining</p>
          <p className="font-semibold text-[var(--color-sage-dark)]">
            {formatCurrency(variance)}
          </p>
        </Card>
      </div>

      <SegmentTabs
        tabs={[
          { id: "purchases", label: `Purchases (${data.purchases.length})` },
          { id: "suppliers", label: `Suppliers (${data.suppliers.length})` },
        ]}
        active={tab}
        onChange={setTab}
      />

      <ExportPanel data={data} scope="shopping" variant="compact" />

      {tab === "purchases" ? (
        <section className="space-y-2">
          {data.purchases.map((p) => {
            const supplier = data.suppliers.find((s) => s.id === p.supplier_id);
            return (
              <Collapsible
                key={p.id}
                padding="sm"
                title={p.item_name}
                subtitle={`${p.purchased ? "Purchased" : "To buy"} · ${formatCurrency(p.budgeted)} budget${supplier ? ` · ${supplier.name}` : ""}`}
              >
                <div className="mb-2 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    className="flex items-center gap-2 text-sm"
                    onClick={() =>
                      updatePurchase(p.id, { purchased: !p.purchased })
                    }
                  >
                    {p.purchased ? (
                      <CheckCircle2 className="h-5 w-5 text-[var(--color-sage)]" />
                    ) : (
                      <Circle className="h-5 w-5 text-[var(--color-muted)]" />
                    )}
                    Mark purchased
                  </button>
                  <IconDelete
                    itemName={p.item_name}
                    onDelete={() => removePurchase(p.id)}
                  />
                </div>
                <Field
                  label="Item name"
                  value={p.item_name}
                  onChange={(e) =>
                    updatePurchase(p.id, { item_name: e.target.value })
                  }
                />
                <div className="mt-2">
                  <SelectField
                    label="Supplier"
                    value={p.supplier_id ?? ""}
                    onChange={(e) =>
                      updatePurchase(p.id, {
                        supplier_id: e.target.value || null,
                      })
                    }
                  >
                    <option value="">None</option>
                    {data.suppliers.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </SelectField>
                </div>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  <Field
                    label="Budget"
                    type="number"
                    value={p.budgeted}
                    onChange={(e) =>
                      updatePurchase(p.id, {
                        budgeted: parseFloat(e.target.value) || 0,
                      })
                    }
                  />
                  <Field
                    label="Actual"
                    type="number"
                    value={p.actual}
                    onChange={(e) =>
                      updatePurchase(p.id, {
                        actual: parseFloat(e.target.value) || 0,
                      })
                    }
                  />
                  <Field
                    label="Stock on hand"
                    type="number"
                    min={0}
                    value={p.stock_on_hand}
                    onChange={(e) =>
                      updatePurchase(p.id, {
                        stock_on_hand: parseInt(e.target.value, 10) || 0,
                      })
                    }
                  />
                  <Field
                    label="Order qty"
                    type="number"
                    min={0}
                    value={p.quantity}
                    onChange={(e) =>
                      updatePurchase(p.id, {
                        quantity: parseInt(e.target.value, 10) || 0,
                      })
                    }
                  />
                </div>
              </Collapsible>
            );
          })}
          <Button
            fullWidth
            onClick={() =>
              addPurchase({
                supplier_id: data.suppliers[0]?.id ?? null,
                item_name: "New item",
                budgeted: 0,
                actual: 0,
                quantity: 1,
                stock_on_hand: 0,
                purchased: false,
              })
            }
          >
            <Plus className="h-5 w-5" /> Add purchase
          </Button>
        </section>
      ) : (
        <section className="space-y-2">
          {data.suppliers.map((s) => (
            <Collapsible
              key={s.id}
              padding="sm"
              title={s.name}
              subtitle={s.contact || "No contact yet"}
            >
              <div className="mb-2 flex justify-end">
                <IconDelete
                  itemName={s.name}
                  onDelete={() => removeSupplier(s.id)}
                />
              </div>
              <Field
                label="Supplier name"
                value={s.name}
                onChange={(e) => updateSupplier(s.id, { name: e.target.value })}
              />
              <div className="mt-2">
                <Field
                  label="Contact"
                  value={s.contact}
                  onChange={(e) =>
                    updateSupplier(s.id, { contact: e.target.value })
                  }
                />
              </div>
              <div className="mt-2">
                <Field
                  label="Notes"
                  value={s.notes ?? ""}
                  onChange={(e) =>
                    updateSupplier(s.id, {
                      notes: e.target.value || null,
                    })
                  }
                />
              </div>
            </Collapsible>
          ))}
          <Button
            variant="secondary"
            fullWidth
            onClick={() =>
              addSupplier({
                name: "New supplier",
                contact: "",
              })
            }
          >
            <Plus className="h-5 w-5" /> Add supplier
          </Button>
        </section>
      )}
    </div>
  );
}
