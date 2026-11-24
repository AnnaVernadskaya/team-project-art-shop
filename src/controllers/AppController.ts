import { Route } from "../types";
import { createElement } from "../utils/dom";
import { LayoutView } from "../views/LayoutView";
import { AboutView } from "../views/AboutView";

export class AppController {
  private layout: LayoutView;
  private aboutView: AboutView;

  constructor() {
    this.layout = new LayoutView();
    this.aboutView = new AboutView();
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
        container.append(this.createPlaceholder("Репродукции", "Каталог в разработке"));
        break;
      case "cart":
        container.append(this.createPlaceholder("Корзина", "Корзина в разработке"));
        break;
    }
  }

  public init(): void {
    this.layout.bindNavigation((route) => this.navigate(route));
    this.navigate("about");
  }
}
