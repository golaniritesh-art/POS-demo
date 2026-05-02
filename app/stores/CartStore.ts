import { makeAutoObservable } from "mobx";
import { CartRow, database } from "../db/database";
import { Product, ProductVariant } from "../models/Product";

class CartStore {
  items: CartRow[] = [];

  constructor() {
    makeAutoObservable(this);
    this.load();
  }

  load() {
    database.initialize();
    this.items = database.getCartItems();
  }

  add(product: Product, variant: ProductVariant) {
    const stock = database.getVariantStock(variant.id);
    const existing = this.items.find(item => item.variantId === variant.id);
    const currentQty = existing?.qty ?? 0;

    if (currentQty >= stock) {
      return {
        added: false,
        message: `Only ${stock} ${product.name} (${variant.size || "one size"} ${variant.color || ""}) in stock.`
      };
    }

    if (existing) {
      existing.qty += 1;
      database.upsertCartItem(existing);
      this.load();
      return { added: true };
    }

    database.upsertCartItem({
      id: `cart-${variant.id}`,
      productId: product.id,
      variantId: variant.id,
      name: product.name,
      sku: variant.sku,
      size: variant.size,
      color: variant.color,
      qty: 1,
      price: product.price
    });
    this.load();
    return { added: true };
  }

  clear() {
    database.clearCart();
    this.load();
  }

  completeSale(cardLast4: string) {
    database.createSale({
      subtotal: this.subtotal,
      tax: this.tax,
      total: this.total,
      cardLast4,
      items: this.items
    });
    this.load();
  }

  get subtotal() {
    return this.items.reduce((sum, item) => sum + item.price * item.qty, 0);
  }

  get tax() {
    return this.subtotal * 0.08;
  }

  get total() {
    return this.subtotal + this.tax;
  }
}

export const cartStore = new CartStore();
