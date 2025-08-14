// composables/useFilters.ts
import { computed, ref } from 'vue';
import { useProductsStore } from '@/stores/products';
import type { ProductFilters } from '@/types/product';

export const useFilters = () => {
  const store = useProductsStore();
  const showFilters = ref(false);

  const filters = computed(() => store.filters);
  const categories = computed(() => store.categories);
  const gemstoneTypes = computed(() => store.gemstoneTypes);
  const origins = computed(() => store.origins);
  const priceRange = computed(() => store.priceRange);
  const caratRange = computed(() => store.caratRange);
  const hasActiveFilters = computed(() => store.hasActiveFilters);

  const updateFilters = (newFilters: Partial<ProductFilters>) => {
    store.setFilters(newFilters);
  };

  const clearAllFilters = () => {
    store.clearFilters();
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
    } else if (typeof currentFilters[filterType] === 'boolean') {
      currentFilters[filterType] = !currentFilters[filterType] as any;
    }
    
    store.setFilters(currentFilters);
  };

  const toggleFiltersPanel = () => {
    showFilters.value = !showFilters.value;
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
    toggleFilter,
    toggleFiltersPanel,
  };
};