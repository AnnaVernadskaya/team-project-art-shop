import { COUNTRY_LABELS, type Painting } from "../types";
import { createElement } from "../utils/dom";

const PAGE_SIZE = 6;
const priceFormat = new Intl.NumberFormat("ru-RU");

export function renderCatalogPage(container: HTMLElement, paintings: readonly Painting[]): void {
  const page = createElement("div", { className: "shop-page" });

  const hero = createHeroSection();
  const catalog = createCatalogSection(paintings);
  const quote = createQuoteSection();

  page.append(hero, catalog, quote);
  container.append(page);
}

function createHeroSection(): HTMLElement {
  const section = createElement("section", { className: "shop-hero container" });

  const image = createElement("img", {
    className: "shop-hero__image",
    attrs: { src: "./images/hero-pigeon.png", alt: "" },
  });

  const content = createElement("div");
  const title = createElement("h1", {
    className: "shop-hero__title",
    text: "Реплики картин от ",
  });
  const brand = createElement("span", { text: "Ink. House" });
  title.append(brand);

  const description = createElement("p", {
    className: "shop-hero__description",
    text: "Репродукции на бумаге и холсте",
  });

  content.append(title, description);
  section.append(image, content);

  return section;
}

function createCatalogSection(paintings: readonly Painting[]): HTMLElement {
  const section = createElement("section", {
    className: "catalog container",
    attrs: { "aria-labelledby": "catalog-title" },
  });

  const heading = createElement("div", { className: "catalog__heading" });
  const title = createElement("h2", {
    className: "catalog__title",
    text: "Каталог картин",
    attrs: { id: "catalog-title" },
  });
  heading.append(title);

  const controls = createElement("div", { className: "catalog__controls" });
  controls.append(createFilters(), createSort());

  const grid = createElement("ul", { className: "catalog__grid" });
  const visiblePaintings = paintings.slice(0, PAGE_SIZE);

  for (const painting of visiblePaintings) {
    const card = createCard(painting);
    grid.append(card);
  }

  section.append(heading, controls, grid);

  if (paintings.length === 0) {
    const message = createElement("p", { text: "Картины не найдены" });
    section.append(message);
  }

  const pageCount = Math.ceil(paintings.length / PAGE_SIZE);

  if (pageCount > 1) {
    section.append(createPagination(pageCount));
  }

  return section;
}

function createFilters(): HTMLElement {
  const filters = createElement("div", {
    className: "catalog__filters",
    attrs: { role: "group", "aria-label": "Фильтр по стране" },
  });

  const labels = ["Все", ...Object.values(COUNTRY_LABELS)];

  for (const text of labels) {
    const button = createElement("button", {
      className: "catalog__filter",
      text,
      attrs: {
        type: "button",
        "aria-pressed": String(text === "Все"),
        disabled: "",
      },
    });

    filters.append(button);
  }

  return filters;
}

function createSort(): HTMLLabelElement {
  const label = createElement("label", {
    className: "catalog__sort",
    text: "Сортировка",
  });

  const select = createElement("select", {
    className: "catalog__sort-select",
    attrs: { disabled: "" },
  });

  const options = ["По умолчанию", "Сначала дешевле", "Сначала дороже"];

  for (const text of options) {
    const option = createElement("option", { text });
    select.append(option);
  }

  label.append(select);

  return label;
}

function createCard(painting: Painting): HTMLLIElement {
  const card = createElement("li", { className: "catalog-card" });

  const image = createElement("img", {
    className: "catalog-card__image",
    attrs: {
      src: `./images/${painting.image}`,
      alt: painting.title,
      loading: "lazy",
    },
  });

  const author = createElement("p", {
    className: "catalog-card__author",
    text: painting.artist,
  });

  const title = createElement("h3", {
    className: "catalog-card__title",
    text: painting.title,
  });

  const size = painting.size.replace("x", "×");
  const details = createElement("p", {
    className: "catalog-card__details",
    text: `${painting.medium} · ${size} см`,
  });

  const price = createElement("p", {
    className: "catalog-card__price",
    text: `${priceFormat.format(painting.price)} ₽`,
  });

  const button = createElement("button", {
    className: "catalog-card__button",
    text: "В корзину",
    attrs: {
      type: "button",
      "aria-label": `Добавить «${painting.title}» в корзину`,
      disabled: "",
    },
  });

  card.append(image, author, title, details, price, button);

  return card;
}

function createPagination(pageCount: number): HTMLElement {
  const pagination = createElement("nav", {
    className: "catalog__pagination",
    attrs: { "aria-label": "Страницы каталога" },
  });

  const previousButton = createPageButton("‹", "Предыдущая страница");
  pagination.append(previousButton);

  for (let page = 1; page <= pageCount; page += 1) {
    const button = createPageButton(String(page), `Страница ${page}`);

    if (page === 1) {
      button.setAttribute("aria-current", "page");
    }

    pagination.append(button);
  }

  const nextButton = createPageButton("›", "Следующая страница");
  pagination.append(nextButton);

  return pagination;
}

function createPageButton(text: string, label: string): HTMLButtonElement {
  return createElement("button", {
    className: "catalog__page",
    text,
    attrs: { type: "button", "aria-label": label, disabled: "" },
  });
}

function createQuoteSection(): HTMLElement {
  const section = createElement("section", {
    className: "shop-quote",
    attrs: { "aria-label": "Цитата об искусстве" },
  });

  const figure = createElement("figure", { className: "container" });
  const quote = createElement("blockquote", {
    text: "«В каждой картине есть свой взгляд на мир, и то, как мы её воспринимаем, зависит от того, как смотрим на мир мы сами».",
  });
  const author = createElement("figcaption", {
    text: "Джон Бергер, «Искусство\u00A0видеть»",
  });

  figure.append(quote, author);
  section.append(figure);

  return section;
}
