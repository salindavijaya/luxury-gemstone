// composables/useProducts.ts
import { computed } from "vue";
import { useProductsStore } from "@/stores/products";

export const useProducts = () => {
  const store = useProductsStore();

  //const products = computed(() => store.paginatedProducts);
  //const allProducts = computed(() => store.products);
  //const filteredProducts = computed(() => store.filteredProducts);
  //const loading = computed(() => store.loading);
  //const error = computed(() => store.error);
  //const totalPages = computed(() => store.totalPages);
  //const currentPage = computed(() => store.currentPage);
  //const hasActiveFilters = computed(() => store.hasActiveFilters);
  //const viewMode = computed(() => store.viewMode);
  //const sortBy = computed(() => store.sortBy);
  //const featuredProducts = computed(() => store.featuredProducts);

  //const fetchProducts = () => store.fetchProducts();
  const getFeaturedProducts = async () => {
    if (store.products.length === 0) {
      await store.fetchProducts();
    }
    return store.featuredProducts;
  };

  //const setFilters = (filters: any) => store.setFilters(filters);
  //const clearFilters = () => store.clearFilters();

  //const setSortBy = (sort: any) => store.setSortBy(sort);
  //const setViewMode = (mode: any) => store.setViewMode(mode);
  //const setPage = (page: number) => store.setPage(page);
  //const addToRecentlyViewed = (id: string) => store.addToRecentlyViewed(id);
  return {
    products: computed(() => store.products),
    filteredProducts: computed(() => store.filteredProducts),
    loading: computed(() => store.loading),
    error: computed(() => store.error),
    hasActiveFilters: computed(() => store.hasActiveFilters),
    totalPages: computed(() => store.totalPages),
    currentPage: computed(() => store.currentPage),
    viewMode: computed(() => store.viewMode),
    sortBy: computed(() => store.sortBy),

    getFeaturedProducts,
    fetchProducts: () => store.fetchProducts(),
    setPage: (page: number) => store.setPage(page),
    addToRecentlyViewed: (id: string) => store.addToRecentlyViewed(id),
    setSortBy: (sort: any) => store.setSortBy(sort),
    setViewMode: (mode: any) => store.setViewMode(mode),
  };
  /* 
  return {
    products,
    allProducts,
    filteredProducts,
    loading,
    error,
    totalPages,
    currentPage,
    hasActiveFilters,
    viewMode,
    sortBy,
    fetchProducts,
    setFilters,
    clearFilters,
    setSortBy,
    setViewMode,
    setPage,
    addToRecentlyViewed,
    getFeaturedProducts,
    featuredProducts,
  }; */
};
