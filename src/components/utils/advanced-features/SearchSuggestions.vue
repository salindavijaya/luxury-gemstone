<template>
  <div
    class="relative"
    @click.away="hideSuggestions"
    role="combobox"
    :aria-expanded="showSuggestions"
    aria-label="Search with suggestions"
  >
    <!-- Search Input -->
    <div class="relative">
      <input
        ref="searchInput"
        v-model="query"
        type="text"
        :placeholder="placeholder"
        class="w-full px-4 py-3 pl-12 pr-10 bg-white border-2 border-slate-200 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 focus:outline-none transition-all duration-200 text-slate-800"
        :aria-describedby="showSuggestions ? 'search-suggestions' : undefined"
        @input="handleInput"
        @focus="handleFocus"
        @keydown="handleKeydown"
      />

      <!-- Search Icon -->
      <Search
        class="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400"
        aria-hidden="true"
      />

      <!-- Clear Button -->
      <button
        v-if="query"
        @click="clearSearch"
        class="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 transition-colors"
        aria-label="Clear search"
      >
        <X class="w-4 h-4" />
      </button>

      <!-- Loading Indicator -->
      <div
        v-if="loading"
        class="absolute right-3 top-1/2 transform -translate-y-1/2"
        aria-hidden="true"
      >
        <div
          class="animate-spin rounded-full h-4 w-4 border-2 border-emerald-500 border-t-transparent"
        ></div>
      </div>
    </div>

    <!-- Suggestions Dropdown -->
    <Transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0 translate-y-1"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 translate-y-1"
    >
      <div
        v-if="
          showSuggestions &&
          (suggestions.length ||
            recentSearches.length ||
            trendingSearches.length)
        "
        id="search-suggestions"
        class="absolute z-50 w-full mt-2 bg-white rounded-lg shadow-xl border border-slate-200 max-h-96 overflow-y-auto"
        role="listbox"
      >
        <!-- Search Suggestions -->
        <div v-if="suggestions.length" class="p-2">
          <div
            class="text-xs font-medium text-slate-500 uppercase tracking-wide px-3 py-2"
          >
            Suggestions
          </div>
          <button
            v-for="(suggestion, index) in suggestions"
            :key="`suggestion-${index}`"
            :ref="(el) => setItemRef(el, `suggestion-${index}`)"
            @click="selectSuggestion(suggestion)"
            :class="[
              'w-full text-left px-3 py-2 rounded-md transition-colors flex items-center gap-3',
              selectedIndex === getSuggestionIndex(index)
                ? 'bg-emerald-50 text-emerald-700'
                : 'text-slate-700 hover:bg-slate-50',
            ]"
            :aria-selected="selectedIndex === getSuggestionIndex(index)"
            role="option"
          >
            <Search class="w-4 h-4 text-slate-400 flex-shrink-0" />
            <div class="flex-1 min-w-0">
              <div
                class="font-medium truncate"
                v-html="highlightMatch(suggestion.text, query)"
              ></div>
              <div
                v-if="suggestion.category"
                class="text-xs text-slate-500 capitalize"
              >
                {{ suggestion.category }}
              </div>
            </div>
            <div
              v-if="suggestion.count"
              class="text-xs text-slate-400 flex-shrink-0"
            >
              {{ formatCount(suggestion.count) }}
            </div>
          </button>
        </div>

        <!-- Recent Searches -->
        <div
          v-if="recentSearches.length && !query"
          class="p-2 border-t border-slate-100"
        >
          <div class="flex items-center justify-between px-3 py-2">
            <div
              class="text-xs font-medium text-slate-500 uppercase tracking-wide"
            >
              Recent Searches
            </div>
            <button
              @click="clearRecentSearches"
              class="text-xs text-slate-400 hover:text-slate-600 transition-colors"
              aria-label="Clear recent searches"
            >
              Clear
            </button>
          </div>
          <button
            v-for="(search, index) in recentSearches.slice(0, 5)"
            :key="`recent-${index}`"
            :ref="(el) => setItemRef(el, `recent-${index}`)"
            @click="selectSuggestion({ text: search, type: 'recent' })"
            :class="[
              'w-full text-left px-3 py-2 rounded-md transition-colors flex items-center gap-3',
              selectedIndex === getRecentIndex(index)
                ? 'bg-emerald-50 text-emerald-700'
                : 'text-slate-700 hover:bg-slate-50',
            ]"
            :aria-selected="selectedIndex === getRecentIndex(index)"
            role="option"
          >
            <Clock class="w-4 h-4 text-slate-400 flex-shrink-0" />
            <span class="truncate">{{ search }}</span>
          </button>
        </div>

        <!-- Trending Searches -->
        <div
          v-if="trendingSearches.length && !query"
          class="p-2 border-t border-slate-100"
        >
          <div
            class="text-xs font-medium text-slate-500 uppercase tracking-wide px-3 py-2"
          >
            Trending
          </div>
          <button
            v-for="(search, index) in trendingSearches.slice(0, 3)"
            :key="`trending-${index}`"
            :ref="(el) => setItemRef(el, `trending-${index}`)"
            @click="selectSuggestion({ text: search.text, type: 'trending' })"
            :class="[
              'w-full text-left px-3 py-2 rounded-md transition-colors flex items-center gap-3',
              selectedIndex === getTrendingIndex(index)
                ? 'bg-emerald-50 text-emerald-700'
                : 'text-slate-700 hover:bg-slate-50',
            ]"
            :aria-selected="selectedIndex === getTrendingIndex(index)"
            role="option"
          >
            <TrendingUp class="w-4 h-4 text-slate-400 flex-shrink-0" />
            <div class="flex-1 min-w-0">
              <div class="truncate">{{ search.text }}</div>
              <div class="text-xs text-slate-500">
                {{ search.trend }}% increase
              </div>
            </div>
          </button>
        </div>

        <!-- No Results -->
        <div
          v-if="query && !loading && !suggestions.length"
          class="p-4 text-center text-slate-500"
        >
          <div class="text-sm">No suggestions found</div>
          <div class="text-xs mt-1">Try adjusting your search terms</div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from "vue";
import { Search, X, Clock, TrendingUp } from "lucide-vue-next";
import { logger } from "../utils/Logger";
import { performanceMonitor } from "../utils/PerformanceMonitor";

interface Suggestion {
  text: string;
  type: "product" | "category" | "brand" | "recent" | "trending";
  category?: string;
  count?: number;
  metadata?: Record<string, any>;
}

interface TrendingSearch {
  text: string;
  trend: number;
  count: number;
}

interface Props {
  placeholder?: string;
  minLength?: number;
  debounceMs?: number;
  maxSuggestions?: number;
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: "Search gemstones, jewelry, or collections...",
  minLength: 2,
  debounceMs: 300,
  maxSuggestions: 8,
});

const emit = defineEmits<{
  search: [query: string];
  suggestion: [suggestion: Suggestion];
}>();

// Reactive state
const query = ref("");
const suggestions = ref<Suggestion[]>([]);
const recentSearches = ref<string[]>([]);
const trendingSearches = ref<TrendingSearch[]>([]);
const showSuggestions = ref(false);
const loading = ref(false);
const selectedIndex = ref(-1);
const searchInput = ref<HTMLInputElement>();
const itemRefs = ref<Map<string, HTMLElement>>(new Map());

// Debounce timer
let debounceTimer: number | null = null;

// Mock data for demonstration
const mockSuggestions: Suggestion[] = [
  { text: "Diamond Engagement Rings", type: "category", count: 245 },
  {
    text: "Emerald Gemstones",
    type: "product",
    category: "gemstones",
    count: 189,
  },
  {
    text: "Sapphire Necklaces",
    type: "product",
    category: "jewelry",
    count: 156,
  },
  { text: "Ruby Collection", type: "category", count: 134 },
  { text: "Tiffany & Co", type: "brand", count: 298 },
  { text: "Vintage Jewelry", type: "category", count: 167 },
  { text: "Pearl Earrings", type: "product", category: "jewelry", count: 203 },
  { text: "Cartier", type: "brand", count: 276 },
];

const mockTrending: TrendingSearch[] = [
  { text: "Pink Diamonds", trend: 25, count: 89 },
  { text: "Art Deco Rings", trend: 18, count: 134 },
  { text: "Tanzanite Jewelry", trend: 32, count: 67 },
];

// Computed properties
const totalItems = computed(() => {
  let count = suggestions.value.length;
  if (!query.value) {
    count += Math.min(recentSearches.value.length, 5);
    count += Math.min(trendingSearches.value.length, 3);
  }
  return count;
});

// Methods
const setItemRef = (el: Element | null, key: string) => {
  if (el) {
    itemRefs.value.set(key, el as HTMLElement);
  } else {
    itemRefs.value.delete(key);
  }
};

const getSuggestionIndex = (index: number) => index;
const getRecentIndex = (index: number) => suggestions.value.length + index;
const getTrendingIndex = (index: number) =>
  suggestions.value.length + Math.min(recentSearches.value.length, 5) + index;

const handleInput = () => {
  if (debounceTimer) {
    clearTimeout(debounceTimer);
  }

  debounceTimer = window.setTimeout(async () => {
    await fetchSuggestions();
  }, props.debounceMs);
};

const handleFocus = () => {
  showSuggestions.value = true;
  if (!query.value) {
    loadRecentSearches();
    loadTrendingSearches();
  }
};

const hideSuggestions = () => {
  showSuggestions.value = false;
  selectedIndex.value = -1;
};

const handleKeydown = (event: KeyboardEvent) => {
  if (!showSuggestions.value) return;

  switch (event.key) {
    case "ArrowDown":
      event.preventDefault();
      selectedIndex.value = Math.min(
        selectedIndex.value + 1,
        totalItems.value - 1
      );
      scrollToSelected();
      break;
    case "ArrowUp":
      event.preventDefault();
      selectedIndex.value = Math.max(selectedIndex.value - 1, -1);
      scrollToSelected();
      break;
    case "Enter":
      event.preventDefault();
      if (selectedIndex.value >= 0) {
        selectItemByIndex(selectedIndex.value);
      } else if (query.value.trim()) {
        performSearch(query.value);
      }
      break;
    case "Escape":
      hideSuggestions();
      searchInput.value?.blur();
      break;
  }
};

const scrollToSelected = async () => {
  await nextTick();
  const selectedKey = getSelectedKey();
  if (selectedKey) {
    const element = itemRefs.value.get(selectedKey);
    element?.scrollIntoView({ block: "nearest" });
  }
};

const getSelectedKey = (): string | null => {
  if (selectedIndex.value < 0) return null;

  if (selectedIndex.value < suggestions.value.length) {
    return `suggestion-${selectedIndex.value}`;
  }

  const recentStart = suggestions.value.length;
  const recentCount = Math.min(recentSearches.value.length, 5);

  if (selectedIndex.value < recentStart + recentCount) {
    return `recent-${selectedIndex.value - recentStart}`;
  }

  return `trending-${selectedIndex.value - recentStart - recentCount}`;
};

const selectItemByIndex = (index: number) => {
  if (index < suggestions.value.length) {
    selectSuggestion(suggestions.value[index]);
  } else {
    const recentStart = suggestions.value.length;
    const recentCount = Math.min(recentSearches.value.length, 5);

    if (index < recentStart + recentCount) {
      const recentIndex = index - recentStart;
      selectSuggestion({
        text: recentSearches.value[recentIndex],
        type: "recent",
      });
    } else {
      const trendingIndex = index - recentStart - recentCount;
      selectSuggestion({
        text: trendingSearches.value[trendingIndex].text,
        type: "trending",
      });
    }
  }
};

const fetchSuggestions = async () => {
  const searchQuery = query.value.trim();

  if (searchQuery.length < props.minLength) {
    suggestions.value = [];
    return;
  }

  loading.value = true;

  try {
    // Simulate API delay and AI processing
    await new Promise((resolve) => setTimeout(resolve, 200));

    // Filter and score suggestions based on query
    const filtered = mockSuggestions
      .filter((suggestion) =>
        suggestion.text.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .sort((a, b) => {
        // Prioritize exact matches and higher counts
        const aExact = a.text
          .toLowerCase()
          .startsWith(searchQuery.toLowerCase())
          ? 1
          : 0;
        const bExact = b.text
          .toLowerCase()
          .startsWith(searchQuery.toLowerCase())
          ? 1
          : 0;

        if (aExact !== bExact) return bExact - aExact;
        return (b.count || 0) - (a.count || 0);
      })
      .slice(0, props.maxSuggestions);

    suggestions.value = filtered;
    showSuggestions.value = true;

    // Track performance
    performanceMonitor.trackApiRequest(
      "GET",
      "/api/search/suggestions",
      200,
      200
    );

    // Log search analytics
    logger.logUserAction("search_suggestions_fetched", {
      query: searchQuery,
      resultCount: filtered.length,
    });
  } catch (error) {
    logger.error("Failed to fetch search suggestions", {
      query: searchQuery,
      error: error instanceof Error ? error.message : "Unknown error",
    });
    suggestions.value = [];
  } finally {
    loading.value = false;
  }
};

const selectSuggestion = (suggestion: Suggestion) => {
  query.value = suggestion.text;
  hideSuggestions();

  // Add to recent searches
  addToRecentSearches(suggestion.text);

  // Emit events
  emit("suggestion", suggestion);
  emit("search", suggestion.text);

  // Log user interaction
  logger.logUserAction("search_suggestion_selected", {
    suggestion: suggestion.text,
    type: suggestion.type,
    category: suggestion.category,
  });
};

const performSearch = (searchQuery: string) => {
  hideSuggestions();
  addToRecentSearches(searchQuery);
  emit("search", searchQuery);

  logger.logUserAction("search_performed", {
    query: searchQuery,
    method: "manual_entry",
  });
};

const clearSearch = () => {
  query.value = "";
  suggestions.value = [];
  searchInput.value?.focus();
};

const addToRecentSearches = (search: string) => {
  const searches = recentSearches.value.filter((s) => s !== search);
  searches.unshift(search);
  recentSearches.value = searches.slice(0, 10);

  // Persist to localStorage
  try {
    localStorage.setItem(
      "recent_searches",
      JSON.stringify(recentSearches.value)
    );
  } catch (error) {
    logger.warn("Failed to save recent searches", { error });
  }
};

const loadRecentSearches = () => {
  try {
    const stored = localStorage.getItem("recent_searches");
    if (stored) {
      recentSearches.value = JSON.parse(stored);
    }
  } catch (error) {
    logger.warn("Failed to load recent searches", { error });
  }
};

const loadTrendingSearches = () => {
  // In a real app, this would come from an API
  trendingSearches.value = mockTrending;
};

const clearRecentSearches = () => {
  recentSearches.value = [];
  try {
    localStorage.removeItem("recent_searches");
  } catch (error) {
    logger.warn("Failed to clear recent searches", { error });
  }

  logger.logUserAction("recent_searches_cleared");
};

const highlightMatch = (text: string, searchQuery: string): string => {
  if (!searchQuery.trim()) return text;

  const regex = new RegExp(
    `(${searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\ <div v-if="showSuggestions && (suggestions.length || recentSearches.length || trendingSearches.length)" id="search')})`,
    "gi"
  );
  return text.replace(
    regex,
    '<mark class="bg-yellow-200 text-yellow-800 px-0.5 rounded">$1</mark>'
  );
};

const formatCount = (count: number): string => {
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}k`;
  }
  return count.toString();
};

// Click away directive
const clickAwayDirective = {
  beforeMount(el: HTMLElement, binding: any) {
    el._clickAway = (event: Event) => {
      if (!el.contains(event.target as Node)) {
        binding.value();
      }
    };
    document.addEventListener("click", el._clickAway);
  },
  unmounted(el: HTMLElement) {
    document.removeEventListener("click", el._clickAway);
  },
};

// Lifecycle
onMounted(() => {
  loadRecentSearches();
  loadTrendingSearches();
});

onUnmounted(() => {
  if (debounceTimer) {
    clearTimeout(debounceTimer);
  }
});

// Watch for query changes to reset selection
watch(query, () => {
  selectedIndex.value = -1;
});
</script>

<script lang="ts">
export default {
  name: "SearchSuggestions",
  directives: {
    clickAway: {
      beforeMount(el: HTMLElement, binding: any) {
        el._clickAway = (event: Event) => {
          if (!el.contains(event.target as Node)) {
            binding.value();
          }
        };
        document.addEventListener("click", el._clickAway);
      },
      unmounted(el: HTMLElement) {
        document.removeEventListener("click", el._clickAway);
      },
    },
  },
};
</script>

<style scoped>
/* Custom scrollbar for suggestions dropdown */
#search-suggestions::-webkit-scrollbar {
  width: 6px;
}

#search-suggestions::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 3px;
}

#search-suggestions::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

#search-suggestions::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* Highlight animation */
mark {
  animation: highlight 0.3s ease-in-out;
}

@keyframes highlight {
  from {
    background-color: #fef3c7;
  }
  to {
    background-color: #fde68a;
  }
}

/* Focus styles */
.focus-visible {
  @apply ring-2 ring-emerald-500 ring-offset-2;
}

/* Mobile optimizations */
@media (max-width: 768px) {
  #search-suggestions {
    @apply max-h-80;
  }
}
</style>
