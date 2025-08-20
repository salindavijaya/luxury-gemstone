<template>
  <div class="relative w-full max-w-md">
    <!-- Search Input -->
    <div class="relative">
      <div
        class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
      >
        <svg
          class="h-5 w-5 text-slate-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>

      <input
        ref="searchInput"
        v-model="searchQuery"
        type="text"
        :placeholder="placeholder"
        class="block w-full pl-10 pr-12 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white text-slate-900 placeholder-slate-500 text-sm"
        :class="{
          'ring-2 ring-emerald-500 border-emerald-500':
            showSuggestions && suggestions.length > 0,
        }"
        @input="handleInput"
        @focus="handleFocus"
        @blur="handleBlur"
        @keydown="handleKeydown"
        autocomplete="off"
        :aria-expanded="showSuggestions"
        :aria-activedescendant="
          selectedIndex >= 0 ? `suggestion-${selectedIndex}` : null
        "
        role="combobox"
        aria-autocomplete="list"
        aria-label="Search products"
      />

      <!-- Loading Spinner -->
      <div
        v-if="isSearching"
        class="absolute inset-y-0 right-0 pr-3 flex items-center"
      >
        <svg
          class="animate-spin h-4 w-4 text-slate-400"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            class="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="4"
          ></circle>
          <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      </div>

      <!-- Clear Button -->
      <button
        v-else-if="searchQuery"
        @click="clearSearch"
        class="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
        aria-label="Clear search"
      >
        <svg
          class="h-4 w-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>

    <!-- Suggestions Dropdown -->
    <div
      v-if="showSuggestions && suggestions.length > 0"
      class="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-96 overflow-y-auto"
      role="listbox"
    >
      <!-- Popular Searches -->
      <div
        v-if="showPopularSearches && popularSearches.length > 0"
        class="p-3 border-b border-slate-100"
      >
        <h4
          class="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2"
        >
          Popular Searches
        </h4>
        <div class="flex flex-wrap gap-1">
          <button
            v-for="(search, index) in popularSearches"
            :key="`popular-${index}`"
            @click="selectPopularSearch(search)"
            class="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded-full hover:bg-emerald-100 hover:text-emerald-700 transition-colors"
          >
            {{ search }}
          </button>
        </div>
      </div>

      <!-- Search Suggestions -->
      <div class="py-2">
        <div
          v-for="(suggestion, index) in suggestions"
          :key="`suggestion-${index}`"
          :id="`suggestion-${index}`"
          class="px-4 py-2 cursor-pointer hover:bg-slate-50 flex items-center gap-3 transition-colors"
          :class="{
            'bg-emerald-50 text-emerald-700': index === selectedIndex,
          }"
          @click="selectSuggestion(suggestion)"
          role="option"
          :aria-selected="index === selectedIndex"
        >
          <!-- Suggestion Icon -->
          <div class="flex-shrink-0">
            <svg
              v-if="suggestion.type === 'product'"
              class="w-4 h-4 text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
              />
            </svg>
            <svg
              v-else-if="suggestion.type === 'category'"
              class="w-4 h-4 text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
            <svg
              v-else
              class="w-4 h-4 text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          <!-- Suggestion Content -->
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2">
              <span class="font-medium text-slate-800 truncate">
                {{ suggestion.title }}
              </span>
              <span
                v-if="suggestion.type"
                class="text-xs bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded uppercase"
              >
                {{ suggestion.type }}
              </span>
            </div>
            <p
              v-if="suggestion.description"
              class="text-xs text-slate-500 truncate mt-0.5"
            >
              {{ suggestion.description }}
            </p>
          </div>

          <!-- Price or Count -->
          <div
            v-if="suggestion.price || suggestion.count"
            class="flex-shrink-0 text-right"
          >
            <span
              v-if="suggestion.price"
              class="text-sm font-semibold text-slate-800"
            >
              ${{ formatPrice(suggestion.price) }}
            </span>
            <span v-else-if="suggestion.count" class="text-xs text-slate-500">
              {{ suggestion.count }} items
            </span>
          </div>
        </div>
      </div>

      <!-- No Results -->
      <div
        v-if="searchQuery && suggestions.length === 0 && !isSearching"
        class="px-4 py-8 text-center text-slate-500"
      >
        <svg
          class="w-8 h-8 mx-auto mb-2 text-slate-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <p class="text-sm">No results found for "{{ searchQuery }}"</p>
        <p class="text-xs mt-1">
          Try different keywords or check your spelling
        </p>
      </div>
    </div>

    <!-- Backdrop -->
    <div
      v-if="showSuggestions"
      class="fixed inset-0 z-40"
      @click="hideSuggestions"
    ></div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from "vue";
import { useSearch } from "@/composables/useSearch";
import { useProductsStore } from "@/features/products/store";

const props = defineProps({
  placeholder: {
    type: String,
    default: "Search diamonds, rubies, emeralds...",
  },
  showPopularSearches: {
    type: Boolean,
    default: true,
  },
});

const emit = defineEmits(["search", "suggestion-select"]);

// Refs
const searchInput = ref(null);
const searchQuery = ref("");
const showSuggestions = ref(false);
const selectedIndex = ref(-1);
const isSearching = ref(false);

// Composables
const { searchProducts, searchHistory, addToSearchHistory } = useSearch();
const productsStore = useProductsStore();

// Computed properties
const suggestions = computed(() => {
  if (!searchQuery.value.trim()) {
    return [];
  }

  const query = searchQuery.value.toLowerCase().trim();
  const allSuggestions = [];

  // Product suggestions
  const productSuggestions = productsStore.products
    .filter(
      (product) =>
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        product.gemstoneType.toLowerCase().includes(query)
    )
    .slice(0, 3)
    .map((product) => ({
      type: "product",
      title: product.name,
      description: `${product.gemstoneType} • ${product.carat}ct`,
      price: product.price,
      id: product.id,
    }));

  // Category suggestions
  const categories = [
    "Diamond",
    "Ruby",
    "Sapphire",
    "Emerald",
    "Tanzanite",
    "Opal",
  ];
  const categorySuggestions = categories
    .filter((category) => category.toLowerCase().includes(query))
    .slice(0, 2)
    .map((category) => ({
      type: "category",
      title: category,
      description: `Browse all ${category.toLowerCase()} products`,
      count: productsStore.products.filter((p) => p.gemstoneType === category)
        .length,
    }));

  // Search term suggestions
  const searchTerms = [
    "engagement ring",
    "wedding band",
    "vintage jewelry",
    "certified diamonds",
    "loose gemstones",
    "custom jewelry",
  ];
  const termSuggestions = searchTerms
    .filter((term) => term.toLowerCase().includes(query))
    .slice(0, 2)
    .map((term) => ({
      type: "search",
      title: term,
      description: `Search for ${term}`,
    }));

  return [...productSuggestions, ...categorySuggestions, ...termSuggestions];
});

const popularSearches = computed(() => [
  "Diamond Rings",
  "Ruby Earrings",
  "Sapphire Necklaces",
  "Emerald Bracelets",
  "Vintage Jewelry",
]);

const showPopularSearchesComputed = computed(() => {
  return props.showPopularSearches && !searchQuery.value.trim();
});

// Watchers
watch(searchQuery, (newQuery) => {
  if (newQuery.trim()) {
    performSearch();
  } else {
    showSuggestions.value = false;
  }
  selectedIndex.value = -1;
});

// Methods
const handleInput = () => {
  showSuggestions.value = true;
};

const handleFocus = () => {
  if (searchQuery.value.trim() || showPopularSearchesComputed.value) {
    showSuggestions.value = true;
  }
};

const handleBlur = () => {
  // Delay hiding suggestions to allow for click events
  setTimeout(() => {
    showSuggestions.value = false;
  }, 200);
};

const handleKeydown = (event) => {
  if (!showSuggestions.value) return;

  switch (event.key) {
    case "ArrowDown":
      event.preventDefault();
      selectedIndex.value = Math.min(
        selectedIndex.value + 1,
        suggestions.value.length - 1
      );
      break;
    case "ArrowUp":
      event.preventDefault();
      selectedIndex.value = Math.max(selectedIndex.value - 1, -1);
      break;
    case "Enter":
      event.preventDefault();
      if (selectedIndex.value >= 0) {
        selectSuggestion(suggestions.value[selectedIndex.value]);
      } else {
        performSearch();
      }
      break;
    case "Escape":
      showSuggestions.value = false;
      selectedIndex.value = -1;
      searchInput.value?.blur();
      break;
  }
};

const performSearch = async () => {
  if (!searchQuery.value.trim()) return;

  isSearching.value = true;

  try {
    const query = searchQuery.value.trim();
    addToSearchHistory(query);
    emit("search", query);
    showSuggestions.value = false;
  } finally {
    isSearching.value = false;
  }
};

const selectSuggestion = (suggestion) => {
  if (suggestion.type === "product") {
    // Navigate to product page or emit product selection
    emit("suggestion-select", {
      type: "product",
      id: suggestion.id,
      query: suggestion.title,
    });
  } else if (suggestion.type === "category") {
    // Filter by category
    emit("suggestion-select", {
      type: "category",
      category: suggestion.title,
      query: suggestion.title,
    });
  } else {
    // Perform search with suggested term
    searchQuery.value = suggestion.title;
    performSearch();
  }

  showSuggestions.value = false;
};

const selectPopularSearch = (search) => {
  searchQuery.value = search;
  performSearch();
};

const clearSearch = () => {
  searchQuery.value = "";
  showSuggestions.value = false;
  selectedIndex.value = -1;
  emit("search", "");
  searchInput.value?.focus();
};

const hideSuggestions = () => {
  showSuggestions.value = false;
};

const formatPrice = (price) => {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

// Keyboard navigation helpers
const scrollToSelectedItem = () => {
  if (selectedIndex.value >= 0) {
    const element = document.getElementById(
      `suggestion-${selectedIndex.value}`
    );
    if (element) {
      element.scrollIntoView({ block: "nearest" });
    }
  }
};

// Lifecycle
onMounted(() => {
  // Focus search input if needed
  if (searchInput.value) {
    searchInput.value.addEventListener("keydown", scrollToSelectedItem);
  }
});

onUnmounted(() => {
  if (searchInput.value) {
    searchInput.value.removeEventListener("keydown", scrollToSelectedItem);
  }
});
</script>

<style scoped>
/* Custom scrollbar for suggestions dropdown */
.overflow-y-auto::-webkit-scrollbar {
  width: 4px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f5f9;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 2px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* Ensure smooth transitions */
.transition-colors {
  transition-property: color, background-color, border-color;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}
</style>
