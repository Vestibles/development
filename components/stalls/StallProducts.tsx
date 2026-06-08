"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Collapsible } from "@/components/ui/Collapsible";
import { Field } from "@/components/ui/Field";
import { IconDelete } from "@/components/ui/IconDelete";
import {
  addProductToStall,
  getStallProducts,
  removeProductFromStall,
  updateProductOnStall,
} from "@/lib/stalls/products";
import {
  formatCurrency,
  formatPercent,
  stallMarginPercent,
  stallUnitProfit,
} from "@/lib/calculations";
import type { Stall } from "@/lib/types";

interface StallProductsProps {
  stall: Stall;
  onUpdate: (
    patch: Pick<Stall, "products" | "item_cost" | "selling_price" | "quantity">
  ) => void;
}

export function StallProducts({ stall, onUpdate }: StallProductsProps) {
  const products = getStallProducts(stall);

  return (
    <div className="space-y-2 border-t border-[var(--color-border)] pt-3">
      <div className="flex items-center justify-between gap-2">
        <h4 className="text-sm font-semibold">
          Products ({products.length})
        </h4>
        <Button
          variant="ghost"
          className="min-h-9 px-3 py-1 text-sm"
          onClick={() =>
            onUpdate(
              addProductToStall(stall, {
                name: "New product",
                item_cost: 0,
                selling_price: 0,
                quantity: 0,
              })
            )
          }
        >
          <Plus className="h-4 w-4" aria-hidden />
          Add
        </Button>
      </div>

      <div className="space-y-2">
        {products.map((product) => {
          const unitProfit = stallUnitProfit(
            product.selling_price,
            product.item_cost
          );
          const margin = stallMarginPercent(
            product.selling_price,
            product.item_cost
          );

          return (
            <Collapsible
              key={product.id}
              padding="sm"
              title={product.name}
              subtitle={`${formatCurrency(product.selling_price)} · qty ${product.quantity} · ${formatPercent(margin)} margin`}
            >
              <div className="mb-2 flex justify-end">
                <IconDelete
                  itemName={product.name}
                  onDelete={() => {
                    const patch = removeProductFromStall(stall, product.id);
                    if (patch) onUpdate(patch);
                  }}
                />
              </div>
              <Field
                label="Product name"
                value={product.name}
                onChange={(e) =>
                  onUpdate(
                    updateProductOnStall(stall, product.id, {
                      name: e.target.value,
                    })
                  )
                }
              />
              <div className="mt-2 grid grid-cols-2 gap-2">
                <Field
                  label="Cost (£)"
                  type="number"
                  step="0.01"
                  min={0}
                  value={product.item_cost}
                  onChange={(e) =>
                    onUpdate(
                      updateProductOnStall(stall, product.id, {
                        item_cost: parseFloat(e.target.value) || 0,
                      })
                    )
                  }
                />
                <Field
                  label="Price (£)"
                  type="number"
                  step="0.01"
                  min={0}
                  value={product.selling_price}
                  onChange={(e) =>
                    onUpdate(
                      updateProductOnStall(stall, product.id, {
                        selling_price: parseFloat(e.target.value) || 0,
                      })
                    )
                  }
                />
                <Field
                  label="Quantity"
                  type="number"
                  min={0}
                  value={product.quantity}
                  onChange={(e) =>
                    onUpdate(
                      updateProductOnStall(stall, product.id, {
                        quantity: parseInt(e.target.value, 10) || 0,
                      })
                    )
                  }
                />
              </div>
              <p className="mt-2 text-xs text-[var(--color-muted)]">
                Profit {formatCurrency(unitProfit)} / item
              </p>
            </Collapsible>
          );
        })}
      </div>
    </div>
  );
}
