import { CartItem, CartSummary } from "../types";
import { createElement } from "../utils/dom";

export interface CartViewHandlers {
  onQuantityChange: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
  onApplyPromo: (code: string) => boolean;
  onCheckout: () => void;
  onGoToCatalog: () => void;
}

export interface CartRenderState {
  items: CartItem[];
  summary: CartSummary;
  hasPromo: boolean;
  isOrdered: boolean;
}

export class CartView {
  private formatPrice(price: number): string {
    return `${price.toLocaleString("ru-RU")} руб`;
  }

  private createMessageState(
    titleText: string,
    descText: string,
    onGoToCatalog: () => void
  ): HTMLElement {
    const box = createElement("div", { className: "cart-empty" });
    const title = createElement("h2", { className: "cart-empty__title", text: titleText });
    const desc = createElement("p", { className: "cart-empty__desc", text: descText });
    const button = createElement("button", {
      className: "btn-outline",
      text: "Перейти в каталог",
      attrs: { type: "button" },
    });

    button.addEventListener("click", onGoToCatalog);
    box.append(title, desc, button);

    return box;
  }

  private createCartItemElement(item: CartItem, handlers: CartViewHandlers): HTMLElement {
    const { product, quantity } = item;
    const row = createElement("article", { className: "cart-item" });

    const img = createElement("img", {
      className: "cart-item__img",
      attrs: { src: `./images/${product.image}`, alt: product.title },
    });

    const info = createElement("div", { className: "cart-item__info" });
    const artist = createElement("p", { className: "cart-item__artist", text: product.artist });
    const title = createElement("h3", { className: "cart-item__title", text: product.title });
    const meta = createElement("p", {
      className: "cart-item__meta",
      text: `${product.medium} (${product.size})`,
    });
    info.append(artist, title, meta);

    const controls = createElement("div", { className: "cart-item__controls" });
    const minusBtn = createElement("button", {
      className: "cart-qty-btn",
      text: "-",
      attrs: { type: "button", "aria-label": "Уменьшить количество" },
    });

    if (quantity <= 1) {
      minusBtn.disabled = true;
    }

    const qtyValue = createElement("span", { className: "cart-item__qty", text: String(quantity) });

    const plusBtn = createElement("button", {
      className: "cart-qty-btn",
      text: "+",
      attrs: { type: "button", "aria-label": "Увеличить количество" },
    });

    minusBtn.addEventListener("click", () => handlers.onQuantityChange(product.id, -1));
    plusBtn.addEventListener("click", () => handlers.onQuantityChange(product.id, 1));

    controls.append(minusBtn, qtyValue, plusBtn);

    const priceBlock = createElement("div", { className: "cart-item__price-block" });
    const itemTotal = createElement("p", {
      className: "cart-item__price",
      text: this.formatPrice(product.price * quantity),
    });
    const removeBtn = createElement("button", {
      className: "cart-item__remove",
      text: "Удалить",
      attrs: { type: "button" },
    });

    removeBtn.addEventListener("click", () => handlers.onRemoveItem(product.id));
    priceBlock.append(itemTotal, removeBtn);

    row.append(img, info, controls, priceBlock);
    return row;
  }

  private createSummaryPanel(state: CartRenderState, handlers: CartViewHandlers): HTMLElement {
    const aside = createElement("aside", { className: "cart-summary" });
    const heading = createElement("h2", { className: "cart-summary__title", text: "Ваш заказ" });

    const promoForm = createElement("form", { className: "cart-promo" });
    const promoInput = createElement("input", {
      className: "cart-promo__input",
      attrs: {
        type: "text",
        placeholder: "Промокод (SALE10)",
        value: state.hasPromo ? "SALE10" : "",
      },
    });

    const promoBtn = createElement("button", {
      className: "cart-promo__btn",
      text: state.hasPromo ? "Применён" : "Применить",
      attrs: { type: "submit" },
    });

    if (state.hasPromo) {
      promoInput.disabled = true;
      promoBtn.disabled = true;
    }

    const promoStatus = createElement("p", {
      className: "cart-promo__status",
      text: state.hasPromo ? "Скидка 10% активирована" : "",
    });

    promoForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const isOk = handlers.onApplyPromo(promoInput.value);

      if (!isOk) {
        promoStatus.textContent = "Неверный промокод";
        promoStatus.classList.add("cart-promo__status--error");
      }
    });

    promoForm.append(promoInput, promoBtn);

    const details = createElement("div", { className: "cart-summary__details" });

    const subtotalRow = createElement("div", { className: "cart-summary__row" });

    subtotalRow.append(
      createElement("span", { text: "Товары" }),
      createElement("span", { text: this.formatPrice(state.summary.subtotal) })
    );
    details.append(subtotalRow);

    if (state.summary.discount > 0) {
      const discountRow = createElement("div", {
        className: "cart-summary__row cart-summary__row--discount",
      });
      discountRow.append(
        createElement("span", { text: "Скидка (10%):" }),
        createElement("span", { text: `-${this.formatPrice(state.summary.discount)}` })
      );
      details.append(discountRow);
    }

    const totalRow = createElement("div", {
      className: "cart-summary__row cart-summary__row--total",
    });
    totalRow.append(
      createElement("span", { text: "Итого:" }),
      createElement("span", { text: this.formatPrice(state.summary.total) })
    );
    details.append(totalRow);

    const checkoutBtn = createElement("button", {
      className: "btn-outline cart-summary__checkout",
      text: "Оформить заказ",
      attrs: { type: "button" },
    });

    checkoutBtn.addEventListener("click", handlers.onCheckout);

    aside.append(heading, promoForm, promoStatus, details, checkoutBtn);

    return aside;
  }

  public render(container: HTMLElement, state: CartRenderState, handlers: CartViewHandlers): void {
    container.replaceChildren();

    const wrapper = createElement("section", { className: "container cart" });
    const pageTitle = createElement("h1", { className: "cart-heading", text: "Корзина" });

    wrapper.append(pageTitle);

    if (state.isOrdered) {
      wrapper.append(
        this.createMessageState(
          "Спасибо за заказ!",
          "Мы свяжемся с вами в ближайшее время для уточнения деталей доставки.",
          handlers.onGoToCatalog
        )
      );
      container.append(wrapper);

      return;
    }

    if (state.items.length === 0) {
      wrapper.append(
        this.createMessageState(
          "Корзина пока пуста",
          "выберите понравившиеся репродукции в нашем каталоге.",
          handlers.onGoToCatalog
        )
      );
      container.append(wrapper);

      return;
    }

    const layout = createElement("div", { className: "cart__layout" });
    const list = createElement("div", { className: "cart__list" });

    state.items.forEach((item) => {
      list.append(this.createCartItemElement(item, handlers));
    });

    const summaryPanel = this.createSummaryPanel(state, handlers);

    layout.append(list, summaryPanel);
    wrapper.append(layout);
    container.append(wrapper);
  }
}
