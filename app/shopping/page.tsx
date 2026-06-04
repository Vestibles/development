"use client";

import { Plus } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Field, SelectField } from "@/components/ui/Field";
import { IconDelete } from "@/components/ui/IconDelete";
import { ExportPanel } from "@/components/export/ExportPanel";
import { useEvent } from "@/lib/context/EventContext";
import {
  formatCurrency,
  totalPurchaseActual,
  totalPurchaseBudget,
} from "@/lib/calculations";
import { CheckCircle2, Circle } from "lucide-react";

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

  const budgetTotal = totalPurchaseBudget(data.purchases);
  const actualTotal = totalPurchaseActual(data.purchases);
  const variance = budgetTotal - actualTotal;

  return (
    <div className="space-y-5">
      <PageHeader
        title="Shopping & stock"
        subtitle="Add, edit, or remove purchases and suppliers"
      />

      <ExportPanel data={data} scope="shopping" variant="compact" />

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

      <section>
        <h2 className="mb-2 text-sm font-semibold">Suppliers</h2>
        <ul className="space-y-2">
          {data.suppliers.map((s) => (
            <Card key={s.id} padding="sm">
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
            </Card>
          ))}
        </ul>
        <Button
          variant="secondary"
          fullWidth
          className="mt-2"
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

      <section className="space-y-3">
        <h2 className="text-sm font-semibold">Purchase list</h2>
        {data.purchases.map((p) => (
          <Card key={p.id}>
            <div className="mb-2 flex items-start justify-between gap-2">
              <button
                type="button"
                className="flex min-w-0 flex-1 items-center gap-2 text-left"
                onClick={() =>
                  updatePurchase(p.id, { purchased: !p.purchased })
                }
              >
                {p.purchased ? (
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-[var(--color-sage)]" />
                ) : (
                  <Circle className="h-5 w-5 shrink-0 text-[var(--color-muted)]" />
                )}
                <span className="font-medium">Mark purchased</span>
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
          </Card>
        ))}
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
    </div>
  );
}
