import { CartModel } from "../models/CartModel";
import { CartView } from "../views/CartView";

export class CartController {
  private model: CartModel;
  private view: CartView;
  private onCartUpdate: (totalCount: number) => void;
  private onGoToCatalog: () => void;
  private isOrdered = false;

  constructor(
    model: CartModel,
    onCartUpdate: (totalCount: number) => void,
    onGoToCatalog: () => void
  ) {
    this.model = model;
    this.view = new CartView();
    this.onCartUpdate = onCartUpdate;
    this.onGoToCatalog = onGoToCatalog;
  }

  public render(container: HTMLElement): void {
    this.view.render(
      container,
      {
        items: this.model.getItems(),
        summary: this.model.getSummary(),
        hasPromo: this.model.hasPromo(),
        isOrdered: this.isOrdered,
      },
      {
        onQuantityChange: (productId, delta) => {
          this.model.updateQuantity(productId, delta);
          this.onCartUpdate(this.model.getTotalCount());
          this.render(container);
        },
        onRemoveItem: (productId) => {
          this.model.removeItem(productId);
          this.onCartUpdate(this.model.getTotalCount());
          this.render(container);
        },
        onApplyPromo: (code) => {
          const isApplied = this.model.applyPromo(code);

          if (isApplied) {
            this.render(container);
          }
          return isApplied;
        },
        onCheckout: () => {
          this.model.clear();
          this.isOrdered = true;
          this.onCartUpdate(0);
          this.render(container);
        },
        onGoToCatalog: () => {
          this.isOrdered = false;
          this.onGoToCatalog();
        },
      }
    );
  }
}
