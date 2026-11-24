import { createElement } from "../utils/dom";

interface TeamMember {
  name: string;
  role: string;
  contributions: string[];
  githubUrl: string;
  githubLabel: string;
  initials: string;
}

const TEAM_MEMBERS: TeamMember[] = [
  {
    name: "Анна Вернадская",
    role: "Разработчица • Каталог и данные",
    contributions: [
      "Подготовка массива изображений",
      "Реализация фильтрации по странам и цене, поиска и сортировки",
      "Вёрстка страницы каталога и unit-тесты для CatalogModel",
    ],
    githubUrl: "https://github.com/AnnaVernadskaya",
    githubLabel: "GitHub",
    initials: "АВ",
  },
  {
    name: "Леся Кубанина",
    role: "Разработчица • Архитектура и корзина",
    contributions: [
      "Настройка структуры проекта и базового каркаса",
      "Реализация логики корзины, localStorage и промокода SALE10",
      "Вёрстка страниц 'О нас' и 'Корзина' и unit-тесты для CartModel",
    ],
    githubUrl: "https://github.com/talestris",
    githubLabel: "GitHub",
    initials: "ЛК",
  },
];

export class AboutView {
  private createHeroSection(onGoToCatalog: () => void): HTMLElement {
    const section = createElement("section", { className: "about-hero" });
    const card = createElement("div", { className: "about-hero__card" });

    const title = createElement("h1", { className: "about-hero__title", text: "ART SHOP" });
    const subtitle = createElement("p", {
      className: "about-hero__subtitle",
      text: "Учебный командный проект",
    });

    const school = createElement("p", { className: "about-hero__school", text: "Rs School" });

    const mainButton = createElement("button", {
      className: "btn-outline about-hero__btn",
      text: "Перейти в каталог",
      attrs: { type: "button" },
    });

    mainButton.addEventListener("click", onGoToCatalog);

    card.append(title, subtitle, school, mainButton);
    section.append(card);

    return section;
  }

  private createMemberCard(member: TeamMember): HTMLElement {
    const card = createElement("article", { className: "member-card" });

    const header = createElement("div", { className: "member-card__header" });
    const avatar = createElement("div", {
      className: "member-card__avatar",
      text: member.initials,
    });

    const info = createElement("div", { className: "member-card__info" });
    const name = createElement("h3", { className: "member-card__name", text: member.name });
    const role = createElement("p", { className: "member-card__role", text: member.role });

    info.append(name, role);
    header.append(avatar, info);

    const body = createElement("div", { className: "member-card__body" });
    const list = createElement("ul", { className: "member-card__list" });

    member.contributions.forEach((itemText) => {
      const li = createElement("li", { text: itemText });
      list.append(li);
    });

    const githubLink = createElement("a", {
      className: "member-card__link",
      text: member.githubLabel,
      attrs: {
        href: member.githubUrl,
        target: "_blank",
        rel: "noreferrer",
      },
    });

    body.append(list, githubLink);
    card.append(header, body);

    return card;
  }

  private createTeamSection(): HTMLElement {
    const section = createElement("section", { className: "about-team" });

    const heading = createElement("h2", { className: "about-team__heading", text: "Наша команда" });

    const grid = createElement("div", { className: "about-team__grid" });

    TEAM_MEMBERS.forEach((member) => {
      grid.append(this.createMemberCard(member));
    });

    section.append(heading, grid);

    return section;
  }

  public render(container: HTMLElement, onGoToCatalog: () => void): void {
    const wrapper = createElement("div", { className: "container about" });

    const heroSection = this.createHeroSection(onGoToCatalog);
    const teamSection = this.createTeamSection();

    wrapper.append(heroSection, teamSection);
    container.append(wrapper);
  }
}
