// Export component types explicitly to avoid conflicts
export {
  ProductFilters as ProductFiltersComponent,
  ProductGrid,
  ProductList,
  ProductSearch,
  ProductSort,
  ViewToggle,
  ActiveFilters
} from "./components";

// Export composables
export { useProducts, useFilters } from "./composables";

// Export store
export { useProductsStore } from "./store";

// Re-export types
export type {
  Product,
  ProductFilters,
  ProductSpecifications,
  SortOption,
  ViewMode
} from "../../types/product";
