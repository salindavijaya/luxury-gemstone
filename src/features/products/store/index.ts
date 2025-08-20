import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { SortOption } from "./types";
import type { Product, ProductFilters, ViewMode } from "./types";

export {
  Cut,
  Color,
  Clarity,
  Shape,
  CertificationAgency,
  StockStatus,
  GemstoneType,
  SortOption,
  Fluorescence,
  type Image,
  type ImageOrString,
  type Product,
  type ProductFilters,
  type ViewMode,
  type ProductSpecifications,
} from "./types";

export const useProductsStore = defineStore("products", () => {
  const products = ref<Product[]>([]);
  const loading = ref(false);
  const filters = ref<ProductFilters>({
    search: "",
    categories: [],
    gemstoneTypes: [],
    priceRange: [0, 100000],
    caratRange: [0, 20],
    cuts: [],
    colors: [],
    clarities: [],
    shapes: [],
    certifications: [],
    origins: [],
    stockStatus: [],
    inStock: true,
    onSale: false,
    featured: false,
    isNew: false,
  });
  const sortBy = ref<SortOption>(SortOption.Newest);
  const viewMode = ref<ViewMode>("grid");
  const currentPage = ref(1);
  const itemsPerPage = ref(20);

  const filteredProducts = computed(() =>
    products.value.filter((p) => {
      // basic filter placeholder
      if (!filters.value.search) return true;
      const q = (filters.value.search || "").toLowerCase();
      return (
        (p.name || "").toLowerCase().includes(q) ||
        (p.description || "").toLowerCase().includes(q)
      );
    })
  );

  // compatibility: error state
  const error = ref<string | null>(null);

  // pagination helpers expected by components/composables
  const paginatedProducts = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage.value;
    const end = start + itemsPerPage.value;
    return filteredProducts.value.slice(start, end);
  });

  const totalPages = computed(
    () => Math.ceil(filteredProducts.value.length / itemsPerPage.value) || 0
  );

  const hasActiveFilters = computed(() => {
    const f = filters.value as any;
    return (
      (f.categories && f.categories.length > 0) ||
      (f.gemstoneTypes && f.gemstoneTypes.length > 0) ||
      (f.priceRange && (f.priceRange[0] > 0 || f.priceRange[1] < 100000)) ||
      (f.caratRange && (f.caratRange[0] > 0 || f.caratRange[1] < 20)) ||
      (f.cuts && f.cuts.length > 0) ||
      (f.colors && f.colors.length > 0) ||
      (f.clarities && f.clarities.length > 0) ||
      (f.shapes && f.shapes.length > 0) ||
      (f.certifications && f.certifications.length > 0) ||
      (f.origins && f.origins.length > 0) ||
      (f.stockStatus && f.stockStatus.length > 0) ||
      !!f.onSale ||
      !!f.featured ||
      !!f.isNew
    );
  });

  const allProducts = computed(() => products.value);
  const totalProducts = computed(() => filteredProducts.value.length);

  // compatibility getters
  const categories = computed(() => {
    const set = new Set(products.value.map((p) => p.category).filter(Boolean));
    return Array.from(set);
  });

  const gemstoneTypes = computed(() => {
    const set = new Set(
      products.value.map((p) => p.gemstoneType).filter(Boolean)
    );
    return Array.from(set);
  });

  const origins = computed(() => {
    const set = new Set(
      products.value.map((p) => p.specifications?.origin).filter(Boolean)
    );
    return Array.from(set);
  });

  const priceRange = computed(() => {
    if (products.value.length === 0) return [0, 100000] as [number, number];
    const prices = products.value.map((p) => p.price || 0);
    return [Math.min(...prices), Math.max(...prices)] as [number, number];
  });

  const caratRange = computed(() => {
    if (products.value.length === 0) return [0, 20] as [number, number];
    const carats = products.value.map((p) => p.specifications?.carat || 0);
    return [Math.min(...carats), Math.max(...carats)] as [number, number];
  });

  function setFilter(partial: Partial<ProductFilters>) {
    filters.value = { ...filters.value, ...partial };
  }
  // Backward-compatible API aliases
  function setFilters(partial: Partial<ProductFilters>) {
    return setFilter(partial);
  }
  function setSort(s: SortOption) {
    sortBy.value = s;
  }
  function setView(v: ViewMode) {
    viewMode.value = v;
  }
  function setViewMode(v: ViewMode) {
    return setView(v);
  }
  function setPage(p: number) {
    currentPage.value = p;
  }

  function setSortBy(s: SortOption) {
    return setSort(s);
  }

  async function fetchProducts() {
    loading.value = true;
    // keep simple: no network call here
    products.value = products.value || [];
    loading.value = false;
  }

  function setSearchQuery(query: string) {
    // compatibility shim: update filters.search and reset page
    filters.value = { ...filters.value, search: query };
    currentPage.value = 1;
  }

  function clearFilters() {
    filters.value = {
      search: "",
      categories: [],
      gemstoneTypes: [],
      priceRange: [0, 100000],
      caratRange: [0, 20],
      cuts: [],
      colors: [],
      clarities: [],
      shapes: [],
      certifications: [],
      origins: [],
      stockStatus: [],
      inStock: true,
      onSale: false,
      featured: false,
      isNew: false,
    };
    currentPage.value = 1;
  }

  function addToRecentlyViewed(_id: string) {
    /* noop */
  }

  return {
    // core
    products,
    allProducts,
    filteredProducts,
    loading,
    error,
    totalProducts,
    totalPages,
    filters,
    sortBy,
    viewMode,
    currentPage,
    itemsPerPage,
    paginatedProducts,
    hasActiveFilters,

    // core actions
    setFilter,
    setSort,
    setView,
    setPage,
    fetchProducts,
    addToRecentlyViewed,

    // backward-compatible API
    setFilters,
    clearFilters,
    setSortBy,
    setViewMode,
    setSearchQuery,
  };
});
