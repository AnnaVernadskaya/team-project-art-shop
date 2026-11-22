export type CountryCategory = "france" | "germany" | "england";

export const COUNTRY_LABELS: Record<CountryCategory, string> = {
  france: "Франция",
  germany: "Германия",
  england: "Англия",
};

export interface Painting {
  id: string;
  title: string;
  artist: string;
  country: CountryCategory;
  medium: string;
  size: string;
  price: number;
  image: string;
}

export interface CartItem {
  product: Painting;
  quantity: number;
}

export type SortOrder = "default" | "price-asc" | "price-desc";

export interface FilterState {
  search: string;
  category: CountryCategory | "all";
  minPrice: number | null;
  maxPrice: number | null;
  sortBy: SortOrder;
}

export interface CartSummary {
  subtotal: number;
  discount: number;
  total: number;
}
