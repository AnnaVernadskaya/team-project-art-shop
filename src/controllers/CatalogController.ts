import { paintings } from "../data/paintings";
import { renderCatalogPage } from "../views/CatalogView";

export function renderCatalog(container: HTMLElement, openAbout: () => void): void {
  renderCatalogPage(container, paintings, openAbout);
}
