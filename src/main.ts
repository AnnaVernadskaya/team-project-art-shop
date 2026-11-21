function copyTemplate(id: string) {
  const template = document.querySelector<HTMLTemplateElement>(`#${id}`);

  if (!template) {
    throw new Error(`В index.html не найден шаблон #${id}`);
  }

  return document.importNode(template.content, true);
}

function renderPage() {
  const app = document.querySelector("#app");

  if (!app) {
    throw new Error("В index.html не найден контейнер #app");
  }

  const route = window.location.hash;

  if (route === "#/catalog" || route === "#/cart") {
    const shop = copyTemplate("shop-template");
    const shopContent = shop.querySelector("#shop-content");
    const pageTemplate = route === "#/cart" ? "cart-template" : "catalog-template";

    if (!shopContent) {
      throw new Error("В shop-template не найден контейнер #shop-content");
    }

    shopContent.append(copyTemplate(pageTemplate));
    app.replaceChildren(shop);
    return;
  }

  app.replaceChildren(copyTemplate("team-template"));
}

renderPage();
window.addEventListener("hashchange", renderPage);
