import { CartItem, CartSummary, Painting } from "../types";

const STORAGE_KEY = "77art-shop-cart";
const PROMO_CODE = "SALE10";
const PROMO_DISCOUNT_RATE = 0.1;

export class CartModel {
  private items: CartItem[] = [];
  private isPromoApplied = false;

  private saveToStorage(): void {
    if (typeof window === "undefined" || typeof window.localStorage === "undefined") {
      return;
    }

    try {
      const data = JSON.stringify({
        items: this.items,
        isPromoApplied: this.isPromoApplied,
      });
      window.localStorage.setItem(STORAGE_KEY, data);
    } catch (error) {
      console.warn("Не удалось сохранить корзину в localStorage", error);
    }
  }

  private loadFromStorage(): void {
    if (typeof window === "undefined" || typeof window.localStorage === "undefined") {
      return;
    }

    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return;

      const parsed = JSON.parse(raw) as {
        items?: CartItem[];
        isPromoApplied?: boolean;
      };

      if (Array.isArray(parsed.items)) {
        this.items = parsed.items;
      }

      if (typeof parsed.isPromoApplied === "boolean") {
        this.isPromoApplied = parsed.isPromoApplied;
      }
    } catch {
      this.items = [];
      this.isPromoApplied = false;
    }
  }

  constructor() {
    this.loadFromStorage();
  }

  public getItems(): CartItem[] {
    return this.items.map((item) => ({ ...item }));
  }

  public getTotalCount(): number {
    return this.items.reduce((sum, item) => sum + item.quantity, 0);
  }

  public addItem(product: Painting): void {
    const existingItem = this.items.find((item) => item.product.id === product.id);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      this.items.push({ product, quantity: 1 });
    }
    this.saveToStorage();
  }

  public updateQuantity(productId: string, delta: number): void {
    const targetItem = this.items.find((item) => item.product.id === productId);
    if (!targetItem) return;

    targetItem.quantity = Math.max(1, targetItem.quantity + delta);

    this.saveToStorage();
  }

  public removeItem(productId: string): void {
    this.items = this.items.filter((item) => item.product.id !== productId);
    this.saveToStorage();
  }

  public applyPromo(code: string): boolean {
    const normalizedCode = code.trim().toUpperCase();

    if (normalizedCode === PROMO_CODE) {
      this.isPromoApplied = true;
      this.saveToStorage();

      return true;
    }
    return false;
  }

  public hasPromo(): boolean {
    return this.isPromoApplied;
  }

  public getSummary(): CartSummary {
    const subtotal = this.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

    const discount = this.isPromoApplied ? Math.round(subtotal * PROMO_DISCOUNT_RATE) : 0;

    const total = subtotal - discount;

    return { subtotal, discount, total };
  }

  public clear(): void {
    this.items = [];
    this.isPromoApplied = false;
    this.saveToStorage();
  }
}
