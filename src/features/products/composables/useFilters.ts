// composables/useFilters.ts
import { computed, ref } from "vue";
import { useProductsStore } from "../store";
import type { ProductFilters } from "@/types/product";

export const useFilters = () => {
  const store = useProductsStore();
  const showFilters = ref(false);

  const filters = computed(() => (store as any).filters);
  const categories = computed(() => (store as any).categories);
  const gemstoneTypes = computed(() => (store as any).gemstoneTypes);
  const origins = computed(() => (store as any).origins);
  const priceRange = computed(() => (store as any).priceRange);
  const caratRange = computed(() => (store as any).caratRange);
  const hasActiveFilters = computed(() => store.hasActiveFilters);

  const updateFilters = (newFilters: Partial<ProductFilters>) => {
    store.setFilters(newFilters);
  };

  const clearAllFilters = () => {
    store.clearFilters();
  };

  const removeFilter = (filterType: keyof ProductFilters | string) => {
    const currentFilters: any = { ...(filters.value as any) };

    if (Array.isArray(currentFilters[filterType])) {
      currentFilters[filterType] = [];
    } else if (
      typeof currentFilters[filterType] === "object" &&
      currentFilters[filterType] !== null
    ) {
      // reset object/range filters to empty object
      currentFilters[filterType] = {};
    } else {
      currentFilters[filterType] = undefined;
    }

    store.setFilters(currentFilters);
  };

  const toggleFilter = (filterType: keyof ProductFilters, value: any) => {
    const currentFilters = { ...filters.value };

    if (Array.isArray(currentFilters[filterType])) {
      const array = currentFilters[filterType] as any[];
      const index = array.indexOf(value);

      if (index > -1) {
        array.splice(index, 1);
      } else {
        array.push(value);
      }
    } else if (typeof currentFilters[filterType] === "boolean") {
      currentFilters[filterType] = !currentFilters[filterType] as any;
    }

    store.setFilters(currentFilters);
  };

  const toggleFiltersPanel = () => {
    showFilters.value = !showFilters.value;
  };

  // Compatibility method for setting individual filters
  const setFilter = <K extends string>(key: K, value: any) => {
    // Cast to any to allow arbitrary string keys for compatibility
    updateFilters({ [key]: value } as any);
  };

  return {
    filters,
    categories,
    gemstoneTypes,
    origins,
    priceRange,
    caratRange,
    hasActiveFilters,
    showFilters,
    updateFilters,
    clearAllFilters,
    removeFilter,
    toggleFilter,
    toggleFiltersPanel,
    setFilter, // Add setFilter as an alias for updateFilters
  };
};
