// composables/useProducts.ts
import { computed } from 'vue';
import { useProductsStore } from '@/stores/products';

export const useProducts = () => {
  const store = useProductsStore();

  const products = computed(() => store.paginatedProducts);
  const allProducts = computed(() => store.products);
  const filteredProducts = computed(() => store.filteredProducts);
  const loading = computed(() => store.loading);
  const error = computed(() => store.error);
  const totalPages = computed(() => store.totalPages);
  const currentPage = computed(() => store.currentPage);
  const hasActiveFilters = computed(() => store.hasActiveFilters);
  const viewMode = computed(() => store.viewMode);
  const sortBy = computed(() => store.sortBy);

  const fetchProducts = () => store.fetchProducts();
  const setFilters = (filters: any) => store.setFilters(filters);
  const clearFilters = () => store.clearFilters();
  const setSortBy = (sort: any) => store.setSortBy(sort);
  const setViewMode = (mode: any) => store.setViewMode(mode);
  const setPage = (page: number) => store.setPage(page);
  const addToRecentlyViewed = (id: string) => store.addToRecentlyViewed(id);

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
  };
};
