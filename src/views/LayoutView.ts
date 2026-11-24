import { Route } from "../types";
import { createElement } from "../utils/dom";

export class LayoutView {
  private mainContainer: HTMLElement;
  private cartBadge!: HTMLElement;
  private navButtons: HTMLButtonElement[] = [];

  private createNavButton(route: Route, className: string, text?: string): HTMLButtonElement {
    const button = createElement("button", {
      className,
      text,
      attrs: { type: "button", "data-route": route },
    });
    this.navButtons.push(button);

    return button;
  }

  private createHeader(): HTMLElement {
    const header = createElement("header", { className: "header " });
    const container = createElement("div", { className: "container header__inner" });

    const logoButton = this.createNavButton("about", "logo");
    const logoIcon = createElement("span", { className: "logo__icon", text: "✳" });
    const logoText = createElement("span", { className: "logo__text", text: "Ink. House" });

    logoButton.append(logoIcon, logoText);

    const nav = createElement("nav", { className: "nav" });
    const aboutButton = this.createNavButton("about", "nav__link", "О нас");
    const catalogButton = this.createNavButton("catalog", "nav__link", "Репродукции");

    const cartButton = this.createNavButton("cart", "nav__link nav__link-cart", "🛒");
    cartButton.setAttribute("aria-label", "Корзина");
    this.cartBadge = createElement("span", { className: "cart-badge", text: "0" });

    cartButton.append(this.cartBadge);

    nav.append(aboutButton, catalogButton, cartButton);
    container.append(logoButton, nav);
    header.append(container);

    return header;
  }

  private createFooter(): HTMLElement {
    const footer = createElement("footer", { className: "footer " });
    const container = createElement("div", { className: "container footer__inner" });

    const brand = createElement("div", { className: "footer__brand" });
    const logoText = createElement("span", { className: "logo__text", text: "Ink. House" });
    const copy = createElement("p", {
      className: "footer__copy",
      text: "Учебный командный проект Rs School",
    });

    brand.append(logoText, copy);

    const links = createElement("div", { className: "footer__links" });
    const repoLink = createElement("a", {
      text: "Репозиторий проекта",
      attrs: {
        href: "https://github.com/AnnaVernadskaya/team-project-art-shop",
        target: "_blank",
        rel: "noreferrer",
      },
    });
    const schoolLink = createElement("a", {
      text: "Rs School",
      attrs: {
        href: "https://rs.school/",
        target: "_blank",
        rel: "noreferrer",
      },
    });

    links.append(repoLink, schoolLink);

    container.append(brand, links);
    footer.append(container);

    return footer;
  }

  constructor() {
    document.body.replaceChildren();

    const header = this.createHeader();

    this.mainContainer = createElement("main", {
      className: "main",
      attrs: { id: "app-content" },
    });

    const footer = this.createFooter();

    document.body.append(header, this.mainContainer, footer);
  }

  public getContentContainer(): HTMLElement {
    return this.mainContainer;
  }

  public updateCartBadge(totalItems: number): void {
    this.cartBadge.textContent = String(totalItems);
  }

  public setActiveRoute(activeRoute: Route): void {
    this.navButtons.forEach((btn) => {
      const isTarget = btn.dataset.route === activeRoute && !btn.classList.contains("logo");
      btn.classList.toggle("nav__link-active", isTarget);
    });
  }

  public bindNavigation(onNavigate: (route: Route) => void): void {
    this.navButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const route = btn.dataset.route as Route | undefined;

        if (route) {
          onNavigate(route);
        }
      });
    });
  }
}
