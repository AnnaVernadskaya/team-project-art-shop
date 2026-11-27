import { paintings } from "../data/paintings";
import { renderCatalogPage } from "../views/CatalogView";

export function renderCatalog(container: HTMLElement): void {
  renderCatalogPage(container, paintings);
}
