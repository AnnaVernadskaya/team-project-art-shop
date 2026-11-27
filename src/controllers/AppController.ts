import { Route } from "../types";
import { createElement } from "../utils/dom";
import { LayoutView } from "../views/LayoutView";
import { AboutView } from "../views/AboutView";
import { renderCatalog } from "./CatalogController";
import { CartModel } from "../models/CartModel";
import { CartController } from "./CartController";

export class AppController {
  private layout: LayoutView;
  private aboutView: AboutView;
  private cartModel: CartModel;
  private cartController: CartController;

  constructor() {
    this.layout = new LayoutView();
    this.aboutView = new AboutView();
    this.cartModel = new CartModel();
    this.cartController = new CartController(
      this.cartModel,
      (count) => this.layout.updateCartBadge(count),
      () => this.navigate("catalog")
    );
  }

  private createPlaceholder(title: string, description: string): HTMLElement {
    const section = createElement("section", { className: "container" });
    const heading = createElement("h1", { text: title });
    const paragraph = createElement("p", { text: description });

    section.append(heading, paragraph);

    return section;
  }

  public navigate(route: Route): void {
    const container = this.layout.getContentContainer();

    container.replaceChildren();
    this.layout.setActiveRoute(route);

    switch (route) {
      case "about":
        this.aboutView.render(container, () => this.navigate("catalog"));
        break;
      case "catalog":
        renderCatalog(container);
        break;
      case "cart":
        this.cartController.render(container);
        break;
    }
  }

  public init(): void {
    this.layout.updateCartBadge(this.cartModel.getTotalCount());
    this.layout.bindNavigation((route) => this.navigate(route));
    this.navigate("about");
  }
}
