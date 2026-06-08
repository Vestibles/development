import { newId } from "../id";
import type { Stall, StallProduct } from "../types";

export function getStallProducts(stall: Stall): StallProduct[] {
  if (stall.products && stall.products.length > 0) {
    return stall.products;
  }
  return [
    {
      id: `${stall.id}-default`,
      name: stall.name,
      item_cost: stall.item_cost,
      selling_price: stall.selling_price,
      quantity: stall.quantity,
    },
  ];
}

/** Keep legacy stall totals in sync when products change. */
export function stallPatchFromProducts(products: StallProduct[]): Pick<
  Stall,
  "products" | "item_cost" | "selling_price" | "quantity"
> {
  const quantity = products.reduce((sum, p) => sum + p.quantity, 0);
  const revenue = products.reduce(
    (sum, p) => sum + p.selling_price * p.quantity,
    0
  );
  const cost = products.reduce((sum, p) => sum + p.item_cost * p.quantity, 0);

  return {
    products,
    quantity,
    selling_price: quantity > 0 ? revenue / quantity : 0,
    item_cost: quantity > 0 ? cost / quantity : 0,
  };
}

export function addProductToStall(
  stall: Stall,
  product: Omit<StallProduct, "id">
): Pick<Stall, "products" | "item_cost" | "selling_price" | "quantity"> {
  const products = [
    ...getStallProducts(stall).filter((p) => !p.id.endsWith("-default")),
    { ...product, id: newId() },
  ];
  return stallPatchFromProducts(products);
}

export function updateProductOnStall(
  stall: Stall,
  productId: string,
  patch: Partial<StallProduct>
): Pick<Stall, "products" | "item_cost" | "selling_price" | "quantity"> {
  const products = getStallProducts(stall).map((p) =>
    p.id === productId ? { ...p, ...patch } : p
  );
  return stallPatchFromProducts(products);
}

export function removeProductFromStall(
  stall: Stall,
  productId: string
): Pick<Stall, "products" | "item_cost" | "selling_price" | "quantity"> | null {
  const products = getStallProducts(stall).filter((p) => p.id !== productId);
  if (products.length === 0) return null;
  return stallPatchFromProducts(products);
}

export function defaultProductForStall(
  stall: Pick<Stall, "name" | "item_cost" | "selling_price" | "quantity">
): StallProduct {
  return {
    id: newId(),
    name: stall.name || "Main item",
    item_cost: stall.item_cost,
    selling_price: stall.selling_price,
    quantity: stall.quantity,
  };
}
