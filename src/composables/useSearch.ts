// composables/useSearch.ts
import { ref, computed, watch } from "vue";
import { useProductsStore } from "@/features/products/store";
import { debounce } from "lodash-es";

export const useSearch = () => {
  const store = useProductsStore();
  const searchQuery = ref("");
  const searchSuggestions = ref<string[]>([]);
  const showSuggestions = ref(false);
  const isSearching = ref(false);

  const recentSearches = ref<string[]>([]);
  const popularSearches = [
    "Diamond",
    "Ruby",
    "Emerald",
    "Sapphire",
    "Round Cut",
    "Princess Cut",
  ];

  // Debounced search function
  const debouncedSearch = debounce((query: string) => {
    store.setSearchQuery(query);
    isSearching.value = false;

    if (query.trim()) {
      addToRecentSearches(query);
    }
  }, 300);

  // Watch for search query changes
  watch(searchQuery, (newQuery) => {
    isSearching.value = true;
    debouncedSearch(newQuery);

    if (newQuery.length > 0) {
      generateSuggestions(newQuery);
      showSuggestions.value = true;
    } else {
      showSuggestions.value = false;
    }
  });

  const generateSuggestions = (query: string) => {
    const allProducts = store.products;
    const suggestions = new Set<string>();
    const lowerQuery = query.toLowerCase();

    // Add matching product names
    allProducts.forEach((product) => {
      if (product.name.toLowerCase().includes(lowerQuery)) {
        suggestions.add(product.name);
      }

      // Add matching gemstone types
      if (
        product.gemstoneType &&
        product.gemstoneType.toLowerCase().includes(lowerQuery)
      ) {
        suggestions.add(
          product.gemstoneType.charAt(0).toUpperCase() +
            product.gemstoneType.slice(1)
        );
      }

      // Add matching categories
      if (product.category.toLowerCase().includes(lowerQuery)) {
        suggestions.add(product.category);
      }

      // Add matching tags
      product.tags?.forEach((tag) => {
        if (tag.toLowerCase().includes(lowerQuery)) {
          suggestions.add(tag.charAt(0).toUpperCase() + tag.slice(1));
        }
      });
    });

    searchSuggestions.value = Array.from(suggestions).slice(0, 8);
  };

  const addToRecentSearches = (query: string) => {
    recentSearches.value = [
      query,
      ...recentSearches.value.filter((search) => search !== query),
    ].slice(0, 5);
  };

  const selectSuggestion = (suggestion: string) => {
    searchQuery.value = suggestion;
    showSuggestions.value = false;
  };

  const clearSearch = () => {
    searchQuery.value = "";
    store.setSearchQuery("");
    showSuggestions.value = false;
  };

  const hideSuggestions = () => {
    setTimeout(() => {
      showSuggestions.value = false;
    }, 200);
  };

  return {
    searchQuery,
    searchSuggestions,
    showSuggestions,
    isSearching,
    recentSearches,
    popularSearches,
    selectSuggestion,
    clearSearch,
    hideSuggestions,
  };
};
