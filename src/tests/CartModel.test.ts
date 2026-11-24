import { describe, it, expect, beforeEach } from "vitest";
import { CartModel } from "../models/CartModel";
import { Painting } from "../types";

const mockPainting1: Painting = {
  id: "france-01",
  title: "Охота Амура",
  artist: "Марсель Руссо",
  country: "france",
  medium: "Холст, масло",
  size: "50x80",
  price: 14500,
  image: "france/amur-hunt.jpg",
};

const mockPainting2: Painting = {
  id: "germany-01",
  title: "Над городом",
  artist: "Курт Вернер",
  country: "germany",
  medium: "Цветная литография",
  size: "40x60",
  price: 16000,
  image: "germany/over-the-city.jpg",
};

describe("CartModel", () => {
  let cart: CartModel;

  beforeEach(() => {
    cart = new CartModel();
    cart.clear();
  });

  it("Возвращает нули для пустой корзины", () => {
    expect(cart.getItems()).toEqual([]);
    expect(cart.getTotalCount()).toBe(0);
    expect(cart.getSummary()).toEqual({
      subtotal: 0,
      discount: 0,
      total: 0,
    });
  });

  it("Добавляет новый товар и увеличивает количество при повторном добавлении", () => {
    cart.addItem(mockPainting1);
    expect(cart.getItems()).toHaveLength(1);
    expect(cart.getItems()[0].quantity).toBe(1);

    cart.addItem(mockPainting1);
    expect(cart.getItems()).toHaveLength(1);
    expect(cart.getItems()[0].quantity).toBe(2);
    expect(cart.getTotalCount()).toBe(2);
  });

  it("Изменяет количество товара и не позволяет опустить его ниже 1", () => {
    cart.addItem(mockPainting1);
    cart.updateQuantity("france-01", 2);
    expect(cart.getItems()[0].quantity).toBe(3);

    cart.updateQuantity("france-01", -10);
    expect(cart.getItems()[0].quantity).toBe(1);
  });

  it("Удаляет товар из корзины", () => {
    cart.addItem(mockPainting1);
    cart.addItem(mockPainting2);
    cart.removeItem("france-01");

    expect(cart.getItems()).toHaveLength(1);
    expect(cart.getItems()[0].product.id).toBe("germany-01");
  });

  it("Правильно считает сумму для нескольких товаров", () => {
    cart.addItem(mockPainting1);
    cart.addItem(mockPainting2);
    cart.addItem(mockPainting2);

    expect(cart.getSummary()).toEqual({
      subtotal: 46500,
      discount: 0,
      total: 46500,
    });
  });

  it("Применяет промокод SALE10 и не накапливает скидку при повторном вводе", () => {
    cart.addItem(mockPainting2);

    const isAppliedFirst = cart.applyPromo(" sale10 ");
    expect(isAppliedFirst).toBe(true);
    expect(cart.getSummary()).toEqual({
      subtotal: 16000,
      discount: 1600,
      total: 14400,
    });

    const isAppliedSecond = cart.applyPromo("SALE10");
    expect(isAppliedSecond).toBe(true);
    expect(cart.getSummary().discount).toBe(1600);
    expect(cart.getSummary().total).toBe(14400);
  });

  it("Игнорирует неизвестный промокод", () => {
    cart.addItem(mockPainting2);

    const isApplied = cart.applyPromo("FREE100");
    expect(isApplied).toBe(false);
    expect(cart.getSummary()).toEqual({
      subtotal: 16000,
      discount: 0,
      total: 16000,
    });
  });
});
